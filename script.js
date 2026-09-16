// ==================== СЛОВАРЬ ПЕРЕВОДОВ ====================
const translations = {
  en: {
    "nav_home": "Dashboard",
    "nav_unis": "Universities & Chances",
    "nav_resources": "Resources & Lessons",
    "nav_checklist": "Checklist 2026",
    "nav_logout": "Switch Profile",
    "search_ph": "Search University...",
    "title_unis": "Universities & Chances Match",
    "title_resources": "Lessons & Free Resources",
    "title_checklist": "Preparation Plan (Checklist)",
    "bot_ph": "Ask about universities, essays or courses...",
    "bot_title": "UniBot Mentor AI",
    "bot_subtitle": "Admission Consultant",
    "filter_country": "All countries",
    "filter_city": "All cities",
    "filter_major": "All majors",
    "chip_tuition": "Tuition",
    "chip_gpa": "Min. GPA",
    "chip_ielts": "Min. IELTS",
    "chip_rate": "Acceptance rate",
    "majors_title": "Popular majors",
    "majors_disclaimer": "* Estimated distribution based on public admissions data",
    "top_major_badge": "Most popular",
    "your_major_badge": "Your major",
    "gpa_pending_label": "Don't have it yet",
    "ielts_pending_label": "Haven't taken it yet",
    "gpa_pending_note": "You can register without a GPA — we'll help you get ready and add it later",
    "ielts_pending_note": "You can register without IELTS — we'll show you where to prepare and add your score later",
    "major_other_ph": "Type your specialty",
    "pending_card_cta": "Add your score to see your real chance",
    "pending_banner": "Fill in your GPA and IELTS anytime in your profile — meanwhile, here are lessons and free resources to get ready",
    "reset_filters": "Reset filters"
  },
  ru: {
    "nav_home": "Главная",
    "nav_unis": "ВУЗы и Шансы",
    "nav_resources": "База и Уроки",
    "nav_checklist": "Чек-лист 2026",
    "nav_logout": "Сменить Профиль",
    "search_ph": "Поиск ВУЗа...",
    "title_unis": "Подборка ВУЗов и Расчет Шансов",
    "title_resources": "Уроки и Бесплатные Ресурсы",
    "title_checklist": "План подготовки (Checklist 2026)",
    "bot_ph": "Спроси о ВУЗах, эссе или курсах...",
    "bot_title": "UniBot Mentor AI",
    "bot_subtitle": "Консультант по поступившим",
    "filter_country": "Все страны",
    "filter_city": "Все города",
    "filter_major": "Все специальности",
    "chip_tuition": "Стоимость",
    "chip_gpa": "Мин. GPA",
    "chip_ielts": "Мин. IELTS",
    "chip_rate": "Конкурс на место",
    "majors_title": "Популярные специальности",
    "majors_disclaimer": "* Примерное распределение на основе открытых данных о поступлении",
    "top_major_badge": "Самая выбираемая",
    "your_major_badge": "Твоя специальность",
    "gpa_pending_label": "Пока нет GPA",
    "ielts_pending_label": "Ещё не сдавал(а)",
    "gpa_pending_note": "Можно зарегистрироваться без GPA — поможем подготовиться и добавишь балл позже",
    "ielts_pending_note": "Можно зарегистрироваться без IELTS — покажем, где готовиться, и добавишь балл позже",
    "major_other_ph": "Укажи свою специальность",
    "pending_card_cta": "Добавь баллы в профиле, чтобы увидеть точный шанс",
    "pending_banner": "Заполни GPA и IELTS в любой момент в профиле — а пока держи уроки и бесплатные ресурсы для подготовки",
    "reset_filters": "Сбросить фильтры"
  }
};

function t(key) {
  const lang = localStorage.getItem('unipath_lang') || 'ru';
  return (translations[lang] && translations[lang][key]) || translations.ru[key] || key;
}

function applyLanguage(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.innerText = translations[lang][key];
    }
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (translations[lang] && translations[lang][key]) {
      el.placeholder = translations[lang][key];
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  populateMajorSelect();
  initUniversityFilters();

  const savedUser = localStorage.getItem('unipath_user');
  if (savedUser) {
    user = JSON.parse(savedUser);
    if(!user.avatar) user.avatar = currentAvatar;
    
    document.getElementById('authScreen').classList.add('opacity-0', 'pointer-events-none');
    setTimeout(() => document.getElementById('authScreen').classList.add('hidden'), 300);
    document.getElementById('mainApp').classList.remove('hidden');
    updateUI();
  }

  // Инициализация переключателя языка (восстановление сохраненного выбора)
  const savedLang = localStorage.getItem('unipath_lang') || 'ru';
  const langLabel = document.getElementById('langToggleLabel');
  if (langLabel) langLabel.innerText = savedLang.toUpperCase();
  applyLanguage(savedLang);
});

function setMobileNavActive(el) {
  document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
    btn.classList.remove('active-nav');
  });
  el.classList.add('active-nav');
}

/* ==================== ПЕРЕКЛЮЧЕНИЕ ТЕМЫ (с анимацией) ==================== */
let themeAnimating = false;

function toggleTheme() {
  if (themeAnimating) return;
  themeAnimating = true;

  const root = document.documentElement;
  const isDark = root.classList.contains('dark-theme');

  let overlay = document.getElementById('themeOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'themeOverlay';
    document.body.appendChild(overlay);
  }

  overlay.style.backgroundColor = isDark ? '#f1f5f9' : '#0b1120';
  overlay.classList.remove('expand');
  void overlay.offsetWidth; // форсируем сброс анимации перед повторным запуском

  requestAnimationFrame(() => {
    overlay.classList.add('expand');
  });

  setTimeout(() => {
    root.classList.toggle('dark-theme');
    localStorage.setItem('unipath_theme', isDark ? 'light' : 'dark');
  }, 300);

  setTimeout(() => {
    overlay.classList.remove('expand');
  }, 650);

  setTimeout(() => {
    themeAnimating = false;
  }, 950);
}

/* ==================== ПЕРЕКЛЮЧЕНИЕ ЯЗЫКА ==================== */
function toggleLanguage() {
  const label = document.getElementById('langToggleLabel');
  const current = localStorage.getItem('unipath_lang') || 'ru';
  const next = current === 'ru' ? 'en' : 'ru';
  localStorage.setItem('unipath_lang', next);
  if (label) label.innerText = next.toUpperCase();
  applyLanguage(next);
}

// ==================== СПИСОК СПЕЦИАЛЬНОСТЕЙ (единый справочник) ====================
const MAJORS_LIST = [
  'Computer Science',
  'Data Science & AI',
  'Business & Economics',
  'Engineering',
  'Medicine',
  'Law',
  'Biology & Life Sciences',
  'Psychology',
  'Political Science / IR',
  'Design & Architecture',
  'Mathematics & Physics'
];

// ==================== БАЗА УНИВЕРСИТЕТОВ (страна / штат / город) ====================
const RAW_UNIVERSITIES = [
  { name: 'Harvard University', domain: 'harvard.edu', country: 'США', countryCode: 'us', state: 'Массачусетс', city: 'Кембридж',
    minGPA: 3.9, minIELTS: 7.5, rate: 4, tuition: '$55,000 / год (Need-Blind Aid)',
    photo: 'https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?auto=format&fit=crop&w=800&q=80',
    description: 'Старейший вуз США (основан в 1636 г.) и член знаменитой Лиги Плюща. Признан мировым лидером в области научных исследований, бизнеса, права и медицины.',
    facts: ['Крупнейшая в мире академическая библиотека (более 20 млн томов).', 'Среди выпускников 8 президентов США и 161 лауреат Нобелевской премии.', 'Эндаумент университета превышает $50 миллиардов, что позволяет покрывать 100% нужд студентов (Full-Ride).'],
    majors: [ {name:'Business & Economics', share:24, top:true, note:'Самая выбираемая программа, тесная связь с Уолл-стрит и консалтингом.'}, {name:'Computer Science', share:20, note:'Быстрорастущее направление, партнёрство с MIT.'}, {name:'Political Science / IR', share:12}, {name:'Biology & Life Sciences', share:10} ] },

  { name: 'MIT', domain: 'mit.edu', country: 'США', countryCode: 'us', state: 'Массачусетс', city: 'Кембридж',
    minGPA: 3.9, minIELTS: 7.5, rate: 4, tuition: '$60,000 / год',
    photo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    description: 'Мировой лидер в инженерии и точных науках. Учебный процесс построен вокруг практических проектов и исследовательских лабораторий с первого курса.',
    facts: ['Выпускники MIT основали компании с суммарной выручкой, сравнимой с ВВП крупной страны.', 'Действует уникальная система Pass/No Record на первом семестре для адаптации студентов.', 'Один из мировых лидеров по числу патентов среди университетов.'],
    majors: [ {name:'Computer Science', share:32, top:true, note:'Флагманская программа, тесно связана с исследованиями в области ИИ.'}, {name:'Engineering', share:28}, {name:'Mathematics & Physics', share:15}, {name:'Data Science & AI', share:12} ] },

  { name: 'Stanford University', domain: 'stanford.edu', country: 'США', countryCode: 'us', state: 'Калифорния', city: 'Стэнфорд',
    minGPA: 3.9, minIELTS: 7.5, rate: 4, tuition: '$55,000 / год (Need-Blind Aid)',
    photo: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
    description: 'Расположен в самом сердце Кремниевой долины. Известен своей предпринимательской культурой, передовыми IT-программами и тесными связями с технологическими гигантами.',
    facts: ['Выпускники Стэнфорда основали Google, Nike, Netflix, HP и Instagram.', 'Университетский кампус — один из самых больших в мире (более 33 кв. км).', 'Собирает более $1 млрд внешнего финансирования на исследования ежегодно.'],
    majors: [ {name:'Computer Science', share:30, top:true, note:'Главный драйвер репутации университета, эпицентр Кремниевой долины.'}, {name:'Engineering', share:22}, {name:'Data Science & AI', share:18}, {name:'Business & Economics', share:12} ] },

  { name: 'UC Berkeley', domain: 'berkeley.edu', country: 'США', countryCode: 'us', state: 'Калифорния', city: 'Беркли',
    minGPA: 3.8, minIELTS: 7.0, rate: 11, tuition: '≈ $45,000 / год (для иностранцев)',
    photo: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
    description: 'Флагман системы University of California. Один из сильнейших государственных университетов мира с мощной инженерной и IT-школой.',
    facts: ['Считается родиной множества открытий в физике, включая элементы таблицы Менделеева.', 'Сильнейшая в мире программа по Computer Science среди гос. вузов.', 'Активный студенческий и стартап-экосистема Bay Area.'],
    majors: [ {name:'Computer Science', share:26, top:true}, {name:'Engineering', share:20}, {name:'Business & Economics', share:16}, {name:'Data Science & AI', share:14} ] },

  { name: 'Caltech', domain: 'caltech.edu', country: 'США', countryCode: 'us', state: 'Калифорния', city: 'Пасадена',
    minGPA: 3.95, minIELTS: 7.5, rate: 3, tuition: '≈ $60,000 / год',
    photo: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=800&q=80',
    description: 'Самый маленький и самый селективный технический университет США. Обучается всего около 1000 бакалавров, что создаёт крайне тесное академическое сообщество.',
    facts: ['Управляет знаменитой лабораторией реактивного движения NASA (JPL).', 'Один из самых высоких показателей Нобелевских лауреатов на душу студентов.', 'Известен легендарными первоапрельскими розыгрышами студентов.'],
    majors: [ {name:'Engineering', share:30, top:true}, {name:'Mathematics & Physics', share:28}, {name:'Computer Science', share:24}, {name:'Data Science & AI', share:10} ] },

  { name: 'Yale University', domain: 'yale.edu', country: 'США', countryCode: 'us', state: 'Коннектикут', city: 'Нью-Хейвен',
    minGPA: 3.9, minIELTS: 7.5, rate: 5, tuition: '≈ $62,000 / год (Need-Blind Aid)',
    photo: 'https://images.unsplash.com/photo-1607237138185-eb5be6a49f6c?auto=format&fit=crop&w=800&q=80',
    description: 'Один из старейших университетов США, известен сильнейшей гуманитарной школой, театральной программой и системой резиденциальных колледжей.',
    facts: ['Основан в 1701 году, входит в тройку старейших вузов страны.', 'Обладает одной из крупнейших университетских художественных коллекций в мире.', 'Среди выпускников 5 президентов США.'],
    majors: [ {name:'Business & Economics', share:22, top:true}, {name:'Political Science / IR', share:16}, {name:'Biology & Life Sciences', share:14}, {name:'Law', share:10} ] },

  { name: 'Princeton University', domain: 'princeton.edu', country: 'США', countryCode: 'us', state: 'Нью-Джерси', city: 'Принстон',
    minGPA: 3.9, minIELTS: 7.5, rate: 4, tuition: '≈ $58,000 / год (Need-Blind Aid)',
    photo: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f5?auto=format&fit=crop&w=800&q=80',
    description: 'Один из вузов Лиги Плюща с сильнейшим упором на бакалавриат и обязательной дипломной работой (senior thesis) для каждого студента.',
    facts: ['Не имеет медицинской и бизнес-школы — весь фокус на бакалавриате.', 'Один из крупнейших эндаументов на одного студента в мире.', 'Кампус признан одним из самых красивых в США.'],
    majors: [ {name:'Business & Economics', share:20, top:true}, {name:'Computer Science', share:18}, {name:'Engineering', share:14}, {name:'Political Science / IR', share:12} ] },

  { name: 'Columbia University', domain: 'columbia.edu', country: 'США', countryCode: 'us', state: 'Нью-Йорк', city: 'Нью-Йорк',
    minGPA: 3.85, minIELTS: 7.5, rate: 4, tuition: '≈ $68,000 / год',
    photo: 'https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&w=800&q=80',
    description: 'Университет Лиги Плюща в самом центре Манхэттена, знаменит программой Core Curriculum и сильнейшей журналистской школой.',
    facts: ['Присуждает Пулитцеровскую премию — самую престижную журналистскую награду в мире.', 'Каждый студент проходит обязательный курс Core Curriculum по западной цивилизации.', 'Рядом расположены штаб-квартиры крупнейших банков и медиакорпораций.'],
    majors: [ {name:'Business & Economics', share:20, top:true}, {name:'Political Science / IR', share:16}, {name:'Computer Science', share:15}, {name:'Law', share:10} ] },

  { name: 'New York University (NYU)', domain: 'nyu.edu', country: 'США', countryCode: 'us', state: 'Нью-Йорк', city: 'Нью-Йорк',
    minGPA: 3.7, minIELTS: 7.5, rate: 12, tuition: '$58,000 / год',
    photo: 'https://images.unsplash.com/photo-1541336032412-2048a678540d?auto=format&fit=crop&w=800&q=80',
    description: 'Глобальный университет с главным кампусом в престижном районе Манхэттена (Гринвич-Виллидж). Делает упор на международное образование и практический опыт в мегаполисе.',
    facts: ['Кампус не имеет традиционных границ: здания университета интегрированы прямо в улицы Нью-Йорка.', 'Имеет полноценные, выдающие дипломы кампусы в Абу-Даби и Шанхае.', 'Среди выпускников больше всего обладателей премии Оскар, чем у любого другого университета в мире.'],
    majors: [ {name:'Business & Economics', share:22, top:true}, {name:'Design & Architecture', share:14}, {name:'Computer Science', share:14}, {name:'Political Science / IR', share:10} ] },

  { name: 'University of Chicago', domain: 'uchicago.edu', country: 'США', countryCode: 'us', state: 'Иллинойс', city: 'Чикаго',
    minGPA: 3.85, minIELTS: 7.5, rate: 5, tuition: '≈ $65,000 / год',
    photo: 'https://images.unsplash.com/photo-1494783367193-149034c05e8f?auto=format&fit=crop&w=800&q=80',
    description: 'Известен строгим академическим духом, сильнейшей экономической школой (родина Chicago School of Economics) и обязательным широким гуманитарным ядром.',
    facts: ['Выпускники и преподаватели получили более 90 Нобелевских премий.', 'Известен девизом "Пусть растёт знание, и пусть жизнь обогащается им".', 'Считается одним из интеллектуально самых требовательных вузов США.'],
    majors: [ {name:'Business & Economics', share:24, top:true}, {name:'Mathematics & Physics', share:16}, {name:'Political Science / IR', share:14}, {name:'Computer Science', share:12} ] },

  { name: 'University of Oxford', domain: 'ox.ac.uk', country: 'Великобритания', countryCode: 'gb', state: null, city: 'Оксфорд',
    minGPA: 3.8, minIELTS: 7.5, rate: 12, tuition: '£38,000 / год',
    photo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
    description: 'Старейший англоязычный университет в мире. Уникален своей системой независимых колледжей и индивидуальными занятиями (тьюториалами), где преподаватель работает с 1-2 студентами.',
    facts: ['Обучение здесь ведется с 1096 года.', 'Оксфорд выпустил 30 премьер-министров Великобритании.', 'Слово "Оксфорд" во всем мире ассоциируется с самым авторитетным словарем английского языка (OED).'],
    majors: [ {name:'Political Science / IR', share:18, top:true}, {name:'Business & Economics', share:16}, {name:'Law', share:14}, {name:'Medicine', share:12} ] },

  { name: 'University of Cambridge', domain: 'cam.ac.uk', country: 'Великобритания', countryCode: 'gb', state: null, city: 'Кембридж',
    minGPA: 3.85, minIELTS: 7.5, rate: 13, tuition: '£35,000 / год',
    photo: 'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?auto=format&fit=crop&w=800&q=80',
    description: 'Вечный соперник Оксфорда, лидирует в точных науках, математике и инженерии. Также построен вокруг системы независимых колледжей.',
    facts: ['Связан с 120 Нобелевскими лауреатами — больше, чем у любого другого университета.', 'Здесь Уотсон и Крик открыли структуру ДНК.', 'Ежегодная регата с Оксфордом (The Boat Race) — одно из старейших спортивных событий мира.'],
    majors: [ {name:'Mathematics & Physics', share:20, top:true}, {name:'Engineering', share:16}, {name:'Computer Science', share:14}, {name:'Medicine', share:12} ] },

  { name: 'Imperial College London', domain: 'imperial.ac.uk', country: 'Великобритания', countryCode: 'gb', state: null, city: 'Лондон',
    minGPA: 3.75, minIELTS: 7.0, rate: 11, tuition: '£38,000 / год',
    photo: 'https://images.unsplash.com/photo-1543832923-44667a44c804?auto=format&fit=crop&w=800&q=80',
    description: 'Технический вуз мирового уровня, специализирующийся исключительно на науке, инженерии, медицине и бизнесе — без гуманитарных факультетов.',
    facts: ['Здесь Александр Флеминг открыл пенициллин.', 'Один из немногих британских вузов, полностью сфокусированных на STEM.', 'Тесно сотрудничает с лондонским Сити и инвестбанками.'],
    majors: [ {name:'Engineering', share:26, top:true}, {name:'Computer Science', share:22}, {name:'Medicine', share:18}, {name:'Mathematics & Physics', share:14} ] },

  { name: 'London School of Economics (LSE)', domain: 'lse.ac.uk', country: 'Великобритания', countryCode: 'gb', state: null, city: 'Лондон',
    minGPA: 3.75, minIELTS: 7.0, rate: 8, tuition: '£25,000 / год',
    photo: 'https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&w=800&q=80',
    description: 'Один из ведущих в мире вузов по экономике, политологии и социальным наукам, расположен в самом центре Лондона.',
    facts: ['Среди выпускников 18 глав государств и 20 лауреатов Нобелевской премии по экономике.', 'Девиз университета: "Постигать причины вещей".', 'Не имеет собственного кампуса — университет буквально "растворён" в центре Лондона.'],
    majors: [ {name:'Business & Economics', share:30, top:true}, {name:'Political Science / IR', share:22}, {name:'Law', share:14}, {name:'Data Science & AI', share:10} ] },

  { name: 'University of Toronto', domain: 'utoronto.ca', country: 'Канада', countryCode: 'ca', state: 'Онтарио', city: 'Торонто',
    minGPA: 3.6, minIELTS: 7.0, rate: 40, tuition: 'CAD $45,000 / год',
    photo: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80',
    description: 'Крупнейший и самый престижный исследовательский университет Канады. Мировой центр в области медицины, инженерии и развития искусственного интеллекта.',
    facts: ['Именно в стенах этого университета в 1921 году был открыт инсулин.', 'Считается родиной глубокого обучения (Deep Learning) благодаря работе Джеффри Хинтона.', 'Ежегодно получает самое большое финансирование среди канадских вузов.'],
    majors: [ {name:'Computer Science', share:20, top:true}, {name:'Business & Economics', share:16}, {name:'Engineering', share:14}, {name:'Biology & Life Sciences', share:12} ] },

  { name: 'McGill University', domain: 'mcgill.ca', country: 'Канада', countryCode: 'ca', state: 'Квебек', city: 'Монреаль',
    minGPA: 3.5, minIELTS: 6.5, rate: 46, tuition: 'CAD $35,000 / год',
    photo: 'https://images.unsplash.com/photo-1519832979-6fa011b87667?auto=format&fit=crop&w=800&q=80',
    description: 'Один из самых престижных университетов Канады, часто называемый "Гарвардом Севера". Расположен в двуязычном Монреале.',
    facts: ['Обучение ведется на английском языке даже во франкоязычной провинции Квебек.', 'Кампус находится у подножия горы Мон-Руаяль в центре города.', 'Среди выпускников — нобелевские лауреаты и главы правительств.'],
    majors: [ {name:'Business & Economics', share:18, top:true}, {name:'Biology & Life Sciences', share:16}, {name:'Political Science / IR', share:12}, {name:'Engineering', share:10} ] },

  { name: 'University of British Columbia (UBC)', domain: 'ubc.ca', country: 'Канада', countryCode: 'ca', state: 'Британская Колумбия', city: 'Ванкувер',
    minGPA: 3.5, minIELTS: 6.5, rate: 52, tuition: 'CAD $40,000 / год',
    photo: 'https://images.unsplash.com/photo-1590595406042-6f8dc2b3f1e6?auto=format&fit=crop&w=800&q=80',
    description: 'Один из крупнейших исследовательских университетов Канады с потрясающим кампусом на побережье Тихого океана.',
    facts: ['Кампус расположен на полуострове с видом на океан и горы.', 'Сильная программа по лесным и природным наукам благодаря уникальному расположению.', 'Один из самых мультикультурных студенческих городков Северной Америки.'],
    majors: [ {name:'Business & Economics', share:18, top:true}, {name:'Computer Science', share:16}, {name:'Biology & Life Sciences', share:14}, {name:'Engineering', share:12} ] },

  { name: 'ETH Zurich', domain: 'ethz.ch', country: 'Швейцария', countryCode: 'ch', state: null, city: 'Цюрих',
    minGPA: 3.7, minIELTS: 7.0, rate: 27, tuition: '≈ CHF 1,500 / год',
    photo: 'https://images.unsplash.com/photo-1592407637319-93aca5a49cc7?auto=format&fit=crop&w=800&q=80',
    description: 'Один из сильнейших технических университетов мира с одной из самых низких стоимостей обучения среди топ-вузов планеты.',
    facts: ['Здесь учился и работал Альберт Эйнштейн.', 'Стоимость обучения — одна из самых низких в мире для вуза такого уровня.', 'Постоянно входит в топ-10 мировых рейтингов по инженерии и IT.'],
    majors: [ {name:'Engineering', share:28, top:true}, {name:'Computer Science', share:24}, {name:'Mathematics & Physics', share:18}, {name:'Data Science & AI', share:14} ] },

  { name: 'Technical University of Munich', domain: 'tum.de', country: 'Германия', countryCode: 'de', state: 'Бавария', city: 'Мюнхен',
    minGPA: 3.5, minIELTS: 6.5, rate: 8, tuition: '≈ €150 / семестр (почти бесплатно)',
    photo: 'https://images.unsplash.com/photo-1595867818082-083862f3d630?auto=format&fit=crop&w=800&q=80',
    description: 'Ведущий технический университет Германии. Государственные вузы страны почти не берут плату за обучение даже с иностранных студентов.',
    facts: ['Обучение фактически бесплатное — платится только небольшой семестровый взнос.', 'Тесно сотрудничает с BMW, Siemens и другими промышленными гигантами.', 'Один из первых европейских вузов, получивших статус "Университета передового опыта".'],
    majors: [ {name:'Engineering', share:30, top:true}, {name:'Computer Science', share:22}, {name:'Mathematics & Physics', share:16}, {name:'Data Science & AI', share:12} ] },

  { name: 'University of Melbourne', domain: 'unimelb.edu.au', country: 'Австралия', countryCode: 'au', state: 'Виктория', city: 'Мельбурн',
    minGPA: 3.5, minIELTS: 6.5, rate: 30, tuition: '≈ AUD $45,000 / год',
    photo: 'https://images.unsplash.com/photo-1514395462725-fb4566210144?auto=format&fit=crop&w=800&q=80',
    description: 'Один из ведущих университетов Южного полушария, известен гибкой Melbourne Model — модульной системой бакалавриата.',
    facts: ['Постоянно занимает 1 место в Австралии по академической репутации.', 'Кампус находится в одном из самых "пригодных для жизни" городов мира.', 'Сильная программа двойных дипломов с университетами Азии.'],
    majors: [ {name:'Business & Economics', share:18, top:true}, {name:'Medicine', share:14}, {name:'Biology & Life Sciences', share:12}, {name:'Law', share:10} ] },

  { name: 'National University of Singapore (NUS)', domain: 'nus.edu.sg', country: 'Сингапур', countryCode: 'sg', state: null, city: 'Сингапур',
    minGPA: 3.7, minIELTS: 7.0, rate: 8, tuition: '≈ SGD $30,000 / год',
    photo: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
    description: 'Лучший университет Азии по большинству мировых рейтингов, с сильнейшими программами по бизнесу, инженерии и IT.',
    facts: ['Постоянно входит в топ-15 мировых рейтингов университетов.', 'Тесно связан со стартап-экосистемой Юго-Восточной Азии.', 'Предлагает уникальные программы двойных дипломов с Yale и другими вузами.'],
    majors: [ {name:'Business & Economics', share:20, top:true}, {name:'Computer Science', share:18}, {name:'Engineering', share:16}, {name:'Data Science & AI', share:14} ] },

  { name: 'Nazarbayev University', domain: 'nu.edu.kz', country: 'Казахстан', countryCode: 'kz', state: null, city: 'Астана',
    minGPA: 3.3, minIELTS: 6.0, rate: 12, tuition: '≈ $14,000 / год (много грантов от государства)',
    photo: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80',
    description: 'Ведущий исследовательский университет Центральной Азии с преподаванием на английском языке и партнёрствами с топовыми западными вузами.',
    facts: ['Большинство студентов учатся по государственным грантам, покрывающим полную стоимость.', 'Учебные программы разработаны совместно с University of Cambridge, Duke и другими партнёрами.', 'Отличный "мост" для абитуриентов из СНГ перед поступлением в топ-вузы США/Европы.'],
    majors: [ {name:'Business & Economics', share:16, top:true}, {name:'Computer Science', share:14}, {name:'Engineering', share:14}, {name:'Political Science / IR', share:12} ] },

  { name: 'Tsinghua University', domain: 'tsinghua.edu.cn', country: 'Китай', countryCode: 'cn', state: null, city: 'Пекин',
    minGPA: 3.8, minIELTS: 6.5, rate: 2, tuition: '≈ ¥30,000 / год (для иностранцев)',
    photo: null,
    description: 'Один из самых престижных технических университетов мира, часто называют "китайским MIT". Лидер по числу патентов и инженерных исследований в Азии.',
    facts: ['Крайне низкий процент поступления даже среди местных абитуриентов.', 'Сильнейшая инженерная и IT-школа континентального Китая.', 'Активно развивает программы на английском языке для иностранных студентов.'],
    majors: [ {name:'Engineering', share:26, top:true}, {name:'Computer Science', share:24}, {name:'Data Science & AI', share:16}, {name:'Business & Economics', share:12} ] },

  { name: 'Peking University', domain: 'pku.edu.cn', country: 'Китай', countryCode: 'cn', state: null, city: 'Пекин',
    minGPA: 3.8, minIELTS: 6.5, rate: 3, tuition: '≈ ¥33,000 / год (для иностранцев)',
    photo: null,
    description: 'Старейший и один из самых престижных университетов Китая, известен сильными гуманитарными и естественнонаучными школами.',
    facts: ['Основан в 1898 году, считается символом современного китайского образования.', 'Сильная программа двойных дипломов с ведущими вузами Европы и США.', 'Один из лидеров по числу публикаций в топовых научных журналах в Азии.'],
    majors: [ {name:'Business & Economics', share:20, top:true}, {name:'Political Science / IR', share:16}, {name:'Computer Science', share:14}, {name:'Biology & Life Sciences', share:12} ] },

  { name: 'University of Tokyo', domain: 'u-tokyo.ac.jp', country: 'Япония', countryCode: 'jp', state: null, city: 'Токио',
    minGPA: 3.7, minIELTS: 6.5, rate: 24, tuition: '≈ ¥535,800 / год',
    photo: null,
    description: 'Самый престижный университет Японии, лидер страны по числу нобелевских лауреатов и научных публикаций.',
    facts: ['Считается лучшим университетом Японии практически по всем мировым рейтингам.', 'Сильная традиция в инженерии, физике и медицине.', 'Государственные японские университеты предлагают одну из самых доступных стоимостей обучения среди топ-вузов мира.'],
    majors: [ {name:'Engineering', share:22, top:true}, {name:'Mathematics & Physics', share:18}, {name:'Medicine', share:14}, {name:'Computer Science', share:12} ] },

  { name: 'Kyoto University', domain: 'kyoto-u.ac.jp', country: 'Япония', countryCode: 'jp', state: null, city: 'Киото',
    minGPA: 3.6, minIELTS: 6.5, rate: 25, tuition: '≈ ¥535,800 / год',
    photo: null,
    description: 'Второй по престижности университет Японии, известен свободой в организации учебного процесса и сильной исследовательской культурой.',
    facts: ['Больше нобелевских лауреатов, чем у любого другого университета Японии, кроме Токийского.', 'Известен неформальным, "вольным" студенческим духом кампуса.', 'Сильная научная школа в химии и фундаментальной физике.'],
    majors: [ {name:'Mathematics & Physics', share:20, top:true}, {name:'Biology & Life Sciences', share:16}, {name:'Engineering', share:14}, {name:'Medicine', share:12} ] },

  { name: 'Seoul National University', domain: 'snu.ac.kr', country: 'Южная Корея', countryCode: 'kr', state: null, city: 'Сеул',
    minGPA: 3.7, minIELTS: 6.5, rate: 15, tuition: '≈ ₩4,000,000 / семестр',
    photo: null,
    description: 'Самый престижный университет Южной Кореи, лидер практически во всех академических рейтингах страны.',
    facts: ['Считается корейским аналогом Лиги Плюща по престижу диплома.', 'Сильная государственная поддержка исследований в инженерии и биотехнологиях.', 'Выпускники доминируют в топ-менеджменте крупнейших корейских корпораций.'],
    majors: [ {name:'Engineering', share:22, top:true}, {name:'Business & Economics', share:18}, {name:'Computer Science', share:14}, {name:'Medicine', share:12} ] },

  { name: 'KAIST', domain: 'kaist.ac.kr', country: 'Южная Корея', countryCode: 'kr', state: null, city: 'Тэджон',
    minGPA: 3.8, minIELTS: 6.5, rate: 12, tuition: '≈ $3,000 / год (большинство студентов на стипендиях)',
    photo: null,
    description: 'Ведущий технический университет Кореи, полностью сфокусирован на инженерии, IT и естественных науках.',
    facts: ['Все занятия ведутся на английском языке.', 'Тесно сотрудничает с Samsung, LG и другими технологическими гигантами.', 'Большинство студентов обучается по государственным стипендиям.'],
    majors: [ {name:'Computer Science', share:28, top:true}, {name:'Engineering', share:26}, {name:'Data Science & AI', share:16}, {name:'Mathematics & Physics', share:10} ] },

  { name: 'Nanyang Technological University (NTU)', domain: 'ntu.edu.sg', country: 'Сингапур', countryCode: 'sg', state: null, city: 'Сингапур',
    minGPA: 3.7, minIELTS: 7.0, rate: 9, tuition: '≈ SGD $30,000 / год',
    photo: null,
    description: 'Один из самых быстрорастущих технических университетов мира, соперничает с NUS за звание лучшего вуза Сингапура.',
    facts: ['Один из самых молодых университетов в мировом топ-20 рейтингов.', 'Сильнейшая инженерная школа Юго-Восточной Азии.', 'Кампус считается одним из самых современных и "зелёных" в мире.'],
    majors: [ {name:'Engineering', share:24, top:true}, {name:'Computer Science', share:20}, {name:'Business & Economics', share:14}, {name:'Data Science & AI', share:12} ] },

  { name: 'University of Hong Kong (HKU)', domain: 'hku.hk', country: 'Гонконг', countryCode: 'hk', state: null, city: 'Гонконг',
    minGPA: 3.7, minIELTS: 7.0, rate: 10, tuition: '≈ HKD $215,000 / год',
    photo: null,
    description: 'Старейший и один из самых престижных университетов Гонконга, известен сильной юридической и медицинской школами.',
    facts: ['Обучение в основном на английском языке.', 'Один из главных финансовых и образовательных хабов Азии.', 'Сильные связи с международным банковским и юридическим сектором.'],
    majors: [ {name:'Business & Economics', share:22, top:true}, {name:'Law', share:16}, {name:'Medicine', share:14}, {name:'Computer Science', share:12} ] },

  { name: 'Hong Kong University of Science and Technology (HKUST)', domain: 'ust.hk', country: 'Гонконг', countryCode: 'hk', state: null, city: 'Гонконг',
    minGPA: 3.7, minIELTS: 7.0, rate: 11, tuition: '≈ HKD $170,000 / год',
    photo: null,
    description: 'Молодой, но крайне быстро выросший в престиже технический университет, специализируется на инженерии и бизнесе.',
    facts: ['Один из самых молодых университетов в мировом топ-50.', 'Сильная программа двойных дипломов по бизнесу с топ-школами США.', 'Активная стартап-экосистема кампуса.'],
    majors: [ {name:'Engineering', share:24, top:true}, {name:'Business & Economics', share:20}, {name:'Computer Science', share:18}, {name:'Data Science & AI', share:12} ] },

  { name: 'Indian Institute of Technology Bombay (IIT Bombay)', domain: 'iitb.ac.in', country: 'Индия', countryCode: 'in', state: 'Махараштра', city: 'Мумбаи',
    minGPA: 3.6, minIELTS: 6.5, rate: 1, tuition: '≈ ₹200,000 / год',
    photo: null,
    description: 'Один из самых престижных технических университетов Индии, попасть можно только через крайне сложный экзамен JEE Advanced.',
    facts: ['Один из самых низких процентов поступления среди технических вузов мира.', 'Выпускники занимают руководящие позиции в Google, Microsoft и крупнейших индийских корпорациях.', 'Обучение ведётся полностью на английском языке.'],
    majors: [ {name:'Engineering', share:30, top:true}, {name:'Computer Science', share:26}, {name:'Data Science & AI', share:14}, {name:'Mathematics & Physics', share:10} ] },

  { name: 'Indian Institute of Technology Delhi (IIT Delhi)', domain: 'iitd.ac.in', country: 'Индия', countryCode: 'in', state: 'Дели', city: 'Нью-Дели',
    minGPA: 3.6, minIELTS: 6.5, rate: 1, tuition: '≈ ₹200,000 / год',
    photo: null,
    description: 'Один из ведущих технических университетов Индии, входит в число самых селективных вузов мира по проценту поступления.',
    facts: ['Приём производится централизованно через экзамен JEE Advanced.', 'Сильная инженерная и предпринимательская экосистема.', 'Один из лидеров технологических стартапов Индии среди выпускников.'],
    majors: [ {name:'Engineering', share:28, top:true}, {name:'Computer Science', share:26}, {name:'Data Science & AI', share:16}, {name:'Mathematics & Physics', share:10} ] },

  { name: 'Sciences Po', domain: 'sciencespo.fr', country: 'Франция', countryCode: 'fr', state: null, city: 'Париж',
    minGPA: 3.5, minIELTS: 7.0, rate: 17, tuition: '≈ €14,000 / год (зависит от дохода семьи)',
    photo: null,
    description: 'Ведущая французская школа социальных и политических наук, кузница дипломатов, политиков и журналистов.',
    facts: ['Среди выпускников — множество президентов Франции и глав международных организаций.', 'Стоимость обучения зависит от дохода семьи студента.', 'Сильнейшая программа по международным отношениям в континентальной Европе.'],
    majors: [ {name:'Political Science / IR', share:32, top:true}, {name:'Law', share:16}, {name:'Business & Economics', share:14}, {name:'Design & Architecture', share:8} ] },

  { name: 'Sorbonne University', domain: 'sorbonne-universite.fr', country: 'Франция', countryCode: 'fr', state: null, city: 'Париж',
    minGPA: 3.4, minIELTS: 6.5, rate: 40, tuition: '≈ €3,770 / год (гос. тариф)',
    photo: null,
    description: 'Один из старейших университетов мира, наследник средневекового парижского университета, силён в гуманитарных и естественных науках.',
    facts: ['Исторические корни восходят к XIII веку.', 'Государственные французские вузы — один из самых доступных вариантов обучения в Европе.', 'Расположен в самом центре Латинского квартала Парижа.'],
    majors: [ {name:'Biology & Life Sciences', share:18, top:true}, {name:'Mathematics & Physics', share:16}, {name:'Political Science / IR', share:12}, {name:'Medicine', share:10} ] },

  { name: 'Bocconi University', domain: 'unibocconi.it', country: 'Италия', countryCode: 'it', state: null, city: 'Милан',
    minGPA: 3.6, minIELTS: 7.0, rate: 18, tuition: '≈ €14,000 / год (зависит от дохода семьи)',
    photo: null,
    description: 'Ведущая бизнес-школа Италии и одна из сильнейших в Европе, известна тесными связями с международным финансовым сектором.',
    facts: ['Считается итальянским эквивалентом London Business School.', 'Стоимость обучения гибко зависит от финансового положения семьи.', 'Сильные карьерные связи с инвестбанками Лондона и Милана.'],
    majors: [ {name:'Business & Economics', share:34, top:true}, {name:'Data Science & AI', share:14}, {name:'Political Science / IR', share:12}, {name:'Law', share:8} ] },

  { name: 'Politecnico di Milano', domain: 'polimi.it', country: 'Италия', countryCode: 'it', state: null, city: 'Милан',
    minGPA: 3.4, minIELTS: 6.0, rate: 35, tuition: '≈ €3,900 / год (зависит от дохода семьи)',
    photo: null,
    description: 'Ведущий технический университет Италии, особенно силён в архитектуре, дизайне и инженерии.',
    facts: ['Одна из сильнейших в мире школ промышленного дизайна.', 'Стоимость обучения одна из самых доступных среди топовых технических вузов Европы.', 'Тесно связан с итальянской автомобильной и дизайнерской индустрией.'],
    majors: [ {name:'Engineering', share:26, top:true}, {name:'Design & Architecture', share:22}, {name:'Computer Science', share:14}, {name:'Mathematics & Physics', share:10} ] },

  { name: 'Delft University of Technology (TU Delft)', domain: 'tudelft.nl', country: 'Нидерланды', countryCode: 'nl', state: null, city: 'Делфт',
    minGPA: 3.5, minIELTS: 6.5, rate: 35, tuition: '≈ €18,000 / год (для не-ЕС)',
    photo: null,
    description: 'Крупнейший и самый престижный технический университет Нидерландов, известен сильной программой по инженерии и архитектуре.',
    facts: ['Родина многих инноваций в области водного строительства и гидротехники.', 'Тесно сотрудничает с крупнейшими европейскими инженерными компаниями.', 'Один из лидеров в исследованиях устойчивой энергетики в Европе.'],
    majors: [ {name:'Engineering', share:30, top:true}, {name:'Computer Science', share:18}, {name:'Design & Architecture', share:16}, {name:'Mathematics & Physics', share:10} ] },

  { name: 'University of Amsterdam', domain: 'uva.nl', country: 'Нидерланды', countryCode: 'nl', state: null, city: 'Амстердам',
    minGPA: 3.4, minIELTS: 6.5, rate: 40, tuition: '≈ €15,000 / год (для не-ЕС)',
    photo: null,
    description: 'Один из крупнейших исследовательских университетов Европы, силён в социальных науках, экономике и медиа.',
    facts: ['Один из самых интернациональных студенческих городов Европы.', 'Много программ преподаётся полностью на английском языке.', 'Расположен в самом центре одного из самых популярных городов Европы у студентов.'],
    majors: [ {name:'Business & Economics', share:20, top:true}, {name:'Political Science / IR', share:16}, {name:'Psychology', share:14}, {name:'Data Science & AI', share:10} ] },

  { name: 'KTH Royal Institute of Technology', domain: 'kth.se', country: 'Швеция', countryCode: 'se', state: null, city: 'Стокгольм',
    minGPA: 3.5, minIELTS: 6.5, rate: 20, tuition: '≈ SEK 180,000 / год (для не-ЕС)',
    photo: null,
    description: 'Крупнейший технический университет Швеции, известен сильными программами в IT, инженерии и устойчивом развитии.',
    facts: ['Один из ведущих технических вузов Северной Европы.', 'Тесно связан с технологической экосистемой Стокгольма (родина Spotify, Klarna).', 'Активная программа обменов с ведущими техническими вузами мира.'],
    majors: [ {name:'Engineering', share:26, top:true}, {name:'Computer Science', share:22}, {name:'Data Science & AI', share:14}, {name:'Mathematics & Physics', share:10} ] },

  { name: 'Lund University', domain: 'lu.se', country: 'Швеция', countryCode: 'se', state: null, city: 'Лунд',
    minGPA: 3.4, minIELTS: 6.5, rate: 25, tuition: '≈ SEK 150,000 / год (для не-ЕС)',
    photo: null,
    description: 'Один из старейших и самых престижных университетов Скандинавии, силён в широком спектре дисциплин от права до инженерии.',
    facts: ['Основан в 1666 году.', 'Один из самых популярных университетов Швеции среди иностранных студентов.', 'Уютный студенческий город с богатой академической традицией.'],
    majors: [ {name:'Business & Economics', share:16, top:true}, {name:'Engineering', share:16}, {name:'Law', share:12}, {name:'Political Science / IR', share:10} ] },

  { name: 'University of Copenhagen', domain: 'ku.dk', country: 'Дания', countryCode: 'dk', state: null, city: 'Копенгаген',
    minGPA: 3.4, minIELTS: 6.5, rate: 30, tuition: '≈ DKK 200,000 / год (для не-ЕС)',
    photo: null,
    description: 'Крупнейший университет Дании, силён в медицине, естественных науках и социальных исследованиях.',
    facts: ['Один из старейших университетов Северной Европы, основан в 1479 году.', 'Сильная научная традиция в физике и биомедицине.', 'Копенгаген регулярно входит в топ самых комфортных для жизни городов мира.'],
    majors: [ {name:'Medicine', share:18, top:true}, {name:'Biology & Life Sciences', share:16}, {name:'Political Science / IR', share:12}, {name:'Law', share:10} ] },

  { name: 'Trinity College Dublin', domain: 'tcd.ie', country: 'Ирландия', countryCode: 'ie', state: null, city: 'Дублин',
    minGPA: 3.5, minIELTS: 6.5, rate: 28, tuition: '≈ €25,000 / год',
    photo: null,
    description: 'Старейший университет Ирландии, известен своей исторической библиотекой и сильной гуманитарной школой.',
    facts: ['Основан в 1592 году королевой Елизаветой I.', 'Хранит знаменитую средневековую рукопись Book of Kells.', 'Ирландия — популярное направление благодаря англоязычному обучению и близости к ЕС.'],
    majors: [ {name:'Business & Economics', share:16, top:true}, {name:'Computer Science', share:14}, {name:'Law', share:12}, {name:'Medicine', share:10} ] },

  { name: 'University College Dublin (UCD)', domain: 'ucd.ie', country: 'Ирландия', countryCode: 'ie', state: null, city: 'Дублин',
    minGPA: 3.4, minIELTS: 6.5, rate: 32, tuition: '≈ €24,000 / год',
    photo: null,
    description: 'Крупнейший университет Ирландии, известен сильной бизнес-школой и тесными связями с технологическими компаниями Дублина.',
    facts: ['Дублин — европейский офисный хаб Google, Facebook и других техгигантов.', 'Одна из крупнейших ирландских бизнес-школ (Smurfit).', 'Активная программа стажировок с международными компаниями.'],
    majors: [ {name:'Business & Economics', share:18, top:true}, {name:'Computer Science', share:16}, {name:'Engineering', share:12}, {name:'Law', share:10} ] },

  { name: 'University of Edinburgh', domain: 'ed.ac.uk', country: 'Великобритания', countryCode: 'gb', state: null, city: 'Эдинбург',
    minGPA: 3.6, minIELTS: 6.5, rate: 40, tuition: '≈ £26,000 / год',
    photo: null,
    description: 'Один из старейших и самых престижных университетов Шотландии, силён в медицине, науках о данных и гуманитарных дисциплинах.',
    facts: ['Основан в 1583 году, один из старейших вузов англоязычного мира.', 'Здесь учился и работал Чарльз Дарвин.', 'Один из самых атмосферных студенческих городов Европы.'],
    majors: [ {name:'Medicine', share:16, top:true}, {name:'Data Science & AI', share:14}, {name:'Business & Economics', share:12}, {name:'Psychology', share:10} ] },

  { name: "King's College London", domain: 'kcl.ac.uk', country: 'Великобритания', countryCode: 'gb', state: null, city: 'Лондон',
    minGPA: 3.5, minIELTS: 7.0, rate: 13, tuition: '≈ £28,000 / год',
    photo: null,
    description: 'Один из основателей Лондонского университета, известен сильной медицинской и юридической школами в самом центре Лондона.',
    facts: ['Одна из старейших медицинских школ Великобритании.', 'Расположен в самом центре Лондона, рядом с парламентом и Темзой.', 'Сильные связи с NHS (Национальной службой здравоохранения Великобритании).'],
    majors: [ {name:'Medicine', share:18, top:true}, {name:'Law', share:14}, {name:'Political Science / IR', share:12}, {name:'Business & Economics', share:10} ] },

  { name: 'University of Manchester', domain: 'manchester.ac.uk', country: 'Великобритания', countryCode: 'gb', state: null, city: 'Манчестер',
    minGPA: 3.4, minIELTS: 6.5, rate: 56, tuition: '≈ £26,000 / год',
    photo: null,
    description: 'Один из крупнейших исследовательских университетов Великобритании, известен сильной инженерной и научной школой.',
    facts: ['Здесь был расщеплён атом Эрнестом Резерфордом.', 'Один из крупнейших студенческих городов Великобритании.', 'Сильная программа по материаловедению — родина графена.'],
    majors: [ {name:'Engineering', share:18, top:true}, {name:'Business & Economics', share:16}, {name:'Computer Science', share:12}, {name:'Biology & Life Sciences', share:10} ] },

  { name: 'University of Cape Town', domain: 'uct.ac.za', country: 'ЮАР', countryCode: 'za', state: null, city: 'Кейптаун',
    minGPA: 3.2, minIELTS: 6.5, rate: 20, tuition: '≈ $8,000 / год (для иностранцев)',
    photo: null,
    description: 'Самый престижный университет Африки, лидер континента по большинству мировых рейтингов.',
    facts: ['Постоянно занимает первое место среди африканских университетов в мировых рейтингах.', 'Расположен у подножия горы Столовая гора — один из самых живописных кампусов мира.', 'Сильная программа по медицине и наукам об окружающей среде.'],
    majors: [ {name:'Business & Economics', share:16, top:true}, {name:'Medicine', share:14}, {name:'Law', share:12}, {name:'Engineering', share:10} ] },

  { name: 'University of São Paulo (USP)', domain: 'usp.br', country: 'Бразилия', countryCode: 'br', state: 'Сан-Паулу', city: 'Сан-Паулу',
    minGPA: 3.3, minIELTS: 6.0, rate: 10, tuition: 'Бесплатно для местных студентов, спецпрограммы для иностранцев',
    photo: null,
    description: 'Крупнейший и самый престижный университет Латинской Америки, силён практически во всех областях науки.',
    facts: ['Постоянно занимает 1 место среди университетов Латинской Америки.', 'Государственное образование в Бразилии бесплатно даже на топовом уровне.', 'Один из крупнейших исследовательских центров Южного полушария.'],
    majors: [ {name:'Engineering', share:18, top:true}, {name:'Medicine', share:16}, {name:'Law', share:12}, {name:'Business & Economics', share:10} ] },

  { name: 'Tecnológico de Monterrey', domain: 'tec.mx', country: 'Мексика', countryCode: 'mx', state: 'Нуэво-Леон', city: 'Монтеррей',
    minGPA: 3.4, minIELTS: 6.5, rate: 65, tuition: '≈ $9,000 / год',
    photo: null,
    description: 'Ведущий частный технический университет Латинской Америки, известен тесными связями с международным бизнесом.',
    facts: ['Один из самых предпринимательских университетов Латинской Америки.', 'Сильные партнёрства с MIT и другими техническими вузами США.', 'Множество кампусов по всей Мексике, объединённых в единую систему.'],
    majors: [ {name:'Business & Economics', share:20, top:true}, {name:'Engineering', share:18}, {name:'Computer Science', share:14}, {name:'Design & Architecture', share:10} ] },

  { name: 'American University of Beirut (AUB)', domain: 'aub.edu.lb', country: 'Ливан', countryCode: 'lb', state: null, city: 'Бейрут',
    minGPA: 3.3, minIELTS: 6.5, rate: 40, tuition: '≈ $20,000 / год',
    photo: null,
    description: 'Старейший американский по модели университет на Ближнем Востоке, известен сильной медицинской школой.',
    facts: ['Основан в 1866 году американскими миссионерами.', 'Обучение полностью на английском языке по американской модели.', 'Один из самых уважаемых вузов арабского мира.'],
    majors: [ {name:'Medicine', share:18, top:true}, {name:'Business & Economics', share:16}, {name:'Engineering', share:12}, {name:'Political Science / IR', share:10} ] },

  { name: 'KAUST (King Abdullah University of Science and Technology)', domain: 'kaust.edu.sa', country: 'Саудовская Аравия', countryCode: 'sa', state: null, city: 'Тувал',
    minGPA: 3.6, minIELTS: 6.5, rate: 3, tuition: 'Полностью покрывается стипендией для всех студентов',
    photo: null,
    description: 'Исследовательский университет для магистратуры и PhD, полностью финансируемый государством — обучение бесплатно для всех принятых студентов.',
    facts: ['Все принятые студенты получают полную стипендию, включая проживание.', 'Кампус построен "с нуля" как международный исследовательский хаб.', 'Один из самых щедро финансируемых университетов мира на одного студента.'],
    majors: [ {name:'Engineering', share:28, top:true}, {name:'Data Science & AI', share:22}, {name:'Biology & Life Sciences', share:16}, {name:'Mathematics & Physics', share:12} ] },

  { name: 'University of Vienna', domain: 'univie.ac.at', country: 'Австрия', countryCode: 'at', state: null, city: 'Вена',
    minGPA: 3.2, minIELTS: 6.5, rate: 70, tuition: '≈ €1,500 / год (для не-ЕС)',
    photo: null,
    description: 'Старейший университет немецкоязычного мира, известен сильной гуманитарной и естественнонаучной традицией.',
    facts: ['Основан в 1365 году.', 'Один из самых доступных по стоимости университетов Западной Европы.', 'Тесно связан с богатой музыкальной и философской традицией Вены.'],
    majors: [ {name:'Psychology', share:14, top:true}, {name:'Biology & Life Sciences', share:12}, {name:'Political Science / IR', share:12}, {name:'Law', share:10} ] },

  { name: 'HSE University (Высшая школа экономики)', domain: 'hse.ru', country: 'Россия', countryCode: 'ru', state: null, city: 'Москва',
    minGPA: 3.6, minIELTS: 6.5, rate: 20, tuition: '≈ ₽500,000 / год',
    photo: null,
    description: 'Один из самых современных и быстрорастущих университетов России, известен сильной экономической и IT-школой.',
    facts: ['Один из самых востребованных вузов России среди работодателей.', 'Активно развивает программы двойных дипломов с зарубежными вузами.', 'Сильная связь с технологическим и финансовым сектором Москвы.'],
    majors: [ {name:'Business & Economics', share:24, top:true}, {name:'Computer Science', share:20}, {name:'Data Science & AI', share:16}, {name:'Political Science / IR', share:10} ] },

  { name: 'Lomonosov Moscow State University (МГУ)', domain: 'msu.ru', country: 'Россия', countryCode: 'ru', state: null, city: 'Москва',
    minGPA: 3.7, minIELTS: 6.5, rate: 15, tuition: '≈ ₽450,000 / год',
    photo: null,
    description: 'Старейший и самый престижный университет России, лидер практически во всех академических рейтингах страны.',
    facts: ['Основан в 1755 году.', 'Главное здание МГУ — одна из знаменитых "сталинских высоток" Москвы.', 'Сильнейшая фундаментальная научная школа в физике и математике.'],
    majors: [ {name:'Mathematics & Physics', share:20, top:true}, {name:'Biology & Life Sciences', share:14}, {name:'Law', share:12}, {name:'Political Science / IR', share:10} ] }
];

// ==================== БАЗОВЫЙ СПРАВОЧНИК ВУЗОВ (реальные данные, без выдуманных цифр) ====================
const BASIC_UNIVERSITIES = [
  { name: 'University of Da Lat', domain: 'dlu.edu.vn', country: 'Вьетнам', countryCode: 'vn', state: null },
  { name: 'Fachhochschule Ludwigshafen, Hochschule für Wirtschaft', domain: 'fh-ludwigshafen.de', country: 'Германия', countryCode: 'de', state: null },
  { name: 'Anglo-American University', domain: 'aauni.edu', country: 'Чехия', countryCode: 'cz', state: null },
  { name: 'University of Greenland', domain: 'ilisimatusarfik.gl', country: 'Greenland', countryCode: 'gl', state: null },
  { name: 'Institute of Commerce and Business', domain: 'icb.edu.mn', country: 'Монголия', countryCode: 'mn', state: null },
  { name: 'Université d\'Oran Es-Senia', domain: 'univ-oran.dz', country: 'Алжир', countryCode: 'dz', state: null },
  { name: 'Arab Academy for Management, Banking and Financial Sciences', domain: 'aambfs.edu.eg', country: 'Иордания', countryCode: 'jo', state: null },
  { name: 'Western Sydney University', domain: 'westernsydney.edu.au', country: 'Австралия', countryCode: 'au', state: 'New South Wales' },
  { name: 'Yonsei University', domain: 'yonsei.ac.kr', country: 'Южная Корея', countryCode: 'kr', state: null },
  { name: 'Universidad Nacional Jorge Basadre Grohmann', domain: 'unjbg.edu.pe', country: 'Перу', countryCode: 'pe', state: null },
  { name: 'Koya University (Kurdistan Region)', domain: 'koyauniversity.org', country: 'Ирак', countryCode: 'iq', state: null },
  { name: 'Universidad de La Amazonia', domain: 'uniamazonia.edu.co', country: 'Колумбия', countryCode: 'co', state: null },
  { name: 'Sebha University', domain: 'sebhau.edu.ly', country: 'Ливия', countryCode: 'ly', state: null },
  { name: 'ABM University College', domain: 'abm.ac.bw', country: 'Ботсвана', countryCode: 'bw', state: null },
  { name: 'Universitat Autónoma de Barcelona', domain: 'uab.es', country: 'Испания', countryCode: 'es', state: null },
  { name: 'Tbilisi Institute of Asia and Africa', domain: 'tiaa.edu.ge', country: 'Грузия', countryCode: 'ge', state: null },
  { name: 'University Marien Ngouabi Brazzaville', domain: 'univ-mngb.net', country: 'Конго', countryCode: 'cg', state: null },
  { name: 'Instituto Superior de Ciênicas e Tecnologia de Moçambique', domain: 'isctem.ac.mz', country: 'Мозамбик', countryCode: 'mz', state: null },
  { name: 'Institute for Command Engineers of The Ministry for Emergency Situations', domain: 'kii.gov.by', country: 'Беларусь', countryCode: 'by', state: null },
  { name: 'Canadian International School of Hong Kong', domain: 'cdnis.edu.hk', country: 'Гонконг', countryCode: 'hk', state: null },
  { name: 'Université Kofi Annan', domain: 'univ-kag.org', country: 'Гвинея', countryCode: 'gn', state: null },
  { name: 'Universidad del CEMA', domain: 'ucema.edu.ar', country: 'Аргентина', countryCode: 'ar', state: 'Ciudad Autónoma de Buenos Aires' },
  { name: 'Universidad Champagnat', domain: 'champagnat.edu.mx', country: 'Мексика', countryCode: 'mx', state: null },
  { name: 'University of Otago', domain: 'otago.ac.nz', country: 'Новая Зеландия', countryCode: 'nz', state: 'Otago' },
  { name: 'Academy of Arts', domain: 'akademiaearteve.edu.al', country: 'Албания', countryCode: 'al', state: null },
  { name: 'University of Trinidad and Tobago', domain: 'utt.edu.tt', country: 'Тринидад и Тобаго', countryCode: 'tt', state: null },
  { name: 'FON University', domain: 'fon.edu.mk', country: 'Северная Македония', countryCode: 'mk', state: null },
  { name: 'American University of Central Asia', domain: 'auca.kg', country: 'Кыргызстан', countryCode: 'kg', state: null },
  { name: 'University College Bahrain', domain: 'ucb.edu.bh', country: 'Бахрейн', countryCode: 'bh', state: null },
  { name: 'Technical University in Zvolen', domain: 'tuzvo.sk', country: 'Словакия', countryCode: 'sk', state: null },
  { name: 'Mamoun Private University for Science and Technology', domain: 'must.edu.sy', country: 'Сирия', countryCode: 'sy', state: null },
  { name: 'Ecole Pour l\'Informatique et les Techniques Avancees', domain: 'epita.fr', country: 'Франция', countryCode: 'fr', state: null },
  { name: 'Wittenborg University', domain: 'wittenborg.eu', country: 'Нидерланды', countryCode: 'nl', state: null },
  { name: 'Universidade Estadual do Norte do Parana', domain: 'uenp.edu.br', country: 'Бразилия', countryCode: 'br', state: null },
  { name: 'University of Forestry Sofia', domain: 'ltu.bg', country: 'Болгария', countryCode: 'bg', state: null },
  { name: 'Umea University', domain: 'umu.se', country: 'Швеция', countryCode: 'se', state: null },
  { name: 'Kandahar University', domain: 'kan.edu.af', country: 'Афганистан', countryCode: 'af', state: null },
  { name: 'University of Saint Joseph', domain: 'usj.edu.mo', country: 'Макао', countryCode: 'mo', state: null },
  { name: 'Universidade do Vale do Itajaí', domain: 'univali.rct-sc.br', country: 'Бразилия', countryCode: 'br', state: null },
  { name: 'Kharkiv State Medical University', domain: 'ksmu.kharkov.ua', country: 'Украина', countryCode: 'ua', state: null },
  { name: 'Sur University College', domain: 'suc.edu.om', country: 'Оман', countryCode: 'om', state: null },
  { name: 'University of Technology - Iraq', domain: 'uotechnology.edu.iq', country: 'Ирак', countryCode: 'iq', state: null },
  { name: 'University of KwaZulu-Natal', domain: 'ukzn.ac.za', country: 'ЮАР', countryCode: 'za', state: 'KwaZulu-Natal' },
  { name: 'University of Silvaner', domain: 'unisilvaner.info', country: 'Сент-Китс и Невис', countryCode: 'kn', state: null },
  { name: 'State Engineering University of Armenia', domain: 'seua.am', country: 'Армения', countryCode: 'am', state: null },
  { name: 'Lithunian Institute of Physical Education', domain: 'lkka.lt', country: 'Литва', countryCode: 'lt', state: null },
  { name: 'Spartan University of Health Sciences', domain: 'spartanmed.org', country: 'Сент-Люсия', countryCode: 'lc', state: null },
  { name: 'Universidad Nacional Siglo XX Llallagua', domain: 'unsxx.edu.bo', country: 'Боливия', countryCode: 'bo', state: null },
  { name: 'University of Brunei Darussalam', domain: 'ubd.edu.bn', country: 'Бруней', countryCode: 'bn', state: null },
  { name: 'Omsk State Technical University', domain: 'omgtu.ru', country: 'Россия', countryCode: 'ru', state: null },
  { name: 'Mutesa 1 Royal University', domain: 'mru.ac.ug', country: 'Уганда', countryCode: 'ug', state: null },
  { name: 'Matn University', domain: 'matnu.edu.lb', country: 'Ливан', countryCode: 'lb', state: null },
  { name: 'Universidad de Pinar del Río', domain: 'upr.edu.cu', country: 'Куба', countryCode: 'cu', state: null },
  { name: 'Universidad Regional Miguel Hidalgo', domain: 'urmh.edu.mx', country: 'Мексика', countryCode: 'mx', state: null },
  { name: 'Manipur University', domain: 'manipuruniv.ac.in', country: 'Индия', countryCode: 'in', state: 'Manipur' },
  { name: 'Hong Kong Baptist University', domain: 'hkbu.edu.hk', country: 'Гонконг', countryCode: 'hk', state: null },
  { name: 'Royal University of Bhutan', domain: 'rub.edu.bt', country: 'Бутан', countryCode: 'bt', state: null },
  { name: 'King Abdulaziz University', domain: 'kau.edu.sa', country: 'Саудовская Аравия', countryCode: 'sa', state: 'Jeddah' },
  { name: 'Harran University', domain: 'harran.edu.tr', country: 'Турция', countryCode: 'tr', state: null },
  { name: 'University of Applied Sciences', domain: 'tktk.ee', country: 'Эстония', countryCode: 'ee', state: null },
  { name: 'Royal Danish School of Pharmacy', domain: 'dfh.dk', country: 'Дания', countryCode: 'dk', state: null },
  { name: 'Massey University', domain: 'massey.ac.nz', country: 'Новая Зеландия', countryCode: 'nz', state: 'Wellington' },
  { name: 'Universitat de les Illes Balears', domain: 'uib.es', country: 'Испания', countryCode: 'es', state: null },
  { name: 'Karlsruher Institut für Technologie', domain: 'kit.edu', country: 'Германия', countryCode: 'de', state: null },
  { name: 'Arab Open University', domain: 'arabou.edu.sa', country: 'Саудовская Аравия', countryCode: 'sa', state: 'Riyadh' },
  { name: 'Australian International School', domain: 'ais.edu.sg', country: 'Сингапур', countryCode: 'sg', state: null },
  { name: 'University of Sibiu', domain: 'sibiu.ro', country: 'Румыния', countryCode: 'ro', state: null },
  { name: 'Al-Asmarya University for Islamic Studies', domain: 'asmarya.edu.ly', country: 'Ливия', countryCode: 'ly', state: null },
  { name: 'Universidad Pedagógica Nacional', domain: 'unipe.edu.ar', country: 'Аргентина', countryCode: 'ar', state: 'Ciudad Autónoma de Buenos Aires' },
  { name: 'Bergen University College', domain: 'hib.no', country: 'Норвегия', countryCode: 'no', state: null },
  { name: 'Imam Abdulrahman Bin Faisal University', domain: 'iau.edu.sa', country: 'Саудовская Аравия', countryCode: 'sa', state: null },
  { name: 'Nippon Sport Science University', domain: 'nittai.ac.jp', country: 'Япония', countryCode: 'jp', state: null },
  { name: 'Université d\'Etat d\'Haiti', domain: 'ueh.edu.ht', country: 'Гаити', countryCode: 'ht', state: null },
  { name: 'Sebatian Kolowa University College', domain: 'sekuco.org', country: 'Танзания', countryCode: 'tz', state: null },
  { name: 'Asa University Bangladesh', domain: 'asaub.edu.bd', country: 'Бангладеш', countryCode: 'bd', state: null },
  { name: 'Escuela de Administración de Negocios', domain: 'ean.edu.co', country: 'Колумбия', countryCode: 'co', state: null },
  { name: 'Universidad Popular de Nicaragua (UPONIC)', domain: 'uponic.edu.ni', country: 'Никарагуа', countryCode: 'ni', state: null },
  { name: 'Sultan Ismail Petra International Islamic College', domain: 'kias.edu.my', country: 'Малайзия', countryCode: 'my', state: null },
  { name: 'Universidad Católica Boliviana, Cochabamba', domain: 'ucbcba.edu.bo', country: 'Боливия', countryCode: 'bo', state: null },
  { name: 'Herat University', domain: 'hu.edu.af', country: 'Афганистан', countryCode: 'af', state: null },
  { name: 'Ecole Nationale d\'Ingénieurs des Travaux Agricoles de Clermont-Ferrand', domain: 'enitac.fr', country: 'Франция', countryCode: 'fr', state: null },
  { name: 'University of Tartu', domain: 'ut.ee', country: 'Эстония', countryCode: 'ee', state: null },
  { name: 'Asian Medical Institute', domain: 'asmi.edu.kg', country: 'Кыргызстан', countryCode: 'kg', state: null },
  { name: 'Université de Buéa', domain: 'ubuea.cm', country: 'Камерун', countryCode: 'cm', state: null },
  { name: 'Angkor University', domain: 'angkor.edu.kh', country: 'Камбоджа', countryCode: 'kh', state: null },
  { name: 'French University in Armenia (UFAR)', domain: 'ufar.am', country: 'Армения', countryCode: 'am', state: null },
  { name: 'Guangdong University of Foreign Studies', domain: 'gdufs.edu.cn', country: 'Китай', countryCode: 'cn', state: null },
  { name: 'Pedagogical University of the Polish Association for Adult Education in Warsaw', domain: 'wsptwpwaw.edu.pl', country: 'Польша', countryCode: 'pl', state: null },
  { name: 'Université de Douala', domain: 'univ-douala.com', country: 'Камерун', countryCode: 'cm', state: null },
  { name: 'Babasaheb Bhimrao Ambedkar University', domain: 'bbauindia.org', country: 'Индия', countryCode: 'in', state: null },
  { name: 'Latvian Academy of Music', domain: 'jvlma.lv', country: 'Латвия', countryCode: 'lv', state: null },
  { name: 'Hankuk Aviation University', domain: 'hangkong.ac.kr', country: 'Южная Корея', countryCode: 'kr', state: null },
  { name: 'Universität Stuttgart', domain: 'uni-stuttgart.de', country: 'Германия', countryCode: 'de', state: null },
  { name: 'Blue Ridge Community College', domain: 'brcc.edu', country: 'США', countryCode: 'us', state: null },
  { name: 'Kabul University', domain: 'ku.edu.af', country: 'Афганистан', countryCode: 'af', state: null },
  { name: 'Universität Liechtenstein', domain: 'uni.li', country: 'Лихтенштейн', countryCode: 'li', state: null },
  { name: 'Université Dakar Bourguiba', domain: 'udb.sn', country: 'Сенегал', countryCode: 'sn', state: null },
  { name: 'Comenius University in Bratislava', domain: 'uniba.sk', country: 'Словакия', countryCode: 'sk', state: null },
  { name: 'University of Belgrade', domain: 'bg.ac.rs', country: 'Сербия', countryCode: 'rs', state: null },
  { name: 'Royal Military Academy', domain: 'rma.ac.be', country: 'Бельгия', countryCode: 'be', state: null },
  { name: 'COMSATS Institute of Information Technology, Wah', domain: 'ciit-wah.edu.pk', country: 'Пакистан', countryCode: 'pk', state: null },
  { name: 'University of Gjirokstra "Eqerem Cabej"', domain: 'uogj.edu.al', country: 'Албания', countryCode: 'al', state: null },
  { name: 'Universidad Nacional Autonoma de Nicaragua', domain: 'unan.edu.ni', country: 'Никарагуа', countryCode: 'ni', state: null },
  { name: 'VIA University College', domain: 'en.via.dk', country: 'Дания', countryCode: 'dk', state: null },
  { name: 'Madurai Kamaraj University', domain: 'mkuhyd.com', country: 'Индия', countryCode: 'in', state: 'Tamil Nadu' },
  { name: 'American University of Science and Technology', domain: 'aust.edu.lb', country: 'Ливан', countryCode: 'lb', state: null },
  { name: 'Pwani University', domain: 'pu.ac.ke', country: 'Кения', countryCode: 'ke', state: null },
  { name: 'Université Notre Dame d\'Haïti', domain: 'undh.org', country: 'Гаити', countryCode: 'ht', state: null },
  { name: 'Abo Akademi University', domain: 'abo.fi', country: 'Финляндия', countryCode: 'fi', state: null },
  { name: 'Academy of the Ministry of Internal Affairs of the Republic of Belarus', domain: 'academy.mia.by', country: 'Беларусь', countryCode: 'by', state: null },
  { name: 'University of Northampton', domain: 'northampton.ac.uk', country: 'Великобритания', countryCode: 'gb', state: null },
  { name: 'Bugema University', domain: 'bugemauniv.ac.ug', country: 'Уганда', countryCode: 'ug', state: 'Luweero' },
  { name: 'International Turkmen Turkish University', domain: 'ittu.edu.tm', country: 'Туркменистан', countryCode: 'tm', state: null },
  { name: 'Al-Islah University', domain: 'islahonline.org', country: 'Ливан', countryCode: 'lb', state: null },
  { name: 'Universidad Experimental Felix Adam', domain: 'unefa.edu.do', country: 'Доминиканская Республика', countryCode: 'do', state: null },
  { name: 'Université des Sciences et Technologies de Lille (Lille I)', domain: 'univ-lille1.fr', country: 'Франция', countryCode: 'fr', state: null },
  { name: 'Universitas Paramadina Mulya', domain: 'paramadina.ac.id', country: 'Индонезия', countryCode: 'id', state: null },
  { name: 'Estonian Academy of Music and Theatre', domain: 'ema.edu.ee', country: 'Эстония', countryCode: 'ee', state: null },
  { name: 'Universidade do Algarve', domain: 'ualg.pt', country: 'Португалия', countryCode: 'pt', state: null },
  { name: 'American University', domain: 'aubih.ba', country: 'Босния и Герцеговина', countryCode: 'ba', state: null },
  { name: 'Russell Berrie Nanotechnology Institute', domain: 'rbni.technion.ac.il', country: 'Израиль', countryCode: 'il', state: null },
  { name: 'American University in Cairo', domain: 'aucegypt.edu', country: 'Египет', countryCode: 'eg', state: null },
  { name: 'Shannon College of Hotel Management', domain: 'shannoncollege.com', country: 'Ирландия', countryCode: 'ie', state: null },
  { name: 'University of Montenegro', domain: 'ucg.cg.ac.yu', country: 'Черногория', countryCode: 'me', state: null },
  { name: 'Uinversity of Babylon', domain: 'uobabylon.edu.iq', country: 'Ирак', countryCode: 'iq', state: null },
  { name: 'Wuyi University', domain: 'wyu.edu.cn', country: 'Китай', countryCode: 'cn', state: null },
  { name: 'Seokyeong University', domain: 'skuniv.ac.kr', country: 'Южная Корея', countryCode: 'kr', state: null },
  { name: 'Tay Nguyen University', domain: 'taynguyenuni.edu.vn', country: 'Вьетнам', countryCode: 'vn', state: null },
  { name: 'Jerusalem University College', domain: 'juc.edu', country: 'Израиль', countryCode: 'il', state: null },
  { name: 'Kuwait International Law School', domain: 'kilaw.edu.kw', country: 'Кувейт', countryCode: 'kw', state: null },
  { name: 'Université Virtuelle de Tunis', domain: 'uvt.rnu.tn', country: 'Тунис', countryCode: 'tn', state: null },
  { name: 'Institute of Teachers Education, Tawau', domain: 'ipgmtawau.edu.my', country: 'Малайзия', countryCode: 'my', state: null },
  { name: 'Technical Institute of Dubnica in Dubnica nad Váhom', domain: 'dti.sk', country: 'Словакия', countryCode: 'sk', state: null },
  { name: 'Université Julius Nyerere Kankan', domain: 'ujnk.org', country: 'Гвинея', countryCode: 'gn', state: null },
  { name: 'Universitas Bung Hatta', domain: 'bunghatta.ac.id', country: 'Индонезия', countryCode: 'id', state: null },
  { name: 'Singapore Institute of Management (SIM)', domain: 'sim.edu.sg', country: 'Сингапур', countryCode: 'sg', state: null },
  { name: 'Wayamba University of Sri Lanka', domain: 'wyb.ac.lk', country: 'Шри-Ланка', countryCode: 'lk', state: null },
  { name: 'Pontificia Universidad Catolica de Puerto Rico', domain: 'pucpr.edu', country: 'Пуэрто-Рико', countryCode: 'pr', state: null },
  { name: 'Pavlodar University', domain: 'psu.kz', country: 'Казахстан', countryCode: 'kz', state: null },
  { name: 'Ankara University', domain: 'ankara.edu.tr', country: 'Турция', countryCode: 'tr', state: null },
  { name: 'Instituto Politécnico do Cávado e do Ave', domain: 'ipca.pt', country: 'Португалия', countryCode: 'pt', state: null },
  { name: 'HUG - Univ. Hospitals of Geneva', domain: 'hcuge.ch', country: 'Швейцария', countryCode: 'ch', state: null },
  { name: 'College of Europe', domain: 'coleurope.eu', country: 'Бельгия', countryCode: 'be', state: null },
  { name: 'Medical Academy Karol Marcinkowski in Poznan', domain: 'usoms.poznan.pl', country: 'Польша', countryCode: 'pl', state: null },
  { name: 'American University of Kuwait', domain: 'auk.edu.kw', country: 'Кувейт', countryCode: 'kw', state: null },
  { name: 'Gifu Women\'s University', domain: 'gijodai.ac.jp', country: 'Япония', countryCode: 'jp', state: null },
  { name: 'University of Prishtina', domain: 'uni-pr.edu', country: 'Косово', countryCode: 'xk', state: null },
  { name: 'Rostov State Medical University', domain: 'rsmu.da.ru', country: 'Россия', countryCode: 'ru', state: null },
  { name: 'University of Fine Arts Belgrade', domain: 'arts.bg.ac.rs', country: 'Сербия', countryCode: 'rs', state: null },
  { name: 'VERN\' University of Applied Sciences', domain: 'vern.hr', country: 'Хорватия', countryCode: 'hr', state: null },
  { name: 'Universidad de la Empresa (UDE)', domain: 'ude.edu.uy', country: 'Уругвай', countryCode: 'uy', state: null },
  { name: 'Dhofar University', domain: 'du.edu.om', country: 'Оман', countryCode: 'om', state: null },
  { name: 'Université de Ngaoundéré', domain: 'univ-ndere.cm', country: 'Камерун', countryCode: 'cm', state: null },
  { name: 'University of Tasmania', domain: 'utas.edu.au', country: 'Австралия', countryCode: 'au', state: 'Tasmania' },
  { name: 'Staatliche Hochschule für Musik', domain: 'mh-trossingen.de', country: 'Германия', countryCode: 'de', state: null },
  { name: '"Angel Kanchev" University of Ruse', domain: 'uni-ruse.bg', country: 'Болгария', countryCode: 'bg', state: null },
  { name: 'University of the Humanities', domain: 'humanities.mn', country: 'Монголия', countryCode: 'mn', state: null },
  { name: 'Budapest University of Economic Sciences and Public Administration', domain: 'bke.hu', country: 'Венгрия', countryCode: 'hu', state: null },
  { name: 'Adamawa State University', domain: 'adsu.edu.ng', country: 'Нигерия', countryCode: 'ng', state: null },
  { name: 'Universidad de La Rioja', domain: 'unirioja.es', country: 'Испания', countryCode: 'es', state: null },
  { name: 'Mongolian State University of Education', domain: 'msue.edu.mn', country: 'Монголия', countryCode: 'mn', state: null },
  { name: 'Nkumba University', domain: 'nkumbauniversity.ac.ug', country: 'Уганда', countryCode: 'ug', state: null },
  { name: 'University of Malta', domain: 'um.edu.mt', country: 'Мальта', countryCode: 'mt', state: null },
  { name: 'University College Odisee', domain: 'odisee.be', country: 'Бельгия', countryCode: 'be', state: null },
  { name: 'Hanoi University', domain: 'hanu.edu.vn', country: 'Вьетнам', countryCode: 'vn', state: 'Hanoi' },
  { name: 'Université de Bouaké', domain: 'ubouake.ci', country: 'Кот-д\'Ивуар', countryCode: 'ci', state: null },
  { name: 'Instituto Tecnológico de León', domain: 'itleon.edu.mx', country: 'Мексика', countryCode: 'mx', state: null },
  { name: 'Hvanneyri Agricultural University', domain: 'hvanneyri.is', country: 'Исландия', countryCode: 'is', state: null },
  { name: 'Shanghai Dainji University', domain: 'sdju.edu.cn', country: 'Китай', countryCode: 'cn', state: null },
  { name: 'Abu Dhabi University', domain: 'adu.ac.ae', country: 'ОАЭ', countryCode: 'ae', state: null },
  { name: 'Aarhus School of Business', domain: 'hha.dk', country: 'Дания', countryCode: 'dk', state: null },
  { name: 'Universidad Panamericana', domain: 'upana.edu.gt', country: 'Гватемала', countryCode: 'gt', state: null },
  { name: 'Centro Universitario de Occidente', domain: 'cunoc.edu.gt', country: 'Гватемала', countryCode: 'gt', state: null },
  { name: 'University of Applied Sciences Basel (FHBB )', domain: 'fhbb.ch', country: 'Швейцария', countryCode: 'ch', state: null },
  { name: 'University of Technology Jamaica', domain: 'utech.edu.jm', country: 'Ямайка', countryCode: 'jm', state: null },
  { name: 'Universiteit Antwerpen, UFSIA', domain: 'ufsia.ac.be', country: 'Бельгия', countryCode: 'be', state: null },
  { name: 'Universidade Salgado de Oliveira', domain: 'universo.br', country: 'Бразилия', countryCode: 'br', state: null },
  { name: 'University of Guyana', domain: 'uog.edu.gy', country: 'Гайана', countryCode: 'gy', state: null },
  { name: 'Carlow Institute of Technology', domain: 'itcarlow.ie', country: 'Ирландия', countryCode: 'ie', state: null },
  { name: 'Lilongwe University of Agriculture and Natural Resources', domain: 'luanar.ac.mw', country: 'Малави', countryCode: 'mw', state: null },
  { name: 'Universidad Santiago de Cali', domain: 'usaca.edu.co', country: 'Колумбия', countryCode: 'co', state: null },
  { name: 'Fiji National University', domain: 'fnu.ac.fj', country: 'Фиджи', countryCode: 'fj', state: null },
  { name: 'Turku School of Economics and Business Administration', domain: 'tukkk.fi', country: 'Финляндия', countryCode: 'fi', state: null },
  { name: 'University of Tromsø', domain: 'uit.no', country: 'Норвегия', countryCode: 'no', state: null },
  { name: 'Louvain School of Management', domain: 'uclouvain.be', country: 'Бельгия', countryCode: 'be', state: null },
  { name: 'Africa Nazarene University', domain: 'anu.ac.ke', country: 'Кения', countryCode: 'ke', state: null },
  { name: 'Tribhuvan University', domain: 'cdc.tu.edu.np', country: 'Непал', countryCode: 'np', state: 'Bagmati' },
  { name: 'University “Pavaresia” Vlore', domain: 'unipavaresia.edu.al', country: 'Албания', countryCode: 'al', state: null },
  { name: 'Universidade Zambeze', domain: 'unizambeze.ac.mz', country: 'Мозамбик', countryCode: 'mz', state: null },
  { name: 'University of Strathclyde', domain: 'strath.ac.uk', country: 'Великобритания', countryCode: 'gb', state: null },
  { name: 'European School of Economics', domain: 'eselondon.ac.uk', country: 'Великобритания', countryCode: 'gb', state: null },
  { name: 'Ilsa Independent College', domain: 'ilsacollege.edu.na', country: 'Намибия', countryCode: 'na', state: null },
  { name: 'Japanese Red Cross College of Nursing', domain: 'redcross.ac.jp', country: 'Япония', countryCode: 'jp', state: null },
  { name: 'University of Dongola', domain: 'uofd.edu.sd', country: 'Судан', countryCode: 'sd', state: null },
  { name: 'Escola Superior de Artes e Design', domain: 'esad.pt', country: 'Португалия', countryCode: 'pt', state: null },
  { name: 'Tibet University', domain: 'utibet.edu.cn', country: 'Китай', countryCode: 'cn', state: null },
  { name: 'EVTEK University of Applied Sciences', domain: 'evtek.fi', country: 'Финляндия', countryCode: 'fi', state: null },
  { name: 'Universidade do Rio de Janeiro', domain: 'unirio.br', country: 'Бразилия', countryCode: 'br', state: null },
  { name: 'University of Lincoln', domain: 'lincoln.ac.uk', country: 'Великобритания', countryCode: 'gb', state: null },
  { name: 'King Abdullah University of Science and Technology', domain: 'kaust.edu.sa', country: 'Саудовская Аравия', countryCode: 'sa', state: 'Aljouf' },
  { name: 'Belarusian State Agricultural Academy', domain: 'baa.by', country: 'Беларусь', countryCode: 'by', state: null },
  { name: 'University of Cape Coast', domain: 'ucc.edu.gh', country: 'Гана', countryCode: 'gh', state: null },
  { name: 'Kagoshima Immaculate Heart University', domain: 'k-junshin.ac.jp', country: 'Япония', countryCode: 'jp', state: null },
  { name: 'Wadi International University', domain: 'wiu.edu.sy', country: 'Сирия', countryCode: 'sy', state: null },
  { name: 'Malmö University College', domain: 'mah.se', country: 'Швеция', countryCode: 'se', state: null },
  { name: 'Lithunian University of Agriculture', domain: 'lzua.lt', country: 'Литва', countryCode: 'lt', state: null },
  { name: 'Changsha University of Electric Power', domain: 'csuep.edu.cn', country: 'Китай', countryCode: 'cn', state: null },
  { name: 'Libyan International Medical University (LIMU)', domain: 'limu.edu.ly', country: 'Ливия', countryCode: 'ly', state: null },
  { name: 'Maseno University', domain: 'maseno.ac.ke', country: 'Кения', countryCode: 'ke', state: null },
  { name: 'Kaunas University of Technology', domain: 'ktu.lt', country: 'Литва', countryCode: 'lt', state: null },
  { name: 'Fachhochschule Bielefeld', domain: 'fh-bielefeld.de', country: 'Германия', countryCode: 'de', state: null },
  { name: 'Shahid Rajaee Teacher Training University', domain: 'srttu.edu', country: 'Иран', countryCode: 'ir', state: 'Tehran' },
  { name: 'American College of Thessaloniki', domain: 'act.edu', country: 'Греция', countryCode: 'gr', state: 'Macedonia' },
  { name: 'Institut Supérieur de Gestion de Tunis', domain: 'isg.rnu.tn', country: 'Тунис', countryCode: 'tn', state: null },
  { name: 'Universidad Gran Mariscal de Ayacucho', domain: 'ugma.edu.ve', country: 'Венесуэла', countryCode: 've', state: null },
  { name: 'Universidad del Istmo', domain: 'udi.edu', country: 'Панама', countryCode: 'pa', state: null },
  { name: 'National Dong Hwa University', domain: 'ndhu.edu.tw', country: 'Тайвань', countryCode: 'tw', state: null },
  { name: 'Yerevan State University', domain: 'ysu.am', country: 'Армения', countryCode: 'am', state: null },
  { name: 'Cavendish University', domain: 'cavendishza.org', country: 'Замбия', countryCode: 'zm', state: null },
  { name: 'Binary University College of Managemant & Entrepreneurship', domain: 'binary.edu.my', country: 'Малайзия', countryCode: 'my', state: null },
  { name: 'Al-Balqa Applied University', domain: 'bau.edu.jo', country: 'Иордания', countryCode: 'jo', state: null },
  { name: 'Universidade Católica de Moçambique', domain: 'ucm.ac.mz', country: 'Мозамбик', countryCode: 'mz', state: null },
  { name: 'University of Glamorgan', domain: 'glam.ac.uk', country: 'Великобритания', countryCode: 'gb', state: null },
  { name: 'Technological University of Iceland', domain: 'iti.is', country: 'Исландия', countryCode: 'is', state: null },
  { name: 'Sana\'a University', domain: 'su.edu.ye', country: 'Йемен', countryCode: 'ye', state: null },
  { name: 'Jinan University', domain: 'jinan.edu.lb', country: 'Ливан', countryCode: 'lb', state: null },
  { name: 'Nigde Omer Halisdemir University', domain: 'nigde.edu.tr', country: 'Турция', countryCode: 'tr', state: 'Nigde' },
  { name: 'Zhezkazgan Baikonurov University', domain: 'zhezu.kz', country: 'Казахстан', countryCode: 'kz', state: null },
  { name: 'Sir Syed Institute Of Technology Islamabad', domain: 'ssms.edu.pk', country: 'Пакистан', countryCode: 'pk', state: 'Panjab' },
  { name: 'University of Asia Pacific, Dhanmondi', domain: 'uap-bd.edu', country: 'Бангладеш', countryCode: 'bd', state: null },
  { name: 'National University of Laos', domain: 'nuol.edu.la', country: 'Лаос', countryCode: 'la', state: 'Vientiane' },
  { name: 'Azerbaijan State Marine Academy', domain: 'adda.edu.az', country: 'Азербайджан', countryCode: 'az', state: null },
  { name: 'Polytechnic Ibadan', domain: 'polyibadan.edu.ng', country: 'Нигерия', countryCode: 'ng', state: null },
  { name: 'Institute of Teachers Education, Tuanku Bainun', domain: 'iptb.edu.my', country: 'Малайзия', countryCode: 'my', state: null },
  { name: 'Bifrost School of Business', domain: 'bifrost.is', country: 'Исландия', countryCode: 'is', state: null },
  { name: 'University of Technology and Life Sciences', domain: 'utp.edu.pl', country: 'Польша', countryCode: 'pl', state: null },
  { name: 'Great Zimbabwe University', domain: 'gzu.ac.zw', country: 'Зимбабве', countryCode: 'zw', state: null },
  { name: 'Gaborone Universal College of Law', domain: 'guc.co.bw', country: 'Ботсвана', countryCode: 'bw', state: null },
  { name: 'Hokuriku University', domain: 'hokuriku-u.ac.jp', country: 'Япония', countryCode: 'jp', state: null },
  { name: 'Open University of Israel', domain: 'openu.ac.il', country: 'Израиль', countryCode: 'il', state: null },
  { name: 'Moscow University for Industry and Finance “Synergy”', domain: 'synergy.ru', country: 'Россия', countryCode: 'ru', state: null },
  { name: 'Fachhochschule Wiener Neustadt', domain: 'fhwn.ac.at', country: 'Австрия', countryCode: 'at', state: null },
  { name: 'Thi Qar University', domain: 'thiqaruni.org', country: 'Ирак', countryCode: 'iq', state: null },
  { name: 'Universidad José Cecilio del Valle', domain: 'ujcv.edu.hn', country: 'Гондурас', countryCode: 'hn', state: null },
  { name: 'Universidad Católica de Honduras', domain: 'unicah.edu', country: 'Гондурас', countryCode: 'hn', state: null },
  { name: 'Dong-A University', domain: 'donga.ac.kr', country: 'Южная Корея', countryCode: 'kr', state: null },
  { name: 'RCSI & UCD Malaysia Campus', domain: 'rumc.edu.my', country: 'Малайзия', countryCode: 'my', state: 'Kuala Lumpur' },
  { name: 'Pontifcia Università Gregoriana', domain: 'unigre.urbe.it', country: 'Holy See (Vatican City State)', countryCode: 'va', state: null },
  { name: 'Sultan Qaboos University', domain: 'squ.edu.om', country: 'Оман', countryCode: 'om', state: null },
  { name: 'Hoa Sen University', domain: 'hoasen.edu.vn', country: 'Вьетнам', countryCode: 'vn', state: 'Ho Chi Minh City' },
  { name: 'New York Instiute of Technology', domain: 'nyit.edu.bh', country: 'Бахрейн', countryCode: 'bh', state: null },
  { name: 'University of Lodz', domain: 'uni.lodz.pl', country: 'Польша', countryCode: 'pl', state: null },
  { name: 'Lithunian Veterinary Academy', domain: 'lva.lt', country: 'Литва', countryCode: 'lt', state: null },
  { name: 'Moldova State Agricultural University', domain: 'uasm.md', country: 'Молдова', countryCode: 'md', state: null },
  { name: 'Universidad Nacional del Este', domain: 'une.edu.py', country: 'Парагвай', countryCode: 'py', state: null },
  { name: 'Moldova Cooperative Trade University', domain: 'uccm.md', country: 'Молдова', countryCode: 'md', state: null },
  { name: 'Australian Defence Force Academy', domain: 'adfa.oz.au', country: 'Австралия', countryCode: 'au', state: 'Australian Capital Territory' },
  { name: 'St. George\'s University', domain: 'sgu.edu', country: 'Гренада', countryCode: 'gd', state: null },
  { name: 'Njala University', domain: 'nu-online.com', country: 'Сьерра-Леоне', countryCode: 'sl', state: null },
  { name: 'Universidad Catolica "Redemptoris Mater"', domain: 'unica.edu.ni', country: 'Никарагуа', countryCode: 'ni', state: null },
  { name: 'Universidad de Navarra', domain: 'unav.es', country: 'Испания', countryCode: 'es', state: null },
  { name: 'Université d\'Aix-Marseille III', domain: 'u-3mrs.fr', country: 'Франция', countryCode: 'fr', state: null },
  { name: 'Charisma University', domain: 'charismauniversity.org', country: 'Turks and Caicos Islands', countryCode: 'tc', state: null },
  { name: 'KU Leuven', domain: 'student.kuleuven.be', country: 'Бельгия', countryCode: 'be', state: 'Leuven' },
  { name: 'The Petroleum Institute', domain: 'pi.ac.ae', country: 'ОАЭ', countryCode: 'ae', state: null },
  { name: 'Azerbaijan Medical University', domain: 'amu.edu.az', country: 'Азербайджан', countryCode: 'az', state: null },
  { name: 'Ain Shams University', domain: 'shams.edu.eg', country: 'Египет', countryCode: 'eg', state: null },
  { name: 'Kunmimg University of Science and Technology', domain: 'kmust.edu.cn', country: 'Китай', countryCode: 'cn', state: null },
  { name: 'Mokpo National University', domain: 'mokpo.ac.kr', country: 'Южная Корея', countryCode: 'kr', state: null },
  { name: 'Debre Birhan University', domain: 'dbu.edu.et', country: 'Эфиопия', countryCode: 'et', state: null },
  { name: 'Georgian Agricultural University', domain: 'gsau.edu.ge', country: 'Грузия', countryCode: 'ge', state: null },
  { name: 'Shikoku University', domain: 'shikoku-u.ac.jp', country: 'Япония', countryCode: 'jp', state: null },
  { name: 'Universidad Católica Madre y Maestra', domain: 'pucmm.edu.do', country: 'Доминиканская Республика', countryCode: 'do', state: null },
  { name: 'Binh Duong University', domain: 'bdu.edu.vn', country: 'Вьетнам', countryCode: 'vn', state: null },
  { name: 'Ecole Supérieure des Sciences Commerciales d\'Angers', domain: 'essca.asso.fr', country: 'Франция', countryCode: 'fr', state: null },
  { name: 'Universidad Laica "Vicente Rocafuerte" de Guayaquil', domain: 'ulaicavr.com', country: 'Эквадор', countryCode: 'ec', state: null },
  { name: 'Sohag University', domain: 'sohag-univ.edu.eg', country: 'Египет', countryCode: 'eg', state: null },
  { name: 'Universidad Tecnológica del Peru', domain: 'utp.edu.pe', country: 'Перу', countryCode: 'pe', state: null },
  { name: 'Université Moulay Ismail Meknès', domain: 'rumi.ac.ma', country: 'Марокко', countryCode: 'ma', state: null },
  { name: 'Comrat State University', domain: 'kdu.md', country: 'Молдова', countryCode: 'md', state: null },
  { name: 'Bayero University Kano', domain: 'buk.edu.ng', country: 'Нигерия', countryCode: 'ng', state: null },
  { name: 'Universidad Autónoma de Manizales', domain: 'autonoma.edu.co', country: 'Колумбия', countryCode: 'co', state: null },
  { name: 'Texila American University', domain: 'tauedu.org', country: 'Гайана', countryCode: 'gy', state: null },
  { name: 'Furman University', domain: 'furman.edu', country: 'США', countryCode: 'us', state: null },
  { name: 'Centennial College', domain: 'centennialcollege.ca', country: 'Канада', countryCode: 'ca', state: 'Ontario' },
  { name: 'Universidad Privada Los Andes', domain: 'upla.edu.pe', country: 'Перу', countryCode: 'pe', state: null },
  { name: 'Federal University of Technology, Akure', domain: 'futa.edu.ng', country: 'Нигерия', countryCode: 'ng', state: null },
  { name: 'University of Southern Queensland', domain: 'usq.edu.au', country: 'Австралия', countryCode: 'au', state: 'Queensland' },
  { name: 'Malawi University of Science and Technology', domain: 'must.ac.mw', country: 'Малави', countryCode: 'mw', state: null },
  { name: 'Kyungwoon University', domain: 'ikw.ac.kr', country: 'Южная Корея', countryCode: 'kr', state: null },
  { name: 'University of Burao', domain: 'buraouniversity.com', country: 'Сомали', countryCode: 'so', state: null },
  { name: 'Universidade Católica do Salvador', domain: 'ucsal.br', country: 'Бразилия', countryCode: 'br', state: 'Salvador' },
  { name: 'Smolensk State Medical Academy', domain: 'sgma.info', country: 'Россия', countryCode: 'ru', state: null },
  { name: 'Université de la Méditerranée (Aix Marseille II)', domain: 'univmed.fr', country: 'Франция', countryCode: 'fr', state: null },
  { name: 'Medical University Pleven', domain: 'mu-pleven.bg', country: 'Болгария', countryCode: 'bg', state: null },
  { name: 'Seoul National University', domain: 'snu.ac.kr', country: 'Южная Корея', countryCode: 'kr', state: null },
  { name: 'Universidad Dr. Rafael Belloso Chacín', domain: 'urbe.edu', country: 'Венесуэла', countryCode: 've', state: null },
  { name: 'Universidad Iberoamericana de Ciencias y Tecnologia', domain: 'unicit.cl', country: 'Чили', countryCode: 'cl', state: null },
  { name: 'University of Rijeka', domain: 'uniri.hr', country: 'Хорватия', countryCode: 'hr', state: null },
  { name: 'Universidad Modular Abierta', domain: 'uma.edu.sv', country: 'Сальвадор', countryCode: 'sv', state: null },
  { name: 'Université de Batna', domain: 'univ-batna.dz', country: 'Алжир', countryCode: 'dz', state: null },
  { name: 'Université de Kisangani', domain: 'unikis.ac.cd', country: 'ДР Конго', countryCode: 'cd', state: null },
  { name: 'Sunyani Technical University', domain: 'stu.edu.gh', country: 'Гана', countryCode: 'gh', state: null },
  { name: 'International College of Tourism and Hotel Management', domain: 'icthm.edu.au', country: 'Австралия', countryCode: 'au', state: null },
  { name: 'Atharva College of Engineering', domain: 'atharvacoe.ac.in', country: 'Индия', countryCode: 'in', state: 'Mumbai' },
  { name: 'Roskilde University', domain: 'ruc.dk', country: 'Дания', countryCode: 'dk', state: null },
  { name: 'Sadat Institute of Higher Education', domain: 'sadat.edu.af', country: 'Афганистан', countryCode: 'af', state: null },
  { name: 'West Minster International College', domain: 'westminster.edu.my', country: 'Малайзия', countryCode: 'my', state: null },
  { name: 'Catholic University in Zimbabwe', domain: 'cuz.ac.zw', country: 'Зимбабве', countryCode: 'zw', state: null },
  { name: 'Nova Scotia Agricultural College', domain: 'nsac.ns.ca', country: 'Канада', countryCode: 'ca', state: 'Nova Scotia' },
  { name: 'Centro Universitário Barao de Maua', domain: 'baraodemaua.br', country: 'Бразилия', countryCode: 'br', state: null },
  { name: 'Odessa State Academy of Construction and Architecture', domain: 'ogasa.odessa.ua', country: 'Украина', countryCode: 'ua', state: null },
  { name: 'Universidad Cristóbal Colón', domain: 'ver.ucc.mx', country: 'Мексика', countryCode: 'mx', state: null },
  { name: 'Fourah Bay College, University of Sierra Leone', domain: 'fbcusl.8k.com', country: 'Сьерра-Леоне', countryCode: 'sl', state: null },
  { name: 'Moscow State University of Railway Transport', domain: 'miit.ru', country: 'Россия', countryCode: 'ru', state: null },
  { name: 'Hubert Kairuki Memorial University', domain: 'hkmu.ac.tz', country: 'Танзания', countryCode: 'tz', state: null },
  { name: 'Universidad de la República', domain: 'universidad.edu.uy', country: 'Уругвай', countryCode: 'uy', state: null },
  { name: 'Tashkent State Technical University', domain: 'tdtu.uz', country: 'Узбекистан', countryCode: 'uz', state: null },
  { name: 'Université de Kairouan', domain: 'univ-k.rnu.tn', country: 'Тунис', countryCode: 'tn', state: null },
  { name: 'St.Kliment Ohridski University', domain: 'uklo.edu.mk', country: 'Северная Македония', countryCode: 'mk', state: null },
  { name: 'London Institute of Management and Technology', domain: 'limt.co.uk', country: 'Великобритания', countryCode: 'gb', state: null },
  { name: 'Universidad Albert Einstein', domain: 'uae.edu.sv', country: 'Сальвадор', countryCode: 'sv', state: null },
  { name: 'Royal College of Surgeons', domain: 'rcsi.ie', country: 'Ирландия', countryCode: 'ie', state: null },
  { name: 'South Carelian Polytechnic', domain: 'scp.fi', country: 'Финляндия', countryCode: 'fi', state: null },
  { name: 'Lutherische Theologische Hochschule Oberursel', domain: 'selk.de', country: 'Германия', countryCode: 'de', state: null },
  { name: 'Botho University', domain: 'bothocollege.ac.bw', country: 'Ботсвана', countryCode: 'bw', state: null },
  { name: 'University of Sierra Leone', domain: 'tusol.org', country: 'Сьерра-Леоне', countryCode: 'sl', state: null },
  { name: 'Universidad de Ciego de Avila', domain: 'unica.cu', country: 'Куба', countryCode: 'cu', state: null },
  { name: 'Riga Teacher Training and Educational Management Academy', domain: 'rpiva.lv', country: 'Латвия', countryCode: 'lv', state: null },
  { name: 'Australlian College of Kuwait', domain: 'ackonline.com', country: 'Кувейт', countryCode: 'kw', state: null },
  { name: 'Phan Chau Trinh University', domain: 'pctu.edu.vn', country: 'Вьетнам', countryCode: 'vn', state: null },
  { name: 'Music Academy in Cracow', domain: 'amuz.krakow.pl', country: 'Польша', countryCode: 'pl', state: null },
  { name: 'Open University of Cyprus', domain: 'ouc.ac.cy', country: 'Кипр', countryCode: 'cy', state: null },
  { name: 'Ecole Supérieure de Commerce de Pau', domain: 'esc-pau.fr', country: 'Франция', countryCode: 'fr', state: null },
  { name: 'Ecole Polytechnique Universitaire de Lille', domain: 'polytech-lille.fr', country: 'Франция', countryCode: 'fr', state: null },
  { name: 'Zagreb University of Applied Sciences', domain: 'tvz.hr', country: 'Хорватия', countryCode: 'hr', state: null },
  { name: 'Kohat University of Science and Technology (KUST)', domain: 'kust.edu.pk', country: 'Пакистан', countryCode: 'pk', state: 'Khyber Pakhtunkhwa' },
  { name: 'University of the Southern Caribbean', domain: 'usc.edu.tt', country: 'Тринидад и Тобаго', countryCode: 'tt', state: null },
  { name: 'University of Sharjah', domain: 'sharjah.ac.ae', country: 'ОАЭ', countryCode: 'ae', state: null },
  { name: 'Midlands State University', domain: 'msu.ac.zw', country: 'Зимбабве', countryCode: 'zw', state: null },
  { name: 'Ege University', domain: 'ege.edu.tr', country: 'Турция', countryCode: 'tr', state: null },
  { name: 'Baltic International Academy', domain: 'bsa.edu.lv', country: 'Латвия', countryCode: 'lv', state: null },
  { name: 'Agricultural University of Norway', domain: 'nlh.no', country: 'Норвегия', countryCode: 'no', state: null },
  { name: 'Universidad de Oriente', domain: 'uo.edu.cu', country: 'Куба', countryCode: 'cu', state: null },
  { name: 'Pontificia Universidad Católica del Ecuador', domain: 'puce.edu.ec', country: 'Эквадор', countryCode: 'ec', state: null },
  { name: 'Universidad Metropolitana Castro Carazo', domain: 'umca.net', country: 'Коста-Рика', countryCode: 'cr', state: null },
  { name: 'University of Mauritius', domain: 'uom.ac.mu', country: 'Маврикий', countryCode: 'mu', state: null },
  { name: 'University of Kabianga', domain: 'kabianga.ac.ke', country: 'Кения', countryCode: 'ke', state: null },
  { name: 'University of Botswana', domain: 'ub.bw', country: 'Ботсвана', countryCode: 'bw', state: null },
  { name: 'Université de Fianarantsoa', domain: 'univ-fianar.mg', country: 'Мадагаскар', countryCode: 'mg', state: null },
  { name: 'Universidad de Las Palmas de Gran Canaria', domain: 'ulpgc.es', country: 'Испания', countryCode: 'es', state: null },
  { name: 'Ahlulbait International University', domain: 'ahlulbaitonline.com', country: 'Ирак', countryCode: 'iq', state: null },
  { name: 'Riara University School of Business and Law', domain: 'riarauniversity.ac.ke', country: 'Кения', countryCode: 'ke', state: null },
  { name: 'Sumy State University', domain: 'sumdu.edu.ua', country: 'Украина', countryCode: 'ua', state: null },
  { name: 'Alverno College', domain: 'alverno.edu', country: 'США', countryCode: 'us', state: null },
  { name: 'Universidad Comunera', domain: 'ucom.edu.py', country: 'Парагвай', countryCode: 'py', state: null },
  { name: 'Hemchandracharay North Gujarat University', domain: 'ngu.ac.in', country: 'Индия', countryCode: 'in', state: 'Gujarat' },
  { name: 'American University of Middle East', domain: 'aum.edu.kw', country: 'Кувейт', countryCode: 'kw', state: null },
  { name: 'Moshi University College of Cooperative and Business Studies', domain: 'muccobs.ac.tz', country: 'Танзания', countryCode: 'tz', state: null },
  { name: 'Université de Sidi-Bel-Abbès (Djillali Liabès)', domain: 'univ-sba.dz', country: 'Алжир', countryCode: 'dz', state: null },
  { name: 'Floret Global University', domain: 'floret.edu.pa', country: 'Панама', countryCode: 'pa', state: null },
  { name: 'Mzuzu University', domain: 'mzuni.ac.mw', country: 'Малави', countryCode: 'mw', state: null },
  { name: 'Reformed Theological Academy of Debrecen', domain: 'drk.hu', country: 'Венгрия', countryCode: 'hu', state: null },
  { name: 'University College Dublin', domain: 'ucd.ie', country: 'Ирландия', countryCode: 'ie', state: null },
  { name: 'Mokwon University Taejon', domain: 'mokwon.ac.kr', country: 'Южная Корея', countryCode: 'kr', state: null },
  { name: 'St. Augustine International University', domain: 'saiu.ac.ug', country: 'Уганда', countryCode: 'ug', state: null },
  { name: 'University of Oradea', domain: 'uoradea.ro', country: 'Румыния', countryCode: 'ro', state: null },
  { name: 'Université Cheikh Anta Diop', domain: 'ucad.sn', country: 'Сенегал', countryCode: 'sn', state: null },
  { name: 'Frederick University', domain: 'frederick.ac.cy', country: 'Кипр', countryCode: 'cy', state: null },
  { name: 'Universidad Panamericana de San Salvador', domain: 'upan.edu.sv', country: 'Сальвадор', countryCode: 'sv', state: null },
  { name: 'Hanoi University of Technology', domain: 'hut.edu.vn', country: 'Вьетнам', countryCode: 'vn', state: null },
  { name: 'European Institute of Education', domain: 'eieonline.com', country: 'Мальта', countryCode: 'mt', state: null },
  { name: 'University of Medicine and Pharmacology of Oradea', domain: 'oradeauniversity.com', country: 'Румыния', countryCode: 'ro', state: null },
  { name: 'Botswana International University of Science & Technology', domain: 'biust.ac.bw', country: 'Ботсвана', countryCode: 'bw', state: null },
  { name: 'Universidad Internacional de Integración de América Latina', domain: 'unival.edu.ni', country: 'Никарагуа', countryCode: 'ni', state: null },
  { name: 'Foundation University', domain: 'foundationu.com', country: 'Филиппины', countryCode: 'ph', state: 'Central Visayas' },
  { name: 'Moscow State University of Ecological Engineering', domain: 'msuie.ru', country: 'Россия', countryCode: 'ru', state: null },
  { name: 'ECAM - Institut Supérieur Industriel', domain: 'ecam.be', country: 'Бельгия', countryCode: 'be', state: null },
  { name: 'National Aviation University', domain: 'nau.edu.ua', country: 'Украина', countryCode: 'ua', state: null },
  { name: 'Global Leadership University', domain: 'glu.edu.mn', country: 'Монголия', countryCode: 'mn', state: null },
  { name: 'Holar University College', domain: 'holar.is', country: 'Исландия', countryCode: 'is', state: null },
  { name: 'Anurag University', domain: 'anurag.edu.in', country: 'Индия', countryCode: 'in', state: null },
  { name: 'Universidade Metropolitana de Angola', domain: 'unimetroangola.com', country: 'Ангола', countryCode: 'ao', state: null },
  { name: 'Prairie State College', domain: 'prairiestate.edu', country: 'США', countryCode: 'us', state: null },
  { name: 'Université de Cocody', domain: 'univ-cocody.ci', country: 'Кот-д\'Ивуар', countryCode: 'ci', state: null },
  { name: 'University of Ljubljana', domain: 'uni-lj.si', country: 'Словения', countryCode: 'si', state: null },
  { name: 'University of Health Sciences Antigua', domain: 'uhsa.ag', country: 'Antigua and Barbuda', countryCode: 'ag', state: null },
  { name: 'Kawamura Gakuen Woman\'s University', domain: 'kgwu.ac.jp', country: 'Япония', countryCode: 'jp', state: null },
  { name: 'Université de Lomé', domain: 'univ-lome.tg', country: 'Того', countryCode: 'tg', state: null },
  { name: 'The Chinese University of Hong Kong', domain: 'cuhk.edu.hk', country: 'Гонконг', countryCode: 'hk', state: null },
  { name: 'University of Jazeera', domain: 'uojazeera.com', country: 'ОАЭ', countryCode: 'ae', state: null },
  { name: 'Escuela Colombiana de Carreras Industriales', domain: 'ecci.edu.co', country: 'Колумбия', countryCode: 'co', state: null },
  { name: 'Metropolitan University', domain: 'metropolitan.edu.rs', country: 'Сербия', countryCode: 'rs', state: null },
  { name: 'Technical University of Bialystok', domain: 'pb.bialystok.pl', country: 'Польша', countryCode: 'pl', state: null },
  { name: 'Universidad Americana', domain: 'uamericana.edu.py', country: 'Парагвай', countryCode: 'py', state: null },
  { name: 'Brno University of Technology', domain: 'vutbr.cz', country: 'Чехия', countryCode: 'cz', state: null },
  { name: 'Alfaisal University', domain: 'alfaisal.edu', country: 'Саудовская Аравия', countryCode: 'sa', state: 'Riyadh' },
  { name: 'Rusangu University', domain: 'rusangu-university.edu.zm', country: 'Замбия', countryCode: 'zm', state: null },
  { name: 'Université du Burundi', domain: 'ub.edu.bi', country: 'Бурунди', countryCode: 'bi', state: null },
  { name: 'Kashan University of Medical Sciences', domain: 'kaums.ac.ir', country: 'Иран', countryCode: 'ir', state: 'Isfahan' },
  { name: 'College of Technology at Dammam', domain: 'dct.gotevot.edu.sa', country: 'Саудовская Аравия', countryCode: 'sa', state: 'Dammam' },
  { name: 'Adiyaman University', domain: 'adiyaman.edu.tr', country: 'Турция', countryCode: 'tr', state: null },
  { name: 'Galillee College', domain: 'galilcol.ac.il', country: 'Израиль', countryCode: 'il', state: null },
  { name: 'Fachhochschule Furtwangen, Hochschule für Technik und Wirtschaft', domain: 'fh-furtwangen.de', country: 'Германия', countryCode: 'de', state: null },
  { name: 'Dilla University', domain: 'dillauniversity.edu.et', country: 'Эфиопия', countryCode: 'et', state: null },
  { name: 'Mongolian State University of Arts and Culture', domain: 'msuac.edu.mn', country: 'Монголия', countryCode: 'mn', state: null },
  { name: 'Jordan Academy of Music / Higher Institute of Music', domain: 'jam.edu.jo', country: 'Иордания', countryCode: 'jo', state: null },
  { name: 'Universidad Mariano Egaña', domain: 'ume.cl', country: 'Чили', countryCode: 'cl', state: null },
  { name: 'Ho Chi Minh City University of Law', domain: 'hcmulaw.edu.vn', country: 'Вьетнам', countryCode: 'vn', state: null },
  { name: 'Odlar Yurdu University', domain: 'oyu.edu.az', country: 'Азербайджан', countryCode: 'az', state: null },
  { name: 'Link Campus University of Malta', domain: 'unilink.it', country: 'Италия', countryCode: 'it', state: null },
  { name: 'Hotelschool The Hague', domain: 'hotelschool.nl', country: 'Нидерланды', countryCode: 'nl', state: null },
  { name: 'University Goce Delcev', domain: 'ugd.edu.mk', country: 'Северная Македония', countryCode: 'mk', state: null },
  { name: 'Tartu Health Care College', domain: 'nooruse.ee', country: 'Эстония', countryCode: 'ee', state: null },
  { name: 'Katholische Fachhochschule Freiburg, Hochschule für Sozialwesen, Religionspädagogik und Pflege', domain: 'kfh-freiburg.de', country: 'Германия', countryCode: 'de', state: null },
  { name: 'Université Lumière de Bujumbura', domain: 'ulbu.bi', country: 'Бурунди', countryCode: 'bi', state: null },
  { name: 'The Kingdom University', domain: 'ku.edu.bh', country: 'Бахрейн', countryCode: 'bh', state: null },
  { name: 'Université de Guelma', domain: 'univ-guelma.dz', country: 'Алжир', countryCode: 'dz', state: null },
  { name: 'Crimea State Medical University', domain: 'crsmu.com', country: 'Украина', countryCode: 'ua', state: null },
  { name: 'Kuwait Maastricht Business School', domain: 'kmbs.edu.kw', country: 'Кувейт', countryCode: 'kw', state: null },
  { name: 'University of World Economy and Diplomacy', domain: 'uwed.uz', country: 'Узбекистан', countryCode: 'uz', state: null },
  { name: 'University of Technical Education Ho Chi Minh City', domain: 'hcmute.edu.vn', country: 'Вьетнам', countryCode: 'vn', state: null },
  { name: 'Dirección General de Institutos Tecnológicos', domain: 'dgit.gob.mx', country: 'Мексика', countryCode: 'mx', state: null },
  { name: 'Beder University', domain: 'beder.edu.al', country: 'Албания', countryCode: 'al', state: null },
  { name: 'Wesleyan University Philippines', domain: 'wesleyan.edu.ph', country: 'Филиппины', countryCode: 'ph', state: 'Central Luzon' },
  { name: 'International University for Graduate Studies', domain: 'iugrad.edu.kn', country: 'Сент-Китс и Невис', countryCode: 'kn', state: null },
  { name: 'Torrens University Australia', domain: 'torrens.edu.au', country: 'Австралия', countryCode: 'au', state: 'South Australia' },
  { name: 'Universidad Nacional Pedro Henríquez Ureña', domain: 'unphu.edu.do', country: 'Доминиканская Республика', countryCode: 'do', state: null },
  { name: 'Tabari Institute of Higher Education', domain: 'tabari.ac.ir', country: 'Иран', countryCode: 'ir', state: 'Mazandaran' },
  { name: 'University of Belize', domain: 'ub.edu.bz', country: 'Белиз', countryCode: 'bz', state: null },
  { name: 'Arabian Gulf University', domain: 'agu.edu.bh', country: 'Бахрейн', countryCode: 'bh', state: null },
  { name: 'Beni Suef University', domain: 'bsu.edu.eg', country: 'Египет', countryCode: 'eg', state: null },
  { name: 'Budapest Business School', domain: 'uni-bge.hu', country: 'Венгрия', countryCode: 'hu', state: null },
  { name: 'University of Grigol Robakidze', domain: 'gruni.edu.ge', country: 'Грузия', countryCode: 'ge', state: null },
  { name: 'University of Zambia', domain: 'unza.zm', country: 'Замбия', countryCode: 'zm', state: null },
  { name: 'Aletheia University', domain: 'au.edu.tw', country: 'Тайвань', countryCode: 'tw', state: null },
  { name: 'New World University', domain: 'newworld.ac', country: 'Доминика', countryCode: 'dm', state: null },
  { name: 'Greenford International University', domain: 'giuedu.bz', country: 'Белиз', countryCode: 'bz', state: null },
  { name: 'University College of Applied Sciences', domain: 'ucas.edu.ps', country: 'Палестина', countryCode: 'ps', state: null },
  { name: 'Université de Bangui', domain: 'univ-bangui.net', country: 'ЦАР', countryCode: 'cf', state: null },
  { name: 'Divine Word University', domain: 'dwu.ac.pg', country: 'Папуа — Новая Гвинея', countryCode: 'pg', state: null },
  { name: 'Kashan University', domain: 'kashanu.ac.ir', country: 'Иран', countryCode: 'ir', state: 'Isfahan' },
  { name: 'Macau University of Science and Technology', domain: 'must.edu.mo', country: 'Макао', countryCode: 'mo', state: null },
  { name: 'Universidad Fermin Toro', domain: 'uft.edu.ve', country: 'Венесуэла', countryCode: 've', state: null },
  { name: 'Slobomir P Univerzitet', domain: 'spu.ba', country: 'Босния и Герцеговина', countryCode: 'ba', state: null },
  { name: 'University of Livingstonia', domain: 'ulivingstonia.com', country: 'Малави', countryCode: 'mw', state: null },
  { name: 'Universidade Federal de Alagoas', domain: 'ufal.br', country: 'Бразилия', countryCode: 'br', state: null },
  { name: 'United States International University', domain: 'usiu.ac.ke', country: 'Кения', countryCode: 'ke', state: null },
  { name: 'Shahid Beheshti University', domain: 'sbu.ac.ir', country: 'Иран', countryCode: 'ir', state: 'Tehran' },
  { name: 'Université d\'Antananarivo', domain: 'univ-antananarivo.mg', country: 'Мадагаскар', countryCode: 'mg', state: null },
  { name: 'Universidad Tecnológica América', domain: 'unita.edu.ec', country: 'Эквадор', countryCode: 'ec', state: null },
  { name: 'Kharkiv State Technical University of Construction and Architecture', domain: 'kstuca.kharkov.ua', country: 'Украина', countryCode: 'ua', state: null },
  { name: 'Karabakh University', domain: 'qu.edu.az', country: 'Азербайджан', countryCode: 'az', state: null },
  { name: 'Universität Kaiserslautern', domain: 'uni-kl.de', country: 'Германия', countryCode: 'de', state: null },
  { name: 'Universidad de Valparaiso', domain: 'uv.cl', country: 'Чили', countryCode: 'cl', state: null },
  { name: 'University of the Faroe Islands', domain: 'setur.fo', country: 'Faroe Islands', countryCode: 'fo', state: null },
  { name: 'Franklin College Switzerland', domain: 'fc.edu', country: 'Швейцария', countryCode: 'ch', state: null },
  { name: 'Yuksek ihtisas University', domain: 'yuksekihtisasuniversitesi.edu.tr', country: 'Турция', countryCode: 'tr', state: null },
  { name: 'Universidad de Cartago Florencio del Castillo', domain: 'uca.ac.cr', country: 'Коста-Рика', countryCode: 'cr', state: null },
  { name: 'City University Programs in Bulgaria', domain: 'cityu.bg', country: 'Болгария', countryCode: 'bg', state: null },
  { name: 'Universidad de Ciencias de la Informatica', domain: 'ucinf.cl', country: 'Чили', countryCode: 'cl', state: null },
  { name: 'Ecole Nationale Supérieure en Electrotechnique, Electronique, Informatique et Hydraulique de Toulouse', domain: 'enseeiht.fr', country: 'Франция', countryCode: 'fr', state: null },
  { name: 'Damascus University', domain: 'damascusuniversity.edu.sy', country: 'Сирия', countryCode: 'sy', state: null },
  { name: 'Keele University', domain: 'keele.ac.uk', country: 'Великобритания', countryCode: 'gb', state: null },
  { name: 'Singidunum University', domain: 'singidunum.edu.rs', country: 'Сербия', countryCode: 'rs', state: null },
  { name: 'Universidad del Cono Sur de las Américas', domain: 'ucsa.edu.py', country: 'Парагвай', countryCode: 'py', state: null },
  { name: 'Universitas Nasional Pasim', domain: 'pasim.ac.id', country: 'Индонезия', countryCode: 'id', state: null },
  { name: 'European University Cyprus', domain: 'euc.ac.cy', country: 'Кипр', countryCode: 'cy', state: null },
  { name: 'Lovely Professional University', domain: 'lpu.in', country: 'Индия', countryCode: 'in', state: 'Punjab' },
  { name: 'University of Macau', domain: 'um.edu.mo', country: 'Макао', countryCode: 'mo', state: null },
  { name: 'Université Alioune Diop de Bambey', domain: 'bambey.univ.sn', country: 'Сенегал', countryCode: 'sn', state: null },
  { name: 'Kyambogo University', domain: 'kyu.ac.ug', country: 'Уганда', countryCode: 'ug', state: null },
  { name: 'National Central University', domain: 'ncu.edu.tw', country: 'Тайвань', countryCode: 'tw', state: null },
  { name: 'International Kazakh-Turkish University', domain: 'turkistan.kz', country: 'Казахстан', countryCode: 'kz', state: null },
  { name: 'Université Catholique de Bukavu', domain: 'ucbukavu.ac.cd', country: 'ДР Конго', countryCode: 'cd', state: null },
  { name: 'Uppsala University', domain: 'uu.se', country: 'Швеция', countryCode: 'se', state: null },
  { name: 'Universidad Católica Nordestana', domain: 'ucne.edu.do', country: 'Доминиканская Республика', countryCode: 'do', state: null },
  { name: 'Suan Dusit Rajabhat University', domain: 'dusit.ac.th', country: 'Таиланд', countryCode: 'th', state: 'Bangkok' },
  { name: 'Moscow State University of Forestry Engineering', domain: 'mgul.ac.ru', country: 'Россия', countryCode: 'ru', state: null },
  { name: 'University of Technology', domain: 'utm.ac.mu', country: 'Маврикий', countryCode: 'mu', state: null },
  { name: 'Universidade Tecnica de Angola', domain: 'utanga.co.ao', country: 'Ангола', countryCode: 'ao', state: null },
  { name: 'Samarkand State University', domain: 'samdu.uz', country: 'Узбекистан', countryCode: 'uz', state: null },
  { name: 'Umutara Polytechnic', domain: 'umutarapolytech.ac.rw', country: 'Руанда', countryCode: 'rw', state: null },
  { name: 'Instituts Supérieurs des Etudes Technologiques', domain: 'isetr.rnu.tn', country: 'Тунис', countryCode: 'tn', state: null },
  { name: 'Universidad de Managua (U de M)', domain: 'udem.edu.ni', country: 'Никарагуа', countryCode: 'ni', state: null },
  { name: 'Bamenda University of Science & Technology', domain: 'bamendauniversity.com', country: 'Камерун', countryCode: 'cm', state: null },
  { name: 'University of Oslo', domain: 'uio.no', country: 'Норвегия', countryCode: 'no', state: null },
  { name: 'Université d\'Alger 3', domain: 'univ-alger3.dz', country: 'Алжир', countryCode: 'dz', state: null },
  { name: 'Universidad Agroforestal Fernando A.Meriño', domain: 'uafam.edu.do', country: 'Доминиканская Республика', countryCode: 'do', state: null },
  { name: 'University of Wroclaw', domain: 'uni.wroc.pl', country: 'Польша', countryCode: 'pl', state: null },
  { name: 'Alahgaff University', domain: 'ahgaff.edu', country: 'Йемен', countryCode: 'ye', state: null },
  { name: 'Royal University of Law and Economics', domain: 'rule.edu.kh', country: 'Камбоджа', countryCode: 'kh', state: null },
  { name: 'Ecole National d\'Agriculture de Meknes', domain: 'enameknes.ac.ma', country: 'Марокко', countryCode: 'ma', state: null },
  { name: 'Ventspils University of Applied Sciences', domain: 'venta.lv', country: 'Латвия', countryCode: 'lv', state: null },
  { name: 'Saint Louis College', domain: 'slc-sflu.edu.ph', country: 'Филиппины', countryCode: 'ph', state: 'Cordillera Administrative Region' },
  { name: 'University of Derby', domain: 'derby.ac.uk', country: 'Великобритания', countryCode: 'gb', state: null },
  { name: 'University of Salerno', domain: 'unisa.it', country: 'Италия', countryCode: 'it', state: null },
  { name: 'Majmaah University', domain: 'mu.edu.sa', country: 'Саудовская Аравия', countryCode: 'sa', state: 'Al Majma\'ah' },
  { name: 'University of Constanta', domain: 'univ-ovidius.ro', country: 'Румыния', countryCode: 'ro', state: null },
  { name: 'Mingechevir State University', domain: 'mdu.edu.az', country: 'Азербайджан', countryCode: 'az', state: null },
  { name: 'Law University of Bratislava', domain: 'uninova.sk', country: 'Словакия', countryCode: 'sk', state: null },
  { name: 'Université de Ziguinchor', domain: 'univ-zig.sn', country: 'Сенегал', countryCode: 'sn', state: null },
  { name: 'Budapest Buddhist University', domain: 'tkbf.hu', country: 'Венгрия', countryCode: 'hu', state: null },
  { name: 'Universidade Lusíada de Angola', domain: 'ulangola.net', country: 'Ангола', countryCode: 'ao', state: null },
  { name: 'World Maritime University', domain: 'wmu.se', country: 'Швеция', countryCode: 'se', state: null },
  { name: 'Makanlal Chutur Vedi University', domain: 'mcu.ac.in', country: 'Индия', countryCode: 'in', state: null },
  { name: 'Université d\'Antsiranana', domain: 'univ-antsiranana.mg', country: 'Мадагаскар', countryCode: 'mg', state: null },
  { name: 'Graduate School of Business Administration Zurich (GSBA Zurich)', domain: 'gsba.ch', country: 'Швейцария', countryCode: 'ch', state: null },
  { name: 'National Institute of Education', domain: 'ine.edu.kh', country: 'Камбоджа', countryCode: 'kh', state: null },
  { name: 'Chiang Mai Vocational College', domain: 'cmvc.ac.th', country: 'Таиланд', countryCode: 'th', state: 'Chiang Mai' },
  { name: 'University of Kragujevac', domain: 'kg.ac.rs', country: 'Сербия', countryCode: 'rs', state: null },
  { name: 'University North', domain: 'unin.hr', country: 'Хорватия', countryCode: 'hr', state: null },
  { name: 'Institut Supérieure d\'Electronique de Paris', domain: 'isep.fr', country: 'Франция', countryCode: 'fr', state: null },
  { name: 'London Interdisciplinary School', domain: 'lis.ac.uk', country: 'Великобритания', countryCode: 'gb', state: null },
  { name: 'Universidad de Puerto Rico, Mayaguez', domain: 'uprm.edu', country: 'Пуэрто-Рико', countryCode: 'pr', state: null },
  { name: 'Zia-ud-Din University', domain: 'zu.edu.pk', country: 'Пакистан', countryCode: 'pk', state: null },
  { name: 'University of Gastronomic Sciences', domain: 'unisg.it', country: 'Италия', countryCode: 'it', state: null },
  { name: 'Srinakharinwirot University', domain: 'swu.ac.th', country: 'Таиланд', countryCode: 'th', state: 'Bangkok' },
  { name: 'University of the Assumption', domain: 'ua.edu.ph', country: 'Филиппины', countryCode: 'ph', state: 'Central Luzon' },
  { name: 'University of Malawi | Old', domain: 'unima.mw', country: 'Малави', countryCode: 'mw', state: null },
  { name: 'Athenaeum Pontificium Regina Apostolorum', domain: 'upra.org', country: 'Holy See (Vatican City State)', countryCode: 'va', state: null },
  { name: 'Third University of Rome', domain: 'uniroma3.it', country: 'Италия', countryCode: 'it', state: null },
  { name: 'Tallinn University', domain: 'tlu.ee', country: 'Эстония', countryCode: 'ee', state: null },
  { name: 'University of Papua New Guinea', domain: 'upng.ac.pg', country: 'Папуа — Новая Гвинея', countryCode: 'pg', state: null },
  { name: 'Southwest Forestry University', domain: 'swfc.edu.cn', country: 'Китай', countryCode: 'cn', state: null },
  { name: 'Faculdades Integradas UPIS', domain: 'upis.br', country: 'Бразилия', countryCode: 'br', state: null },
  { name: 'Sinop University', domain: 'sinop.edu.tr', country: 'Турция', countryCode: 'tr', state: null },
  { name: 'Adventist University of Central Africa', domain: 'auca.ac.rw', country: 'Руанда', countryCode: 'rw', state: null },
  { name: 'Kigali Institute of Science & Technology', domain: 'kist.ac.rw', country: 'Руанда', countryCode: 'rw', state: null },
  { name: 'Norton University', domain: 'norton.edu.kh', country: 'Камбоджа', countryCode: 'kh', state: null },
  { name: 'Universidad Central del Caribe', domain: 'uccaribe.edu', country: 'Пуэрто-Рико', countryCode: 'pr', state: null },
  { name: 'Óbuda University', domain: 'uni-obuda.hu', country: 'Венгрия', countryCode: 'hu', state: null },
  { name: 'The University of Olivet', domain: 'olivetcollege.edu', country: 'США', countryCode: 'us', state: 'Michigan' },
  { name: 'Waterford Institute Of Technology', domain: 'wit.ie', country: 'Ирландия', countryCode: 'ie', state: null },
  { name: 'Isfahan University', domain: 'ui.ac.ir', country: 'Иран', countryCode: 'ir', state: 'Isfahan' },
  { name: 'University of Portharcourt', domain: 'uniport.edu.ng', country: 'Нигерия', countryCode: 'ng', state: null },
  { name: 'Mohammad Ali Jinnah University, Karachi', domain: 'jinnah.edu', country: 'Пакистан', countryCode: 'pk', state: null },
  { name: 'University of Macedonia', domain: 'uom.gr', country: 'Греция', countryCode: 'gr', state: 'Macedonia' },
  { name: 'Giresun University', domain: 'giresun.edu.tr', country: 'Турция', countryCode: 'tr', state: 'Giresun' },
  { name: 'Liaquat University of Medical & Health Sciences Jamshoro', domain: 'lumhs.edu.pk', country: 'Пакистан', countryCode: 'pk', state: null },
  { name: 'The University of Sheffield', domain: 'shef.ac.uk', country: 'Великобритания', countryCode: 'gb', state: null },
  { name: 'Universum College', domain: 'universum-ks.org', country: 'Косово', countryCode: 'xk', state: null },
  { name: 'Orkhon University', domain: 'orkhon.edu.mn', country: 'Монголия', countryCode: 'mn', state: null },
  { name: 'Baker College', domain: 'baker.edu', country: 'США', countryCode: 'us', state: null },
  { name: 'Fachhochschule Stuttgart, Hochschule der Medien', domain: 'hdm-stuttgart.de', country: 'Германия', countryCode: 'de', state: null },
  { name: 'Kessben College', domain: 'kc.edu.gh', country: 'Гана', countryCode: 'gh', state: null },
  { name: 'ICFAI University, Dehradun', domain: 'iudehradun.edu.in', country: 'Индия', countryCode: 'in', state: 'Dehradun' },
  { name: 'American School of Bahrain', domain: 'asb.bh', country: 'Бахрейн', countryCode: 'bh', state: null },
  { name: 'Royal University of Phnom Penh', domain: 'rupp.edu.kh', country: 'Камбоджа', countryCode: 'kh', state: null },
  { name: 'Universidad de San José', domain: 'universidadsanjosecr.com', country: 'Коста-Рика', countryCode: 'cr', state: null },
  { name: 'Arab Open University, Kuwait Branch', domain: 'aou.edu.kw', country: 'Кувейт', countryCode: 'kw', state: null },
  { name: 'State University of Tetova', domain: 'unite.edu.mk', country: 'Северная Македония', countryCode: 'mk', state: null },
  { name: 'Universidad Carlos III de Madrid', domain: 'uc3m.es', country: 'Испания', countryCode: 'es', state: null },
  { name: 'Vlerick Brussels Campus', domain: 'vlerick.com', country: 'Бельгия', countryCode: 'be', state: null },
  { name: 'Universidad Interamericana de Puerto Rico', domain: 'inter.edu', country: 'Пуэрто-Рико', countryCode: 'pr', state: null },
  { name: 'Universidad ORT Uruguay', domain: 'ort.edu.uy', country: 'Уругвай', countryCode: 'uy', state: null },
  { name: 'Université de Thiès', domain: 'univ-thies.sn', country: 'Сенегал', countryCode: 'sn', state: null },
  { name: 'Siebold University of Nagasaki', domain: 'sun.ac.jp', country: 'Япония', countryCode: 'jp', state: null },
  { name: 'Universidad de la Integración de las Americas (UNIDAD)', domain: 'unida.edu.py', country: 'Парагвай', countryCode: 'py', state: null },
  { name: 'National Academy of Arts', domain: 'nha-bg.org', country: 'Болгария', countryCode: 'bg', state: null },
  { name: 'European International University', domain: 'europeaniu.org', country: 'Бельгия', countryCode: 'be', state: null },
  { name: 'Kwara State Polytecnic', domain: 'kwarapoly.edu.ng', country: 'Нигерия', countryCode: 'ng', state: null },
  { name: 'Academy of Economic Studies of Moldova', domain: 'ase.md', country: 'Молдова', countryCode: 'md', state: null },
  { name: 'Universidad Nacional del Altiplano', domain: 'unap.edu.pe', country: 'Перу', countryCode: 'pe', state: null },
  { name: 'Seoul Jangsin University', domain: 'sjs.ac.kr', country: 'Южная Корея', countryCode: 'kr', state: null },
  { name: 'Univesidade Agostinho Neto', domain: 'uan.ao', country: 'Ангола', countryCode: 'ao', state: null },
  { name: 'Universidad La Gran Colombia', domain: 'ugrancolombia.edu.co', country: 'Колумбия', countryCode: 'co', state: null },
  { name: 'Ecole Mohammadia d\'Ingénieurs', domain: 'emi.ac.ma', country: 'Марокко', countryCode: 'ma', state: null },
  { name: 'Addis Ababa University', domain: 'aau.edu.et', country: 'Эфиопия', countryCode: 'et', state: null },
  { name: 'Estonian University of Life Sciences', domain: 'emu.ee', country: 'Эстония', countryCode: 'ee', state: null },
  { name: 'Botswana Accountancy College', domain: 'bac.ac.bw', country: 'Ботсвана', countryCode: 'bw', state: null },
  { name: 'Williamsburg Technical College', domain: 'wiltech.edu', country: 'США', countryCode: 'us', state: null },
  { name: 'An-Najah National University', domain: 'najah.edu', country: 'Палестина', countryCode: 'ps', state: null },
  { name: 'Balamand University', domain: 'balamand.edu.lb', country: 'Ливан', countryCode: 'lb', state: null },
  { name: 'American University of Armenia', domain: 'aua.am', country: 'Армения', countryCode: 'am', state: null },
  { name: 'Purbanchal University', domain: 'purbuniv.edu.np', country: 'Непал', countryCode: 'np', state: 'Koshi' },
  { name: 'National University of Management', domain: 'num.edu.kh', country: 'Камбоджа', countryCode: 'kh', state: null },
  { name: 'University of Auckland', domain: 'auckland.ac.nz', country: 'Новая Зеландия', countryCode: 'nz', state: 'Auckland' },
  { name: 'Brandon University', domain: 'brandonu.ca', country: 'Канада', countryCode: 'ca', state: 'Manitoba' },
  { name: 'Institute of Management and Business Technology', domain: 'imbt.ma', country: 'Марокко', countryCode: 'ma', state: null },
  { name: 'Yanbu Technical Institute', domain: 'yti.edu.sa', country: 'Саудовская Аравия', countryCode: 'sa', state: 'Yanbu' },
  { name: 'University of Hargeisa', domain: 'hargeisauniversity.net', country: 'Сомали', countryCode: 'so', state: null },
  { name: 'Technische Hochschule Ingolstadt', domain: 'thi.de', country: 'Германия', countryCode: 'de', state: null },
  { name: 'Baghdad College of Pharmacy', domain: 'bpc.edu.iq', country: 'Ирак', countryCode: 'iq', state: null },
  { name: 'Universidad Industrial de Santander', domain: 'uis.edu.co', country: 'Колумбия', countryCode: 'co', state: null },
  { name: 'Tbilisi State Medical University', domain: 'tsmu.edu', country: 'Грузия', countryCode: 'ge', state: null },
  { name: 'Ghana Institute of Management and Public Administration (GIMPA)', domain: 'gimpa.edu.gh', country: 'Гана', countryCode: 'gh', state: null },
  { name: 'The Hong Kong Polytechnic University', domain: 'polyu.edu.hk', country: 'Гонконг', countryCode: 'hk', state: null },
  { name: 'Hochschule für Jüdische Studien Heidelberg', domain: 'hjs.uni-heidelberg.de', country: 'Германия', countryCode: 'de', state: null },
  { name: 'Swedish School of Economics and Business Administration, Finland', domain: 'shh.fi', country: 'Финляндия', countryCode: 'fi', state: null },
  { name: 'Belarusian State Medical University', domain: 'bsmu.by', country: 'Беларусь', countryCode: 'by', state: null },
  { name: 'Modern University For Technology and Information', domain: 'mti.edu.eg', country: 'Египет', countryCode: 'eg', state: null },
  { name: 'Universidad del Aconcagua', domain: 'uda.edu.ar', country: 'Аргентина', countryCode: 'ar', state: null },
  { name: 'National Taipei College of Nursing', domain: 'ntcn.edu.tw', country: 'Тайвань', countryCode: 'tw', state: null },
  { name: 'Universidad Rural de Guatemala', domain: 'urural.edu.gt', country: 'Гватемала', countryCode: 'gt', state: null },
  { name: 'South East European University', domain: 'seeu.edu.mk', country: 'Северная Македония', countryCode: 'mk', state: null },
  { name: 'Université de Kinshasa', domain: 'unikin.cd', country: 'ДР Конго', countryCode: 'cd', state: null },
  { name: 'Baghlan University', domain: 'baghlan.edu.af', country: 'Афганистан', countryCode: 'af', state: null },
  { name: 'Cyryx College', domain: 'cyryxcollege.edu.mv', country: 'Мальдивы', countryCode: 'mv', state: null },
  { name: 'Universidad Maimónides', domain: 'maimonides.edu.ar', country: 'Аргентина', countryCode: 'ar', state: 'Ciudad Autónoma de Buenos Aires' },
  { name: 'Université du Québec en Outaouais', domain: 'uqo.ca', country: 'Канада', countryCode: 'ca', state: 'Quebec' },
  { name: 'Universidad Tecnológica de Santiago', domain: 'utesa.edu', country: 'Доминиканская Республика', countryCode: 'do', state: null },
  { name: 'West Coast University (WCU)', domain: 'westcoastuniversity-edu.com', country: 'Панама', countryCode: 'pa', state: null },
  { name: 'University of Seychelles', domain: 'unisey.ac.sc', country: 'Сейшелы', countryCode: 'sc', state: null },
  { name: 'Universidad Alas Peruanas', domain: 'uap.edu.pe', country: 'Перу', countryCode: 'pe', state: null },
  { name: 'UNESCO-IHE Institute for Water Education', domain: 'unesco-ihe.org', country: 'Нидерланды', countryCode: 'nl', state: null },
  { name: 'Yerevan Haibusak University', domain: 'haybusak.org', country: 'Армения', countryCode: 'am', state: null },
  { name: 'The College of The Bahamas', domain: 'cob.edu.bs', country: 'Багамы', countryCode: 'bs', state: null },
  { name: 'University of Zululand', domain: 'unizulu.ac.za', country: 'ЮАР', countryCode: 'za', state: 'KwaZulu-Natal' },
  { name: 'Karatay University', domain: 'karatay.edu.tr', country: 'Турция', countryCode: 'tr', state: null },
  { name: 'Ummah University', domain: 'uou.edu.ps', country: 'Палестина', countryCode: 'ps', state: null },
  { name: 'Donetsk National Technical University', domain: 'donntu.edu.ua', country: 'Украина', countryCode: 'ua', state: null },
  { name: 'Universidad de San Pedro Sula', domain: 'usps.edu.hn', country: 'Гондурас', countryCode: 'hn', state: null },
  { name: 'Taiz University', domain: 'taizun.net', country: 'Йемен', countryCode: 'ye', state: null },
  { name: 'Abasyn University Peshawar', domain: 'abasyn.edu.pk', country: 'Пакистан', countryCode: 'pk', state: 'Khyber Pakhtunkhwa' },
  { name: 'Silesian School of Economics and Languages', domain: 'gallus.pl', country: 'Польша', countryCode: 'pl', state: null },
  { name: 'Universidad San Francisco Xavier', domain: 'usfx.info', country: 'Боливия', countryCode: 'bo', state: null },
  { name: 'Chuvash State University', domain: 'chuvsu.ru', country: 'Россия', countryCode: 'ru', state: null },
  { name: 'University of Nis', domain: 'ni.ac.rs', country: 'Сербия', countryCode: 'rs', state: null },
  { name: 'Columbus University', domain: 'columbus.edu', country: 'Панама', countryCode: 'pa', state: null },
  { name: 'Vytautas Magnus University', domain: 'vdu.lt', country: 'Литва', countryCode: 'lt', state: null },
  { name: 'Auckland University of Technology', domain: 'aut.ac.nz', country: 'Новая Зеландия', countryCode: 'nz', state: 'Auckland' },
  { name: 'University for Peace', domain: 'upeace.org', country: 'Коста-Рика', countryCode: 'cr', state: null },
  { name: 'Majan University College', domain: 'majancollege.edu.om', country: 'Оман', countryCode: 'om', state: null },
  { name: 'Universidad de Matanzas Camilo Cienfuegos', domain: 'umcc.cu', country: 'Куба', countryCode: 'cu', state: null },
  { name: 'Instituto Universitario de La Paz', domain: 'unipaz.edu.co', country: 'Колумбия', countryCode: 'co', state: null },
  { name: 'Cyprus College', domain: 'cycollege.ac.cy', country: 'Кипр', countryCode: 'cy', state: null },
  { name: 'Universidad Santa Maria Caracas', domain: 'usm.trompo.com', country: 'Венесуэла', countryCode: 've', state: null },
  { name: 'Czech University of Agriculture Prague', domain: 'czu.cz', country: 'Чехия', countryCode: 'cz', state: null },
  { name: 'International University of Sarajevo', domain: 'ius.edu.ba', country: 'Босния и Герцеговина', countryCode: 'ba', state: null },
  { name: 'Université des Sciences et de la Technologie d\'Oran', domain: 'univ-usto.dz', country: 'Алжир', countryCode: 'dz', state: null },
  { name: 'Universidad Isaac Newton', domain: 'usin.edu.sv', country: 'Сальвадор', countryCode: 'sv', state: null },
  { name: 'St Theresa\'s Medical University', domain: 'stmu.org', country: 'Сент-Китс и Невис', countryCode: 'kn', state: null },
  { name: 'Palestine Technical University - Kadoorie', domain: 'ptuk.edu.ps', country: 'Палестина', countryCode: 'ps', state: null },
  { name: 'China Medical College', domain: 'cmc.edu.tw', country: 'Тайвань', countryCode: 'tw', state: null },
  { name: 'American College of Greece', domain: 'acg.gr', country: 'Греция', countryCode: 'gr', state: 'Attica' },
  { name: 'Ontario College of Art and Design', domain: 'ocad.ca', country: 'Канада', countryCode: 'ca', state: 'Ontario' },
  { name: 'Hampden-Sydney College', domain: 'hsc.edu', country: 'США', countryCode: 'us', state: null },
  { name: 'University of Mostar', domain: 'sve-mo.ba', country: 'Босния и Герцеговина', countryCode: 'ba', state: null },
  { name: 'Ferghana Politechnical Institute', domain: 'ferpi.dem.ru', country: 'Узбекистан', countryCode: 'uz', state: null },
  { name: 'University of Fort Hare', domain: 'ufh.ac.za', country: 'ЮАР', countryCode: 'za', state: 'Eastern Cape Province' },
  { name: 'University of Prizren "Ukshin Hoti"', domain: 'uni-prizren.com', country: 'Косово', countryCode: 'xk', state: null },
  { name: 'The Interdisciplinary Center Herzliya', domain: 'idc.ac.il', country: 'Израиль', countryCode: 'il', state: null },
  { name: 'Boston Graduate School of Psychoanalysis', domain: 'bgsp.edu', country: 'США', countryCode: 'us', state: null },
  { name: 'University of Stavanger', domain: 'uis.no', country: 'Норвегия', countryCode: 'no', state: null },
  { name: 'Upper Nile University', domain: 'unu.edu.sd', country: 'Судан', countryCode: 'sd', state: null },
  { name: 'ESOFT Uni', domain: 'esoft.academy', country: 'Шри-Ланка', countryCode: 'lk', state: 'Western Province' },
  { name: 'University of Medicine 1, Yangon', domain: 'um1ygn.edu.mm', country: 'Мьянма', countryCode: 'mm', state: null },
  { name: 'Anton de Kom University', domain: 'uvs.edu', country: 'Суринам', countryCode: 'sr', state: null },
  { name: 'University College of Skövde', domain: 'his.se', country: 'Швеция', countryCode: 'se', state: null },
  { name: 'University of the South Pacific', domain: 'usp.ac.fj', country: 'Фиджи', countryCode: 'fj', state: null },
  { name: 'Université de Yaoundé I', domain: 'uy1.uninet.cm', country: 'Камерун', countryCode: 'cm', state: null },
  { name: 'Université Ez-Zitouna', domain: 'uz.rnu.tn', country: 'Тунис', countryCode: 'tn', state: null },
  { name: 'University of the Gambia', domain: 'utg.edu.gm', country: 'Гамбия', countryCode: 'gm', state: null },
  { name: 'Université d\'Abomey-Calavi (UAC)', domain: 'uac.bj', country: 'Бенин', countryCode: 'bj', state: null },
  { name: 'University of Aden', domain: 'adenuniversity.edu.ye', country: 'Йемен', countryCode: 'ye', state: null },
  { name: 'Central Buganda University', domain: 'cbu2000.com', country: 'Уганда', countryCode: 'ug', state: null },
  { name: 'BGC Trust University, Bangladesh', domain: 'bgctrustbd.org', country: 'Бангладеш', countryCode: 'bd', state: null },
  { name: 'International University College of Technology Twintech (IUCTT)', domain: 'iuctt.edu.my', country: 'Малайзия', countryCode: 'my', state: null },
  { name: 'Health sciences University of Mongolia', domain: 'hsum-ac.mn', country: 'Монголия', countryCode: 'mn', state: null },
  { name: 'Universidad Politécnica de El Salvador', domain: 'upes.edu.sv', country: 'Сальвадор', countryCode: 'sv', state: null },
  { name: 'Université Pierre Mendès France', domain: 'upmf-grenoble.fr', country: 'Франция', countryCode: 'fr', state: null },
  { name: 'University of Patras', domain: 'upatras.gr', country: 'Греция', countryCode: 'gr', state: 'Peloponnesus' },
  { name: 'University of Urbino', domain: 'uniurb.it', country: 'Италия', countryCode: 'it', state: null },
  { name: 'Windsor University School of Medicine', domain: 'windsor.edu', country: 'Сент-Китс и Невис', countryCode: 'kn', state: null },
  { name: 'Hadhramout University of Science and Technology', domain: 'hust.edu.ye', country: 'Йемен', countryCode: 'ye', state: null },
  { name: 'University of SS. Cyril and Methodius in Trnava', domain: 'ucm.sk', country: 'Словакия', countryCode: 'sk', state: null },
  { name: 'Sol Plaatje University', domain: 'spu.ac.za', country: 'ЮАР', countryCode: 'za', state: 'Northern Cape Province' },
  { name: 'Temasek Polytechnic', domain: 'tp.edu.sg', country: 'Сингапур', countryCode: 'sg', state: null },
  { name: 'Gulu University', domain: 'gu.ac.ug', country: 'Уганда', countryCode: 'ug', state: null },
  { name: 'University of Da Nang', domain: 'udn.vn', country: 'Вьетнам', countryCode: 'vn', state: 'Da Nang' },
  { name: 'Islamic Azad University, Yazd', domain: 'iauyazd.ac.ir', country: 'Иран', countryCode: 'ir', state: 'Yazd' },
  { name: 'Al-Buraimi University College', domain: 'buc.edu.om', country: 'Оман', countryCode: 'om', state: null },
  { name: 'National Taiwan College of the Arts', domain: 'ntca.edu.tw', country: 'Тайвань', countryCode: 'tw', state: null },
  { name: 'Escuela Agricola Panamericana Zamorano', domain: 'zamorano.edu', country: 'Гондурас', countryCode: 'hn', state: null },
  { name: 'University of Maribor', domain: 'um.si', country: 'Словения', countryCode: 'si', state: null },
  { name: 'Gulf University for Science and Technology', domain: 'gust.edu.kw', country: 'Кувейт', countryCode: 'kw', state: null },
  { name: 'Nha Trang Tourism College', domain: 'ntc.edu.vn', country: 'Вьетнам', countryCode: 'vn', state: 'Khanh Hoa' },
  { name: 'Universitas Bunda Mulia Jakarta', domain: 'ubm.ac.id', country: 'Индонезия', countryCode: 'id', state: null },
  { name: 'Mukogawa Women\'s University', domain: 'mukogawa-u.ac.jp', country: 'Япония', countryCode: 'jp', state: null },
  { name: 'Yokohama National University', domain: 'ynu.ac.jp', country: 'Япония', countryCode: 'jp', state: null },
  { name: 'Universidad Metropolitana de Asunción', domain: 'uma.edu.py', country: 'Парагвай', countryCode: 'py', state: null },
  { name: 'Dalhousie University', domain: 'dal.ca', country: 'Канада', countryCode: 'ca', state: 'Nova Scotia' },
  { name: 'Université de Toamasina', domain: 'univ-toamasina.mg', country: 'Мадагаскар', countryCode: 'mg', state: null },
  { name: 'Université Hassan II - Aïn Chock', domain: 'rectorat-uh2c.ac.ma', country: 'Марокко', countryCode: 'ma', state: null },
  { name: 'Académie de Bordeaux', domain: 'ac-bordeaux.fr', country: 'Франция', countryCode: 'fr', state: null },
  { name: 'Universidad Adventista de Bolivia', domain: 'uab.edu.bo', country: 'Боливия', countryCode: 'bo', state: null },
  { name: 'International University of Kyrgyzstan', domain: 'iuk.kg', country: 'Кыргызстан', countryCode: 'kg', state: null },
  { name: 'International Hellenic University', domain: 'ihu.gr', country: 'Греция', countryCode: 'gr', state: 'Macedonia' },
  { name: 'University of Aleppo', domain: 'alepuniv.edu.sy', country: 'Сирия', countryCode: 'sy', state: null },
  { name: 'Curtin University', domain: 'curtin.edu.au', country: 'Австралия', countryCode: 'au', state: 'Western Australia' },
  { name: 'Northwestern University In Qatar', domain: 'qatar.northwestern.edu', country: 'Катар', countryCode: 'qa', state: null },
  { name: 'St.Cyril and Methodius University', domain: 'ukim.edu.mk', country: 'Северная Македония', countryCode: 'mk', state: null },
  { name: 'Music Academy "Fryderyk Chopin" in Warszaw', domain: 'chopin.edu.pl', country: 'Польша', countryCode: 'pl', state: null },
  { name: 'Chamreun University of Poly Technology', domain: 'cup.edu.kh', country: 'Камбоджа', countryCode: 'kh', state: null },
  { name: 'Universidad del Valle de Guatemala', domain: 'uvg.edu.gt', country: 'Гватемала', countryCode: 'gt', state: null },
  { name: 'University of Split', domain: 'unist.hr', country: 'Хорватия', countryCode: 'hr', state: null },
  { name: 'Lulea University of Technology', domain: 'luth.se', country: 'Швеция', countryCode: 'se', state: null },
  { name: 'Hong Kong Chu Hai College', domain: 'chuhai.edu.hk', country: 'Гонконг', countryCode: 'hk', state: null },
  { name: 'Universität für Musik und darstellende Kunst Wien', domain: 'mdw.ac.at', country: 'Австрия', countryCode: 'at', state: null },
  { name: 'Universidad de la Cuenca del Plata', domain: 'ucp.edu.ar', country: 'Аргентина', countryCode: 'ar', state: null },
  { name: 'Institute of Business Administration Sukkur', domain: 'iba-suk.edu.pk', country: 'Пакистан', countryCode: 'pk', state: null },
  { name: 'Universidad de Iberoamérica', domain: 'unibe.ac.cr', country: 'Коста-Рика', countryCode: 'cr', state: null },
  { name: 'Institut Teknologi Adhi Tama Surabaya', domain: 'itats.ac.id', country: 'Индонезия', countryCode: 'id', state: null },
  { name: 'Al-Zaiem Al-Azhari University', domain: 'aau.edu.sd', country: 'Судан', countryCode: 'sd', state: null },
  { name: 'National University of Rwanda', domain: 'nur.ac.rw', country: 'Руанда', countryCode: 'rw', state: null },
  { name: 'University of Dodoma', domain: 'udom.ac.tz', country: 'Танзания', countryCode: 'tz', state: null },
  { name: 'Dubna International University for Nature, Society and Man', domain: 'uni-dubna.ru', country: 'Россия', countryCode: 'ru', state: null },
  { name: 'Hansei University', domain: 'hansei.ac.kr', country: 'Южная Корея', countryCode: 'kr', state: null },
  { name: 'Jewish University in Moscow', domain: 'jum.ru', country: 'Россия', countryCode: 'ru', state: null },
  { name: 'Mizan Tepi University', domain: 'mtu.edu.et', country: 'Эфиопия', countryCode: 'et', state: null },
  { name: 'University Institute of Teacher Training "Suor Orsola Benincasa"', domain: 'unisob.na.it', country: 'Италия', countryCode: 'it', state: null },
  { name: 'Universidad Francisco Gavidia', domain: 'ufg.edu.sv', country: 'Сальвадор', countryCode: 'sv', state: null },
  { name: 'Instituto Tecnológico de San Luis Potosí', domain: 'itslp.edu.mx', country: 'Мексика', countryCode: 'mx', state: null },
  { name: 'Hacettepe University', domain: 'hun.edu.tr', country: 'Турция', countryCode: 'tr', state: null },
  { name: 'Luiss Guido Carli University', domain: 'luiss.it', country: 'Италия', countryCode: 'it', state: null },
  { name: 'Escuela Bancaria y Comercial', domain: 'ebc.mx', country: 'Мексика', countryCode: 'mx', state: null },
  { name: 'Tajik Agrarian University', domain: 'tajagroun.tj', country: 'Таджикистан', countryCode: 'tj', state: null },
  { name: 'Lupane State University', domain: 'lsu.ac.zw', country: 'Зимбабве', countryCode: 'zw', state: null },
  { name: 'Carnegie Mellon University Qatar', domain: 'qatar.cmu.edu', country: 'Катар', countryCode: 'qa', state: null },
  { name: 'Istanbul Medeniyet University', domain: 'medeniyet.edu.tr', country: 'Турция', countryCode: 'tr', state: null },
  { name: 'Azerbaijan National Conservatorie', domain: 'conservatory.az', country: 'Азербайджан', countryCode: 'az', state: null },
  { name: 'SASTRA University', domain: 'sastra.edu', country: 'Индия', countryCode: 'in', state: 'Tamil Nadu' },
  { name: 'Vidzeme University College', domain: 'va.lv', country: 'Латвия', countryCode: 'lv', state: null },
  { name: 'University of Agriculture and Veterinary Medicine Timisoara', domain: 'usab-tm.ro', country: 'Румыния', countryCode: 'ro', state: null },
  { name: 'Royal University of Agriculture', domain: 'rua.edu.kh', country: 'Камбоджа', countryCode: 'kh', state: null },
  { name: 'Lampang Vocational College', domain: 'lampangvc.ac.th', country: 'Таиланд', countryCode: 'th', state: 'Lampang' },
  { name: 'National College of Art and Design', domain: 'khio.no', country: 'Норвегия', countryCode: 'no', state: null },
  { name: 'University of the Arts Singapore', domain: 'uas.edu.sg', country: 'Сингапур', countryCode: 'sg', state: null },
  { name: 'Harare Institute of Technology', domain: 'hit.ac.zw', country: 'Зимбабве', countryCode: 'zw', state: null },
  { name: 'Ghazni University', domain: 'gu.edu.af', country: 'Афганистан', countryCode: 'af', state: null },
  { name: 'Azerbaijan State University of Oil and Industry', domain: 'asoiu.edu.az', country: 'Азербайджан', countryCode: 'az', state: null },
  { name: 'Shingyeong University', domain: 'sgu.ac.kr', country: 'Южная Корея', countryCode: 'kr', state: null },
  { name: 'Université Quisqueya', domain: 'uniq.edu', country: 'Гаити', countryCode: 'ht', state: null },
  { name: 'Central Ostrobothnia University of Applied Sciences', domain: 'cou.fi', country: 'Финляндия', countryCode: 'fi', state: null },
  { name: 'Stamford University', domain: 'stamforduniversity.edu.bd', country: 'Бангладеш', countryCode: 'bd', state: null },
  { name: 'Technical University of Denmark', domain: 'dtu.dk', country: 'Дания', countryCode: 'dk', state: null },
  { name: 'Université des Antilles', domain: 'univ-antilles.fr', country: 'Guadeloupe', countryCode: 'gp', state: null },
  { name: 'Botswana Open University', domain: 'bou.ac.bw', country: 'Ботсвана', countryCode: 'bw', state: null },
  { name: 'University of El Imam El Mahdi University', domain: 'elmahdi.edu.sd', country: 'Судан', countryCode: 'sd', state: null },
  { name: 'Universidad Empresarial Mateo Kuljis', domain: 'unikuljis.edu.bo', country: 'Боливия', countryCode: 'bo', state: null },
  { name: 'Université de Dschang', domain: 'univ-dschang.org', country: 'Камерун', countryCode: 'cm', state: null },
  { name: 'Nyenrode Business University', domain: 'nyenrode.nl', country: 'Нидерланды', countryCode: 'nl', state: null },
  { name: 'Universidade Eduardo Mondlane', domain: 'uem.mz', country: 'Мозамбик', countryCode: 'mz', state: null },
  { name: 'University of South Bohemia', domain: 'jcu.cz', country: 'Чехия', countryCode: 'cz', state: null },
  { name: 'Universidad Metropolitana de Honduras', domain: 'unimetro.edu.hn', country: 'Гондурас', countryCode: 'hn', state: null },
  { name: 'Centro de Estudios Universitarios Monterrey', domain: 'ceu.edu.mx', country: 'Мексика', countryCode: 'mx', state: null },
  { name: 'Sapporo University', domain: 'sapporo-u.ac.jp', country: 'Япония', countryCode: 'jp', state: null },
  { name: 'HfH – University of Applied Sciences of Special Needs Education', domain: 'hfh.ch', country: 'Швейцария', countryCode: 'ch', state: null },
  { name: 'Moldova State University', domain: 'usm.md', country: 'Молдова', countryCode: 'md', state: null },
  { name: 'Universidad Autónoma de Las Américas', domain: 'uam.edu.co', country: 'Колумбия', countryCode: 'co', state: null },
  { name: 'Abylai Khan University', domain: 'ablaikhan.kz', country: 'Казахстан', countryCode: 'kz', state: null },
  { name: 'Universitas 17 Agustus 1945 Samarinda', domain: 'untag-smd.ac.id', country: 'Индонезия', countryCode: 'id', state: null },
  { name: 'Université Shalom de Bunia', domain: 'unishabunia.org', country: 'ДР Конго', countryCode: 'cd', state: null },
  { name: 'Turība University', domain: 'turiba.lv', country: 'Латвия', countryCode: 'lv', state: null },
  { name: 'Université Abdou Moumouni de Niamey', domain: 'uam.refer.ne', country: 'Нигер', countryCode: 'ne', state: null },
  { name: 'Puntland State University', domain: 'puntlandstateuniversity.com', country: 'Сомали', countryCode: 'so', state: null },
  { name: 'University of Southern Denmark - SDU', domain: 'sdu.dk', country: 'Дания', countryCode: 'dk', state: null },
  { name: 'Huaqiao University Quanzhuo', domain: 'hqu.edu.cn', country: 'Китай', countryCode: 'cn', state: null },
  { name: 'Soutsaka Institute of Technology', domain: 'simt.edu.la', country: 'Лаос', countryCode: 'la', state: 'Vientiane' },
  { name: 'Universidade de Evora', domain: 'uevora.pt', country: 'Португалия', countryCode: 'pt', state: null },
  { name: 'University of Northern Bahr El-Ghazal', domain: 'unbeg.edu.sd', country: 'Южный Судан', countryCode: 'ss', state: null },
  { name: 'Collège de France', domain: 'college-de-france.fr', country: 'Франция', countryCode: 'fr', state: null },
  { name: 'Université de Ouagadougou', domain: 'univ-ouaga.bf', country: 'Буркина-Фасо', countryCode: 'bf', state: null },
  { name: 'Pontifcia Universitas a S.Thomas Aquinate in Urbe', domain: 'pust.urbe.it', country: 'Holy See (Vatican City State)', countryCode: 'va', state: null },
  { name: 'Université Kongo', domain: 'universitekongo.org', country: 'ДР Конго', countryCode: 'cd', state: null },
  { name: 'Tajikistan International University', domain: 'tiu.tj', country: 'Таджикистан', countryCode: 'tj', state: null },
  { name: 'Universidad Simón Bolivar', domain: 'usb.ve', country: 'Венесуэла', countryCode: 've', state: null },
  { name: 'Universitat Jaume I de Castellón', domain: 'uji.es', country: 'Испания', countryCode: 'es', state: null },
  { name: 'Hachinohe Institute of Technology', domain: 'hi-tech.ac.jp', country: 'Япония', countryCode: 'jp', state: null },
  { name: 'University of Andorra', domain: 'uda.ad', country: 'Андорра', countryCode: 'ad', state: null },
  { name: 'International Business School Kelajak ILMI', domain: 'ibs.uz', country: 'Узбекистан', countryCode: 'uz', state: null },
  { name: 'Shahputra College', domain: 'kolejshahputra.edu.my', country: 'Малайзия', countryCode: 'my', state: null },
  { name: 'Universidad Abierta y a Distancia de Panama', domain: 'unadp.ac.pa', country: 'Панама', countryCode: 'pa', state: null },
  { name: 'Duy Tan University', domain: 'duytan.edu.vn', country: 'Вьетнам', countryCode: 'vn', state: null },
  { name: 'Mogadishu University', domain: 'mogadishuuniversity.com', country: 'Сомали', countryCode: 'so', state: null },
  { name: 'University of Namibia', domain: 'unam.na', country: 'Намибия', countryCode: 'na', state: null },
  { name: 'Universidad para la Cooperación Internacional', domain: 'uci.ac.cr', country: 'Коста-Рика', countryCode: 'cr', state: null },
  { name: 'Université Ibn Toufail', domain: 'univ-ibntofail.ac.ma', country: 'Марокко', countryCode: 'ma', state: null },
  { name: 'St. Augustine University of Tanzania', domain: 'saut.ac.tz', country: 'Танзания', countryCode: 'tz', state: null },
  { name: 'City University Athens', domain: 'cityu.gr', country: 'Греция', countryCode: 'gr', state: 'Attica' },
  { name: 'Western Delta University', domain: 'wdu.edu.ng', country: 'Нигерия', countryCode: 'ng', state: null },
  { name: 'Selma University', domain: 'selmauniversity.edu', country: 'США', countryCode: 'us', state: null },
  { name: 'IBAIS University', domain: 'ibaisuniv.edu.bd', country: 'Бангладеш', countryCode: 'bd', state: null },
  { name: 'Madawalabu University', domain: 'mwu.edu.et', country: 'Эфиопия', countryCode: 'et', state: null },
  { name: 'Swedish University of Agricultural Sciences', domain: 'slu.se', country: 'Швеция', countryCode: 'se', state: null },
  { name: 'Aleksander Gieysztor School of Humanities in Pultusk', domain: 'wsh.edu.pl', country: 'Польша', countryCode: 'pl', state: null },
  { name: 'Valley View University', domain: 'vvu.edu.gh', country: 'Гана', countryCode: 'gh', state: null },
  { name: 'Punjab Agricultural University', domain: 'pau.edu', country: 'Индия', countryCode: 'in', state: 'Punjab' },
  { name: 'Malta College of Arts, Science and Technology', domain: 'mcast.edu.mt', country: 'Мальта', countryCode: 'mt', state: null },
  { name: 'University of Economics in Bratislava', domain: 'euba.sk', country: 'Словакия', countryCode: 'sk', state: null },
  { name: 'Akanu Ibiam Federal Polytechnic, Unwana', domain: 'polyunwana.net', country: 'Нигерия', countryCode: 'ng', state: null },
  { name: 'Lutheran School Of Theology In Aarhus', domain: 'teologi.dk', country: 'Дания', countryCode: 'dk', state: null },
  { name: 'B.P.Koirala Institute of Health Sciences', domain: 'bpkihs.edu', country: 'Непал', countryCode: 'np', state: 'Koshi' },
  { name: 'Victoria University of Wellington', domain: 'vuw.ac.nz', country: 'Новая Зеландия', countryCode: 'nz', state: 'Wellington' },
  { name: 'Universidad Central', domain: 'unicen.edu.bo', country: 'Боливия', countryCode: 'bo', state: null },
  { name: 'Universitas Wijaya Kusuma Surabaya', domain: 'wijayakusumasby.ac.id', country: 'Индонезия', countryCode: 'id', state: null },
  { name: 'University for Information Science and Technology "St. Paul The Apostle"', domain: 'uist.edu.mk', country: 'Северная Македония', countryCode: 'mk', state: null },
  { name: 'Dodge City Community College', domain: 'dc3.edu', country: 'США', countryCode: 'us', state: null },
  { name: 'Universidad del Sagrado Corazon', domain: 'sagrado.edu', country: 'Пуэрто-Рико', countryCode: 'pr', state: null },
  { name: 'University Malaysia Pahang', domain: 'ump.edu.my', country: 'Малайзия', countryCode: 'my', state: null },
  { name: 'Universidad Nacional de Avellaneda', domain: 'undav.edu.ar', country: 'Аргентина', countryCode: 'ar', state: 'Buenos Aires' },
  { name: 'Universidad Nacional de Chimborazo', domain: 'unach.edu.ec', country: 'Эквадор', countryCode: 'ec', state: null },
  { name: 'Al-Baath University', domain: 'albaath-univ.edu.sy', country: 'Сирия', countryCode: 'sy', state: null },
  { name: 'University of Medicine and Pharmacy of Cluj-Napoca', domain: 'umfcluj.ro', country: 'Румыния', countryCode: 'ro', state: null },
  { name: 'Zawiya University', domain: 'zu.edu.ly', country: 'Ливия', countryCode: 'ly', state: null },
  { name: 'Free University Stockholm', domain: 'stockholm-fu.com', country: 'Швеция', countryCode: 'se', state: null },
  { name: 'Yerevan State Medical University', domain: 'ysmu.am', country: 'Армения', countryCode: 'am', state: null },
  { name: 'Tiffin University Prague', domain: 'tiffinprague.cz', country: 'Чехия', countryCode: 'cz', state: null },
  { name: 'Catholic University of Malawi', domain: 'cunima.net', country: 'Малави', countryCode: 'mw', state: null },
  { name: 'Nairobi Institute of Business Studies', domain: 'nibs.ac.ke', country: 'Кения', countryCode: 'ke', state: null },
  { name: 'Ural State University of Economics', domain: 'usue.ru', country: 'Россия', countryCode: 'ru', state: null },
  { name: 'Ural Academy of Public Administration', domain: 'uapa.ru', country: 'Россия', countryCode: 'ru', state: null },
  { name: 'Bourgas Free University', domain: 'bfu.bg', country: 'Болгария', countryCode: 'bg', state: null },
  { name: 'Papua New Guinea University of Technology', domain: 'unitech.ac.pg', country: 'Папуа — Новая Гвинея', countryCode: 'pg', state: null },
  { name: 'Lingnan University', domain: 'ln.edu.hk', country: 'Гонконг', countryCode: 'hk', state: null },
  { name: 'National University of Science and Technology Bulawayo', domain: 'nust.ac.zw', country: 'Зимбабве', countryCode: 'zw', state: null },
  { name: 'University of Juba', domain: 'juba.edu.sd', country: 'Южный Судан', countryCode: 'ss', state: null },
  { name: 'Western Galilee College', domain: 'wgalil.ac.il', country: 'Израиль', countryCode: 'il', state: null },
  { name: 'Universidad Salvadorena "Alberto Masferrer"', domain: 'usam.edu.sv', country: 'Сальвадор', countryCode: 'sv', state: null },
  { name: 'Escuela Militar de Ingeniería', domain: 'emi.edu.bo', country: 'Боливия', countryCode: 'bo', state: null },
  { name: 'Greenheart Medical School', domain: 'greenheartmed.org', country: 'Гайана', countryCode: 'gy', state: null },
  { name: 'Maldives National University', domain: 'mnu.edu.mv', country: 'Мальдивы', countryCode: 'mv', state: null },
  { name: 'Zenith University College', domain: 'zucghana.org', country: 'Гана', countryCode: 'gh', state: null },
  { name: 'Tokyo University of Information Sciences', domain: 'tuis.ac.jp', country: 'Япония', countryCode: 'jp', state: null },
  { name: 'Institute of Technical Education', domain: 'ite.edu.sg', country: 'Сингапур', countryCode: 'sg', state: null },
  { name: 'International Theravada Buddhist Missionary University', domain: 'itbmu.org.mm', country: 'Мьянма', countryCode: 'mm', state: null },
  { name: 'Escuela Politécnica del Ejercito', domain: 'espe.edu.ec', country: 'Эквадор', countryCode: 'ec', state: null },
  { name: 'Universidad Nacional Autónoma de Honduras', domain: 'unah.edu.hn', country: 'Гондурас', countryCode: 'hn', state: null },
  { name: 'University of Guelph', domain: 'uoguelph.ca', country: 'Канада', countryCode: 'ca', state: 'Ontario' },
  { name: 'Université Thierno Amadou Diallo', domain: 'utad-petel-edu.org', country: 'Гвинея', countryCode: 'gn', state: null },
  { name: 'University Hospital Zurich', domain: 'unispital.ch', country: 'Швейцария', countryCode: 'ch', state: null },
  { name: 'Trinity University School of Medicine', domain: 'tusom.org', country: 'Saint Vincent and the Grenadines', countryCode: 'vc', state: null },
  { name: 'Instituto Superior de Saúde do Alto Ave', domain: 'isave.edu.pt', country: 'Португалия', countryCode: 'pt', state: null },
  { name: 'Elmergib University', domain: 'elmergib.edu.ly', country: 'Ливия', countryCode: 'ly', state: null },
  { name: 'Universidad Gabriela Mistral', domain: 'ugm.cl', country: 'Чили', countryCode: 'cl', state: null },
  { name: 'Sofia University', domain: 'sofia.edu', country: 'США', countryCode: 'us', state: null },
  { name: 'International People\'s College', domain: 'ipc.dk', country: 'Дания', countryCode: 'dk', state: null },
  { name: 'Olabisi Onabanjo University', domain: 'oouagoiwoye.edu.ng', country: 'Нигерия', countryCode: 'ng', state: null },
  { name: 'University of Zimbabwe', domain: 'uz.ac.zw', country: 'Зимбабве', countryCode: 'zw', state: null },
  { name: 'Université Libre de Tunis', domain: 'ult.ens.tn', country: 'Тунис', countryCode: 'tn', state: null },
  { name: 'St. Thomas University', domain: 'stthomasu.ca', country: 'Канада', countryCode: 'ca', state: null },
  { name: 'Konkuk University', domain: 'konkuk.ac.kr', country: 'Южная Корея', countryCode: 'kr', state: null },
  { name: 'University of the City of Manila', domain: 'plm.edu.ph', country: 'Филиппины', countryCode: 'ph', state: 'National Capital Region' },
  { name: 'Tampere University of Technology', domain: 'tut.fi', country: 'Финляндия', countryCode: 'fi', state: null },
  { name: 'Centro de Estudios Avanzados de Puerto Rico y el Caribe', domain: 'ceaprc.org', country: 'Пуэрто-Рико', countryCode: 'pr', state: null },
  { name: 'University of Sint Eustatius School of Medicine', domain: 'eustatiusmed.edu', country: 'Нидерланды', countryCode: 'nl', state: null },
  { name: 'Uganda Martyr\'s University', domain: 'umu.ac.ug', country: 'Уганда', countryCode: 'ug', state: null },
  { name: 'Islamia University of Bahawalpur', domain: 'iub.edu.pk', country: 'Пакистан', countryCode: 'pk', state: null },
  { name: 'Lampang Rajabhat University', domain: 'lpru.ac.th', country: 'Таиланд', countryCode: 'th', state: 'Lampang' },
  { name: 'Universidad Católica Cecilio Acosta', domain: 'unica.edu.ve', country: 'Венесуэла', countryCode: 've', state: null },
  { name: 'University of Akureyri', domain: 'unak.is', country: 'Исландия', countryCode: 'is', state: null },
  { name: 'American University of the Caribbean', domain: 'auchaiti.org', country: 'Гаити', countryCode: 'ht', state: null },
  { name: 'Institut Teknologi Brunei', domain: 'itb.edu.bn', country: 'Бруней', countryCode: 'bn', state: null },
  { name: 'Haigazian University', domain: 'haigazian.edu.lb', country: 'Ливан', countryCode: 'lb', state: null },
  { name: 'Fachhochschule Burgenland', domain: 'fh-burgenland.at', country: 'Австрия', countryCode: 'at', state: null },
  { name: 'National Sun Yat-Sen University', domain: 'nsysu.edu.tw', country: 'Тайвань', countryCode: 'tw', state: null },
  { name: 'Adama Science and Technology University', domain: 'astu.edu.et', country: 'Эфиопия', countryCode: 'et', state: null },
  { name: 'University of Moratuwa', domain: 'mrt.ac.lk', country: 'Шри-Ланка', countryCode: 'lk', state: null },
  { name: 'National Institute of Development Administration', domain: 'nida.ac.th', country: 'Таиланд', countryCode: 'th', state: 'Bangkok' },
  { name: 'High Institute for Banking & Financial Studies', domain: 'hibfs.edu.sd', country: 'Судан', countryCode: 'sd', state: null },
  { name: 'Séchenyi István University', domain: 'sze.hu', country: 'Венгрия', countryCode: 'hu', state: null },
  { name: 'Universidad International SEK, Santiago', domain: 'uisek.cl', country: 'Чили', countryCode: 'cl', state: null },
  { name: 'Politeknik Negeri Sambas', domain: 'poltesa.ac.id', country: 'Индонезия', countryCode: 'id', state: null },
  { name: 'San Diego City College', domain: 'sdcity.edu', country: 'США', countryCode: 'us', state: 'California' },
  { name: 'Silesian University', domain: 'slu.cz', country: 'Чехия', countryCode: 'cz', state: null },
  { name: 'Tashkent Islam University', domain: 'tiu.uz', country: 'Узбекистан', countryCode: 'uz', state: null },
  { name: 'The CTL Eurocollege', domain: 'ctleuro.ac.cy', country: 'Кипр', countryCode: 'cy', state: null },
  { name: 'Universidad de Cartago', domain: 'ucapanama.org', country: 'Панама', countryCode: 'pa', state: null },
  { name: 'Ittihad Private University', domain: 'ipu.edu.sy', country: 'Сирия', countryCode: 'sy', state: null },
  { name: 'DUT MMI - Université Bordeaux Montaigne', domain: 'mmibordeaux.com', country: 'Франция', countryCode: 'fr', state: null },
  { name: 'Pacific Adventist University', domain: 'pau.ac.pg', country: 'Папуа — Новая Гвинея', countryCode: 'pg', state: null },
  { name: 'Enugu State University of Science and Technology', domain: 'esut.edu.ng', country: 'Нигерия', countryCode: 'ng', state: null },
  { name: 'Kabul Medical University', domain: 'kmu.edu.af', country: 'Афганистан', countryCode: 'af', state: null },
  { name: 'Latvian Maritime Academy', domain: 'lama.lv', country: 'Латвия', countryCode: 'lv', state: null },
  { name: 'Kyrgyz State Technical University', domain: 'kstu.kg', country: 'Кыргызстан', countryCode: 'kg', state: null },
  { name: 'University of Kuopio', domain: 'uku.fi', country: 'Финляндия', countryCode: 'fi', state: null },
  { name: 'Universiti Islam Sultan Sharif Ali', domain: 'unissa.edu.bn', country: 'Бруней', countryCode: 'bn', state: null },
  { name: 'Postgraduate Institute of Agriculture (PGIA)', domain: 'pgia.ac.lk', country: 'Шри-Ланка', countryCode: 'lk', state: null },
  { name: 'Hanoi University of Agriculture', domain: 'hua.edu.vn', country: 'Вьетнам', countryCode: 'vn', state: null },
  { name: 'Nile Valley University', domain: 'nilevalley.edu.sd', country: 'Судан', countryCode: 'sd', state: null },
  { name: 'East Africa University Bosaso', domain: 'eastafricauniversity.net', country: 'Сомали', countryCode: 'so', state: null },
  { name: 'Alain University of Science and Technology', domain: 'alainuniversity.ac.ae', country: 'ОАЭ', countryCode: 'ae', state: null },
  { name: 'International Tourism Institute', domain: 'itismalta.com', country: 'Мальта', countryCode: 'mt', state: null },
  { name: 'Bermuda College', domain: 'bercol.bm', country: 'Bermuda', countryCode: 'bm', state: null },
  { name: 'University of Tripoli', domain: 'uot.edu.ly', country: 'Ливия', countryCode: 'ly', state: null },
  { name: 'Instituto Politécnico de Castelo Branco', domain: 'ipcb.pt', country: 'Португалия', countryCode: 'pt', state: null },
  { name: 'Swiss Business School Zurich (SBS)', domain: 'sbs.edu', country: 'Швейцария', countryCode: 'ch', state: null },
  { name: 'Omdurman Ahlia University', domain: 'oau.edu.sd', country: 'Судан', countryCode: 'sd', state: null },
  { name: 'University of Zagreb', domain: 'unizg.hr', country: 'Хорватия', countryCode: 'hr', state: null },
  { name: 'Universidad Rafael Landívar', domain: 'url.edu.gt', country: 'Гватемала', countryCode: 'gt', state: null },
  { name: 'Vaal University of Technology', domain: 'vut.ac.za', country: 'ЮАР', countryCode: 'za', state: 'Gauteng Province' },
  { name: 'Agricultural University of Plovdiv', domain: 'au-plovdiv.bg', country: 'Болгария', countryCode: 'bg', state: null },
  { name: 'American University of Antigua', domain: 'auamed.org', country: 'Antigua and Barbuda', countryCode: 'ag', state: null },
  { name: 'Debrecen University of Agricultural Sciences', domain: 'agr.unideb.hu', country: 'Венгрия', countryCode: 'hu', state: null },
  { name: 'Hodeidah University', domain: 'hoduniv.net.ye', country: 'Йемен', countryCode: 'ye', state: null },
  { name: 'American University of the Caribbean, School of Medicine', domain: 'aucmed.edu', country: 'Белиз', countryCode: 'bz', state: null },
  { name: 'Universitas Muhammadiyah Yogyakarta', domain: 'umy.ac.id', country: 'Индонезия', countryCode: 'id', state: null },
  { name: 'Pedagogical State University "Ion Creanga"', domain: 'upm.moldnet.md', country: 'Молдова', countryCode: 'md', state: null },
  { name: 'Universidad Central', domain: 'ucentral.edu.co', country: 'Колумбия', countryCode: 'co', state: null },
  { name: 'Universidade da Madeira', domain: 'uma.pt', country: 'Португалия', countryCode: 'pt', state: null },
  { name: 'Jingdezhen China Institute', domain: 'jci.edu.cn', country: 'Китай', countryCode: 'cn', state: null },
  { name: 'Dominica State College', domain: 'dsc.dm', country: 'Доминика', countryCode: 'dm', state: null },
  { name: 'National Metallurgical Academy of Ukraine', domain: 'nmetau.edu.ua', country: 'Украина', countryCode: 'ua', state: null },
  { name: 'Usak University', domain: 'usak.edu.tr', country: 'Турция', countryCode: 'tr', state: null },
  { name: 'Universidad Católica de Santiago de Guayaquil', domain: 'ucsg.edu.ec', country: 'Эквадор', countryCode: 'ec', state: null },
  { name: 'Université Française d\'Égypte', domain: 'ufe.edu.eg', country: 'Египет', countryCode: 'eg', state: null },
  { name: 'University of Basrah', domain: 'uobasrah.edu.iq', country: 'Ирак', countryCode: 'iq', state: null },
  { name: 'Universidad Técnica Estatal de Quevedo', domain: 'uteq.edu.ec', country: 'Эквадор', countryCode: 'ec', state: null },
  { name: 'Universidad Centroamericana "José Simeón Canas"', domain: 'uca.edu.sv', country: 'Сальвадор', countryCode: 'sv', state: null },
  { name: 'Yarmouk University', domain: 'yu.edu.jo', country: 'Иордания', countryCode: 'jo', state: null },
  { name: 'Ilia Chavchavadze State University', domain: 'iliauni.edu.ge', country: 'Грузия', countryCode: 'ge', state: null },
  { name: 'Eurasia International University', domain: 'eiu.am', country: 'Армения', countryCode: 'am', state: null },
  { name: 'National University of Ireland', domain: 'nui.ie', country: 'Ирландия', countryCode: 'ie', state: null },
  { name: 'Fachhochschule Vorarlberg', domain: 'fhv.at', country: 'Австрия', countryCode: 'at', state: null },
  { name: 'Al-Nasser University', domain: 'al-edu.com', country: 'Йемен', countryCode: 'ye', state: null },
  { name: 'Madenat Alelem University College', domain: 'madenatalelem.com', country: 'Ирак', countryCode: 'iq', state: null },
  { name: 'University of Jaffna', domain: 'jfn.ac.lk', country: 'Шри-Ланка', countryCode: 'lk', state: null },
  { name: 'University of the Virgin Islands', domain: 'uvi.edu', country: 'Virgin Islands, British', countryCode: 'vg', state: null },
  { name: 'University of the West Indies, Mona', domain: 'uwimona.edu.jm', country: 'Ямайка', countryCode: 'jm', state: null },
  { name: 'North East University Bangladesh', domain: 'neub.edu.bd', country: 'Бангладеш', countryCode: 'bd', state: null },
  { name: 'Dogus University', domain: 'dogus.edu.tr', country: 'Турция', countryCode: 'tr', state: null },
  { name: 'Universidad Madero', domain: 'umad.edu.mx', country: 'Мексика', countryCode: 'mx', state: null },
  { name: 'Universidade de Taubaté', domain: 'unitau.br', country: 'Бразилия', countryCode: 'br', state: null },
  { name: 'Université de Mbuji Mayi', domain: 'um-rdc.org', country: 'ДР Конго', countryCode: 'cd', state: null },
  { name: 'Harokopio University', domain: 'hua.gr', country: 'Греция', countryCode: 'gr', state: 'Attica' },
  { name: 'Fachhochschule Hamburg', domain: 'fh-hamburg.de', country: 'Германия', countryCode: 'de', state: null },
  { name: 'Tamkang University', domain: 'tku.edu.tw', country: 'Тайвань', countryCode: 'tw', state: null },
  { name: 'Centro Universitário De Goiás - UNIGOIÁS', domain: 'unigoias.com.br', country: 'Бразилия', countryCode: 'br', state: 'Goiânia' },
  { name: 'International Institute of Information Technology, Bangalore', domain: 'iiitb.ac.in', country: 'Индия', countryCode: 'in', state: 'Karnataka' },
  { name: 'University of Palestine', domain: 'up.edu.ps', country: 'Палестина', countryCode: 'ps', state: null },
  { name: 'Institute of Information Technology', domain: 'iit.com.na', country: 'Намибия', countryCode: 'na', state: null },
  { name: 'Universidad Tecnológica de Honduras', domain: 'uth.hn', country: 'Гондурас', countryCode: 'hn', state: null },
  { name: 'Republic Polytechnic', domain: 'rp.edu.sg', country: 'Сингапур', countryCode: 'sg', state: null },
  { name: 'Macau Polytechnic Institute', domain: 'ipm.edu.mo', country: 'Макао', countryCode: 'mo', state: null },
  { name: 'International College of the Cayman Islands', domain: 'icci.edu.ky', country: 'Cayman Islands', countryCode: 'ky', state: null },
  { name: 'Kuwait University', domain: 'kuniv.edu.kw', country: 'Кувейт', countryCode: 'kw', state: null },
  { name: 'American International University West Africa', domain: 'aiu.edu.gm', country: 'Гамбия', countryCode: 'gm', state: null },
  { name: 'University of Fiji', domain: 'unifiji.ac.fj', country: 'Фиджи', countryCode: 'fj', state: null },
  { name: 'Università Pontifcia Salesiana', domain: 'ups.urbe.it', country: 'Holy See (Vatican City State)', countryCode: 'va', state: null },
  { name: 'All Nations University College', domain: 'anuc.edu.gh', country: 'Гана', countryCode: 'gh', state: null },
  { name: 'Université de Bamenda', domain: 'unibda.net', country: 'Камерун', countryCode: 'cm', state: null },
  { name: 'University of Reading Malaysia', domain: 'reading.edu.my', country: 'Малайзия', countryCode: 'my', state: 'Johor' },
  { name: 'Armed Forces Academy of General Milan Rastislav Štefánik', domain: 'aos.sk', country: 'Словакия', countryCode: 'sk', state: null },
  { name: 'Ateneo de Zamboanga University', domain: 'adzu.edu.ph', country: 'Филиппины', countryCode: 'ph', state: 'Zamboanga del Sur' },
  { name: 'Naif Arab University for Security Sciences', domain: 'nauss.edu.sa', country: 'Саудовская Аравия', countryCode: 'sa', state: 'Riyadh' },
  { name: 'Université de la Polynésie Française', domain: 'upf.pf', country: 'French Polynesia', countryCode: 'pf', state: null },
  { name: 'Universidad Católica de Cuyo', domain: 'uccuyo.edu.ar', country: 'Аргентина', countryCode: 'ar', state: 'Mendoza' },
  { name: 'Vitebsk State Medical University', domain: 'vgmu.vitebsk.by', country: 'Беларусь', countryCode: 'by', state: null },
  { name: 'Palestine Polytechnic University', domain: 'ppu.edu', country: 'Палестина', countryCode: 'ps', state: null },
];

function autoEnrichUniversityData(uni, tier) {
  const flag = `https://flagcdn.com/w40/${uni.countryCode}.png`;
  const logo = `https://logo.clearbit.com/${uni.domain}`;
  const website = `https://${uni.domain}`;

  const cityPart = uni.city || null;
  let location;
  if (cityPart && uni.state) location = `${cityPart}, ${uni.state}, ${uni.country}`;
  else if (cityPart) location = `${cityPart}, ${uni.country}`;
  else if (uni.state) location = `${uni.state}, ${uni.country}`;
  else location = uni.country;

  return {
    ...uni,
    tier,
    flag, logo, location, website,
    city: cityPart,
    minGPA: (uni.minGPA !== undefined) ? uni.minGPA : null,
    minIELTS: (uni.minIELTS !== undefined) ? uni.minIELTS : null,
    rate: (uni.rate !== undefined) ? uni.rate : null,
    tuition: uni.tuition || null,
    description: uni.description || '',
    facts: uni.facts || [],
    majors: uni.majors || [],
    photo: uni.photo || null
  };
}

const DB = [
  ...RAW_UNIVERSITIES.map(u => autoEnrichUniversityData(u, 'rich')),
  ...BASIC_UNIVERSITIES.map(u => autoEnrichUniversityData(u, 'basic'))
];

let currentAvatar = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f98a.svg';
let user = { name: '', major: 'Computer Science', gpa: 3.8, ielts: 7.0, gpaPending: false, ieltsPending: false, avatar: '' };

function populateMajorSelect() {
  const select = document.getElementById('regMajor');
  if (!select || select.options.length) return;
  MAJORS_LIST.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = m;
    select.appendChild(opt);
  });
  const otherOpt = document.createElement('option');
  otherOpt.value = 'Other';
  otherOpt.textContent = 'Другое / Other';
  select.appendChild(otherOpt);
}

function handleMajorSelectChange() {
  const select = document.getElementById('regMajor');
  const otherInput = document.getElementById('regMajorOther');
  if (select.value === 'Other') {
    otherInput.classList.remove('hidden');
    otherInput.required = true;
  } else {
    otherInput.classList.add('hidden');
    otherInput.required = false;
  }
}

function togglePendingField(field) {
  if (field === 'gpa') {
    const checked = document.getElementById('regGPAPending').checked;
    const input = document.getElementById('regGPA');
    input.disabled = checked;
    input.classList.toggle('opacity-50', checked);
    if (checked) { input.dataset.prevValue = input.value; input.value = ''; }
    else if (input.dataset.prevValue) { input.value = input.dataset.prevValue; }
  } else {
    const checked = document.getElementById('regIELTSPending').checked;
    const input = document.getElementById('regIELTS');
    input.disabled = checked;
    input.classList.toggle('opacity-50', checked);
    if (checked) { input.dataset.prevValue = input.value; input.value = ''; }
    else if (input.dataset.prevValue) { input.value = input.dataset.prevValue; }
  }
}

function selectPresetAvatar(src) {
  currentAvatar = src;
  document.getElementById('avatarPreview').src = src;
  document.querySelectorAll('#avatarPresets img').forEach(img => {
    if(img.src === src) img.classList.add('selected');
    else img.classList.remove('selected');
  });
}

function handleCustomAvatarUpload(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(evt) {
      currentAvatar = evt.target.result;
      document.getElementById('avatarPreview').src = currentAvatar;
      document.querySelectorAll('#avatarPresets img').forEach(img => img.classList.remove('selected'));
    };
    reader.readAsDataURL(file);
  }
}

function handleRegistration(e) {
  e.preventDefault();
  user.name = document.getElementById('regName').value;

  const majorSelectVal = document.getElementById('regMajor').value;
  user.major = majorSelectVal === 'Other' ? (document.getElementById('regMajorOther').value || 'Other') : majorSelectVal;

  user.gpaPending = document.getElementById('regGPAPending').checked;
  user.ieltsPending = document.getElementById('regIELTSPending').checked;
  user.gpa = user.gpaPending ? null : parseFloat(document.getElementById('regGPA').value);
  user.ielts = user.ieltsPending ? null : parseFloat(document.getElementById('regIELTS').value);
  user.avatar = currentAvatar;

  localStorage.setItem('unipath_user', JSON.stringify(user));

  document.getElementById('authScreen').classList.add('opacity-0');
  setTimeout(() => {
    document.getElementById('authScreen').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    updateUI();
  }, 300);
}

function openEditProfile() {
  document.getElementById('regName').value = user.name;

  const majorSelect = document.getElementById('regMajor');
  const isKnownMajor = MAJORS_LIST.includes(user.major);
  majorSelect.value = isKnownMajor ? user.major : 'Other';
  document.getElementById('regMajorOther').value = isKnownMajor ? '' : (user.major || '');
  handleMajorSelectChange();

  document.getElementById('regGPAPending').checked = !!user.gpaPending;
  document.getElementById('regIELTSPending').checked = !!user.ieltsPending;
  const gpaInput = document.getElementById('regGPA');
  const ieltsInput = document.getElementById('regIELTS');
  gpaInput.value = user.gpaPending ? '' : (user.gpa ?? 3.8);
  ieltsInput.value = user.ieltsPending ? '' : (user.ielts ?? 7.0);
  delete gpaInput.dataset.prevValue;
  delete ieltsInput.dataset.prevValue;
  gpaInput.disabled = !!user.gpaPending;
  ieltsInput.disabled = !!user.ieltsPending;
  gpaInput.classList.toggle('opacity-50', !!user.gpaPending);
  ieltsInput.classList.toggle('opacity-50', !!user.ieltsPending);

  document.getElementById('avatarPreview').src = user.avatar;
  currentAvatar = user.avatar;

  const auth = document.getElementById('authScreen');
  auth.classList.remove('hidden', 'pointer-events-none');
  setTimeout(() => auth.classList.remove('opacity-0'), 50);
}

function logout() {
  localStorage.removeItem('unipath_user');
  document.getElementById('mainApp').classList.add('hidden');
  const auth = document.getElementById('authScreen');
  auth.classList.remove('hidden', 'pointer-events-none');
  setTimeout(() => auth.classList.remove('opacity-0'), 50);
}

function updateUI() {
  document.getElementById('headerUserName').innerText = user.name;
  document.getElementById('headerUserMajor').innerText = user.major || 'Aspirant';
  document.getElementById('welcomeUserName').innerText = user.name.split(' ')[0];
  document.getElementById('headerUserAvatar').src = user.avatar || currentAvatar;
  
  const recText = document.getElementById('smartRecommendationText');
  if (user.gpaPending || user.ieltsPending) {
    const missing = [user.gpaPending ? 'GPA' : null, user.ieltsPending ? 'IELTS' : null].filter(Boolean).join(' и ');
    recText.innerHTML = `Пока не хватает данных: <b class="text-amber-300">${missing}</b>. ${t('pending_banner')} — раздел «База и Уроки» ниже поможет начать подготовку уже сейчас.`;
  } else if (user.ielts < 7.0) {
    recText.innerHTML = `Твой GPA: <b class="text-indigo-300">${user.gpa}</b>, IELTS: <b class="text-amber-300">${user.ielts}</b>. Рекомендуем поднять IELTS до 7.5 для топовых ВУЗов США. Ссылки на бесплатные тесты приведены ниже!`;
  } else {
    recText.innerHTML = `Отличный профиль! GPA: <b class="text-emerald-300">${user.gpa}</b>, IELTS: <b class="text-emerald-300">${user.ielts}</b>. У тебя высокие шансы в топовые Университеты Европы и Канады. Сосредоточься на Эссе!`;
  }

  renderUniversities();
  renderLeoWidget();
  initLeoNotifications();
}

function handleLogoError(img, domain, initial) {
  const stage = img.dataset.fallbackStage || '0';
  if (stage === '0') {
    img.dataset.fallbackStage = '1';
    img.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } else {
    img.onerror = null;
    img.parentElement.innerHTML = `<span class="font-extrabold text-indigo-600 text-sm">${initial}</span>`;
  }
}

const GENERIC_UNI_PHOTO = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%234338ca'/%3E%3Cstop offset='1' stop-color='%236366f1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='400' fill='url(%23g)'/%3E%3Cg fill='white' opacity='0.9'%3E%3Cpath d='M400 120 L520 170 L400 220 L280 170 Z'/%3E%3Cpath d='M320 190 v55 q80 30 160 0 v-55' fill='none' stroke='white' stroke-width='8'/%3E%3Ccircle cx='520' cy='170' r='6'/%3E%3Cline x1='520' y1='170' x2='520' y2='215' stroke='white' stroke-width='4'/%3E%3C/g%3E%3C/svg%3E";

function renderUniversities(filteredList = DB) {
  const list = document.getElementById('universityList');
  list.innerHTML = '';

  if (filteredList.length === 0) {
    list.innerHTML = `<p class="text-xs text-slate-400 text-center py-6">Ничего не найдено — попробуй изменить фильтры.</p>`;
    return;
  }

  const pending = user.gpaPending || user.ieltsPending;

  filteredList.forEach(uni => {
    const hasStats = uni.minGPA !== null && uni.rate !== null;
    let finalMatch = null, barColor = 'bg-slate-300', textColor = 'text-slate-400', matchLabel = t('pending_card_cta');

    if (!hasStats) {
      matchLabel = 'Нет данных';
    } else if (!pending) {
      let gpaRatio = user.gpa / uni.minGPA;
      let baseChance = (100 - uni.rate * 1.5) * (gpaRatio * 0.9);
      if (uni.minIELTS !== null && user.ielts < uni.minIELTS) baseChance -= 20;
      finalMatch = Math.min(Math.max(Math.round(baseChance), 5), 98);
      barColor = finalMatch > 65 ? 'bg-emerald-500' : (finalMatch > 35 ? 'bg-amber-400' : 'bg-rose-500');
      textColor = finalMatch > 65 ? 'text-emerald-600' : (finalMatch > 35 ? 'text-amber-600' : 'text-rose-600');
      matchLabel = `${finalMatch}% Шанс`;
    }

    const topMajor = uni.majors.find(m => m.top) || uni.majors[0];
    const userMajorEntry = uni.majors.find(m => m.name === user.major);
    let majorBadge = '';
    if (userMajorEntry) {
      majorBadge = `<span class="inline-flex items-center gap-1 px-2 py-0.5 mt-1.5 bg-emerald-100 text-emerald-700 rounded-md text-[10px] font-bold">✅ ${t('your_major_badge')}: ${userMajorEntry.name} (${userMajorEntry.share}%)</span>`;
    } else if (topMajor) {
      majorBadge = `<span class="inline-flex items-center gap-1 px-2 py-0.5 mt-1.5 bg-indigo-50 text-indigo-700 rounded-md text-[10px] font-bold">🎓 ${t('top_major_badge')}: ${topMajor.name} (${topMajor.share}%)</span>`;
    }

    const tuitionLine = uni.tuition ? ` • <span class="text-indigo-600 font-medium">${uni.tuition}</span>` : '';
    const statsLine = hasStats
      ? `Мин. IELTS: ${uni.minIELTS ?? '—'} • Мин. GPA: ${uni.minGPA}`
      : `<a href="${uni.website}" target="_blank" rel="noopener" onclick="event.stopPropagation();" class="text-indigo-500 hover:underline">Сайт вуза →</a>`;

    const card = document.createElement('div');
    card.className = 'p-4 border border-slate-200/80 rounded-2xl bg-white hover:border-indigo-400 hover:shadow-lg transition duration-300 cursor-pointer group overflow-hidden';
    card.onclick = () => openUniModal(uni.name);

    card.innerHTML = `
      <div class="flex flex-wrap items-start justify-between gap-x-2 gap-y-1 mb-2">
        <div class="flex items-center space-x-3 min-w-0 flex-1">
          <div class="w-10 h-10 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-xl p-1 shrink-0 overflow-hidden group-hover:scale-105 transition">
            <img src="${uni.logo}"
                 onerror="handleLogoError(this, '${uni.domain}', '${uni.name.charAt(0)}')"
                 class="max-w-full max-h-full object-contain"
                 alt="${uni.name}">
          </div>
          <div class="min-w-0">
            <div class="flex items-center space-x-2">
              <h4 class="font-extrabold text-slate-900 text-xs md:text-sm leading-snug group-hover:text-indigo-600 transition break-words">${uni.name}</h4>
              <img src="${uni.flag}" class="w-4 h-3 rounded-sm object-cover shadow-sm shrink-0" alt="Flag">
            </div>
            <p class="text-[11px] text-slate-400 break-words">${uni.location}${tuitionLine}</p>
          </div>
        </div>
        <div class="text-right shrink-0 max-w-[42%] sm:max-w-none">
          <span class="text-xs md:text-sm font-extrabold ${textColor} break-words">${matchLabel}</span>
          <p class="text-[10px] text-slate-400 break-words">${statsLine}</p>
        </div>
      </div>
      <div class="space-y-1">
        <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div class="${barColor} h-1.5 rounded-full transition-all duration-1000" style="width: ${finalMatch !== null ? finalMatch : 100}%"></div>
        </div>
      </div>
      ${majorBadge}
    `;
    list.appendChild(card);
  });
}

function openUniModal(uniName) {
  const uni = DB.find(u => u.name === uniName);
  if (!uni) return;

  const photoImg = document.getElementById('modalUniPhoto');
  photoImg.onerror = () => { photoImg.onerror = null; photoImg.src = GENERIC_UNI_PHOTO; };
  photoImg.src = uni.photo || GENERIC_UNI_PHOTO;

  document.getElementById('modalUniName').innerText = uni.name;
  document.getElementById('modalUniLocation').innerHTML = `<img src="${uni.flag}" class="w-4 h-3 rounded-sm object-cover shadow-sm inline-block"> ${uni.location}`;
  document.getElementById('modalUniDesc').innerText = uni.description || 'Подробное описание пока не добавлено — переходи на официальный сайт вуза, чтобы узнать больше.';

  const websiteBtn = document.getElementById('modalUniWebsiteBtn');
  if (websiteBtn) websiteBtn.href = uni.website;

  const statsBox = document.getElementById('modalUniStats');
  if (statsBox) {
    const chips = [
      uni.tuition ? { icon: 'wallet', label: t('chip_tuition'), value: uni.tuition } : null,
      uni.minGPA !== null ? { icon: 'bar-chart-2', label: t('chip_gpa'), value: uni.minGPA } : null,
      uni.minIELTS !== null ? { icon: 'languages', label: t('chip_ielts'), value: uni.minIELTS } : null,
      uni.rate !== null ? { icon: 'percent', label: t('chip_rate'), value: `${uni.rate}%` } : null
    ].filter(Boolean);

    if (chips.length > 0) {
      statsBox.innerHTML = chips.map(c => `
        <div class="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
          <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1"><i data-lucide="${c.icon}" class="w-3 h-3"></i>${c.label}</p>
          <p class="text-xs font-extrabold text-slate-800 mt-0.5">${c.value}</p>
        </div>
      `).join('');
    } else {
      statsBox.innerHTML = `<div class="col-span-2 sm:col-span-4 p-3 bg-amber-50 border border-amber-100 rounded-xl text-[11px] text-amber-700 font-medium">
        Точных цифр GPA/IELTS/стоимости по этому вузу пока нет в базе — уточни требования на официальном сайте.
      </div>`;
    }
  }

  const factsList = document.getElementById('modalUniFacts');
  if (uni.facts.length > 0) {
    factsList.innerHTML = uni.facts.map(fact => `
      <li class="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
        <div class="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
        <span>${fact}</span>
      </li>
    `).join('');
  } else {
    factsList.innerHTML = `<li class="text-xs text-slate-400 italic">Интересные факты по этому вузу пока не добавлены.</li>`;
  }

  const majorsBox = document.getElementById('modalUniMajors');
  if (majorsBox) {
    if (uni.majors.length > 0) {
      const sorted = [...uni.majors].sort((a, b) => b.share - a.share);
      majorsBox.innerHTML = sorted.map(m => {
        const isUserMajor = m.name === user.major;
        return `
          <div class="p-2.5 rounded-xl border ${isUserMajor ? 'border-indigo-300 bg-indigo-50/60' : 'border-slate-100 bg-slate-50'}">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-bold text-slate-800 flex items-center gap-1.5">${m.name}
                ${m.top ? `<span class="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-[9px] font-bold">${t('top_major_badge')}</span>` : ''}
                ${isUserMajor ? `<span class="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[9px] font-bold">${t('your_major_badge')}</span>` : ''}
              </span>
              <span class="text-[11px] font-bold text-indigo-600">${m.share}%</span>
            </div>
            <div class="w-full bg-slate-200/70 rounded-full h-1.5 overflow-hidden">
              <div class="bg-indigo-500 h-1.5 rounded-full" style="width:${m.share * 3}%"></div>
            </div>
            ${m.note ? `<p class="text-[10px] text-slate-500 mt-1">${m.note}</p>` : ''}
          </div>
        `;
      }).join('') + `<p class="text-[10px] text-slate-400 pt-1">${t('majors_disclaimer')}</p>`;
    } else {
      majorsBox.innerHTML = `<p class="text-xs text-slate-400 italic">Разбивка по специальностям для этого вуза пока не добавлена.</p>`;
    }
  }

  const modal = document.getElementById('uniModal');
  modal.classList.remove('hidden');
  requestAnimationFrame(() => {
    modal.classList.remove('opacity-0');
  });
  lucide.createIcons();
}

function closeUniModal() {
  const modal = document.getElementById('uniModal');
  modal.classList.add('opacity-0');
  setTimeout(() => {
    modal.classList.add('hidden');
  }, 300);
}

function initUniversityFilters() {
  const countrySelect = document.getElementById('filterCountry');
  const majorSelect = document.getElementById('filterMajor');
  if (!countrySelect || countrySelect.dataset.initialized) return;

  const countries = [...new Set(DB.map(u => u.country))].sort();
  countries.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    countrySelect.appendChild(opt);
  });

  MAJORS_LIST.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = m;
    majorSelect.appendChild(opt);
  });

  countrySelect.dataset.initialized = '1';
  populateCityFilter('');
}

function populateCityFilter(country) {
  const citySelect = document.getElementById('filterCity');
  const currentVal = citySelect.value;
  citySelect.innerHTML = `<option value="">📍 ${t('filter_city')}</option>`;

  const pool = country ? DB.filter(u => u.country === country) : DB;
  const cities = [...new Set(pool.map(u => u.state ? `${u.state} — ${u.city || ''}`.replace(/ — $/, '') : u.city).filter(Boolean))].sort();
  cities.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    citySelect.appendChild(opt);
  });

  if (cities.includes(currentVal)) citySelect.value = currentVal;
}

function onCountryFilterChange() {
  populateCityFilter(document.getElementById('filterCountry').value);
  filterUniversities();
}

function resetUniversityFilters() {
  document.getElementById('uniSearchInput').value = '';
  document.getElementById('filterCountry').value = '';
  document.getElementById('filterMajor').value = '';
  populateCityFilter('');
  filterUniversities();
}

function filterUniversities() {
  const query = document.getElementById('uniSearchInput').value.toLowerCase();
  const country = document.getElementById('filterCountry').value;
  const cityState = document.getElementById('filterCity').value;
  const major = document.getElementById('filterMajor').value;

  const filtered = DB.filter(u => {
    const matchesQuery = !query || u.name.toLowerCase().includes(query) || u.location.toLowerCase().includes(query);
    const matchesCountry = !country || u.country === country;
    const uniCityLabel = u.state ? `${u.state} — ${u.city || ''}`.replace(/ — $/, '') : u.city;
    const matchesCity = !cityState || uniCityLabel === cityState;
    const matchesMajor = !major || u.majors.some(m => m.name === major);
    return matchesQuery && matchesCountry && matchesCity && matchesMajor;
  });

  renderUniversities(filtered);
}

function handleEnter(e) { if (e.key === 'Enter') processInput(); }

function processInput() {
  const inputField = document.getElementById('chatInput');
  const text = inputField.value.trim();
  if (text !== '') {
    sendUserMessage(text);
    inputField.value = '';
  }
}

async function sendUserMessage(text) {
  const chat = document.getElementById('chatHistory');
  
  const userDiv = document.createElement('div');
  userDiv.className = 'bg-indigo-600 text-white p-3 rounded-2xl rounded-tr-none ml-auto max-w-[85%] text-xs shadow-md my-1.5 font-medium';
  userDiv.innerHTML = text;
  chat.appendChild(userDiv);
  chat.scrollTop = chat.scrollHeight;

  const botDiv = document.createElement('div');
  botDiv.className = 'bg-white p-3.5 rounded-2xl rounded-tl-none border border-slate-200/90 text-slate-800 max-w-[92%] text-xs shadow-sm leading-relaxed my-1.5 flex flex-col';
  botDiv.innerHTML = '<span class="animate-pulse text-slate-400">ИИ думает...</span>';
  chat.appendChild(botDiv);
  chat.scrollTop = chat.scrollHeight;

  try {
    const response = await fetch('/.netlify/functions/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: text,
        userContext: { name: user.name, major: user.major, gpa: user.gpa, ielts: user.ielts }
      })
    });
    
    const data = await response.json();
    const replyText = data.reply ? data.reply.replace(/\n/g, '<br>') : 'Ошибка получения ответа.';
    
    // Вставляем ответ и добавляем кнопку копирования диалога
    botDiv.innerHTML = `
      <div class="mb-2">${replyText}</div>
      <button class="copy-dialog-btn flex items-center space-x-1.5 text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition pt-2 border-t border-slate-100/80 mt-1 w-full justify-start active:scale-95 origin-left">
        <i data-lucide="copy" class="w-3 h-3"></i>
        <span>Скопировать диалог</span>
      </button>
    `;

    // Логика кнопки
    const copyBtn = botDiv.querySelector('.copy-dialog-btn');
    copyBtn.onclick = () => {
      const textToCopy = `Мой запрос: ${text}\nОтвет ИИ: ${data.reply || 'Ошибка получения ответа'}`;
      navigator.clipboard.writeText(textToCopy).then(() => {
        copyBtn.innerHTML = '<i data-lucide="check" class="w-3 h-3 text-emerald-500"></i><span class="text-emerald-500">Скопировано!</span>';
        lucide.createIcons();
        setTimeout(() => {
          copyBtn.innerHTML = '<i data-lucide="copy" class="w-3 h-3"></i><span>Скопировать диалог</span>';
          lucide.createIcons();
        }, 2000);
      });
    };
  } catch (err) {
    botDiv.innerHTML = 'Не удалось связаться с сервером ИИ.';
  }
  
  lucide.createIcons();
  chat.scrollTop = chat.scrollHeight;
}
// ==================== LEO'S DAILY MISSIONS ====================

const LEO_MISSIONS = [
  "Найди 2 extracurricular activities, которые соответствуют твоей специальности.",
  "Напиши первые 100 слов своего Personal Statement.",
  "Добавь 3 university в свой shortlist.",
  "Выучи 15 новых слов для IELTS/SAT."
];

const LEO_MIN_WORDS = 20;
const LEO_HISTORY_KEY = 'unipath_penguin_history';
const LEO_PROGRESS_KEY = 'unipath_penguin_progress';
const LEO_NOTIFY_KEY = 'unipath_penguin_notified_day';

// Ключ дня в формате "год-деньГода" — используется, чтобы миссия менялась ровно раз в 24 часа
function getLeoDayKey() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const dayOfYear = Math.floor(diff / 86400000);
  return `${now.getFullYear()}-${dayOfYear}`;
}

function getLeoDayIndex() {
  const [, dayOfYear] = getLeoDayKey().split('-').map(Number);
  return dayOfYear % LEO_MISSIONS.length;
}

function getTodayLeoMission() {
  return LEO_MISSIONS[getLeoDayIndex()];
}

function getLeoHistory() {
  try {
    return JSON.parse(localStorage.getItem(LEO_HISTORY_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveLeoHistoryEntry(text) {
  const history = getLeoHistory();
  history.push({ day: getLeoDayKey(), text });
  // Храним только последние 30 записей, чтобы не раздувать localStorage
  localStorage.setItem(LEO_HISTORY_KEY, JSON.stringify(history.slice(-30)));
}

function getLeoProgress() {
  try {
    return JSON.parse(localStorage.getItem(LEO_PROGRESS_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function isTodayLeoMissionDone() {
  return getLeoProgress().lastCompletedDay === getLeoDayKey();
}

function markTodayLeoMissionDone() {
  localStorage.setItem(LEO_PROGRESS_KEY, JSON.stringify({ lastCompletedDay: getLeoDayKey() }));
}

// ---------- Виджет на дашборде ----------

function renderLeoWidget() {
  const preview = document.getElementById('leoMissionPreview');
  const doneBadge = document.getElementById('leoDoneBadge');
  const timerBadge = document.getElementById('leoTimerBadge');
  if (!preview) return;

  preview.innerText = getTodayLeoMission();

  const done = isTodayLeoMissionDone();
  if (doneBadge) doneBadge.classList.toggle('hidden', !done);
  if (doneBadge) doneBadge.classList.toggle('flex', done);
  if (timerBadge) timerBadge.classList.toggle('hidden', done);

  if (window.lucide) lucide.createIcons();
}

// ---------- Модальное окно ----------

function buildLeoGreeting() {
  const firstName = (user.name || '').split(' ')[0] || 'друг';
  let greeting = `Привет, ${firstName}! 👋 Я Лео, твой помощник по подготовке. Готов(а) выполнить сегодняшнюю миссию?`;

  const hasGpa = !user.gpaPending && user.gpa !== null && user.gpa !== undefined;
  const hasIelts = !user.ieltsPending && user.ielts !== null && user.ielts !== undefined;

  if (hasGpa || hasIelts) {
    const parts = [];
    if (hasGpa) parts.push(`GPA ${user.gpa}`);
    if (hasIelts) parts.push(`IELTS ${user.ielts}`);
    greeting += ` Кстати, с ${parts.join(' и ')} у тебя отличная база — маленькие ежедневные шаги приблизят тебя к цели ещё быстрее!`;
  }

  return greeting;
}

function openLeoModal() {
  const modal = document.getElementById('leoModal');
  if (!modal) return;

  document.getElementById('leoGreetingText').innerText = buildLeoGreeting();
  document.getElementById('leoMissionText').innerText = getTodayLeoMission();

  const answerInput = document.getElementById('leoAnswerInput');
  const submitBtn = document.getElementById('leoSubmitBtn');
  const feedbackBox = document.getElementById('leoFeedbackBox');

  feedbackBox.classList.add('hidden');
  feedbackBox.classList.remove('leo-success', 'leo-error');
  feedbackBox.innerHTML = '';

  if (isTodayLeoMissionDone()) {
    answerInput.value = '';
    answerInput.disabled = true;
    submitBtn.disabled = true;
    feedbackBox.classList.remove('hidden');
    feedbackBox.classList.add('leo-success');
    feedbackBox.innerHTML = '🎉 Ты уже сдал(а) сегодняшнюю миссию, отличная работа! Возвращайся завтра за новым заданием.';
  } else {
    answerInput.disabled = false;
    submitBtn.disabled = false;
    answerInput.value = '';
  }

  modal.classList.remove('hidden');
  requestAnimationFrame(() => modal.classList.remove('opacity-0'));
  if (window.lucide) lucide.createIcons();
}

function closeLeoModal() {
  const modal = document.getElementById('leoModal');
  if (!modal) return;
  modal.classList.add('opacity-0');
  setTimeout(() => modal.classList.add('hidden'), 300);
}

// ---------- Отправка ответа Лео ----------

async function submitLeoMission() {
  const answerInput = document.getElementById('leoAnswerInput');
  const submitBtn = document.getElementById('leoSubmitBtn');
  const feedbackBox = document.getElementById('leoFeedbackBox');

  const answer = answerInput.value.trim();

  feedbackBox.classList.remove('leo-success', 'leo-error');

  if (!answer) {
    feedbackBox.classList.remove('hidden');
    feedbackBox.classList.add('leo-error');
    feedbackBox.innerHTML = 'Напиши пару предложений о том, что ты сделал(а) — тогда Лео сможет это проверить.';
    return;
  }

  const wordCount = answer.split(/\s+/).filter(Boolean).length;
  if (wordCount < LEO_MIN_WORDS) {
    feedbackBox.classList.remove('hidden');
    feedbackBox.classList.add('leo-error');
    feedbackBox.innerHTML = `Пиши чуть подробнее 🙂 Нужно минимум ${LEO_MIN_WORDS} слов, а у тебя сейчас ${wordCount}.`;
    return;
  }

  submitBtn.disabled = true;
  const originalBtnHTML = submitBtn.innerHTML;
  submitBtn.innerHTML = '<span class="animate-pulse">Лео проверяет ответ...</span>';

  try {
    const response = await fetch('/.netlify/functions/ai-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answer,
        mission: getTodayLeoMission(),
        history: getLeoHistory().map(h => h.text)
      })
    });

    const data = await response.json();

    feedbackBox.classList.remove('hidden');

    if (data.success) {
      feedbackBox.classList.add('leo-success');
      feedbackBox.innerHTML = data.message || '🎉 Отлично, миссия засчитана!';
      saveLeoHistoryEntry(answer);
      markTodayLeoMissionDone();
      answerInput.disabled = true;
      renderLeoWidget();
    } else {
      feedbackBox.classList.add('leo-error');
      feedbackBox.innerHTML = data.message || 'Лео думает, что тут можно доработать. Попробуй еще раз!';
      submitBtn.disabled = false;
    }
  } catch (err) {
    feedbackBox.classList.remove('hidden');
    feedbackBox.classList.add('leo-error');
    feedbackBox.innerHTML = 'Не удалось связаться с Лео. Проверь соединение и попробуй снова.';
    submitBtn.disabled = false;
  }

  submitBtn.innerHTML = originalBtnHTML;
  if (window.lucide) lucide.createIcons();
}

// ---------- Push-уведомления ----------

function initLeoNotifications() {
  if (!('Notification' in window)) return;

  if (Notification.permission === 'default') {
    Notification.requestPermission().then(() => sendLeoDailyNotification());
    return;
  }

  sendLeoDailyNotification();
}

function sendLeoDailyNotification() {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const todayKey = getLeoDayKey();
  if (localStorage.getItem(LEO_NOTIFY_KEY) === todayKey) return; // уже уведомляли сегодня
  if (isTodayLeoMissionDone()) return;

  try {
    const notification = new Notification("Leo's Daily Mission 🐧", {
      body: `Today's Mission => ${getTodayLeoMission()} [Start mission]`,
      icon: '/image/leo-face.png',
      badge: '/image/leo-face.png'
    });
    notification.onclick = () => {
      window.focus();
      openLeoModal();
    };
    localStorage.setItem(LEO_NOTIFY_KEY, todayKey);
  } catch (e) {
    // Уведомления недоступны в этом окружении (например, некоторые мобильные webview) — тихо игнорируем
  }
}
