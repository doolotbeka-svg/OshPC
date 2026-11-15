export interface LeadData {
  source: 'order' | 'quiz';
  phone: string;
  name?: string;
  problem?: string;
  device?: string;
  issue?: string;
  location?: string;
  price?: string;
  /** Скрытое поле-ловушка для ботов */
  website?: string;
}

/**
 * Отправляет заявку на сервер, который пересылает ее владельцу в WhatsApp.
 * Возвращает true, если заявка доставлена; false — если нужно отправить вручную.
 */
export async function submitLead(lead: LeadData): Promise<boolean> {
  try {
    const res = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(lead),
    });
    return res.ok;
  } catch {
    return false;
  }
}
