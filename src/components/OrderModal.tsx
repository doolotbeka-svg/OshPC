import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2, MessageCircle, X } from 'lucide-react';
import { buildWhatsAppUrl, isValidKyrgyzPhone } from '../data/serviceData';
import { useContent } from '../content/ContentContext';
import { submitLead } from '../lib/submitLead';

interface OrderModalProps {
  isOpen: boolean;
  initialProblem?: string;
  onClose: () => void;
}

export default function OrderModal({ isOpen, initialProblem = '', onClose }: OrderModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+996 ');
  const [problem, setProblem] = useState(initialProblem);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [delivered, setDelivered] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const { contacts } = useContent();

  useEffect(() => {
    if (isOpen) {
      setProblem(initialProblem);
      setSubmitted(false);
      setDelivered(false);
      setError('');
    }
  }, [isOpen, initialProblem]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    // Блокируем прокрутку страницы под открытым окном
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const whatsappDirect = buildWhatsAppUrl(
    contacts.whatsappNumber,
    `Здравствуйте! Заявка с сайта ${contacts.brand}:\nИмя: ${name.trim()}\nТелефон: ${phone.trim()}\nПроблема: ${
      problem.trim() || 'Нужна консультация и диагностика'
    }`
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;

    if (name.trim().length < 2) {
      setError('Пожалуйста, укажите ваше имя.');
      return;
    }
    if (!isValidKyrgyzPhone(phone)) {
      setError('Введите корректный номер телефона в формате +996 (XXX) XX-XX-XX.');
      return;
    }

    setError('');
    setSending(true);
    // Сервер пересылает заявку мастеру в WhatsApp. Если не получилось —
    // покажем клиенту кнопку, чтобы он отправил заявку сам.
    const ok = await submitLead({
      source: 'order',
      name: name.trim(),
      phone: phone.trim(),
      problem: problem.trim(),
      website: honeypot,
    });
    setSending(false);
    setDelivered(ok);
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть окно заявки"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="py-2">
            <CheckCircle2 className="h-10 w-10 text-[#16A34A]" aria-hidden="true" />
            <h2 id="order-modal-title" className="font-display mt-4 text-2xl font-bold text-slate-900">
              {delivered ? 'Заявка отправлена!' : 'Почти готово!'}
            </h2>
            {delivered ? (
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Спасибо, {name.trim()}. Дежурный мастер в Оше перезвонит на номер{' '}
                <span className="font-semibold text-slate-900 tabular-nums">{phone}</span> в течение
                5–10 минут, чтобы уточнить детали и время выезда.
              </p>
            ) : (
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Спасибо, {name.trim()}. Не получилось передать заявку автоматически — нажмите кнопку
                ниже и отправьте сообщение в WhatsApp, мастер перезвонит на номер{' '}
                <span className="font-semibold text-slate-900 tabular-nums">{phone}</span> в течение
                5–10 минут.
              </p>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappDirect}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  delivered
                    ? 'inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50'
                    : 'inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#16A34A] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#15803D]'
                }
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                <span>{delivered ? 'Написать в WhatsApp' : 'Отправить заявку в WhatsApp'}</span>
              </a>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Закрыть
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 id="order-modal-title" className="font-display pr-8 text-2xl font-bold text-slate-900">
              Вызвать мастера в Оше
            </h2>
            <p className="mt-1.5 text-sm text-slate-600">
              Оставьте контакты — перезвоним за 5 минут, назовем точную стоимость и согласуем время.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
              <div>
                <label htmlFor="order-name" className="block text-sm font-semibold text-slate-800">
                  Ваше имя
                </label>
                <input
                  id="order-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Например, Азамат"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 min-h-[46px] w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                />
              </div>

              <div>
                <label htmlFor="order-phone" className="block text-sm font-semibold text-slate-800">
                  Номер телефона (+996)
                </label>
                <input
                  id="order-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+996 (555) 12-34-56"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1.5 min-h-[46px] w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 tabular-nums outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                />
              </div>

              <div>
                <label htmlFor="order-problem" className="block text-sm font-semibold text-slate-800">
                  Краткое описание проблемы
                </label>
                <textarea
                  id="order-problem"
                  rows={3}
                  placeholder="Например: ноутбук Lenovo сильно греется и шумит, нужна чистка или диагностика"
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                />
              </div>

              {/* Ловушка для ботов: поле скрыто от людей и программ чтения с экрана */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
              />

              {error && (
                <p className="text-xs font-medium text-red-600" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={sending}
                className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-60"
              >
                {sending ? 'Отправляем…' : 'Отправить заявку мастеру'}
              </button>
              <p className="text-center text-xs text-slate-500">
                Бесплатная диагностика при ремонте · Оплата после проверки
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
