import { useEffect } from 'react';
import { X } from 'lucide-react';
import { SITE_CONTACTS } from '../data/serviceData';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть политику конфиденциальности"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 id="privacy-modal-title" className="font-display pr-8 text-xl font-bold text-slate-900">
          Политика конфиденциальности {SITE_CONTACTS.brand}
        </h2>

        <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
          <p>
            Настоящая политика определяет порядок обработки контактных данных клиентов сервисного
            центра {SITE_CONTACTS.brand} в городе Ош, Кыргызстан.
          </p>
          <p>
            <strong className="text-slate-900">1. Какие данные мы запрашиваем:</strong> только имя,
            контактный номер телефона и описание неисправности техники для согласования времени
            диагностики и стоимости ремонта.
          </p>
          <p>
            <strong className="text-slate-900">2. Сохранность данных на устройствах:</strong>{' '}
            мастера сервиса строго соблюдают конфиденциальность личных фотографий, документов,
            паролей и корпоративных баз 1С на накопителях клиентов.
          </p>
          <p>
            <strong className="text-slate-900">3. Передача третьим лицам:</strong> мы не продаем и
            не передаем ваши номера телефонов рекламным или сторонним организациям.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 inline-flex min-h-[42px] items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
        >
          Понятно
        </button>
      </div>
    </div>
  );
}
