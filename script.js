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
    majors: [ {name:'Business & Economics', share:16, top:true}, {name:'Computer Science', share:14}, {name:'Engineering', share:14}, {name:'Political Science / IR', share:12} ] }
];

function autoEnrichUniversityData(uni) {
  const flag = `https://flagcdn.com/w40/${uni.countryCode}.png`;
  const logo = `https://logo.clearbit.com/${uni.domain}`;
  const location = uni.state ? `${uni.city}, ${uni.state}, ${uni.country}` : `${uni.city}, ${uni.country}`;
  return { ...uni, flag, logo, location };
}

const DB = RAW_UNIVERSITIES.map(autoEnrichUniversityData);

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
}

function renderUniversities(filteredList = DB) {
  const list = document.getElementById('universityList');
  list.innerHTML = '';

  if (filteredList.length === 0) {
    list.innerHTML = `<p class="text-xs text-slate-400 text-center py-6">Ничего не найдено — попробуй изменить фильтры.</p>`;
    return;
  }

  const pending = user.gpaPending || user.ieltsPending;

  filteredList.forEach(uni => {
    let finalMatch = null, barColor = 'bg-slate-300', textColor = 'text-slate-400', matchLabel = t('pending_card_cta');

    if (!pending) {
      let gpaRatio = user.gpa / uni.minGPA;
      let baseChance = (100 - uni.rate * 1.5) * (gpaRatio * 0.9);
      if (user.ielts < uni.minIELTS) baseChance -= 20;
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

    const card = document.createElement('div');
    card.className = 'p-4 border border-slate-200/80 rounded-2xl bg-white hover:border-indigo-400 hover:shadow-lg transition duration-300 cursor-pointer group';
    card.onclick = () => openUniModal(uni.name);

    card.innerHTML = `
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-xl p-1 shrink-0 overflow-hidden group-hover:scale-105 transition">
            <img src="${uni.logo}" 
                 onerror="this.onerror=null; this.parentElement.innerHTML='<span class=\\'font-extrabold text-indigo-600 text-sm\\'>${uni.name.charAt(0)}</span>';" 
                 class="max-w-full max-h-full object-contain" 
                 alt="${uni.name}">
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <h4 class="font-extrabold text-slate-900 text-xs md:text-sm leading-snug group-hover:text-indigo-600 transition">${uni.name}</h4>
              <img src="${uni.flag}" class="w-4 h-3 rounded-sm object-cover shadow-sm shrink-0" alt="Flag">
            </div>
            <p class="text-[11px] text-slate-400">${uni.location} • <span class="text-indigo-600 font-medium">${uni.tuition}</span></p>
          </div>
        </div>
        <div class="text-right shrink-0">
          <span class="text-xs md:text-sm font-extrabold ${textColor}">${matchLabel}</span>
          <p class="text-[10px] text-slate-400">Мин. IELTS: ${uni.minIELTS} • Мин. GPA: ${uni.minGPA}</p>
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

  document.getElementById('modalUniPhoto').src = uni.photo;
  document.getElementById('modalUniName').innerText = uni.name;
  document.getElementById('modalUniLocation').innerHTML = `<img src="${uni.flag}" class="w-4 h-3 rounded-sm object-cover shadow-sm inline-block"> ${uni.location}`;
  document.getElementById('modalUniDesc').innerText = uni.description;

  const statsBox = document.getElementById('modalUniStats');
  if (statsBox) {
    const chips = [
      { icon: 'wallet', label: t('chip_tuition'), value: uni.tuition },
      { icon: 'bar-chart-2', label: t('chip_gpa'), value: uni.minGPA },
      { icon: 'languages', label: t('chip_ielts'), value: uni.minIELTS },
      { icon: 'percent', label: t('chip_rate'), value: `${uni.rate}%` }
    ];
    statsBox.innerHTML = chips.map(c => `
      <div class="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
        <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1"><i data-lucide="${c.icon}" class="w-3 h-3"></i>${c.label}</p>
        <p class="text-xs font-extrabold text-slate-800 mt-0.5">${c.value}</p>
      </div>
    `).join('');
  }

  const factsList = document.getElementById('modalUniFacts');
  factsList.innerHTML = uni.facts.map(fact => `
    <li class="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
      <div class="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
      <span>${fact}</span>
    </li>
  `).join('');

  const majorsBox = document.getElementById('modalUniMajors');
  if (majorsBox) {
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
  const cities = [...new Set(pool.map(u => u.state ? `${u.state} — ${u.city}` : u.city))].sort();
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
    const uniCityLabel = u.state ? `${u.state} — ${u.city}` : u.city;
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
