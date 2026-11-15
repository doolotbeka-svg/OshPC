import { useState } from 'react';
import { Cpu, MapPin, ShieldCheck, Wallet } from 'lucide-react';
import { ADVANTAGES, WORKFLOW_STEPS } from '../data/serviceData';

const ADVANTAGE_ICONS = [Wallet, MapPin, Cpu, ShieldCheck];

export default function WorkflowAndAdvantages() {
  const [imageError, setImageError] = useState(false);

  return (
    <>
      {/* Block 5: How We Work */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-blue-600">Как мы работаем</p>
            <h2 className="font-display mt-2 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              От обращения до готового устройства — 4 понятных шага
            </h2>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WORKFLOW_STEPS.map((step) => (
              <div
                key={step.number}
                className="flex flex-col rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6"
              >
                <span className="font-display text-2xl font-bold text-blue-600 tabular-nums">
                  {step.number}
                </span>
                <h3 className="font-display mt-3 text-lg font-bold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Block 6: Why Choose Us */}
      <section id="advantages" className="border-y border-slate-200/80 bg-[#F8FAFC] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left image column */}
            <div className="lg:col-span-5">
              <div className="relative h-full min-h-[260px] overflow-hidden rounded-2xl border border-slate-200 bg-white sm:min-h-[340px]">
                {!imageError ? (
                  <img
                    src="/src/assets/images/workshop_diagnostics_osh_1794754545576.jpg"
                    alt="Чистая разборка, апгрейд NVMe SSD и обслуживание системы охлаждения ноутбука"
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-blue-50 p-8 text-center">
                    <Cpu className="mb-3 h-12 w-12 text-blue-600" aria-hidden="true" />
                    <p className="font-display text-base font-semibold text-slate-800">
                      Склад запчастей в Оше
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      NVMe SSD, ОЗУ, матрицы и комплектующие в наличии
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right advantages column */}
            <div className="flex flex-col justify-center lg:col-span-7">
              <p className="text-sm font-semibold text-blue-600">Почему выбирают нас</p>
              <h2 className="font-display mt-2 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Сервис в Оше, которому доверяют технику и рабочие данные
              </h2>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {ADVANTAGES.map((item, idx) => {
                  const Icon = ADVANTAGE_ICONS[idx] || ShieldCheck;
                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-slate-200 bg-white p-5"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <h3 className="font-display mt-3.5 text-base font-bold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
