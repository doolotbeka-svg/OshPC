import { useEffect, useState, type FormEvent } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  KeyRound,
  LogOut,
  Plus,
  RotateCcw,
  Save,
  Trash2,
} from 'lucide-react';
import {
  DEFAULT_CONTENT,
  SERVICE_CATEGORIES,
  type SiteContent,
} from '../data/serviceData';
import { fetchSavedContent, useSetContent } from '../content/ContentContext';

const PASSWORD_KEY = 'oshpc-admin-password';

const TABS: { key: keyof SiteContent; label: string; hint: string }[] = [
  { key: 'contacts', label: 'Контакты', hint: 'Телефон, WhatsApp, адрес, график и ссылки на соцсети.' },
  { key: 'hero', label: 'Главный экран', hint: 'Первый экран сайта: заголовок, текст, цифры и пункты доверия.' },
  { key: 'services', label: 'Услуги и цены', hint: 'Карточки услуг в прайс-листе.' },
  {
    key: 'calculator',
    label: 'Цены калькулятора',
    hint: 'Скидка и цены «от–до» в сомах для каждой проблемы и типа устройства. Цена со скидкой округляется до 50 сом.',
  },
  { key: 'workflow', label: 'Как мы работаем', hint: 'Шаги работы с клиентом.' },
  { key: 'advantages', label: 'Преимущества', hint: 'Блок «Почему выбирают нас».' },
  { key: 'reviews', label: 'Отзывы', hint: 'Отзывы клиентов. Общий рейтинг считается автоматически.' },
  { key: 'faq', label: 'Вопросы и ответы', hint: 'Частые вопросы внизу страницы.' },
  { key: 'zones', label: 'Районы выезда', hint: 'Районы и время прибытия на карте в контактах.' },
  { key: 'sections', label: 'Заголовки разделов', hint: 'Надзаголовки, заголовки и подзаголовки всех блоков.' },
  { key: 'seo', label: 'SEO', hint: 'Название вкладки браузера и описание для поисковиков.' },
];

const LABELS: Record<string, string> = {
  brand: 'Название компании',
  cityLabel: 'Город (подпись вверху)',
  phoneDisplay: 'Телефон (например, +996 (555) 12-34-56)',
  whatsappNumber: 'Номер WhatsApp (цифры с кодом 996)',
  whatsappGreeting: 'Первое сообщение в WhatsApp',
  telegramUrl: 'Ссылка на Telegram',
  instagramUrl: 'Ссылка на Instagram',
  address: 'Полный адрес',
  addressShort: 'Короткий адрес (на схеме карты)',
  schedule: 'График работы',
  scheduleShort: 'График коротко (на главном экране)',
  map2gisUrl: 'Ссылка на 2ГИС',
  mapGoogleUrl: 'Ссылка на Google Maps',
  title: 'Заголовок',
  subtitle: 'Подзаголовок',
  ctaLabel: 'Текст главной кнопки',
  metrics: 'Цифры под главным экраном',
  value: 'Значение',
  label: 'Подпись',
  trustPoints: 'Пункты доверия',
  category: 'Категория',
  description: 'Описание',
  price: 'Цена',
  duration: 'Время работы',
  number: 'Номер шага',
  name: 'Имя / название',
  district: 'Район',
  device: 'Устройство',
  issue: 'Задача',
  text: 'Текст',
  source: 'Источник (2ГИС, Google Карты…)',
  date: 'Дата',
  rating: 'Оценка (1–5)',
  question: 'Вопрос',
  answer: 'Ответ',
  eta: 'Время прибытия',
  eyebrow: 'Надзаголовок (синий текст над заголовком)',
  ctaTitle: 'Заголовок блока «Не нашли услугу?»',
  ctaText: 'Текст блока «Не нашли услугу?»',
  ratingLabel: 'Подпись рядом с рейтингом',
  services: 'Услуги',
  calculator: 'Калькулятор',
  workflow: 'Как мы работаем',
  advantages: 'Преимущества',
  reviews: 'Отзывы',
  faq: 'Вопросы и ответы',
  contacts: 'Контакты',
  discountPercent: 'Скидка, % (0 — без скидки)',
  issues: 'Проблемы (шаг 2 калькулятора)',
  hint: 'Пояснение',
  time: 'Примерное время работы',
  laptop: 'Ноутбук',
  pc: 'Стационарный ПК',
  aio: 'Моноблок',
  min: 'Цена от, сом',
  max: 'Цена до, сом',
};

const LONG_FIELDS = new Set([
  'description',
  'subtitle',
  'text',
  'answer',
  'ctaText',
  'whatsappGreeting',
  'address',
]);

const SELECT_OPTIONS: Record<string, { value: string; label: string }[]> = {
  category: SERVICE_CATEGORIES.filter((c) => c.id !== 'all').map((c) => ({
    value: c.id,
    label: c.label,
  })),
};

/** Шаблоны новых элементов списков. */
const TEMPLATES: Record<string, unknown> = {
  metrics: { value: '', label: '' },
  trustPoints: '',
  services: { id: '', category: 'hardware', title: 'Новая услуга', description: '', price: 'от 0 сом', duration: '' },
  workflow: { number: '', title: 'Новый шаг', description: '' },
  advantages: { title: 'Новое преимущество', description: '' },
  reviews: { id: '', name: 'Имя клиента', district: '', device: '', issue: '', text: '', source: '2ГИС', date: '', rating: 5 },
  faq: { id: '', question: 'Новый вопрос', answer: '' },
  zones: { id: '', name: 'Новый район', eta: '' },
  issues: {
    id: '',
    title: 'Новая проблема',
    hint: '',
    time: '',
    laptop: { min: 500, max: 1500 },
    pc: { min: 500, max: 1500 },
    aio: { min: 500, max: 1500 },
  },
};

function newItem(listName: string): unknown {
  const template = structuredClone(TEMPLATES[listName] ?? '');
  if (template && typeof template === 'object' && 'id' in template) {
    (template as { id: string }).id = `${listName}-${Date.now().toString(36)}`;
  }
  return template;
}

function itemSummary(item: unknown, index: number): string {
  if (typeof item === 'string') return item || `Пункт ${index + 1}`;
  if (item && typeof item === 'object') {
    const o = item as Record<string, unknown>;
    const text = o.title ?? o.name ?? o.question ?? o.value;
    if (typeof text === 'string' && text.trim()) return text;
  }
  return `Элемент ${index + 1}`;
}

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15';

function readStoredPassword(): string {
  try {
    return sessionStorage.getItem(PASSWORD_KEY) ?? '';
  } catch {
    return '';
  }
}

function storePassword(value: string | null) {
  try {
    if (value) sessionStorage.setItem(PASSWORD_KEY, value);
    else sessionStorage.removeItem(PASSWORD_KEY);
  } catch {
    // Хранилище браузера недоступно — придется вводить пароль заново
  }
}

/* ---------------------------- Редакторы полей ---------------------------- */

interface NodeProps {
  name: string;
  value: unknown;
  onChange: (value: unknown) => void;
}

function ValueEditor({ name, value, onChange }: NodeProps) {
  if (Array.isArray(value)) return <ListEditor name={name} items={value} onChange={onChange} />;

  if (value && typeof value === 'object') {
    return (
      <ObjectEditor value={value as Record<string, unknown>} onChange={onChange} />
    );
  }

  if (typeof value === 'number') {
    return (
      <input
        type="number"
        min={name === 'rating' ? 1 : 0}
        max={name === 'rating' ? 5 : name === 'discountPercent' ? 90 : undefined}
        step={name === 'rating' ? 0.5 : name === 'min' || name === 'max' ? 50 : 1}
        value={value}
        onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
        className={`${inputClass} max-w-[140px]`}
      />
    );
  }

  const text = typeof value === 'string' ? value : '';
  const options = SELECT_OPTIONS[name];
  if (options) {
    return (
      <select value={text} onChange={(e) => onChange(e.target.value)} className={inputClass}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  }

  if (LONG_FIELDS.has(name) || text.length > 90) {
    return (
      <textarea
        rows={Math.min(8, Math.max(3, Math.ceil(text.length / 80)))}
        value={text}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    );
  }

  return (
    <input type="text" value={text} onChange={(e) => onChange(e.target.value)} className={inputClass} />
  );
}

function ObjectEditor({
  value,
  onChange,
}: {
  value: Record<string, unknown>;
  onChange: (value: unknown) => void;
}) {
  const keys = Object.keys(value).filter((k) => k !== 'id');
  return (
    <div className="space-y-4">
      {keys.map((key) => {
        const child = value[key];
        const isGroup = child !== null && typeof child === 'object' && !Array.isArray(child);
        const update = (v: unknown) => onChange({ ...value, [key]: v });
        if (isGroup) {
          return (
            <fieldset key={key} className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
              <legend className="px-1.5 text-sm font-bold text-slate-900">
                {LABELS[key] ?? key}
              </legend>
              <ValueEditor name={key} value={child} onChange={update} />
            </fieldset>
          );
        }
        // Списки нельзя класть в <label>: клик по кнопке внутри метки
        // дублируется браузером на первую кнопку и карточка сразу закрывается
        const Wrapper = Array.isArray(child) ? 'div' : 'label';
        return (
          <Wrapper key={key} className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-600">
              {LABELS[key] ?? key}
            </span>
            <ValueEditor name={key} value={child} onChange={update} />
          </Wrapper>
        );
      })}
    </div>
  );
}

function ListEditor({
  name,
  items,
  onChange,
}: {
  name: string;
  items: unknown[];
  onChange: (value: unknown) => void;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
    if (openIndex === from) setOpenIndex(to);
  };

  const remove = (index: number) => {
    if (!window.confirm(`Удалить «${itemSummary(items[index], index)}»?`)) return;
    onChange(items.filter((_, i) => i !== index));
    setOpenIndex(null);
  };

  const add = () => {
    onChange([...items, newItem(name)]);
    setOpenIndex(items.length);
  };

  const simple = items.every((item) => typeof item !== 'object' || item === null);

  return (
    <div className="space-y-2.5">
      {items.length === 0 && (
        <p className="rounded-lg border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500">
          Список пуст — этот блок не будет показан на сайте.
        </p>
      )}
      {items.map((item, index) => {
        const controls = (
          <div className="flex shrink-0 items-center gap-1">
            <IconButton label="Выше" onClick={() => move(index, index - 1)} disabled={index === 0}>
              <ArrowUp className="h-4 w-4" />
            </IconButton>
            <IconButton
              label="Ниже"
              onClick={() => move(index, index + 1)}
              disabled={index === items.length - 1}
            >
              <ArrowDown className="h-4 w-4" />
            </IconButton>
            <IconButton label="Удалить" onClick={() => remove(index)} danger>
              <Trash2 className="h-4 w-4" />
            </IconButton>
          </div>
        );

        if (simple) {
          return (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-1">
                <ValueEditor
                  name={name}
                  value={item}
                  onChange={(v) => onChange(items.map((it, i) => (i === index ? v : it)))}
                />
              </div>
              {controls}
            </div>
          );
        }

        const isOpen = openIndex === index;
        return (
          <div key={index} className="rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center gap-2 px-3 py-2">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                className="flex min-h-[40px] flex-1 items-center gap-2 text-left text-sm font-semibold text-slate-900"
              >
                <span className="w-6 shrink-0 text-xs font-medium text-slate-400 tabular-nums">
                  {index + 1}.
                </span>
                <span className="line-clamp-1">{itemSummary(item, index)}</span>
              </button>
              {controls}
            </div>
            {isOpen && (
              <div className="border-t border-slate-100 bg-slate-50/60 p-4">
                <ValueEditor
                  name={name}
                  value={item}
                  onChange={(v) => onChange(items.map((it, i) => (i === index ? v : it)))}
                />
              </div>
            )}
          </div>
        );
      })}
      <button
        type="button"
        onClick={add}
        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-dashed border-blue-300 px-3.5 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Добавить
      </button>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors disabled:opacity-30 ${
        danger ? 'hover:bg-red-50 hover:text-red-600' : 'hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      {children}
    </button>
  );
}

/* ------------------------------- Вход ------------------------------- */

async function checkPassword(password: string): Promise<'ok' | 'wrong' | 'unavailable'> {
  try {
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: { 'x-admin-password': password },
    });
    if (res.ok) return 'ok';
    if (res.status === 401) return 'wrong';
    return 'unavailable';
  } catch {
    return 'unavailable';
  }
}

function LoginForm({ onSuccess }: { onSuccess: (password: string) => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const result = await checkPassword(password);
    setBusy(false);
    if (result === 'ok') onSuccess(password);
    else if (result === 'wrong') setError('Неверный пароль.');
    else setError('Сервер недоступен. Админ-панель работает только на опубликованном сайте.');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <h1 className="font-display text-2xl font-bold text-slate-900">Админ-панель</h1>
        <p className="mt-1.5 text-sm text-slate-600">Введите пароль администратора сайта.</p>
        <label htmlFor="admin-password" className="mt-6 block text-sm font-semibold text-slate-800">
          Пароль
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`${inputClass} mt-1.5 min-h-[44px]`}
        />
        {error && (
          <p className="mt-2 text-xs font-medium text-red-600" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy || !password}
          className="mt-5 flex min-h-[44px] w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {busy ? 'Проверяем…' : 'Войти'}
        </button>
        <a href="#" className="mt-4 block text-center text-sm text-slate-500 hover:text-slate-900">
          ← Вернуться на сайт
        </a>
      </form>
    </div>
  );
}

/* ---------------------------- Смена пароля ---------------------------- */

const MIN_PASSWORD_LENGTH = 8;

function PasswordForm({
  currentPassword,
  onChanged,
  onUnauthorized,
}: {
  currentPassword: string;
  onChanged: (newPassword: string) => void;
  onUnauthorized: () => void;
}) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeat, setRepeat] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setDone(false);
    if (oldPassword !== currentPassword) {
      setError('Текущий пароль указан неверно.');
      return;
    }
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setError(`Новый пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов.`);
      return;
    }
    if (newPassword.trim() !== newPassword) {
      setError('Пароль не должен начинаться или заканчиваться пробелом.');
      return;
    }
    if (newPassword !== repeat) {
      setError('Новые пароли не совпадают.');
      return;
    }
    if (newPassword === currentPassword) {
      setError('Новый пароль совпадает с текущим.');
      return;
    }

    setError('');
    setBusy(true);
    try {
      const res = await fetch('/api/content', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json', 'x-admin-password': currentPassword },
        body: JSON.stringify({ newPassword }),
      });
      if (res.status === 401) return onUnauthorized();
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? `Ошибка ${res.status}`);
      }
      onChanged(newPassword);
      setOldPassword('');
      setNewPassword('');
      setRepeat('');
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось сменить пароль.');
    } finally {
      setBusy(false);
    }
  };

  const field = (
    id: string,
    label: string,
    value: string,
    set: (v: string) => void,
    autoComplete: string
  ) => (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label}
      </label>
      <input
        id={id}
        type="password"
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => {
          set(e.target.value);
          setDone(false);
        }}
        className={`${inputClass} min-h-[44px]`}
      />
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6"
    >
      {field('pw-old', 'Текущий пароль', oldPassword, setOldPassword, 'current-password')}
      {field(
        'pw-new',
        `Новый пароль (не короче ${MIN_PASSWORD_LENGTH} символов)`,
        newPassword,
        setNewPassword,
        'new-password'
      )}
      {field('pw-repeat', 'Повторите новый пароль', repeat, setRepeat, 'new-password')}

      {error && (
        <p className="text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
      {done && (
        <p className="text-sm font-medium text-green-700" role="status">
          Пароль изменен. Старый пароль больше не подходит.
        </p>
      )}

      <button
        type="submit"
        disabled={busy || !oldPassword || !newPassword || !repeat}
        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-40"
      >
        <KeyRound className="h-4 w-4" aria-hidden="true" />
        {busy ? 'Сохраняем…' : 'Сменить пароль'}
      </button>
    </form>
  );
}

/* --------------------------- Панель целиком --------------------------- */

type Status = { kind: 'ok' | 'error' | 'info'; text: string } | null;

export default function AdminPanel() {
  const setSiteContent = useSetContent();
  const [password, setPassword] = useState('');
  const [draft, setDraft] = useState<SiteContent | null>(null);
  const [savedJson, setSavedJson] = useState('');
  const [activeTab, setActiveTab] = useState<keyof SiteContent>('contacts');
  const [view, setView] = useState<'content' | 'password'>('content');
  const [status, setStatus] = useState<Status>(null);
  const [busy, setBusy] = useState(false);

  const dirty = draft !== null && JSON.stringify(draft) !== savedJson;

  const loadDraft = async () => {
    try {
      const content = await fetchSavedContent();
      setDraft(content);
      setSavedJson(JSON.stringify(content));
    } catch {
      setDraft(DEFAULT_CONTENT);
      setSavedJson(JSON.stringify(DEFAULT_CONTENT));
      setStatus({ kind: 'error', text: 'Не удалось загрузить сохраненные данные — показаны исходные.' });
    }
  };

  // Автовход, если пароль уже вводили в этой вкладке
  useEffect(() => {
    const stored = readStoredPassword();
    if (!stored) return;
    checkPassword(stored).then((result) => {
      if (result === 'ok') {
        setPassword(stored);
        void loadDraft();
      } else {
        storePassword(null);
      }
    });
  }, []);

  // Предупреждение о несохраненных изменениях
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const handleLogin = (pw: string) => {
    storePassword(pw);
    setPassword(pw);
    void loadDraft();
  };

  const logout = () => {
    if (dirty && !window.confirm('Есть несохраненные изменения. Выйти без сохранения?')) return;
    storePassword(null);
    setPassword('');
    setDraft(null);
  };

  const handleUnauthorized = () => {
    storePassword(null);
    setPassword('');
    setStatus({ kind: 'error', text: 'Пароль больше не подходит. Войдите заново.' });
  };

  const save = async () => {
    if (!draft) return;
    setBusy(true);
    setStatus(null);
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'content-type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify(draft),
      });
      if (res.status === 401) return handleUnauthorized();
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? `Ошибка ${res.status}`);
      }
      setSavedJson(JSON.stringify(draft));
      setSiteContent(draft);
      setStatus({ kind: 'ok', text: 'Сохранено. Изменения уже видны на сайте.' });
    } catch (error) {
      setStatus({
        kind: 'error',
        text: error instanceof Error ? error.message : 'Не удалось сохранить.',
      });
    } finally {
      setBusy(false);
    }
  };

  const resetToDefaults = async () => {
    if (
      !window.confirm(
        'Вернуть всё содержимое сайта к исходному варианту? Все ваши правки будут удалены.'
      )
    )
      return;
    setBusy(true);
    setStatus(null);
    try {
      const res = await fetch('/api/content', {
        method: 'DELETE',
        headers: { 'x-admin-password': password },
      });
      if (res.status === 401) return handleUnauthorized();
      if (!res.ok) throw new Error(`Ошибка ${res.status}`);
      setDraft(DEFAULT_CONTENT);
      setSavedJson(JSON.stringify(DEFAULT_CONTENT));
      setSiteContent(DEFAULT_CONTENT);
      setStatus({ kind: 'ok', text: 'Содержимое сброшено к исходному.' });
    } catch (error) {
      setStatus({
        kind: 'error',
        text: error instanceof Error ? error.message : 'Не удалось сбросить.',
      });
    } finally {
      setBusy(false);
    }
  };

  if (!password) return <LoginForm onSuccess={handleLogin} />;

  if (!draft) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  const tab = TABS.find((t) => t.key === activeTab) ?? TABS[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      {/* Верхняя панель */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="font-display text-base font-bold">Админ-панель {draft.contacts.brand}</p>
            <p className="text-xs text-slate-500">
              {dirty ? 'Есть несохраненные изменения' : 'Все изменения сохранены'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="#"
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Сайт
            </a>
            <button
              type="button"
              onClick={logout}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Выйти
            </button>
            <button
              type="button"
              onClick={save}
              disabled={!dirty || busy}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-40"
            >
              <Save className="h-4 w-4" aria-hidden="true" />
              {busy ? 'Сохраняем…' : 'Сохранить'}
            </button>
          </div>
        </div>
        {status && (
          <div
            role="status"
            className={`border-t px-4 py-2 text-center text-sm font-medium ${
              status.kind === 'ok'
                ? 'border-green-200 bg-green-50 text-green-800'
                : status.kind === 'error'
                  ? 'border-red-200 bg-red-50 text-red-700'
                  : 'border-blue-200 bg-blue-50 text-blue-800'
            }`}
          >
            {status.text}
          </div>
        )}
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_1fr]">
        {/* Разделы */}
        <nav aria-label="Разделы" className="lg:sticky lg:top-24 lg:self-start">
          <ul className="flex gap-1.5 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
            {TABS.map((t) => (
              <li key={t.key} className="shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab(t.key);
                    setView('content');
                  }}
                  aria-current={view === 'content' && t.key === activeTab ? 'page' : undefined}
                  className={`w-full whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors ${
                    view === 'content' && t.key === activeTab
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-700 hover:bg-white hover:text-slate-900'
                  }`}
                >
                  {t.label}
                </button>
              </li>
            ))}
            <li className="shrink-0 lg:mt-3 lg:border-t lg:border-slate-200 lg:pt-3">
              <button
                type="button"
                onClick={() => setView('password')}
                aria-current={view === 'password' ? 'page' : undefined}
                className={`inline-flex w-full items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors ${
                  view === 'password'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-700 hover:bg-white hover:text-slate-900'
                }`}
              >
                <KeyRound className="h-4 w-4" aria-hidden="true" />
                Сменить пароль
              </button>
            </li>
          </ul>
          <button
            type="button"
            onClick={resetToDefaults}
            disabled={busy}
            className="mt-4 hidden items-center gap-1.5 px-3 text-xs font-medium text-slate-500 hover:text-red-600 lg:inline-flex"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Сбросить к исходному
          </button>
        </nav>

        {/* Редактор */}
        {view === 'password' ? (
          <main className="min-w-0">
            <div className="mb-5">
              <h1 className="font-display text-2xl font-bold">Смена пароля</h1>
              <p className="mt-1 text-sm text-slate-600">
                Новый пароль начнет действовать сразу, старый перестанет подходить.
              </p>
            </div>
            <PasswordForm
              currentPassword={password}
              onChanged={(pw) => {
                storePassword(pw);
                setPassword(pw);
              }}
              onUnauthorized={handleUnauthorized}
            />
          </main>
        ) : (
        <main className="min-w-0">
          <div className="mb-5">
            <h1 className="font-display text-2xl font-bold">{tab.label}</h1>
            <p className="mt-1 text-sm text-slate-600">{tab.hint}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/60 p-4 sm:p-6">
            <ValueEditor
              key={tab.key}
              name={tab.key}
              value={draft[tab.key]}
              onChange={(v) => setDraft({ ...draft, [tab.key]: v } as SiteContent)}
            />
          </div>
          <button
            type="button"
            onClick={resetToDefaults}
            disabled={busy}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-red-600 lg:hidden"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Сбросить к исходному
          </button>
        </main>
        )}
      </div>
    </div>
  );
}
