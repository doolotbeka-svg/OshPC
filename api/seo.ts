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

export function GET(request: Request): Response {
  const file = new URL(request.url).searchParams.get('file');
  const origin = siteOrigin(request);

  if (file === 'sitemap') {
    const xml =
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      `  <url>\n    <loc>${origin}/</loc>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n` +
      '</urlset>\n';
    return text(xml, 'application/xml');
  }

  const robots = isPreviewDeployment()
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${origin}/sitemap.xml\n`;
  return text(robots, 'text/plain');
}
