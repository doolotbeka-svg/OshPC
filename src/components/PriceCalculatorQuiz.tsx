import { useState, type FormEvent } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Laptop,
  Monitor,
  MonitorSmartphone,
  MessageCircle,
  RotateCcw,
} from 'lucide-react';
import {
  buildWhatsAppUrl,
  calculateQuizEstimate,
  isValidKyrgyzPhone,
} from '../data/serviceData';
import { useContent } from '../content/ContentContext';

const DEVICE_OPTIONS = [
  { id: 'Ноутбук', label: 'Ноутбук', desc: 'Lenovo, ASUS, HP, Acer, Apple MacBook', icon: Laptop },
  {
    id: 'Стационарный ПК',
    label: 'Стационарный ПК',
    desc: 'Домашний, игровой или офисный системный блок',
    icon: Monitor,
  },
  {
    id: 'Моноблок',
    label: 'Моноблок',
    desc: 'iMac, HP All-in-One, Lenovo IdeaCentre',
    icon: MonitorSmartphone,
  },
];

const ISSUE_OPTIONS = [
  { id: 'Не включается', label: 'Не включается', hint: 'Нет реакции на кнопку питания или черный экран' },
  { id: 'Тормозит и греется', label: 'Тормозит и греется', hint: 'Шумит вентилятор, зависают программы' },
  { id: 'Нужна установка Windows', label: 'Нужна установка Windows', hint: 'Windows 10/11, драйверы, Office, антивирус' },
  { id: 'Разбит экран', label: 'Разбит экран', hint: 'Трещины, полосы или нет подсветки матрицы' },
  { id: 'Другое', label: 'Другое', hint: 'Замена разъема, клавиатуры, апгрейд SSD, вирусы' },
];

const LOCATION_OPTIONS = [
  {
    id: 'Выезд мастера на дом по Ошу',
    label: 'Выезд мастера на дом по Ошу',
    hint: 'Приедем домой или в офис за 40 минут. Выезд 0 сом при ремонте.',
  },
  {
    id: 'Привезу в сервисный центр',
    label: 'Привезу в сервисный центр',
    hint: '', // подставляется адрес из контактов
  },
];

export default function PriceCalculatorQuiz() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [device, setDevice] = useState<string>('');
  const [issue, setIssue] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [phone, setPhone] = useState<string>('+996 ');
  const [phoneError, setPhoneError] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const { contacts, sections } = useContent();
  const text = sections.calculator;

  const estimate = calculateQuizEstimate(
    device || 'Ноутбук',
    issue || 'Другое',
    location || 'Выезд мастера на дом по Ошу'
  );

  const whatsappSummaryUrl = buildWhatsAppUrl(
    contacts.whatsappNumber,
    `Здравствуйте! Рассчитал стоимость на сайте со скидкой 10%:\nУстройство: ${device}\nПроблема: ${issue}\nФормат: ${location}\nОриентировочная цена со скидкой: от ${estimate.discountedMin} до ${estimate.discountedMax} сом\nМой номер: ${phone.trim()}`
  );

  const handleSelectDevice = (selected: string) => {
    setDevice(selected);
    setStep(2);
  };

  const handleSelectIssue = (selected: string) => {
    setIssue(selected);
    setStep(3);
  };

  const handleSelectLocation = (selected: string) => {
    setLocation(selected);
    setStep(4);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValidKyrgyzPhone(phone)) {
      setPhoneError('Введите корректный номер телефона Кыргызстана (например, +996 555 12 34 56)');
      return;
    }
    setPhoneError('');
    setSubmitted(true);
    // У сайта нет бэкенда: расчет уходит мастеру сообщением в WhatsApp
    window.open(whatsappSummaryUrl, '_blank', 'noopener,noreferrer');
  };

  const handleReset = () => {
    setStep(1);
    setDevice('');
    setIssue('');
    setLocation('');
    setPhone('+996 ');
    setPhoneError('');
    setSubmitted(false);
  };

  const progressScale = step === 1 ? 0.25 : step === 2 ? 0.5 : step === 3 ? 0.75 : 1;

  return (
    <section id="calculator" className="border-y border-slate-200/80 bg-[#F8FAFC] py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold text-blue-600">{text.eyebrow}</p>
          <h2 className="font-display mt-2 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {text.title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600">{text.subtitle}</p>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {/* Progress header */}
          <div className="border-b border-slate-100 px-6 py-4 sm:px-8">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>{submitted ? 'Расчет готов' : step < 4 ? `Шаг ${step} из 3` : 'Финальный шаг'}</span>
              <span className="tabular-nums text-blue-600">Скидка 10% активирована</span>
            </div>
            <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full origin-left rounded-full bg-blue-600 transition-transform duration-200 ease-out"
                style={{ transform: `scaleX(${progressScale})` }}
              />
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {submitted ? (
              <div className="py-4">
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-[#16A34A]" aria-hidden="true" />
                    <div>
                      <h3 className="font-display text-xl font-bold text-slate-900">
                        Расчет готов — отправьте его мастеру в WhatsApp
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        Мы открыли WhatsApp с расчетом — нажмите «Отправить», чтобы закрепить скидку 10%. Мастер свяжется с вами по номеру <span className="font-semibold text-slate-900 tabular-nums">{phone}</span> в течение 5–10 минут.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 rounded-xl border border-slate-200 bg-[#F8FAFC] p-5 sm:grid-cols-3">
                  <div>
                    <span className="text-xs text-slate-500">Устройство и задача</span>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {device} · {issue}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500">Формат</span>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{location}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500">Ориентир со скидкой 10%</span>
                    <p className="font-display mt-1 text-lg font-bold text-blue-600 tabular-nums">
                      {estimate.discountedMin.toLocaleString('ru-RU')} –{' '}
                      {estimate.discountedMax.toLocaleString('ru-RU')} сом
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a
                    href={whatsappSummaryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#16A34A] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#15803D]"
                  >
                    <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>Отправить расчет в WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    <RotateCcw className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>Рассчитать для другого устройства</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {step === 1 && (
                  <div>
                    <h3 className="font-display text-xl font-bold text-slate-900">
                      Шаг 1. Выберите устройство
                    </h3>
                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      {DEVICE_OPTIONS.map((item) => {
                        const Icon = item.icon;
                        const selected = device === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelectDevice(item.id)}
                            className={`flex flex-col items-start rounded-xl border p-5 text-left transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                              selected
                                ? 'border-blue-600 bg-blue-50/50'
                                : 'border-slate-200 bg-[#F8FAFC] hover:border-blue-400 hover:bg-white'
                            }`}
                          >
                            <Icon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                            <span className="font-display mt-3 text-base font-semibold text-slate-900">
                              {item.label}
                            </span>
                            <span className="mt-1 text-xs leading-relaxed text-slate-600">
                              {item.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h3 className="font-display text-xl font-bold text-slate-900">
                      Шаг 2. Что случилось с устройством?
                    </h3>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {ISSUE_OPTIONS.map((item) => {
                        const selected = issue === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelectIssue(item.id)}
                            className={`flex flex-col items-start rounded-xl border p-4 text-left transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                              selected
                                ? 'border-blue-600 bg-blue-50/50'
                                : 'border-slate-200 bg-[#F8FAFC] hover:border-blue-400 hover:bg-white'
                            }`}
                          >
                            <span className="font-display text-base font-semibold text-slate-900">
                              {item.label}
                            </span>
                            <span className="mt-1 text-xs text-slate-600">{item.hint}</span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="inline-flex min-h-[40px] items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900"
                      >
                        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                        <span>Назад</span>
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h3 className="font-display text-xl font-bold text-slate-900">
                      Шаг 3. Где удобно провести ремонт?
                    </h3>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {LOCATION_OPTIONS.map((item) => {
                        const selected = location === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelectLocation(item.id)}
                            className={`flex flex-col items-start rounded-xl border p-5 text-left transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                              selected
                                ? 'border-blue-600 bg-blue-50/50'
                                : 'border-slate-200 bg-[#F8FAFC] hover:border-blue-400 hover:bg-white'
                            }`}
                          >
                            <span className="font-display text-base font-semibold text-slate-900">
                              {item.label}
                            </span>
                            <span className="mt-1.5 text-xs leading-relaxed text-slate-600">
                              {item.hint || contacts.address}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="inline-flex min-h-[40px] items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900"
                      >
                        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                        <span>Назад</span>
                      </button>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs font-medium text-slate-500">
                            {device} · {issue} · {location}
                          </p>
                          <p className="mt-1 text-sm text-slate-700">
                            Примерное время работы: <span className="font-semibold text-slate-900">{estimate.estimatedTime}</span>
                          </p>
                        </div>
                        <div className="sm:text-right">
                          <span className="text-xs text-slate-500">Предварительно со скидкой 10%</span>
                          <div className="font-display text-2xl font-bold text-blue-600 tabular-nums">
                            {estimate.discountedMin.toLocaleString('ru-RU')} –{' '}
                            {estimate.discountedMax.toLocaleString('ru-RU')} сом
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <label htmlFor="quiz-phone" className="block text-sm font-semibold text-slate-900">
                        Введите номер телефона (+996), чтобы зафиксировать цену и скидку 10%
                      </label>
                      <div className="mt-2.5 flex flex-col gap-3 sm:flex-row">
                        <input
                          id="quiz-phone"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder="+996 (555) 00-00-00"
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            if (phoneError) setPhoneError('');
                          }}
                          className={`min-h-[48px] flex-1 rounded-xl border px-4 py-3 text-base text-slate-900 tabular-nums outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 ${
                            phoneError ? 'border-red-500 bg-red-50/40' : 'border-slate-300 bg-white'
                          }`}
                        />
                        <button
                          type="submit"
                          className="inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:text-base"
                        >
                          <span>Рассчитать стоимость и получить скидку 10%</span>
                          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                        </button>
                      </div>
                      {phoneError && (
                        <p className="mt-2 text-xs font-medium text-red-600" role="alert">
                          {phoneError}
                        </p>
                      )}
                      <p className="mt-2.5 text-xs text-slate-500">
                        Нажимая кнопку, вы соглашаетесь на обратный звонок мастера. Без спама.
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="inline-flex min-h-[40px] items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900"
                      >
                        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                        <span>Изменить выбор</span>
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
