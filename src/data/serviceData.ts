export type ServiceCategory = 'all' | 'diagnostics' | 'software' | 'hardware';

export interface ServiceItem {
  id: string;
  category: Exclude<ServiceCategory, 'all'>;
  categoryLabel: string;
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
  source: '2ГИС' | 'Google Карты';
  date: string;
  rating: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const SITE_CONTACTS = {
  brand: 'OshPC Service',
  cityLabel: 'г. Ош, выезд по всему городу',
  phoneDisplay: '+996 (555) 12-34-56',
  phoneHref: 'tel:+996555123456',
  whatsappNumber: '996555123456',
  whatsappUrl:
    'https://wa.me/996555123456?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5!%20%D0%9D%D1%83%D0%B6%D0%BD%D0%B0%20%D0%BA%D0%BE%D0%BD%D1%81%D1%83%D0%BB%D1%8C%D1%82%D0%B0%D1%86%D0%B8%D1%8F%20%D0%BF%D0%BE%20%D1%80%D0%B5%D0%BC%D0%BE%D0%BD%D1%82%D1%83%20%D0%B2%20%D0%9E%D1%88%D0%B5.',
  telegramUrl: 'https://t.me/oshpc_service',
  instagramUrl: 'https://instagram.com/oshpc.service',
  address: 'г. Ош, ул. Курманжан Датка, 248 (ориентир — напротив ТЦ «Келечек»)',
  schedule: 'Ежедневно с 09:00 до 20:00 без выходных',
  map2gisUrl: 'https://2gis.kg/osh',
  mapGoogleUrl: 'https://maps.google.com/?q=Osh+Kyrgyzstan',
};

export const SERVICE_CATEGORIES: { id: ServiceCategory; label: string }[] = [
  { id: 'all', label: 'Все услуги' },
  { id: 'diagnostics', label: 'Диагностика и профилактика' },
  { id: 'software', label: 'Настройка программ' },
  { id: 'hardware', label: 'Аппаратный ремонт' },
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'diag-full',
    category: 'diagnostics',
    categoryLabel: 'Диагностика и профилактика',
    title: 'Комплексная диагностика ПК или ноутбука',
    description:
      'Проверка накопителей, памяти, питания, температур и материнской платы с точным расчетом стоимости до начала ремонта.',
    price: '0 сом (при ремонте) / от 300 сом',
    duration: '20–40 мин',
  },
  {
    id: 'cleaning-mx4',
    category: 'diagnostics',
    categoryLabel: 'Диагностика и профилактика',
    title: 'Чистка от пыли и замена термопасты (Arctic MX-4)',
    description:
      'Полная разборка системы охлаждения, удаление пыли из радиаторов, смазка вентилятора и нанесение оригинальной пасты Arctic MX-4.',
    price: 'от 800 сом',
    duration: '60 мин',
  },
  {
    id: 'windows-setup',
    category: 'software',
    categoryLabel: 'Настройка программ',
    title: 'Установка и настройка Windows (10/11), драйверов и офисных программ',
    description:
      'Чистая установка системы с сохранением личных файлов, все актуальные драйверы, Microsoft Office, браузеры и кодеки.',
    price: 'от 700 сом',
    duration: '60–90 мин',
  },
  {
    id: 'virus-speedup',
    category: 'software',
    categoryLabel: 'Настройка программ',
    title: 'Удаление вирусов, баннеров и ускорение работы системы',
    description:
      'Очистка от рекламного ПО, майнеров и всплывающих окон, оптимизация автозагрузки и настройка надежной защиты.',
    price: 'от 500 сом',
    duration: '40–60 мин',
  },
  {
    id: 'kbd-battery-port',
    category: 'hardware',
    categoryLabel: 'Аппаратный ремонт',
    title: 'Замена клавиатуры, аккумулятора или разъема питания',
    description:
      'Аккуратная замена неисправного модуля на совместимую или оригинальную деталь с тестированием зарядки и клавиш.',
    price: 'от 1 000 сом',
    duration: '1–2 часа',
  },
  {
    id: 'screen-matrix',
    category: 'hardware',
    categoryLabel: 'Аппаратный ремонт',
    title: 'Замена матрицы (экрана) ноутбука',
    description:
      'Подбор дисплея IPS/TN с нужным разрешением и частотой, замена без засветов и следов вскрытия корпуса.',
    price: 'от 1 500 сом (без учета детали)',
    duration: '45–90 мин',
  },
  {
    id: 'upgrade-ssd-ram',
    category: 'hardware',
    categoryLabel: 'Аппаратный ремонт',
    title: 'Апгрейд (установка SSD, добавление оперативной памяти) и перенос данных',
    description:
      'Ускоряем старый ноутбук или ПК в 3–5 раз за счет NVMe/SATA SSD и расширения ОЗУ с полным переносом системы и документов.',
    price: 'от 600 сом',
    duration: '40–60 мин',
  },
  {
    id: 'pc-build',
    category: 'hardware',
    categoryLabel: 'Аппаратный ремонт',
    title: 'Сборка ПК под заказ (для игр, дизайна, офиса)',
    description:
      'Подбор комплектующих под ваш бюджет на рынке Оша и Бишкека, аккуратный кабель-менеджмент и стресс-тестирование.',
    price: 'от 1 500 сом',
    duration: '1 день',
  },
];

export const WORKFLOW_STEPS = [
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
];

export const ADVANTAGES = [
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
];

export const REVIEWS: ReviewItem[] = [
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
];

export const FAQ_ITEMS: FaqItem[] = [
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
];

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

  // Выезд бесплатный при ремонте, но отмечаем логистику
  if (location === 'Привезу в сервисный центр') {
    // Без доп. изменений к базовой оценке
  }

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
