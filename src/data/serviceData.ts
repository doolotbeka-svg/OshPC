export type ServiceCategory = 'all' | 'diagnostics' | 'software' | 'hardware';

export interface ServiceItem {
  id: string;
  category: Exclude<ServiceCategory, 'all'>;
  title: string;
  description: string;
  price: string;
  duration: string;
}

export interface ReviewItem {
  id: string;
  name: string;
  district: string;
  device: string;
  issue: string;
  text: string;
  source: string;
  date: string;
  rating: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface SectionHeading {
  eyebrow: string;
  title: string;
}

export interface SiteContacts {
  brand: string;
  cityLabel: string;
  phoneDisplay: string;
  whatsappNumber: string;
  whatsappGreeting: string;
  telegramUrl: string;
  instagramUrl: string;
  address: string;
  addressShort: string;
  schedule: string;
  scheduleShort: string;
  map2gisUrl: string;
  mapGoogleUrl: string;
}

export interface SiteContent {
  seo: { title: string; description: string };
  contacts: SiteContacts;
  hero: {
    title: string;
    subtitle: string;
    ctaLabel: string;
    metrics: { value: string; label: string }[];
    trustPoints: string[];
  };
  sections: {
    services: SectionHeading & { subtitle: string; ctaTitle: string; ctaText: string };
    calculator: SectionHeading & { subtitle: string };
    workflow: SectionHeading;
    advantages: SectionHeading;
    reviews: SectionHeading & { ratingLabel: string };
    faq: SectionHeading;
    contacts: SectionHeading & { subtitle: string };
  };
  services: ServiceItem[];
  workflow: { number: string; title: string; description: string }[];
  advantages: { title: string; description: string }[];
  reviews: ReviewItem[];
  faq: FaqItem[];
  zones: { id: string; name: string; eta: string }[];
}

export const SERVICE_CATEGORIES: { id: ServiceCategory; label: string }[] = [
  { id: 'all', label: 'Все услуги' },
  { id: 'diagnostics', label: 'Диагностика и профилактика' },
  { id: 'software', label: 'Настройка программ' },
  { id: 'hardware', label: 'Аппаратный ремонт' },
];

export function categoryLabel(category: ServiceCategory): string {
  return SERVICE_CATEGORIES.find((c) => c.id === category)?.label ?? '';
}

export const DEFAULT_CONTENT: SiteContent = {
  seo: {
    title: 'OshPC Service — Ремонт и настройка ПК и ноутбуков в Оше',
    description:
      'Профессиональный ремонт, диагностика и настройка компьютеров и ноутбуков в городе Ош, Кыргызстан. Выезд мастера за 40 минут, бесплатная диагностика при ремонте, гарантия до 1 года.',
  },
  contacts: {
    brand: 'OshPC Service',
    cityLabel: 'г. Ош, выезд по всему городу',
    phoneDisplay: '+996 (555) 12-34-56',
    whatsappNumber: '996555123456',
    whatsappGreeting: 'Здравствуйте! Нужна консультация по ремонту в Оше.',
    telegramUrl: 'https://t.me/oshpc_service',
    instagramUrl: 'https://instagram.com/oshpc.service',
    address: 'г. Ош, ул. Курманжан Датка, 248 (ориентир — напротив ТЦ «Келечек»)',
    addressShort: 'ул. Курманжан Датка, 248',
    schedule: 'Ежедневно с 09:00 до 20:00 без выходных',
    scheduleShort: 'Ежедневно 09:00–20:00',
    map2gisUrl: 'https://2gis.kg/osh',
    mapGoogleUrl: 'https://maps.google.com/?q=Osh+Kyrgyzstan',
  },
  hero: {
    title: 'Профессиональный ремонт, диагностика и настройка ПК и ноутбуков в Оше',
    subtitle:
      'Бесплатная диагностика при ремонте. Выезд мастера на дом и в офис по Ошу за 40 минут. Гарантия на все работы и запчасти до 1 года.',
    ctaLabel: 'Вызвать мастера / Узнать цену',
    metrics: [
      { value: '40 мин', label: 'Среднее время выезда мастера по г. Ош' },
      { value: '0 сом', label: 'Диагностика при дальнейшем ремонте' },
      { value: 'до 1 года', label: 'Официальная гарантия на работу и детали' },
      { value: '80% задач', label: 'Устраняем в день обращения за 1–2 часа' },
    ],
    trustPoints: [
      'Оплата после проверки работы',
      'Оригинальные комплектующие',
      'Опыт мастеров более 5 лет',
    ],
  },
  sections: {
    services: {
      eyebrow: 'Услуги и прозрачный прайс-лист',
      title: 'Честные цены на популярные работы в сомах',
      subtitle:
        'Стоимость согласуется до начала ремонта. Оригинальные запчасти и расходники всегда в наличии на нашем складе в Оше.',
      ctaTitle: 'Не нашли свою проблему в списке?',
      ctaText:
        'Опишите поломку или отправьте фото экрана в WhatsApp — мастер назовет точную цену за 5 минут.',
    },
    calculator: {
      eyebrow: 'Онлайн-калькулятор стоимости',
      title: 'Узнайте цену ремонта за 3 шага и получите скидку 10%',
      subtitle:
        'Ответьте на три коротких вопроса — система сразу покажет ориентировочную вилку цен в сомах и закрепит за вами скидку 10% на работу мастера.',
    },
    workflow: {
      eyebrow: 'Как мы работаем',
      title: 'От обращения до готового устройства — 4 понятных шага',
    },
    advantages: {
      eyebrow: 'Почему выбирают нас',
      title: 'Сервис в Оше, которому доверяют технику и рабочие данные',
    },
    reviews: {
      eyebrow: 'Отзывы клиентов из Оша',
      title: 'Реальные истории ремонта на 2ГИС и Google Картах',
      ratingLabel: 'Оценка в 2ГИС и Google',
    },
    faq: {
      eyebrow: 'Частые вопросы',
      title: 'Ответы перед вызовом мастера',
    },
    contacts: {
      eyebrow: 'Контакты в Оше',
      title: 'Приезжайте в сервис или вызывайте мастера',
      subtitle:
        'Работаем без выходных. Принимаем оплату наличными, через MBank, О!Деньги и Элкарт.',
    },
  },
  services: [
    {
      id: 'diag-full',
      category: 'diagnostics',
      title: 'Комплексная диагностика ПК или ноутбука',
      description:
        'Проверка накопителей, памяти, питания, температур и материнской платы с точным расчетом стоимости до начала ремонта.',
      price: '0 сом (при ремонте) / от 300 сом',
      duration: '20–40 мин',
    },
    {
      id: 'cleaning-mx4',
      category: 'diagnostics',
      title: 'Чистка от пыли и замена термопасты (Arctic MX-4)',
      description:
        'Полная разборка системы охлаждения, удаление пыли из радиаторов, смазка вентилятора и нанесение оригинальной пасты Arctic MX-4.',
      price: 'от 800 сом',
      duration: '60 мин',
    },
    {
      id: 'windows-setup',
      category: 'software',
      title: 'Установка и настройка Windows (10/11), драйверов и офисных программ',
      description:
        'Чистая установка системы с сохранением личных файлов, все актуальные драйверы, Microsoft Office, браузеры и кодеки.',
      price: 'от 700 сом',
      duration: '60–90 мин',
    },
    {
      id: 'virus-speedup',
      category: 'software',
      title: 'Удаление вирусов, баннеров и ускорение работы системы',
      description:
        'Очистка от рекламного ПО, майнеров и всплывающих окон, оптимизация автозагрузки и настройка надежной защиты.',
      price: 'от 500 сом',
      duration: '40–60 мин',
    },
    {
      id: 'kbd-battery-port',
      category: 'hardware',
      title: 'Замена клавиатуры, аккумулятора или разъема питания',
      description:
        'Аккуратная замена неисправного модуля на совместимую или оригинальную деталь с тестированием зарядки и клавиш.',
      price: 'от 1 000 сом',
      duration: '1–2 часа',
    },
    {
      id: 'screen-matrix',
      category: 'hardware',
      title: 'Замена матрицы (экрана) ноутбука',
      description:
        'Подбор дисплея IPS/TN с нужным разрешением и частотой, замена без засветов и следов вскрытия корпуса.',
      price: 'от 1 500 сом (без учета детали)',
      duration: '45–90 мин',
    },
    {
      id: 'upgrade-ssd-ram',
      category: 'hardware',
      title: 'Апгрейд (установка SSD, добавление оперативной памяти) и перенос данных',
      description:
        'Ускоряем старый ноутбук или ПК в 3–5 раз за счет NVMe/SATA SSD и расширения ОЗУ с полным переносом системы и документов.',
      price: 'от 600 сом',
      duration: '40–60 мин',
    },
    {
      id: 'pc-build',
      category: 'hardware',
      title: 'Сборка ПК под заказ (для игр, дизайна, офиса)',
      description:
        'Подбор комплектующих под ваш бюджет на рынке Оша и Бишкека, аккуратный кабель-менеджмент и стресс-тестирование.',
      price: 'от 1 500 сом',
      duration: '1 день',
    },
  ],
  workflow: [
    {
      number: '01',
      title: 'Заявка',
      description:
        'Вы оставляете заявку на сайте, проходите быстрый расчет стоимости или пишете нам в WhatsApp.',
    },
    {
      number: '02',
      title: 'Диагностика',
      description:
        'Мастер приезжает к вам за 40 минут или принимает технику в сервисе и называет точную цену до начала работ.',
    },
    {
      number: '03',
      title: 'Ремонт',
      description:
        'Устраняем неисправность в день обращения — 80% типичных поломок решаем на месте за 1–2 часа.',
    },
    {
      number: '04',
      title: 'Проверка и гарантия',
      description:
        'Вы лично проверяете скорость и стабильность работы устройства, оплачиваете услугу и получаете гарантийный талон.',
    },
  ],
  advantages: [
    {
      title: 'Честная цена без сюрпризов',
      description:
        'Итоговая стоимость озвучивается сразу после диагностики и фиксируется до начала ремонта — никаких скрытых доплат.',
    },
    {
      title: 'Выезд по всему городу Ош',
      description:
        'Оперативно приезжаем в центр и все микрорайоны: Юго-Восток, Анар, Ак-Тилек, ХБК, Кулатов, Черемушки, а также ближайший пригород.',
    },
    {
      title: 'Собственный склад запчастей',
      description:
        'Популярные SSD, оперативная память, блоки питания, матрицы, клавиатуры и термопаста Arctic MX-4 всегда в наличии в Оше.',
    },
    {
      title: 'Полная конфиденциальность',
      description:
        'Ваши семейные фотографии, рабочие документы, пароли и бухгалтерские базы 1С остаются в полной сохранности.',
    },
  ],
  reviews: [
    {
      id: 'rev-1',
      name: 'Азамат Токтосунов',
      district: 'мкр. Юго-Восток',
      device: 'Lenovo IdeaPad 5',
      issue: 'Перегрев и шум вентилятора',
      text: 'Ноутбук сильно гудел и выключался во время работы. Мастер приехал домой на Юго-Восток через 35 минут, почистил систему охлаждения, заменил термопасту на MX-4 и поставил SSD. Стал работать тихо и очень быстро.',
      source: '2ГИС',
      date: 'Октябрь 2026',
      rating: 5,
    },
    {
      id: 'rev-2',
      name: 'Айгерим Кадырова',
      district: 'Центр, ул. Ленина',
      device: 'ASUS ROG Strix G15',
      issue: 'Установка Windows 11 и драйверов',
      text: 'Заказывала настройку нового игрового ноутбука для учебы и монтажа. Привезла в сервис на Курманжан Датка — за полтора часа поставили чистую Windows 11, все драйверы и нужные программы. Цену сказали сразу, выдали талон.',
      source: 'Google Карты',
      date: 'Октябрь 2026',
      rating: 5,
    },
    {
      id: 'rev-3',
      name: 'Бектур Маматов',
      district: 'мкр. Анар',
      device: 'Офисный ПК (2 шт.)',
      issue: 'Не включался, зависала 1С',
      text: 'В офисе перестал запускаться компьютер бухгалтера с важной базой 1С. Ребята оперативно приехали, заменили вышедший из строя блок питания из наличия и перенесли систему на новый SSD без потери ни одного файла.',
      source: '2ГИС',
      date: 'Сентябрь 2026',
      rating: 5,
    },
    {
      id: 'rev-4',
      name: 'Елена Соколова',
      district: 'мкр. Черемушки',
      device: 'HP Pavilion 15',
      issue: 'Разбитая матрица экрана',
      text: 'Случайно прижали экран ноутбука, пошла трещина. Матрица оказалась на складе в Оше, заменили прямо в день обращения за час. Оплатила переводом через МБанк после того, как сама проверила картинку.',
      source: 'Google Карты',
      date: 'Сентябрь 2026',
      rating: 5,
    },
  ],
  faq: [
    {
      id: 'faq-1',
      question: 'Сколько времени занимает диагностика?',
      answer:
        'Первичная экспресс-диагностика на выезде или в сервисном центре занимает 20–40 минут. Если проблема плавающая и требует глубокой проверки материнской платы или длительного стресс-теста, диагностика может занять от 2 до 4 часов.',
    },
    {
      id: 'faq-2',
      question: 'Даете ли вы гарантию на установку Windows и ремонт?',
      answer:
        'Да, после завершения работ вы получаете официальный гарантийный талон. Гарантия на программную настройку составляет до 3 месяцев, а на аппаратный ремонт и установленные комплектующие — от 6 до 12 месяцев.',
    },
    {
      id: 'faq-3',
      question: 'Сколько стоит выезд мастера по городу Ош?',
      answer:
        'При дальнейшем проведении ремонта или настройки выезд мастера по всему городу Ош (Центр, Юго-Восток, Анар, Ак-Тилек, ХБК, Кулатов, Черемушки) бесплатный. В случае отказа от ремонта оплачивается только выезд и проведенная диагностика — от 300 сом.',
    },
    {
      id: 'faq-4',
      question: 'Можно ли оплатить переводом через МБанк (MBank), О!Деньги или Элкарт?',
      answer:
        'Да, мы принимаем оплату любым удобным способом: наличными в сомах, переводом или по QR-коду через MBank (МБанк), О!Деньги, MegaPay, Bakai24 и карты Элкарт. Оплата происходит только после того, как вы проверите исправную работу устройства.',
    },
    {
      id: 'faq-5',
      question: 'Сохранятся ли мои файлы и документы при переустановке системы или ремонте?',
      answer:
        'Обязательно. Перед любыми работами с системой мы делаем резервную копию важных папок, фотографий, рабочих документов и баз данных, если накопитель исправен.',
    },
  ],
  zones: [
    { id: 'center', name: 'Центр (Курманжан Датка)', eta: '15–20 мин' },
    { id: 'yugovostok', name: 'мкр. Юго-Восток', eta: '25–35 мин' },
    { id: 'anar', name: 'мкр. Анар / Ак-Тилек', eta: '30–40 мин' },
    { id: 'hbk', name: 'мкр. ХБК / Кулатов / Черемушки', eta: '25–40 мин' },
  ],
};

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/**
 * Накладывает сохраненное содержимое на значения по умолчанию.
 * Объекты сливаются по полям (новые поля получают значения по умолчанию),
 * массивы и примитивы берутся из сохраненных данных, если тип совпадает.
 */
export function mergeContent<T>(defaults: T, saved: unknown): T {
  if (isPlainObject(defaults)) {
    if (!isPlainObject(saved)) return defaults;
    const out: Record<string, unknown> = { ...defaults };
    for (const key of Object.keys(defaults)) {
      if (key in saved) out[key] = mergeContent((defaults as Record<string, unknown>)[key], saved[key]);
    }
    return out as T;
  }
  if (Array.isArray(defaults)) return (Array.isArray(saved) ? saved : defaults) as T;
  return (typeof saved === typeof defaults ? saved : defaults) as T;
}

/** Разрешает только http(s), tel: и mailto: ссылки. */
export function safeUrl(url: string): string {
  return /^(https?:|tel:|mailto:)/i.test(url.trim()) ? url.trim() : '#';
}

export function phoneHref(contacts: SiteContacts): string {
  // Ссылка для звонка строится из отображаемого номера: "+996 (555) 12-34-56" -> "tel:+996555123456"
  const digits = contacts.phoneDisplay.replace(/\D/g, '');
  return `tel:${contacts.phoneDisplay.trim().startsWith('+') ? '+' : ''}${digits}`;
}

/** Ссылка на WhatsApp с готовым текстом сообщения. */
export function buildWhatsAppUrl(whatsappNumber: string, message: string): string {
  return `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}

export function whatsappUrl(contacts: SiteContacts): string {
  return buildWhatsAppUrl(contacts.whatsappNumber, contacts.whatsappGreeting);
}

/**
 * Проверка номера Кыргызстана: +996XXXXXXXXX (12 цифр), 0XXXXXXXXX (10 цифр)
 * или XXXXXXXXX (9 цифр без кода).
 */
export function isValidKyrgyzPhone(raw: string): boolean {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('996')) return digits.length === 12;
  if (digits.startsWith('0')) return digits.length === 10;
  return digits.length === 9;
}

export interface QuizCalculation {
  minPrice: number;
  maxPrice: number;
  discountedMin: number;
  discountedMax: number;
  estimatedTime: string;
}

export function calculateQuizEstimate(
  device: string,
  issue: string,
  location: string
): QuizCalculation {
  let minPrice = 500;
  let maxPrice = 1200;
  let estimatedTime = '1–2 часа';

  switch (issue) {
    case 'Не включается':
      minPrice = device === 'Моноблок' ? 1200 : 800;
      maxPrice = device === 'Стационарный ПК' ? 2500 : 3500;
      estimatedTime = '1–3 часа';
      break;
    case 'Тормозит и греется':
      minPrice = 800;
      maxPrice = 1600;
      estimatedTime = '60–90 минут';
      break;
    case 'Нужна установка Windows':
      minPrice = 700;
      maxPrice = 1100;
      estimatedTime = '60–90 минут';
      break;
    case 'Разбит экран':
      minPrice = device === 'Моноблок' ? 2000 : 1500;
      maxPrice = device === 'Моноблок' ? 3500 : 2500;
      estimatedTime = '1–2 часа (работа без учета матрицы)';
      break;
    default:
      minPrice = 500;
      maxPrice = 1500;
      estimatedTime = 'от 40 минут после осмотра';
      break;
  }

  if (device === 'Моноблок' && issue === 'Тормозит и греется') {
    minPrice += 300;
    maxPrice += 400;
  }

  // Формат (выезд / сервис) пока не влияет на цену: выезд бесплатный при ремонте.
  void location;

  const discountedMin = Math.round((minPrice * 0.9) / 50) * 50;
  const discountedMax = Math.round((maxPrice * 0.9) / 50) * 50;

  return {
    minPrice,
    maxPrice,
    discountedMin,
    discountedMax,
    estimatedTime,
  };
}
