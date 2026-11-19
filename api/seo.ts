/**
 * robots.txt и sitemap.xml (Vercel Function).
 *
 * vercel.json перенаправляет /robots.txt и /sitemap.xml сюда. Адрес сайта
 * берется из запроса, поэтому файлы верны для любого домена: oshpc.vercel.app,
 * собственного домена или превью-ссылки.
 *
 * Превью-деплои Vercel (не основной сайт) закрываются от индексации, чтобы
 * в поиске не появлялись дубли.
 */
import { head } from '@vercel/blob';

/**
 * Поисковые и ИИ-боты, которым сайт явно открыт.
 * Google-Extended и Applebot-Extended — не отдельные роботы, а «токены»:
 * они разрешают Google и Apple использовать контент сайта для своих ИИ-моделей.
 */
const ALLOWED_BOTS = [
  'Googlebot',
  'GPTBot',
  'OAI-SearchBot',
  'ClaudeBot',
  'PerplexityBot',
  'Google-Extended',
  'Applebot-Extended',
];

/**
 * Технические разделы, закрытые от индексации.
 * Админка открывается по адресу /#admin: часть после # роботы не видят и не
 * индексируют, а запретить ее в robots.txt невозможно. Данные админки отдает
 * /api/content, поэтому закрываем весь /api/.
 * Корзины и поиска по сайту сейчас нет; если появятся — добавьте их пути сюда.
 */
const DISALLOWED_PATHS = ['/api/'];

function siteOrigin(request: Request): string {
  const url = new URL(request.url);
  const host = request.headers.get('x-forwarded-host') ?? url.host;
  const proto = request.headers.get('x-forwarded-proto') ?? url.protocol.replace(':', '');
  return `${proto}://${host}`;
}

function isPreviewDeployment(): boolean {
  return process.env.VERCEL_ENV !== undefined && process.env.VERCEL_ENV !== 'production';
}

function text(body: string, contentType: string): Response {
  return new Response(body, {
    headers: {
      'content-type': `${contentType}; charset=utf-8`,
      'cache-control': 'public, max-age=3600',
    },
  });
}

function buildRobots(origin: string): string {
  const rules = ['Allow: /', ...DISALLOWED_PATHS.map((p) => `Disallow: ${p}`)].join('\n');
  // У робота, для которого есть своя группа, правила из группы "*" не действуют,
  // поэтому запреты повторяются в каждой группе.
  return [
    '# Поисковые и ИИ-боты: сайт открыт полностью, кроме технических разделов',
    ...ALLOWED_BOTS.map((bot) => `User-agent: ${bot}`),
    rules,
    '',
    '# Все остальные роботы',
    'User-agent: *',
    rules,
    '',
    `Sitemap: ${origin}/sitemap.xml`,
    '',
  ].join('\n');
}

/** Дата последнего сохранения в админке — она же дата изменения страницы. */
async function lastModified(): Promise<string | null> {
  try {
    const blob = await head('site-content.json');
    return blob.uploadedAt.toISOString().slice(0, 10);
  } catch {
    // Содержимое еще не сохраняли или хранилище недоступно — дату не указываем
    return null;
  }
}

async function buildSitemap(origin: string): Promise<string> {
  const lastmod = await lastModified();
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    '  <url>\n' +
    `    <loc>${origin}/</loc>\n` +
    (lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : '') +
    '  </url>\n' +
    '</urlset>\n'
  );
}

export async function GET(request: Request): Promise<Response> {
  const file = new URL(request.url).searchParams.get('file');
  const origin = siteOrigin(request);

  if (file === 'sitemap') return text(await buildSitemap(origin), 'application/xml');

  const robots = isPreviewDeployment() ? 'User-agent: *\nDisallow: /\n' : buildRobots(origin);
  return text(robots, 'text/plain');
}
