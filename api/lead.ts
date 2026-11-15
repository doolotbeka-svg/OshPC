/**
 * Прием заявок с сайта (Vercel Function).
 *
 *   POST /api/lead  — принять заявку и переслать ее владельцу в WhatsApp через CallMeBot
 *
 * Нужные переменные окружения (Vercel → Settings → Environment Variables):
 *   CALLMEBOT_PHONE  — номер WhatsApp, который активировал CallMeBot, например +996555123456
 *   CALLMEBOT_APIKEY — ключ, который прислал бот CallMeBot
 *
 * Если переменные не заданы или CallMeBot не ответил, функция возвращает 503,
 * и сайт предлагает клиенту отправить заявку через WhatsApp вручную.
 */

const MAX_FIELD = 500;

type LeadSource = 'order' | 'quiz';

interface LeadPayload {
  source: LeadSource;
  name?: string;
  phone: string;
  problem?: string;
  device?: string;
  issue?: string;
  location?: string;
  price?: string;
  /** Скрытое поле-ловушка для ботов: люди его не видят и не заполняют */
  website?: string;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

function clean(value: unknown): string {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, MAX_FIELD) : '';
}

function isValidKyrgyzPhone(raw: string): boolean {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('996')) return digits.length === 12;
  if (digits.startsWith('0')) return digits.length === 10;
  return digits.length === 9;
}

function buildMessage(lead: LeadPayload): string {
  const lines: string[] = [];
  if (lead.source === 'quiz') {
    lines.push('🧮 Новая заявка с калькулятора OshPC');
    if (lead.device) lines.push(`Устройство: ${lead.device}`);
    if (lead.issue) lines.push(`Проблема: ${lead.issue}`);
    if (lead.location) lines.push(`Формат: ${lead.location}`);
    if (lead.price) lines.push(`Расчет: ${lead.price}`);
  } else {
    lines.push('🛠 Новая заявка с сайта OshPC');
    if (lead.name) lines.push(`Имя: ${lead.name}`);
    lines.push(`Проблема: ${lead.problem || 'не указана'}`);
  }
  const digits = lead.phone.replace(/\D/g, '');
  lines.push(`Телефон: ${lead.phone}`);
  if (digits.startsWith('996')) lines.push(`Написать клиенту: https://wa.me/${digits}`);
  const time = new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Bishkek' });
  lines.push(`Время: ${time}`);
  return lines.join('\n');
}

export async function POST(request: Request): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: 'Некорректный запрос' }, 400);
  }

  const lead: LeadPayload = {
    source: body.source === 'quiz' ? 'quiz' : 'order',
    name: clean(body.name),
    phone: clean(body.phone),
    problem: clean(body.problem),
    device: clean(body.device),
    issue: clean(body.issue),
    location: clean(body.location),
    price: clean(body.price),
    website: clean(body.website),
  };

  // Бот заполнил скрытое поле — делаем вид, что все хорошо, и ничего не отправляем
  if (lead.website) return json({ ok: true });

  if (!isValidKyrgyzPhone(lead.phone)) {
    return json({ error: 'Некорректный номер телефона' }, 400);
  }
  if (lead.source === 'order' && (lead.name ?? '').length < 2) {
    return json({ error: 'Укажите имя' }, 400);
  }

  const phone = process.env.CALLMEBOT_PHONE;
  const apikey = process.env.CALLMEBOT_APIKEY;
  if (!phone || !apikey) {
    console.error('lead: CALLMEBOT_PHONE / CALLMEBOT_APIKEY не заданы');
    return json({ error: 'Отправка заявок не настроена' }, 503);
  }

  const url =
    'https://api.callmebot.com/whatsapp.php' +
    `?phone=${encodeURIComponent(phone)}` +
    `&text=${encodeURIComponent(buildMessage(lead))}` +
    `&apikey=${encodeURIComponent(apikey)}`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
    const text = await res.text();
    // CallMeBot отвечает 200 и HTML-страницей; об ошибках сообщает текстом
    if (!res.ok || /error|invalid|not\s+(?:active|allowed)/i.test(text)) {
      console.error('lead: CallMeBot rejected', res.status, text.slice(0, 300));
      return json({ error: 'Не удалось отправить заявку' }, 502);
    }
    return json({ ok: true });
  } catch (error) {
    console.error('lead: CallMeBot request failed', error);
    return json({ error: 'Не удалось отправить заявку' }, 502);
  }
}
