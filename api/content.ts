/**
 * API содержимого сайта (Vercel Function).
 *
 *   GET    /api/content  — сохраненное содержимое (или null, если еще не сохраняли)
 *   POST   /api/content  — проверка пароля администратора (вход в админ-панель)
 *   PUT    /api/content  — сохранить содержимое (нужен пароль)
 *   PATCH  /api/content  — сменить пароль администратора: { "newPassword": "..." } (нужен пароль)
 *   DELETE /api/content  — сбросить к исходному содержимому (нужен пароль)
 *
 * Пароль передается в заголовке `x-admin-password`.
 *
 * Где хранится пароль:
 *   - после смены в админ-панели — хэш (scrypt с солью) в приватном Vercel Blob
 *     `admin-auth.json`; пароль из переменной окружения больше не подходит;
 *   - пока пароль не меняли — переменная окружения ADMIN_PASSWORD.
 * Если пароль забыт: удалите `admin-auth.json` в хранилище Vercel Blob (Storage →
 * oshpc-content), и снова заработает пароль из ADMIN_PASSWORD.
 *
 * Данные лежат в приватном хранилище Vercel Blob (переменная BLOB_READ_WRITE_TOKEN
 * появляется при подключении хранилища).
 */
import { createHash, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { del, get, put } from '@vercel/blob';

const CONTENT_PATH = 'site-content.json';
const AUTH_PATH = 'admin-auth.json';
const MAX_BODY_BYTES = 500_000;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 200;

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  keylen: number
) => Promise<Buffer>;

interface StoredAuth {
  algo: 'scrypt';
  salt: string; // base64
  hash: string; // base64
  updatedAt: string;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

async function readBlobJson<T>(path: string): Promise<T | null> {
  const result = await get(path, { access: 'private', useCache: false });
  if (!result || result.statusCode !== 200) return null;
  return JSON.parse(await new Response(result.stream).text()) as T;
}

async function writeBlobJson(path: string, data: unknown): Promise<void> {
  await put(path, JSON.stringify(data), {
    access: 'private',
    allowOverwrite: true,
    addRandomSuffix: false,
    contentType: 'application/json',
  });
}

/** Сравнение строк без утечки длины и времени сравнения. */
function safeEqualStrings(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest();
  const hb = createHash('sha256').update(b).digest();
  return timingSafeEqual(ha, hb);
}

type AuthResult = 'ok' | 'denied' | 'error';

async function checkAuth(request: Request): Promise<AuthResult> {
  const given = request.headers.get('x-admin-password') ?? '';
  if (!given) return 'denied';

  let stored: StoredAuth | null;
  try {
    stored = await readBlobJson<StoredAuth>(AUTH_PATH);
  } catch (error) {
    // Не откатываемся на пароль из окружения: иначе при сбое хранилища
    // снова заработал бы старый пароль
    console.error('auth read failed', error);
    return 'error';
  }

  if (stored) {
    const salt = Buffer.from(stored.salt, 'base64');
    const expected = Buffer.from(stored.hash, 'base64');
    const actual = await scryptAsync(given, salt, expected.length);
    return timingSafeEqual(actual, expected) ? 'ok' : 'denied';
  }

  const envPassword = process.env.ADMIN_PASSWORD;
  if (!envPassword) return 'denied';
  return safeEqualStrings(given, envPassword) ? 'ok' : 'denied';
}

/** Возвращает ответ с ошибкой, если пароль не подошел, или null, если все в порядке. */
async function requireAuth(request: Request): Promise<Response | null> {
  const result = await checkAuth(request);
  if (result === 'ok') return null;
  if (result === 'error') return json({ error: 'Хранилище недоступно, попробуйте позже' }, 503);
  return json({ error: 'Неверный пароль' }, 401);
}

export async function GET(): Promise<Response> {
  try {
    return json(await readBlobJson(CONTENT_PATH));
  } catch (error) {
    console.error('content GET failed', error);
    // Сайт продолжит работать на содержимом по умолчанию
    return json(null);
  }
}

export async function POST(request: Request): Promise<Response> {
  return (await requireAuth(request)) ?? json({ ok: true });
}

export async function PUT(request: Request): Promise<Response> {
  const denied = await requireAuth(request);
  if (denied) return denied;

  const text = await request.text();
  if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) {
    return json({ error: 'Слишком большой объем данных' }, 413);
  }

  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return json({ error: 'Некорректный JSON' }, 400);
  }
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return json({ error: 'Ожидается объект с содержимым сайта' }, 400);
  }

  try {
    await writeBlobJson(CONTENT_PATH, data);
    return json({ ok: true });
  } catch (error) {
    console.error('content PUT failed', error);
    return json({ error: 'Не удалось сохранить. Попробуйте еще раз.' }, 500);
  }
}

export async function PATCH(request: Request): Promise<Response> {
  const denied = await requireAuth(request);
  if (denied) return denied;

  let newPassword: unknown;
  try {
    newPassword = ((await request.json()) as { newPassword?: unknown }).newPassword;
  } catch {
    return json({ error: 'Некорректный запрос' }, 400);
  }
  if (typeof newPassword !== 'string' || newPassword.length < MIN_PASSWORD_LENGTH) {
    return json({ error: `Пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов` }, 400);
  }
  if (newPassword.length > MAX_PASSWORD_LENGTH) {
    return json({ error: 'Слишком длинный пароль' }, 400);
  }
  if (newPassword.trim() !== newPassword) {
    return json({ error: 'Пароль не должен начинаться или заканчиваться пробелом' }, 400);
  }

  try {
    const salt = randomBytes(16);
    const hash = await scryptAsync(newPassword, salt, 64);
    const auth: StoredAuth = {
      algo: 'scrypt',
      salt: salt.toString('base64'),
      hash: hash.toString('base64'),
      updatedAt: new Date().toISOString(),
    };
    await writeBlobJson(AUTH_PATH, auth);
    return json({ ok: true });
  } catch (error) {
    console.error('password change failed', error);
    return json({ error: 'Не удалось сменить пароль. Попробуйте еще раз.' }, 500);
  }
}

export async function DELETE(request: Request): Promise<Response> {
  const denied = await requireAuth(request);
  if (denied) return denied;
  try {
    await del(CONTENT_PATH);
    return json({ ok: true });
  } catch (error) {
    console.error('content DELETE failed', error);
    return json({ error: 'Не удалось сбросить содержимое.' }, 500);
  }
}
