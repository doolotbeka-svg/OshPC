/**
 * Главная страница с готовым текстом (серверная отрисовка, Vercel Function).
 *
 * vercel.json перенаправляет "/" сюда. Функция берет содержимое из админки
 * (Vercel Blob), отрисовывает React-приложение в HTML и встраивает его в шаблон.
 * Поисковики и ИИ-боты получают полный текст страницы без выполнения JavaScript,
 * а браузер «оживляет» готовую разметку (hydrateRoot в src/main.tsx).
 *
 * Серверная сборка и шаблон лежат в dist-server/ (создаются командой npm run build)
 * и подключаются к функции через includeFiles в vercel.json.
 *
 * Если что-то пошло не так, отдается обычный шаблон: сайт отрисуется в браузере,
 * как раньше.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { get } from '@vercel/blob';

interface SeoContent {
  seo: { title: string; description: string };
}
type RenderFn = (saved: unknown) => { html: string; content: SeoContent };

const SERVER_DIR = path.join(process.cwd(), 'dist-server');

let templatePromise: Promise<string> | null = null;
let renderPromise: Promise<RenderFn> | null = null;

function loadTemplate(): Promise<string> {
  templatePromise ??= readFile(path.join(SERVER_DIR, 'template.html'), 'utf8');
  return templatePromise;
}

function loadRender(): Promise<RenderFn> {
  renderPromise ??= import(pathToFileURL(path.join(SERVER_DIR, 'entry-server.js')).href).then(
    (mod: { render: RenderFn }) => mod.render
  );
  return renderPromise;
}

async function readSavedContent(): Promise<unknown> {
  try {
    const result = await get('site-content.json', { access: 'private', useCache: false });
    if (!result || result.statusCode !== 200) return null;
    return JSON.parse(await new Response(result.stream).text());
  } catch (error) {
    console.error('render: content read failed', error);
    return null;
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** JSON для вставки в <script>: экранируем всё, что может закрыть тег. */
function safeJson(value: unknown): string {
  const lineSep = String.fromCharCode(0x2028);
  const paraSep = String.fromCharCode(0x2029);
  return JSON.stringify(value)
    .split("<").join("\\u003c")
    .split(">").join("\\u003e")
    .split("&").join("\\u0026")
    .split(lineSep).join("\\u2028")
    .split(paraSep).join("\\u2029");
}

function setMeta(html: string, attr: 'name' | 'property', key: string, value: string): string {
  const pattern = new RegExp(`(<meta\\s+${attr}="${key}"\\s+content=")[^"]*(")`);
  return html.replace(pattern, `$1${escapeHtml(value)}$2`);
}

function injectPage(template: string, appHtml: string, content: SeoContent): string {
  const { title, description } = content.seo;
  let html = template.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`);
  html = setMeta(html, 'name', 'description', description);
  html = setMeta(html, 'property', 'og:title', title);
  html = setMeta(html, 'property', 'og:description', description);
  return html.replace(
    '<div id="root"></div>',
    `<div id="root">${appHtml}</div>\n    <script>window.__SITE_CONTENT__=${safeJson(content)}</script>`
  );
}

function htmlResponse(body: string, cache: string): Response {
  return new Response(body, {
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': cache },
  });
}

export async function GET(): Promise<Response> {
  let template: string;
  try {
    template = await loadTemplate();
  } catch (error) {
    console.error('render: template missing', error);
    return new Response('Сайт временно недоступен', { status: 500 });
  }

  try {
    const [render, saved] = await Promise.all([loadRender(), readSavedContent()]);
    const { html, content } = render(saved);
    // CDN держит страницу минуту и обновляет ее в фоне: правки из админки
    // появляются у посетителей в течение ~1 минуты
    return htmlResponse(
      injectPage(template, html, content),
      'public, max-age=0, s-maxage=60, stale-while-revalidate=600'
    );
  } catch (error) {
    console.error('render: SSR failed, serving client-only page', error);
    return htmlResponse(template, 'no-store');
  }
}
