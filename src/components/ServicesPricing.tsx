import { useState } from 'react';
import { MessageCircle, Wrench } from 'lucide-react';
import {
  SERVICES,
  SERVICE_CATEGORIES,
  SITE_CONTACTS,
  type ServiceCategory,
} from '../data/serviceData';

interface ServicesPricingProps {
  onSelectService: (serviceTitle: string) => void;
}

export default function ServicesPricing({ onSelectService }: ServicesPricingProps) {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('all');

  const filteredServices =
    activeCategory === 'all'
      ? SERVICES
      : SERVICES.filter((service) => service.category === activeCategory);

  return (
    <section id="services" className="bg-white py-16 sm:py-20">
      <div id="prices" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-blue-600">Услуги и прозрачный прайс-лист</p>
            <h2 className="font-display mt-2 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Честные цены на популярные работы в сомах
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Стоимость согласуется до начала ремонта. Оригинальные запчасти и расходники всегда в
              наличии на нашем складе в Оше.
            </p>
          </div>

          {/* Interactive segmented filter tabs */}
          <div
            role="tablist"
            aria-label="Категории услуг"
            className="flex flex-wrap gap-1.5 rounded-xl bg-slate-100 p-1.5"
          >
            {SERVICE_CATEGORIES.map((category) => {
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(category.id)}
                  className={`min-h-[40px] whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-semibold transition-all duration-150 sm:text-sm ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Service Cards Grid */}
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {filteredServices.map((service, index) => (
            <article
              key={service.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-[#F8FAFC] p-5 transition-colors duration-150 hover:border-blue-300 hover:bg-white sm:p-6"
            >
              <div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <span aria-hidden="true">·</span>
                  <span>{service.categoryLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{service.duration}</span>
                </div>

                <h3 className="font-display mt-2.5 text-lg font-semibold leading-snug text-slate-900">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {service.description}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 pt-4">
                <div>
                  <span className="block text-xs text-slate-500">Стоимость</span>
                  <span className="font-display text-lg font-bold text-slate-900 tabular-nums">
                    {service.price}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectService(service.title)}
                  className="inline-flex min-h-[42px] shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  <Wrench className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Заказать</span>
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom WhatsApp Prompt */}
        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-display text-lg font-semibold text-slate-900">
              Не нашли свою проблему в списке?
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Опишите поломку или отправьте фото экрана в WhatsApp — мастер назовет точную цену за 5 минут.
            </p>
          </div>
          <a
            href={SITE_CONTACTS.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#16A34A] px-5 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#15803D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16A34A]"
          >
            <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Спросить мастера в WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
