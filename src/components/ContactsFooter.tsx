import { useState } from 'react';
import {
  Clock,
  Cpu,
  ExternalLink,
  Instagram,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from 'lucide-react';
import { SITE_CONTACTS } from '../data/serviceData';

interface ContactsFooterProps {
  onOpenOrderModal: (prefill?: string) => void;
  onOpenPrivacy: () => void;
}

const OSH_ZONES = [
  { id: 'center', name: 'Центр (Курманжан Датка)', eta: '15–20 мин' },
  { id: 'yugovostok', name: 'мкр. Юго-Восток', eta: '25–35 мин' },
  { id: 'anar', name: 'мкр. Анар / Ак-Тилек', eta: '30–40 мин' },
  { id: 'hbk', name: 'мкр. ХБК / Кулатов / Черемушки', eta: '25–40 мин' },
];

export default function ContactsFooter({
  onOpenOrderModal,
  onOpenPrivacy,
}: ContactsFooterProps) {
  const [selectedZone, setSelectedZone] = useState(OSH_ZONES[0]);

  return (
    <footer id="contacts" className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Contact Details */}
          <div className="flex flex-col justify-between lg:col-span-5">
            <div>
              <p className="text-sm font-semibold text-blue-600">Контакты в Оше</p>
              <h2 className="font-display mt-2 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Приезжайте в сервис или вызывайте мастера
              </h2>
              <p className="mt-3 text-base text-slate-600">
                Работаем без выходных. Принимаем оплату наличными, через MBank, О!Деньги и Элкарт.
              </p>

              <dl className="mt-7 space-y-5">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-blue-600">
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-slate-500">Адрес сервисного центра</dt>
                    <dd className="mt-0.5 text-sm font-semibold text-slate-900 sm:text-base">
                      {SITE_CONTACTS.address}
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-blue-600">
                    <Clock className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-slate-500">График работы</dt>
                    <dd className="mt-0.5 text-sm font-semibold text-slate-900 sm:text-base">
                      {SITE_CONTACTS.schedule}
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-blue-600">
                    <Phone className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-slate-500">Телефон для вызова</dt>
                    <dd className="mt-0.5">
                      <a
                        href={SITE_CONTACTS.phoneHref}
                        className="font-display text-lg font-bold text-slate-900 tabular-nums transition-colors hover:text-blue-600"
                      >
                        {SITE_CONTACTS.phoneDisplay}
                      </a>
                    </dd>
                  </div>
                </div>
              </dl>
            </div>

            {/* Messengers & Order Action */}
            <div className="mt-8 border-t border-slate-100 pt-6">
              <p className="text-xs font-medium text-slate-500">Мессенджеры и соцсети</p>
              <div className="mt-3 flex flex-wrap items-center gap-2.5">
                <a
                  href={SITE_CONTACTS.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[42px] items-center gap-2 whitespace-nowrap rounded-xl bg-[#16A34A] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#15803D]"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={SITE_CONTACTS.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[42px] items-center gap-2 whitespace-nowrap rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:border-blue-300 hover:bg-white"
                >
                  <Send className="h-4 w-4 text-blue-600" aria-hidden="true" />
                  <span>Telegram</span>
                </a>

                <a
                  href={SITE_CONTACTS.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[42px] items-center gap-2 whitespace-nowrap rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:border-blue-300 hover:bg-white"
                >
                  <Instagram className="h-4 w-4 text-slate-700" aria-hidden="true" />
                  <span>Instagram</span>
                </a>
              </div>
            </div>
          </div>

          {/* Interactive 2GIS / Google Maps Placeholder Card */}
          <div className="lg:col-span-7">
            <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-[#F8FAFC]">
              {/* Map Header Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4">
                <div>
                  <span className="text-xs font-medium text-slate-500">
                    Карта выезда по г. Ош · 2ГИС / Google Maps
                  </span>
                  <p className="font-display text-sm font-bold text-slate-900">
                    {selectedZone.name} — время прибытия {selectedZone.eta}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={SITE_CONTACTS.map2gisUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[38px] items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 transition-colors hover:border-blue-400 hover:text-blue-600"
                  >
                    <span>2ГИС</span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                  <a
                    href={SITE_CONTACTS.mapGoogleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[38px] items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 transition-colors hover:border-blue-400 hover:text-blue-600"
                  >
                    <span>Google Maps</span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>

              {/* Clean schematic map canvas */}
              <div className="relative flex-1 min-h-[260px] overflow-hidden bg-slate-100">
                <svg
                  viewBox="0 0 800 420"
                  className="h-full w-full object-cover"
                  role="img"
                  aria-label="Схема расположения сервисного центра OshPC Service в центре города Ош"
                >
                  <rect width="800" height="420" fill="#F1F5F9" />
                  {/* Ak-Buura River */}
                  <path
                    d="M 330 0 C 345 110, 315 240, 360 420"
                    fill="none"
                    stroke="#BAE6FD"
                    strokeWidth="22"
                  />
                  {/* Main city roads */}
                  <path d="M 0 190 L 800 175" stroke="#FFFFFF" strokeWidth="14" />
                  <path d="M 0 295 L 800 280" stroke="#FFFFFF" strokeWidth="10" />
                  <path d="M 455 0 L 430 420" stroke="#FFFFFF" strokeWidth="14" />
                  <path d="M 190 0 L 215 420" stroke="#FFFFFF" strokeWidth="10" />
                  <path d="M 620 0 L 605 420" stroke="#FFFFFF" strokeWidth="10" />

                  {/* District blocks */}
                  <rect x="65" y="55" width="105" height="95" rx="10" fill="#E2E8F0" opacity="0.7" />
                  <rect x="475" y="45" width="120" height="105" rx="10" fill="#E2E8F0" opacity="0.7" />
                  <rect x="465" y="210" width="115" height="60" rx="10" fill="#E2E8F0" opacity="0.7" />
                  <rect x="65" y="215" width="115" height="60" rx="10" fill="#E2E8F0" opacity="0.7" />

                  {/* Street labels */}
                  <text x="485" y="168" fill="#64748B" fontSize="13" fontWeight="600">
                    ул. Курманжан Датка
                  </text>
                  <text x="455" y="345" fill="#64748B" fontSize="12" fontWeight="500">
                    пр. Масалиева
                  </text>
                  <text x="145" y="182" fill="#64748B" fontSize="12" fontWeight="500">
                    ул. Ленина
                  </text>
                  <text x="275" y="95" fill="#0284C7" fontSize="12" fontWeight="600">
                    р. Ак-Буура
                  </text>

                  {/* Coverage ring */}
                  <circle
                    cx="444"
                    cy="182"
                    r="110"
                    fill="#2563EB"
                    fillOpacity="0.08"
                    stroke="#2563EB"
                    strokeOpacity="0.25"
                    strokeDasharray="6 6"
                  />

                  {/* Service center pin */}
                  <g transform="translate(444, 182)">
                    <circle r="18" fill="#2563EB" fillOpacity="0.18" />
                    <circle r="9" fill="#2563EB" stroke="#FFFFFF" strokeWidth="3" />
                    <rect x="16" y="-22" width="196" height="44" rx="10" fill="#0F172A" />
                    <text x="28" y="-4" fill="#FFFFFF" fontSize="13" fontWeight="700">
                      OshPC Service
                    </text>
                    <text x="28" y="13" fill="#CBD5E1" fontSize="11">
                      ул. Курманжан Датка, 248
                    </text>
                  </g>
                </svg>
              </div>

              {/* Zone selector footer inside map card */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-5 py-4">
                <div className="flex flex-wrap gap-1.5">
                  {OSH_ZONES.map((zone) => {
                    const active = selectedZone.id === zone.id;
                    return (
                      <button
                        key={zone.id}
                        type="button"
                        onClick={() => setSelectedZone(zone)}
                        className={`min-h-[34px] rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                          active
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {zone.name}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => onOpenOrderModal(`Выезд мастера: ${selectedZone.name}`)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  Вызвать в этот район →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-slate-200 pt-8 text-xs text-slate-500 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <Cpu className="h-4 w-4 text-blue-600" aria-hidden="true" />
            <span>
              © 2026 {SITE_CONTACTS.brand} · г. Ош, Кыргызстан. Все права защищены.
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenPrivacy}
            className="font-medium text-slate-600 underline-offset-4 hover:text-slate-900 hover:underline"
          >
            Политика конфиденциальности
          </button>
        </div>
      </div>
    </footer>
  );
}
