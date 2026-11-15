/**
 * API содержимого сайта (Vercel Function).
 *
 *   GET    /api/content  — сохраненное содержимое (или null, если еще не сохраняли)
 *   POST   /api/content  — проверка пароля администратора (вход в админ-панель)
 *   PUT    /api/content  — сохранить содержимое (нужен пароль)
 *   DELETE /api/content  — сбросить к исходному содержимому (нужен пароль)
 *
 * Пароль передается в заголовке `x-admin-password` и сверяется с переменной
 * окружения ADMIN_PASSWORD. Данные лежат в приватном хранилище Vercel Blob
 * (переменная BLOB_READ_WRITE_TOKEN появляется при подключении хранилища).
 */
import { createHash, timingSafeEqual } from 'node:crypto';
import { del, get, put } from '@vercel/blob';

const CONTENT_PATH = 'site-content.json';
const MAX_BODY_BYTES = 500_000;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

function isAuthorized(request: Request): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const given = request.headers.get('x-admin-password') ?? '';
  // Сравниваем хэши, чтобы длина и время сравнения не выдавали пароль
  const a = createHash('sha256').update(given).digest();
  const b = createHash('sha256').update(expected).digest();
  return timingSafeEqual(a, b);
}

function unauthorized(): Response {
  return json({ error: 'Неверный пароль' }, 401);
}

export async function GET(): Promise<Response> {
  try {
    const result = await get(CONTENT_PATH, { access: 'private', useCache: false });
    if (!result || result.statusCode !== 200) return json(null);
    const text = await new Response(result.stream).text();
    return json(JSON.parse(text));
  } catch (error) {
    console.error('content GET failed', error);
    // Сайт продолжит работать на содержимом по умолчанию
    return json(null);
  }
}

export async function POST(request: Request): Promise<Response> {
  if (!isAuthorized(request)) return unauthorized();
  return json({ ok: true });
}

export async function PUT(request: Request): Promise<Response> {
  if (!isAuthorized(request)) return unauthorized();

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
    await put(CONTENT_PATH, JSON.stringify(data), {
      access: 'private',
      allowOverwrite: true,
      addRandomSuffix: false,
      contentType: 'application/json',
    });
    return json({ ok: true });
  } catch (error) {
    console.error('content PUT failed', error);
    return json({ error: 'Не удалось сохранить. Попробуйте еще раз.' }, 500);
  }
}

export async function DELETE(request: Request): Promise<Response> {
  if (!isAuthorized(request)) return unauthorized();
  try {
    await del(CONTENT_PATH);
    return json({ ok: true });
  } catch (error) {
    console.error('content DELETE failed', error);
    return json({ error: 'Не удалось сбросить содержимое.' }, 500);
  }
}
