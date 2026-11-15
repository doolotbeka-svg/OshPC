import { useState } from 'react';
import { ArrowRight, CheckCircle2, Laptop, MapPin, MessageCircle } from 'lucide-react';
import { SITE_CONTACTS } from '../data/serviceData';

interface HeroProps {
  onOpenOrderModal: (prefill?: string) => void;
}

const HERO_METRICS = [
  { value: '40 мин', label: 'Среднее время выезда мастера по г. Ош' },
  { value: '0 сом', label: 'Диагностика при дальнейшем ремонте' },
  { value: 'до 1 года', label: 'Официальная гарантия на работу и детали' },
  { value: '80% задач', label: 'Устраняем в день обращения за 1–2 часа' },
];

const TRUST_POINTS = [
  'Оплата после проверки работы',
  'Оригинальные комплектующие',
  'Опыт мастеров более 5 лет',
];

export default function Hero({ onOpenOrderModal }: HeroProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <section className="border-b border-slate-200/80 bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="grid items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left column: Value proposition & primary actions */}
          <div className="flex flex-col justify-center lg:col-span-7">
            <div className="mb-4 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm font-medium text-slate-600">
              <span className="inline-flex items-center gap-1.5 text-slate-800">
                <MapPin className="h-4 w-4 text-blue-600" aria-hidden="true" />
                <span>{SITE_CONTACTS.cityLabel}</span>
              </span>
              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>
              <span>Ежедневно 09:00–20:00</span>
            </div>

            <h1 className="font-display max-w-2xl text-balance text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[1.12] tracking-tight text-slate-900">
              Профессиональный ремонт, диагностика и настройка ПК и ноутбуков в Оше
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Бесплатная диагностика при ремонте. Выезд мастера на дом и в офис по Ошу за 40 минут.
              Гарантия на все работы и запчасти до 1 года.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <button
                type="button"
                onClick={() => onOpenOrderModal()}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#2563EB] px-6 py-3.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:text-base"
              >
                <span>Вызвать мастера / Узнать цену</span>
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </button>

              <a
                href={SITE_CONTACTS.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#16A34A] px-6 py-3.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#15803D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16A34A] sm:text-base"
              >
                <MessageCircle className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
                <span>Написать в WhatsApp</span>
              </a>
            </div>

            {/* Trust Triggers Strip */}
            <ul className="mt-7 flex flex-col gap-2.5 border-t border-slate-200 pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2">
              {TRUST_POINTS.map((point) => (
                <li
                  key={point}
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-700"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right column: High-res service studio workbench image */}
          <div className="lg:col-span-5">
            <div className="relative h-full min-h-[260px] overflow-hidden rounded-2xl border border-slate-200 bg-white sm:min-h-[340px]">
              {!imageError ? (
                <img
                  src="/src/assets/images/hero_repair_workbench_1794754544272.jpg"
                  alt="Современное рабочее место мастера по ремонту и диагностике ноутбуков в Оше"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-blue-50 p-8 text-center">
                  <Laptop className="mb-3 h-12 w-12 text-blue-600" aria-hidden="true" />
                  <p className="font-display text-base font-semibold text-slate-800">
                    Мастерская OshPC Service
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Диагностика, апгрейд и модульный ремонт ноутбуков и ПК
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Full-width 4-column metric bar below the hero split */}
        <div className="mt-10 grid grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 lg:grid-cols-4 lg:gap-8">
          {HERO_METRICS.map((metric, idx) => (
            <div
              key={metric.value}
              className={
                idx > 0 ? 'lg:border-l lg:border-slate-100 lg:pl-8' : ''
              }
            >
              <div className="font-display text-2xl font-bold tracking-tight text-slate-900 tabular-nums sm:text-3xl">
                {metric.value}
              </div>
              <p className="mt-1 text-xs leading-snug text-slate-600 sm:text-sm">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
