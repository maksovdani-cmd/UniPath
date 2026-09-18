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
function svgUri(svg) {
  return 'data:image/svg+xml,' + encodeURIComponent(svg.replace(/\s+/g, ' ').trim());
}

const SCN = {
  fuji: svgUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'>
    <rect width='800' height='400' fill='#eaf2f8'/>
    <circle cx='630' cy='100' r='55' fill='#ffd76a'/>
    <polygon points='400,80 560,330 240,330' fill='#5c7a99'/>
    <polygon points='400,80 460,190 340,190' fill='#ffffff'/>
    <rect y='330' width='800' height='70' fill='#4a7c59'/>
  </svg>`),
  sakura: svgUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'>
    <rect width='800' height='400' fill='#fde8ef'/>
    <path d='M0 350 Q200 310 400 335 T800 325 V400 H0 Z' fill='#6b8f71'/>
    <path d='M100 260 Q150 150 210 120' stroke='#7a5240' stroke-width='12' fill='none'/>
    <path d='M600 250 Q660 140 710 100' stroke='#7a5240' stroke-width='12' fill='none'/>
    <g fill='#f4a7c0'>
      <circle cx='150' cy='130' r='24'/><circle cx='195' cy='105' r='24'/><circle cx='230' cy='140' r='24'/>
      <circle cx='630' cy='95' r='24'/><circle cx='675' cy='75' r='24'/><circle cx='710' cy='110' r='24'/>
    </g>
  </svg>`),
  greatwall1: svgUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'>
    <rect width='800' height='400' fill='#f6e7c9'/>
    <circle cx='650' cy='90' r='50' fill='#e0763a'/>
    <path d='M0 280 L80 250 L120 280 L200 240 L240 275 L330 230 L370 270 L460 220 L500 265 L590 215 L630 260 L720 210 L800 250 V400 H0 Z' fill='#8a6a4a'/>
    <rect x='60' y='230' width='36' height='40' fill='#7a5a3c'/>
    <rect x='310' y='215' width='36' height='40' fill='#7a5a3c'/>
    <rect x='570' y='200' width='36' height='40' fill='#7a5a3c'/>
  </svg>`),
  greatwall2: svgUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'>
    <rect width='800' height='400' fill='#dcebf0'/>
    <circle cx='150' cy='90' r='45' fill='#ffffff' opacity='0.8'/>
    <path d='M0 300 L80 270 L120 300 L200 260 L240 295 L330 250 L370 290 L460 240 L500 285 L590 235 L630 280 L720 230 L800 270 V400 H0 Z' fill='#c0392b'/>
    <rect x='60' y='250' width='36' height='40' fill='#a5302a'/>
    <rect x='310' y='235' width='36' height='40' fill='#a5302a'/>
    <rect x='570' y='220' width='36' height='40' fill='#a5302a'/>
  </svg>`),
  hanok: svgUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'>
    <rect width='800' height='400' fill='#e8f0fb'/>
    <rect y='330' width='800' height='70' fill='#8fa876'/>
    <path d='M180 260 Q400 170 620 260 L620 290 L180 290 Z' fill='#274b6e'/>
    <rect x='250' y='290' width='300' height='60' fill='#c0392b'/>
    <path d='M150 265 Q400 185 650 265' stroke='#1a3550' stroke-width='8' fill='none'/>
  </svg>`),
  modernkorea: svgUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'>
    <rect width='800' height='400' fill='#0f1f3d'/>
    <rect x='120' y='150' width='70' height='200' fill='#22406b'/>
    <rect x='220' y='100' width='80' height='250' fill='#2c527f'/>
    <rect x='330' y='180' width='60' height='170' fill='#22406b'/>
    <rect x='420' y='60' width='90' height='290' fill='#37699e'/>
    <rect x='540' y='130' width='70' height='220' fill='#22406b'/>
    <rect x='630' y='170' width='80' height='180' fill='#2c527f'/>
    <circle cx='460' cy='90' r='6' fill='#ffd76a'/>
    <circle cx='250' cy='130' r='6' fill='#ffd76a'/>
  </svg>`),
  marina: svgUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'>
    <rect width='800' height='400' fill='#fdf1e0'/>
    <rect y='310' width='800' height='90' fill='#2b6a8f'/>
    <rect x='340' y='150' width='40' height='170' fill='#3a3a3a'/>
    <rect x='400' y='150' width='40' height='170' fill='#3a3a3a'/>
    <rect x='460' y='150' width='40' height='170' fill='#3a3a3a'/>
    <rect x='320' y='120' width='200' height='40' fill='#4a4a4a'/>
    <ellipse cx='150' cy='330' rx='60' ry='18' fill='#dfe6ea'/>
  </svg>`),
  harbourHK1: svgUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'>
    <rect width='800' height='400' fill='#e3edf5'/>
    <rect y='320' width='800' height='80' fill='#3d6e8f'/>
    <rect x='100' y='180' width='40' height='140' fill='#5a6b7a'/>
    <rect x='160' y='140' width='50' height='180' fill='#4a5b6a'/>
    <rect x='230' y='200' width='36' height='120' fill='#5a6b7a'/>
    <rect x='290' y='100' width='60' height='220' fill='#3a4b5a'/>
    <rect x='370' y='170' width='44' height='150' fill='#5a6b7a'/>
    <rect x='440' y='120' width='55' height='200' fill='#4a5b6a'/>
    <rect x='520' y='190' width='40' height='130' fill='#5a6b7a'/>
    <rect x='580' y='80' width='65' height='240' fill='#324556'/>
  </svg>`),
  harbourHK2: svgUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'>
    <rect width='800' height='400' fill='#f7e9e4'/>
    <rect y='320' width='800' height='80' fill='#a75d4a'/>
    <rect x='100' y='180' width='40' height='140' fill='#8a6250'/>
    <rect x='160' y='140' width='50' height='180' fill='#795546'/>
    <rect x='230' y='200' width='36' height='120' fill='#8a6250'/>
    <rect x='290' y='100' width='60' height='220' fill='#634638'/>
    <rect x='370' y='170' width='44' height='150' fill='#8a6250'/>
    <rect x='440' y='120' width='55' height='200' fill='#795546'/>
    <rect x='520' y='190' width='40' height='130' fill='#8a6250'/>
    <rect x='580' y='80' width='65' height='240' fill='#523a2e'/>
  </svg>`),
  indiagate: svgUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'>
    <rect width='800' height='400' fill='#f9e6c8'/>
    <rect y='330' width='800' height='70' fill='#9a7a4a'/>
    <rect x='340' y='140' width='120' height='180' fill='#c9a15a'/>
    <path d='M340 140 Q400 90 460 140' fill='#c9a15a'/>
    <rect x='300' y='300' width='200' height='20' fill='#a5804a'/>
  </svg>`),
  gatewayindia: svgUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'>
    <rect width='800' height='400' fill='#dcecf2'/>
    <rect y='320' width='800' height='80' fill='#3d7a94'/>
    <rect x='330' y='130' width='140' height='190' fill='#5a4a3a'/>
    <path d='M350 130 Q400 60 450 130 Z' fill='#5a4a3a'/>
    <rect x='370' y='180' width='60' height='140' fill='#dcecf2'/>
    <rect x='250' y='250' width='60' height='70' fill='#5a4a3a'/>
    <rect x='490' y='250' width='60' height='70' fill='#5a4a3a'/>
  </svg>`),
  eiffel: svgUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'>
    <rect width='800' height='400' fill='#fcebd8'/>
    <rect y='340' width='800' height='60' fill='#7a8a6a'/>
    <path d='M400 80 L340 340 L390 340 L400 220 L410 340 L460 340 Z' fill='#4a4a4a'/>
    <path d='M370 200 L430 200' stroke='#4a4a4a' stroke-width='6'/>
    <path d='M355 270 L445 270' stroke='#4a4a4a' stroke-width='6'/>
  </svg>`),
  notredame: svgUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'>
    <rect width='800' height='400' fill='#e9e3f2'/>
    <rect y='330' width='800' height='70' fill='#5b6b8a'/>
    <rect x='320' y='150' width='60' height='180' fill='#8a7a6a'/>
    <rect x='420' y='150' width='60' height='180' fill='#8a7a6a'/>
    <polygon points='320,150 350,100 380,150' fill='#6a5a4a'/>
    <polygon points='420,150 450,100 480,150' fill='#6a5a4a'/>
    <circle cx='400' cy='220' r='24' fill='#e9e3f2' stroke='#6a5a4a' stroke-width='4'/>
  </svg>`),
  duomo1: svgUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'>
    <rect width='800' height='400' fill='#fde9d6'/>
    <rect y='330' width='800' height='70' fill='#8a7050'/>
    <rect x='300' y='170' width='200' height='160' fill='#d8cbb0'/>
    <polygon points='300,170 400,100 500,170' fill='#c4b596'/>
    <polygon points='260,200 300,170 300,330 260,330' fill='#c4b596'/>
    <polygon points='500,170 540,200 540,330 500,330' fill='#c4b596'/>
    <line x1='400' y1='100' x2='400' y2='70' stroke='#8a7050' stroke-width='4'/>
  </svg>`),
  duomo2: svgUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'>
    <rect width='800' height='400' fill='#e4ecf4'/>
    <rect y='330' width='800' height='70' fill='#5a6a80'/>
    <rect x='300' y='170' width='200' height='160' fill='#aebccb'/>
    <polygon points='300,170 400,100 500,170' fill='#96a6b8'/>
    <polygon points='260,200 300,170 300,330 260,330' fill='#96a6b8'/>
    <polygon points='500,170 540,200 540,330 500,330' fill='#96a6b8'/>
    <line x1='400' y1='100' x2='400' y2='70' stroke='#5a6a80' stroke-width='4'/>
  </svg>`),
  windmill: svgUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'>
    <rect width='800' height='400' fill='#dcecef'/>
    <rect y='340' width='800' height='60' fill='#6a9955'/>
    <polygon points='390,340 380,200 410,200 400,340' fill='#c9a96a'/>
    <g stroke='#5a4a3a' stroke-width='6'>
      <line x1='395' y1='210' x2='340' y2='150'/>
      <line x1='395' y1='210' x2='450' y2='150'/>
      <line x1='395' y1='210' x2='340' y2='260'/>
      <line x1='395' y1='210' x2='450' y2='260'/>
    </g>
  </svg>`),
  canal: svgUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'>
    <rect width='800' height='400' fill='#f0e6d2'/>
    <rect y='320' width='800' height='80' fill='#5a7a95'/>
    <rect x='150' y='170' width='90' height='150' fill='#a5443a'/>
    <polygon points='150,170 195,130 240,170' fill='#7a2f28'/>
    <rect x='250' y='150' width='90' height='170' fill='#c9915a'/>
    <polygon points='250,150 295,110 340,150' fill='#a5713e'/>
    <rect x='350' y='190' width='90' height='130' fill='#8a6a4a'/>
    <polygon points='350,190 395,150 440,190' fill='#5a4a35'/>
  </svg>`),
  stockholm: svgUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'>
    <rect width='800' height='400' fill='#e6eef5'/>
    <rect y='320' width='800' height='80' fill='#3d6e8f'/>
    <rect x='200' y='190' width='60' height='130' fill='#a54a3a'/>
    <rect x='280' y='150' width='70' height='170' fill='#8a3a2f'/>
    <rect x='370' y='210' width='50' height='110' fill='#a54a3a'/>
    <rect x='440' y='170' width='65' height='150' fill='#8a3a2f'/>
    <rect x='520' y='200' width='55' height='120' fill='#a54a3a'/>
  </svg>`),
  lund: svgUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'>
    <rect width='800' height='400' fill='#f5efe0'/>
    <rect y='320' width='800' height='80' fill='#7a9560'/>
    <rect x='340' y='180' width='120' height='140' fill='#c9a96a'/>
    <polygon points='340,180 400,130 460,180' fill='#a5834a'/>
    <rect x='390' y='230' width='20' height='90' fill='#7a5a3a'/>
  </svg>`),
  copenhagen: svgUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'>
    <rect width='800' height='400' fill='#e0eef4'/>
    <rect y='320' width='800' height='80' fill='#3d7a94'/>
    <rect x='220' y='200' width='60' height='120' fill='#c9915a'/>
    <rect x='290' y='170' width='55' height='150' fill='#a5713e'/>
    <rect x='355' y='210' width='45' height='110' fill='#c9915a'/>
    <path d='M480 300 Q500 260 530 280 Q550 260 560 290 Q540 320 480 300 Z' fill='#9db8c4'/>
  </svg>`),
  trinity: svgUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'>
    <rect width='800' height='400' fill='#eaf4e6'/>
    <rect y='320' width='800' height='80' fill='#3f6b3f'/>
    <rect x='320' y='170' width='160' height='150' fill='#8a7a5a'/>
    <rect x='370' y='120' width='60' height='60' fill='#6a5c40'/>
    <rect x='390' y='80' width='20' height='45' fill='#6a5c40'/>
  </svg>`),
  ucd: svgUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'>
    <rect width='800' height='400' fill='#e6f0e0'/>
    <rect y='320' width='800' height='80' fill='#4a7a55'/>
    <rect x='260' y='190' width='90' height='130' fill='#3a5a70'/>
    <rect x='360' y='150' width='80' height='170' fill='#2c4658'/>
    <rect x='450' y='200' width='80' height='120' fill='#3a5a70'/>
  </svg>`),
  edinburgh: svgUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'>
    <rect width='800' height='400' fill='#d9dee6'/>
    <polygon points='250,330 300,180 380,330' fill='#6a6a6a'/>
    <rect x='330' y='150' width='50' height='90' fill='#5a5a5a'/>
    <rect x='400' y='190' width='45' height='140' fill='#6a6a6a'/>
    <rect y='330' width='800' height='70' fill='#4a5a4a'/>
  </svg>`),
  bigben: svgUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'>
    <rect width='800' height='400' fill='#e0e6ee'/>
    <rect y='330' width='800' height='70' fill='#5a7a95'/>
    <rect x='370' y='120' width='60' height='210' fill='#8a7a5a'/>
    <polygon points='370,120 400,80 430,120' fill='#6a5c40'/>
    <circle cx='400' cy='160' r='16' fill='#f0e6c8'/>
  </svg>`),
  manchester: svgUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'>
    <rect width='800' height='400' fill='#dfe3e6'/>
    <rect y='330' width='800' height='70' fill='#5a5a5a'/>
    <rect x='300' y='190' width='36' height='140' fill='#a5453a'/>
    <rect x='360' y='150' width='40' height='180' fill='#8a3a2f'/>
    <rect x='420' y='210' width='30' height='120' fill='#a5453a'/>
  </svg>`),
  tablemountain: svgUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'>
    <rect width='800' height='400' fill='#e6f0f5'/>
    <polygon points='200,300 260,150 560,150 620,300' fill='#7a6a55'/>
    <rect y='300' width='800' height='100' fill='#4a7a55'/>
  </svg>`),
  saopaulo: svgUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'>
    <rect width='800' height='400' fill='#fdeee0'/>
    <rect y='320' width='800' height='80' fill='#8a6a4a'/>
    <rect x='200' y='190' width='40' height='130' fill='#5a6b7a'/>
    <rect x='260' y='150' width='45' height='170' fill='#4a5b6a'/>
    <rect x='320' y='210' width='36' height='110' fill='#5a6b7a'/>
    <rect x='380' y='120' width='55' height='200' fill='#3a4b5a'/>
    <rect x='450' y='180' width='40' height='140' fill='#5a6b7a'/>
    <rect x='510' y='160' width='45' height='160' fill='#4a5b6a'/>
  </svg>`),
  monterrey: svgUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'>
    <rect width='800' height='400' fill='#fbe9d0'/>
    <polygon points='250,320 320,180 400,320' fill='#a5875a'/>
    <polygon points='380,320 450,140 540,320' fill='#8a6a4a'/>
    <rect y='320' width='800' height='80' fill='#c9a96a'/>
  </svg>`),
  beirut: svgUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'>
    <rect width='800' height='400' fill='#fdf0e0'/>
    <rect y='330' width='800' height='70' fill='#3d7a94'/>
    <path d='M400 330 L400 180 L370 180 L400 130 L430 180 L400 180' fill='#3f6b3f'/>
    <path d='M400 180 L360 220 M400 200 L440 240 M400 220 L365 260' stroke='#3f6b3f' stroke-width='6'/>
  </svg>`),
  redsea: svgUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'>
    <rect width='800' height='400' fill='#fbead2'/>
    <circle cx='650' cy='100' r='55' fill='#f0a35a'/>
    <path d='M0 260 Q200 230 400 255 T800 245 V400 H0 Z' fill='#d9b878'/>
    <path d='M0 330 Q200 310 400 328 T800 320 V400 H0 Z' fill='#2b6a8f'/>
  </svg>`),
  vienna: svgUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'>
    <rect width='800' height='400' fill='#fdf3e0'/>
    <rect y='330' width='800' height='70' fill='#7a9560'/>
    <rect x='280' y='210' width='240' height='120' fill='#d9b878'/>
    <rect x='340' y='160' width='30' height='170' fill='#c9a45a'/>
    <rect x='430' y='160' width='30' height='170' fill='#c9a45a'/>
    <polygon points='340,160 355,130 370,160' fill='#a5824a'/>
    <polygon points='430,160 445,130 460,160' fill='#a5824a'/>
  </svg>`),
  kremlin: svgUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'>
    <rect width='800' height='400' fill='#f5e6da'/>
    <rect y='330' width='800' height='70' fill='#8a3a2f'/>
    <rect x='300' y='210' width='200' height='120' fill='#a5453a'/>
    <ellipse cx='340' cy='190' rx='22' ry='30' fill='#d9a95a'/>
    <ellipse cx='400' cy='170' rx='26' ry='36' fill='#3d7a5a'/>
    <ellipse cx='460' cy='190' rx='22' ry='30' fill='#d9a95a'/>
    <polygon points='400,120 400,134' stroke='#8a3a2f'/>
  </svg>`),
  msutower: svgUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'>
    <rect width='800' height='400' fill='#e6ecf2'/>
    <rect y='330' width='800' height='70' fill='#4a5a70'/>
    <rect x='350' y='230' width='100' height='100' fill='#8a7a5a'/>
    <rect x='365' y='160' width='70' height='75' fill='#7a6c4e'/>
    <rect x='378' y='110' width='44' height='55' fill='#6a5c40'/>
    <polygon points='378,110 400,80 422,110' fill='#5a4c34'/>
    <line x1='400' y1='80' x2='400' y2='60' stroke='#5a4c34' stroke-width='4'/>
  </svg>`)
};


const RAW_UNIVERSITIES = [
  { name: 'Harvard University', domain: 'harvard.edu', country: 'США', countryCode: 'us', state: 'Массачусетс', city: 'Кембридж',
    system: 'us', livingCost: '≈ $18,000 / год (общежитие + питание)',
    minGPA: 3.9, minIELTS: 7.5, rate: 4, tuition: '$55,000 / год (Need-Blind Aid)',
    photo: 'https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?auto=format&fit=crop&w=800&q=80',
    description: 'Старейший вуз США (основан в 1636 г.) и член знаменитой Лиги Плюща. Признан мировым лидером в области научных исследований, бизнеса, права и медицины.',
    facts: ['Крупнейшая в мире академическая библиотека (более 20 млн томов).', 'Среди выпускников 8 президентов США и 161 лауреат Нобелевской премии.', 'Эндаумент университета превышает $50 миллиардов, что позволяет покрывать 100% нужд студентов (Full-Ride).'],
    majors: [ {name:'Business & Economics', share:24, top:true, note:'Самая выбираемая программа, тесная связь с Уолл-стрит и консалтингом.'}, {name:'Computer Science', share:20, note:'Быстрорастущее направление, партнёрство с MIT.'}, {name:'Political Science / IR', share:12}, {name:'Biology & Life Sciences', share:10} ] },

  { name: 'MIT', domain: 'mit.edu', country: 'США', countryCode: 'us', state: 'Массачусетс', city: 'Кембридж',
    system: 'us', livingCost: '≈ $18,000 / год (общежитие + питание)',
    minGPA: 3.9, minIELTS: 7.5, rate: 4, tuition: '$60,000 / год',
    photo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    description: 'Мировой лидер в инженерии и точных науках. Учебный процесс построен вокруг практических проектов и исследовательских лабораторий с первого курса.',
    facts: ['Выпускники MIT основали компании с суммарной выручкой, сравнимой с ВВП крупной страны.', 'Действует уникальная система Pass/No Record на первом семестре для адаптации студентов.', 'Один из мировых лидеров по числу патентов среди университетов.'],
    majors: [ {name:'Computer Science', share:32, top:true, note:'Флагманская программа, тесно связана с исследованиями в области ИИ.'}, {name:'Engineering', share:28}, {name:'Mathematics & Physics', share:15}, {name:'Data Science & AI', share:12} ] },

  { name: 'Stanford University', domain: 'stanford.edu', country: 'США', countryCode: 'us', state: 'Калифорния', city: 'Стэнфорд',
    system: 'us', livingCost: '≈ $19,000 / год (общежитие + питание)',
    minGPA: 3.9, minIELTS: 7.5, rate: 4, tuition: '$55,000 / год (Need-Blind Aid)',
    photo: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
    description: 'Расположен в самом сердце Кремниевой долины. Известен своей предпринимательской культурой, передовыми IT-программами и тесными связями с технологическими гигантами.',
    facts: ['Выпускники Стэнфорда основали Google, Nike, Netflix, HP и Instagram.', 'Университетский кампус — один из самых больших в мире (более 33 кв. км).', 'Собирает более $1 млрд внешнего финансирования на исследования ежегодно.'],
    majors: [ {name:'Computer Science', share:30, top:true, note:'Главный драйвер репутации университета, эпицентр Кремниевой долины.'}, {name:'Engineering', share:22}, {name:'Data Science & AI', share:18}, {name:'Business & Economics', share:12} ] },

  { name: 'UC Berkeley', domain: 'berkeley.edu', country: 'США', countryCode: 'us', state: 'Калифорния', city: 'Беркли',
    system: 'us', livingCost: '≈ $17,500 / год',
    minGPA: 3.8, minIELTS: 7.0, rate: 11, tuition: '≈ $45,000 / год (для иностранцев)',
    photo: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
    description: 'Флагман системы University of California. Один из сильнейших государственных университетов мира с мощной инженерной и IT-школой.',
    facts: ['Считается родиной множества открытий в физике, включая элементы таблицы Менделеева.', 'Сильнейшая в мире программа по Computer Science среди гос. вузов.', 'Активный студенческий и стартап-экосистема Bay Area.'],
    majors: [ {name:'Computer Science', share:26, top:true}, {name:'Engineering', share:20}, {name:'Business & Economics', share:16}, {name:'Data Science & AI', share:14} ] },

  { name: 'Caltech', domain: 'caltech.edu', country: 'США', countryCode: 'us', state: 'Калифорния', city: 'Пасадена',
    system: 'us', livingCost: '≈ $16,000 / год',
    minGPA: 3.95, minIELTS: 7.5, rate: 3, tuition: '≈ $60,000 / год',
    photo: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=800&q=80',
    description: 'Самый маленький и самый селективный технический университет США. Обучается всего около 1000 бакалавров, что создаёт крайне тесное академическое сообщество.',
    facts: ['Управляет знаменитой лабораторией реактивного движения NASA (JPL).', 'Один из самых высоких показателей Нобелевских лауреатов на душу студентов.', 'Известен легендарными первоапрельскими розыгрышами студентов.'],
    majors: [ {name:'Engineering', share:30, top:true}, {name:'Mathematics & Physics', share:28}, {name:'Computer Science', share:24}, {name:'Data Science & AI', share:10} ] },

  { name: 'Yale University', domain: 'yale.edu', country: 'США', countryCode: 'us', state: 'Коннектикут', city: 'Нью-Хейвен',
    system: 'us', livingCost: '≈ $16,500 / год',
    minGPA: 3.9, minIELTS: 7.5, rate: 5, tuition: '≈ $62,000 / год (Need-Blind Aid)',
    photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Yale_University_Old_Campus.JPG?width=800',
    description: 'Один из старейших университетов США, известен сильнейшей гуманитарной школой, театральной программой и системой резиденциальных колледжей.',
    facts: ['Основан в 1701 году, входит в тройку старейших вузов страны.', 'Обладает одной из крупнейших университетских художественных коллекций в мире.', 'Среди выпускников 5 президентов США.'],
    majors: [ {name:'Business & Economics', share:22, top:true}, {name:'Political Science / IR', share:16}, {name:'Biology & Life Sciences', share:14}, {name:'Law', share:10} ] },

  { name: 'Princeton University', domain: 'princeton.edu', country: 'США', countryCode: 'us', state: 'Нью-Джерси', city: 'Принстон',
    system: 'us', livingCost: '≈ $17,000 / год',
    minGPA: 3.9, minIELTS: 7.5, rate: 4, tuition: '≈ $58,000 / год (Need-Blind Aid)',
    photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nassau_Hall_Princeton.JPG?width=800',
    description: 'Один из вузов Лиги Плюща с сильнейшим упором на бакалавриат и обязательной дипломной работой (senior thesis) для каждого студента.',
    facts: ['Не имеет медицинской и бизнес-школы — весь фокус на бакалавриате.', 'Один из крупнейших эндаументов на одного студента в мире.', 'Кампус признан одним из самых красивых в США.'],
    majors: [ {name:'Business & Economics', share:20, top:true}, {name:'Computer Science', share:18}, {name:'Engineering', share:14}, {name:'Political Science / IR', share:12} ] },

  { name: 'Columbia University', domain: 'columbia.edu', country: 'США', countryCode: 'us', state: 'Нью-Йорк', city: 'Нью-Йорк',
    system: 'us', livingCost: '≈ $22,000 / год (один из самых дорогих городов США)',
    minGPA: 3.85, minIELTS: 7.5, rate: 4, tuition: '≈ $68,000 / год',
    photo: 'https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&w=800&q=80',
    description: 'Университет Лиги Плюща в самом центре Манхэттена, знаменит программой Core Curriculum и сильнейшей журналистской школой.',
    facts: ['Присуждает Пулитцеровскую премию — самую престижную журналистскую награду в мире.', 'Каждый студент проходит обязательный курс Core Curriculum по западной цивилизации.', 'Рядом расположены штаб-квартиры крупнейших банков и медиакорпораций.'],
    majors: [ {name:'Business & Economics', share:20, top:true}, {name:'Political Science / IR', share:16}, {name:'Computer Science', share:15}, {name:'Law', share:10} ] },

  { name: 'New York University (NYU)', domain: 'nyu.edu', country: 'США', countryCode: 'us', state: 'Нью-Йорк', city: 'Нью-Йорк',
    system: 'us', livingCost: '≈ $22,000 / год (один из самых дорогих городов США)',
    minGPA: 3.7, minIELTS: 7.5, rate: 12, tuition: '$58,000 / год',
    photo: 'https://images.unsplash.com/photo-1541336032412-2048a678540d?auto=format&fit=crop&w=800&q=80',
    description: 'Глобальный университет с главным кампусом в престижном районе Манхэттена (Гринвич-Виллидж). Делает упор на международное образование и практический опыт в мегаполисе.',
    facts: ['Кампус не имеет традиционных границ: здания университета интегрированы прямо в улицы Нью-Йорка.', 'Имеет полноценные, выдающие дипломы кампусы в Абу-Даби и Шанхае.', 'Среди выпускников больше всего обладателей премии Оскар, чем у любого другого университета в мире.'],
    majors: [ {name:'Business & Economics', share:22, top:true}, {name:'Design & Architecture', share:14}, {name:'Computer Science', share:14}, {name:'Political Science / IR', share:10} ] },

  { name: 'University of Chicago', domain: 'uchicago.edu', country: 'США', countryCode: 'us', state: 'Иллинойс', city: 'Чикаго',
    system: 'us', livingCost: '≈ $16,000 / год',
    minGPA: 3.85, minIELTS: 7.5, rate: 5, tuition: '≈ $65,000 / год',
    photo: 'https://images.unsplash.com/photo-1494783367193-149034c05e8f?auto=format&fit=crop&w=800&q=80',
    description: 'Известен строгим академическим духом, сильнейшей экономической школой (родина Chicago School of Economics) и обязательным широким гуманитарным ядром.',
    facts: ['Выпускники и преподаватели получили более 90 Нобелевских премий.', 'Известен девизом "Пусть растёт знание, и пусть жизнь обогащается им".', 'Считается одним из интеллектуально самых требовательных вузов США.'],
    majors: [ {name:'Business & Economics', share:24, top:true}, {name:'Mathematics & Physics', share:16}, {name:'Political Science / IR', share:14}, {name:'Computer Science', share:12} ] },

  { name: 'University of Oxford', domain: 'ox.ac.uk', country: 'Великобритания', countryCode: 'gb', state: null, city: 'Оксфорд',
    system: 'uk', livingCost: '≈ £12,500 / год',
    minGPA: 3.8, minIELTS: 7.5, rate: 12, tuition: '£38,000 / год',
    photo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
    description: 'Старейший англоязычный университет в мире. Уникален своей системой независимых колледжей и индивидуальными занятиями (тьюториалами), где преподаватель работает с 1-2 студентами.',
    facts: ['Обучение здесь ведется с 1096 года.', 'Оксфорд выпустил 30 премьер-министров Великобритании.', 'Слово "Оксфорд" во всем мире ассоциируется с самым авторитетным словарем английского языка (OED).'],
    majors: [ {name:'Political Science / IR', share:18, top:true}, {name:'Business & Economics', share:16}, {name:'Law', share:14}, {name:'Medicine', share:12} ] },

  { name: 'University of Cambridge', domain: 'cam.ac.uk', country: 'Великобритания', countryCode: 'gb', state: null, city: 'Кембридж',
    system: 'uk', livingCost: '≈ £13,000 / год (общежитие + питание)',
    minGPA: 3.85, minIELTS: 7.5, rate: 13, tuition: '£35,000 / год',
    photo: 'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?auto=format&fit=crop&w=800&q=80',
    description: 'Вечный соперник Оксфорда, лидирует в точных науках, математике и инженерии. Также построен вокруг системы независимых колледжей.',
    facts: ['Связан с 120 Нобелевскими лауреатами — больше, чем у любого другого университета.', 'Здесь Уотсон и Крик открыли структуру ДНК.', 'Ежегодная регата с Оксфордом (The Boat Race) — одно из старейших спортивных событий мира.'],
    majors: [ {name:'Mathematics & Physics', share:20, top:true}, {name:'Engineering', share:16}, {name:'Computer Science', share:14}, {name:'Medicine', share:12} ] },

  { name: 'Imperial College London', domain: 'imperial.ac.uk', country: 'Великобритания', countryCode: 'gb', state: null, city: 'Лондон',
    system: 'uk', livingCost: '≈ £16,000 / год (самый дорогой город Великобритании)',
    minGPA: 3.75, minIELTS: 7.0, rate: 11, tuition: '£38,000 / год',
    photo: 'https://images.unsplash.com/photo-1543832923-44667a44c804?auto=format&fit=crop&w=800&q=80',
    description: 'Технический вуз мирового уровня, специализирующийся исключительно на науке, инженерии, медицине и бизнесе — без гуманитарных факультетов.',
    facts: ['Здесь Александр Флеминг открыл пенициллин.', 'Один из немногих британских вузов, полностью сфокусированных на STEM.', 'Тесно сотрудничает с лондонским Сити и инвестбанками.'],
    majors: [ {name:'Engineering', share:26, top:true}, {name:'Computer Science', share:22}, {name:'Medicine', share:18}, {name:'Mathematics & Physics', share:14} ] },

  { name: 'London School of Economics (LSE)', domain: 'lse.ac.uk', country: 'Великобритания', countryCode: 'gb', state: null, city: 'Лондон',
    system: 'uk', livingCost: '≈ £16,000 / год (самый дорогой город Великобритании)',
    minGPA: 3.75, minIELTS: 7.0, rate: 8, tuition: '£25,000 / год',
    photo: 'https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&w=800&q=80',
    description: 'Один из ведущих в мире вузов по экономике, политологии и социальным наукам, расположен в самом центре Лондона.',
    facts: ['Среди выпускников 18 глав государств и 20 лауреатов Нобелевской премии по экономике.', 'Девиз университета: "Постигать причины вещей".', 'Не имеет собственного кампуса — университет буквально "растворён" в центре Лондона.'],
    majors: [ {name:'Business & Economics', share:30, top:true}, {name:'Political Science / IR', share:22}, {name:'Law', share:14}, {name:'Data Science & AI', share:10} ] },

  { name: 'University of Toronto', domain: 'utoronto.ca', country: 'Канада', countryCode: 'ca', state: 'Онтарио', city: 'Торонто',
    system: 'canada', livingCost: '≈ CAD $16,000 / год',
    minGPA: 3.6, minIELTS: 7.0, rate: 40, tuition: 'CAD $45,000 / год',
    photo: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80',
    description: 'Крупнейший и самый престижный исследовательский университет Канады. Мировой центр в области медицины, инженерии и развития искусственного интеллекта.',
    facts: ['Именно в стенах этого университета в 1921 году был открыт инсулин.', 'Считается родиной глубокого обучения (Deep Learning) благодаря работе Джеффри Хинтона.', 'Ежегодно получает самое большое финансирование среди канадских вузов.'],
    majors: [ {name:'Computer Science', share:20, top:true}, {name:'Business & Economics', share:16}, {name:'Engineering', share:14}, {name:'Biology & Life Sciences', share:12} ] },

  { name: 'McGill University', domain: 'mcgill.ca', country: 'Канада', countryCode: 'ca', state: 'Квебек', city: 'Монреаль',
    system: 'canada', livingCost: '≈ CAD $13,000 / год',
    minGPA: 3.5, minIELTS: 6.5, rate: 46, tuition: 'CAD $35,000 / год',
    photo: 'https://images.unsplash.com/photo-1519832979-6fa011b87667?auto=format&fit=crop&w=800&q=80',
    description: 'Один из самых престижных университетов Канады, часто называемый "Гарвардом Севера". Расположен в двуязычном Монреале.',
    facts: ['Обучение ведется на английском языке даже во франкоязычной провинции Квебек.', 'Кампус находится у подножия горы Мон-Руаяль в центре города.', 'Среди выпускников — нобелевские лауреаты и главы правительств.'],
    majors: [ {name:'Business & Economics', share:18, top:true}, {name:'Biology & Life Sciences', share:16}, {name:'Political Science / IR', share:12}, {name:'Engineering', share:10} ] },

  { name: 'University of British Columbia (UBC)', domain: 'ubc.ca', country: 'Канада', countryCode: 'ca', state: 'Британская Колумбия', city: 'Ванкувер',
    system: 'canada', livingCost: '≈ CAD $17,000 / год',
    minGPA: 3.5, minIELTS: 6.5, rate: 52, tuition: 'CAD $40,000 / год',
    photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/University_of_British_Columbia_as_seen_from_the_new_SUB.JPG?width=800',
    description: 'Один из крупнейших исследовательских университетов Канады с потрясающим кампусом на побережье Тихого океана.',
    facts: ['Кампус расположен на полуострове с видом на океан и горы.', 'Сильная программа по лесным и природным наукам благодаря уникальному расположению.', 'Один из самых мультикультурных студенческих городков Северной Америки.'],
    majors: [ {name:'Business & Economics', share:18, top:true}, {name:'Computer Science', share:16}, {name:'Biology & Life Sciences', share:14}, {name:'Engineering', share:12} ] },

  { name: 'ETH Zurich', domain: 'ethz.ch', country: 'Швейцария', countryCode: 'ch', state: null, city: 'Цюрих',
    system: 'europe', livingCost: '≈ CHF 18,000 / год (один из самых дорогих городов мира)',
    minGPA: 3.7, minIELTS: 7.0, rate: 27, tuition: '≈ CHF 1,500 / год',
    photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/ETH_Zurich,_Swiss_Federal_Institute_of_Technology,_Zurich_University_(Ank_Kumar)_06.jpg?width=800',
    description: 'Один из сильнейших технических университетов мира с одной из самых низких стоимостей обучения среди топ-вузов планеты.',
    facts: ['Здесь учился и работал Альберт Эйнштейн.', 'Стоимость обучения — одна из самых низких в мире для вуза такого уровня.', 'Постоянно входит в топ-10 мировых рейтингов по инженерии и IT.'],
    majors: [ {name:'Engineering', share:28, top:true}, {name:'Computer Science', share:24}, {name:'Mathematics & Physics', share:18}, {name:'Data Science & AI', share:14} ] },

  { name: 'Technical University of Munich', domain: 'tum.de', country: 'Германия', countryCode: 'de', state: 'Бавария', city: 'Мюнхен',
    system: 'europe', livingCost: '≈ €12,000 / год',
    minGPA: 3.5, minIELTS: 6.5, rate: 8, tuition: '≈ €150 / семестр (почти бесплатно)',
    photo: 'https://images.unsplash.com/photo-1595867818082-083862f3d630?auto=format&fit=crop&w=800&q=80',
    description: 'Ведущий технический университет Германии. Государственные вузы страны почти не берут плату за обучение даже с иностранных студентов.',
    facts: ['Обучение фактически бесплатное — платится только небольшой семестровый взнос.', 'Тесно сотрудничает с BMW, Siemens и другими промышленными гигантами.', 'Один из первых европейских вузов, получивших статус "Университета передового опыта".'],
    majors: [ {name:'Engineering', share:30, top:true}, {name:'Computer Science', share:22}, {name:'Mathematics & Physics', share:16}, {name:'Data Science & AI', share:12} ] },

  { name: 'University of Melbourne', domain: 'unimelb.edu.au', country: 'Австралия', countryCode: 'au', state: 'Виктория', city: 'Мельбурн',
    system: 'australia', livingCost: '≈ AUD $22,000 / год',
    minGPA: 3.5, minIELTS: 6.5, rate: 30, tuition: '≈ AUD $45,000 / год',
    photo: 'https://images.unsplash.com/photo-1514395462725-fb4566210144?auto=format&fit=crop&w=800&q=80',
    description: 'Один из ведущих университетов Южного полушария, известен гибкой Melbourne Model — модульной системой бакалавриата.',
    facts: ['Постоянно занимает 1 место в Австралии по академической репутации.', 'Кампус находится в одном из самых "пригодных для жизни" городов мира.', 'Сильная программа двойных дипломов с университетами Азии.'],
    majors: [ {name:'Business & Economics', share:18, top:true}, {name:'Medicine', share:14}, {name:'Biology & Life Sciences', share:12}, {name:'Law', share:10} ] },

  { name: 'National University of Singapore (NUS)', domain: 'nus.edu.sg', country: 'Сингапур', countryCode: 'sg', state: null, city: 'Сингапур',
    system: 'asia', livingCost: '≈ SGD $14,000 / год',
    minGPA: 3.7, minIELTS: 7.0, rate: 8, tuition: '≈ SGD $30,000 / год',
    photo: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
    description: 'Лучший университет Азии по большинству мировых рейтингов, с сильнейшими программами по бизнесу, инженерии и IT.',
    facts: ['Постоянно входит в топ-15 мировых рейтингов университетов.', 'Тесно связан со стартап-экосистемой Юго-Восточной Азии.', 'Предлагает уникальные программы двойных дипломов с Yale и другими вузами.'],
    majors: [ {name:'Business & Economics', share:20, top:true}, {name:'Computer Science', share:18}, {name:'Engineering', share:16}, {name:'Data Science & AI', share:14} ] },

  { name: 'Nazarbayev University', domain: 'nu.edu.kz', country: 'Казахстан', countryCode: 'kz', state: null, city: 'Астана',
    system: 'other', livingCost: '≈ $5,000 / год',
    minGPA: 3.3, minIELTS: 6.0, rate: 12, tuition: '≈ $14,000 / год (много грантов от государства)',
    photo: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80',
    description: 'Ведущий исследовательский университет Центральной Азии с преподаванием на английском языке и партнёрствами с топовыми западными вузами.',
    facts: ['Большинство студентов учатся по государственным грантам, покрывающим полную стоимость.', 'Учебные программы разработаны совместно с University of Cambridge, Duke и другими партнёрами.', 'Отличный "мост" для абитуриентов из СНГ перед поступлением в топ-вузы США/Европы.'],
    majors: [ {name:'Business & Economics', share:16, top:true}, {name:'Computer Science', share:14}, {name:'Engineering', share:14}, {name:'Political Science / IR', share:12} ] },

  { name: 'Tsinghua University', domain: 'tsinghua.edu.cn', country: 'Китай', countryCode: 'cn', state: null, city: 'Пекин',
    system: 'asia', livingCost: '≈ ¥40,000 / год',
    minGPA: 3.8, minIELTS: 6.5, rate: 2, tuition: '≈ ¥30,000 / год (для иностранцев)',
    photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Main_building_of_Tsinghua_University_(20190709103617).jpg?width=800',
    description: 'Один из самых престижных технических университетов мира, часто называют "китайским MIT". Лидер по числу патентов и инженерных исследований в Азии.',
    facts: ['Крайне низкий процент поступления даже среди местных абитуриентов.', 'Сильнейшая инженерная и IT-школа континентального Китая.', 'Активно развивает программы на английском языке для иностранных студентов.'],
    majors: [ {name:'Engineering', share:26, top:true}, {name:'Computer Science', share:24}, {name:'Data Science & AI', share:16}, {name:'Business & Economics', share:12} ] },

  { name: 'Peking University', domain: 'pku.edu.cn', country: 'Китай', countryCode: 'cn', state: null, city: 'Пекин',
    system: 'asia', livingCost: '≈ ¥40,000 / год',
    minGPA: 3.8, minIELTS: 6.5, rate: 3, tuition: '≈ ¥33,000 / год (для иностранцев)',
    photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Red_building_of_Peking_University.JPG?width=800',
    description: 'Старейший и один из самых престижных университетов Китая, известен сильными гуманитарными и естественнонаучными школами.',
    facts: ['Основан в 1898 году, считается символом современного китайского образования.', 'Сильная программа двойных дипломов с ведущими вузами Европы и США.', 'Один из лидеров по числу публикаций в топовых научных журналах в Азии.'],
    majors: [ {name:'Business & Economics', share:20, top:true}, {name:'Political Science / IR', share:16}, {name:'Computer Science', share:14}, {name:'Biology & Life Sciences', share:12} ] },

  { name: 'University of Tokyo', domain: 'u-tokyo.ac.jp', country: 'Япония', countryCode: 'jp', state: null, city: 'Токио',
    system: 'asia', livingCost: '≈ ¥1,200,000 / год',
    minGPA: 3.7, minIELTS: 6.5, rate: 24, tuition: '≈ ¥535,800 / год',
    photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Yasuda_Auditorium,_Tokyo_University_-_Nov_2005.JPG?width=800',
    description: 'Самый престижный университет Японии, лидер страны по числу нобелевских лауреатов и научных публикаций.',
    facts: ['Считается лучшим университетом Японии практически по всем мировым рейтингам.', 'Сильная традиция в инженерии, физике и медицине.', 'Государственные японские университеты предлагают одну из самых доступных стоимостей обучения среди топ-вузов мира.'],
    majors: [ {name:'Engineering', share:22, top:true}, {name:'Mathematics & Physics', share:18}, {name:'Medicine', share:14}, {name:'Computer Science', share:12} ] },

  { name: 'Kyoto University', domain: 'kyoto-u.ac.jp', country: 'Япония', countryCode: 'jp', state: null, city: 'Киото',
    system: 'asia', livingCost: '≈ ¥1,000,000 / год',
    minGPA: 3.6, minIELTS: 6.5, rate: 25, tuition: '≈ ¥535,800 / год',
    photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kyoto_University_Clock_Tower.jpg?width=800',
    description: 'Второй по престижности университет Японии, известен свободой в организации учебного процесса и сильной исследовательской культурой.',
    facts: ['Больше нобелевских лауреатов, чем у любого другого университета Японии, кроме Токийского.', 'Известен неформальным, "вольным" студенческим духом кампуса.', 'Сильная научная школа в химии и фундаментальной физике.'],
    majors: [ {name:'Mathematics & Physics', share:20, top:true}, {name:'Biology & Life Sciences', share:16}, {name:'Engineering', share:14}, {name:'Medicine', share:12} ] },

  { name: 'Seoul National University', domain: 'snu.ac.kr', country: 'Южная Корея', countryCode: 'kr', state: null, city: 'Сеул',
    system: 'asia', livingCost: '≈ ₩10,000,000 / год',
    minGPA: 3.7, minIELTS: 6.5, rate: 15, tuition: '≈ ₩4,000,000 / семестр',
    photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Seoul_National_University_Main_Gate_at_Night.jpg?width=800',
    description: 'Самый престижный университет Южной Кореи, лидер практически во всех академических рейтингах страны.',
    facts: ['Считается корейским аналогом Лиги Плюща по престижу диплома.', 'Сильная государственная поддержка исследований в инженерии и биотехнологиях.', 'Выпускники доминируют в топ-менеджменте крупнейших корейских корпораций.'],
    majors: [ {name:'Engineering', share:22, top:true}, {name:'Business & Economics', share:18}, {name:'Computer Science', share:14}, {name:'Medicine', share:12} ] },

  { name: 'KAIST', domain: 'kaist.ac.kr', country: 'Южная Корея', countryCode: 'kr', state: null, city: 'Тэджон',
    system: 'asia', livingCost: '≈ ₩7,000,000 / год',
    minGPA: 3.8, minIELTS: 6.5, rate: 12, tuition: '≈ $3,000 / год (большинство студентов на стипендиях)',
    photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/KAIST_campus_at_night.jpg?width=800',
    description: 'Ведущий технический университет Кореи, полностью сфокусирован на инженерии, IT и естественных науках.',
    facts: ['Все занятия ведутся на английском языке.', 'Тесно сотрудничает с Samsung, LG и другими технологическими гигантами.', 'Большинство студентов обучается по государственным стипендиям.'],
    majors: [ {name:'Computer Science', share:28, top:true}, {name:'Engineering', share:26}, {name:'Data Science & AI', share:16}, {name:'Mathematics & Physics', share:10} ] },

  { name: 'Nanyang Technological University (NTU)', domain: 'ntu.edu.sg', country: 'Сингапур', countryCode: 'sg', state: null, city: 'Сингапур',
    system: 'asia', livingCost: '≈ SGD $14,000 / год',
    minGPA: 3.7, minIELTS: 7.0, rate: 9, tuition: '≈ SGD $30,000 / год',
    photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/School_of_Art,_Design_and_Media,_Nanyang_Technological_University,_Singapore_-_20151028.jpg?width=800',
    description: 'Один из самых быстрорастущих технических университетов мира, соперничает с NUS за звание лучшего вуза Сингапура.',
    facts: ['Один из самых молодых университетов в мировом топ-20 рейтингов.', 'Сильнейшая инженерная школа Юго-Восточной Азии.', 'Кампус считается одним из самых современных и "зелёных" в мире.'],
    majors: [ {name:'Engineering', share:24, top:true}, {name:'Computer Science', share:20}, {name:'Business & Economics', share:14}, {name:'Data Science & AI', share:12} ] },

  { name: 'University of Hong Kong (HKU)', domain: 'hku.hk', country: 'Гонконг', countryCode: 'hk', state: null, city: 'Гонконг',
    system: 'asia', livingCost: '≈ HKD $90,000 / год',
    minGPA: 3.7, minIELTS: 7.0, rate: 10, tuition: '≈ HKD $215,000 / год',
    photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Main_Building_of_the_University_of_Hong_Kong_and_clock_tower.JPG?width=800',
    description: 'Старейший и один из самых престижных университетов Гонконга, известен сильной юридической и медицинской школами.',
    facts: ['Обучение в основном на английском языке.', 'Один из главных финансовых и образовательных хабов Азии.', 'Сильные связи с международным банковским и юридическим сектором.'],
    majors: [ {name:'Business & Economics', share:22, top:true}, {name:'Law', share:16}, {name:'Medicine', share:14}, {name:'Computer Science', share:12} ] },

  { name: 'Hong Kong University of Science and Technology (HKUST)', domain: 'ust.hk', country: 'Гонконг', countryCode: 'hk', state: null, city: 'Гонконг',
    system: 'asia', livingCost: '≈ HKD $90,000 / год',
    minGPA: 3.7, minIELTS: 7.0, rate: 11, tuition: '≈ HKD $170,000 / год',
    photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/HKUST_campus_view_looking_from_above.jpg?width=800',
    description: 'Молодой, но крайне быстро выросший в престиже технический университет, специализируется на инженерии и бизнесе.',
    facts: ['Один из самых молодых университетов в мировом топ-50.', 'Сильная программа двойных дипломов по бизнесу с топ-школами США.', 'Активная стартап-экосистема кампуса.'],
    majors: [ {name:'Engineering', share:24, top:true}, {name:'Business & Economics', share:20}, {name:'Computer Science', share:18}, {name:'Data Science & AI', share:12} ] },

  { name: 'Indian Institute of Technology Bombay (IIT Bombay)', domain: 'iitb.ac.in', country: 'Индия', countryCode: 'in', state: 'Махараштра', city: 'Мумбаи',
    system: 'asia', livingCost: '≈ $3,000 / год',
    minGPA: 3.6, minIELTS: 6.5, rate: 1, tuition: '≈ ₹200,000 / год',
    photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Main_building_in_IIT_Bombay.jpg?width=800',
    description: 'Один из самых престижных технических университетов Индии, попасть можно только через крайне сложный экзамен JEE Advanced.',
    facts: ['Один из самых низких процентов поступления среди технических вузов мира.', 'Выпускники занимают руководящие позиции в Google, Microsoft и крупнейших индийских корпорациях.', 'Обучение ведётся полностью на английском языке.'],
    majors: [ {name:'Engineering', share:30, top:true}, {name:'Computer Science', share:26}, {name:'Data Science & AI', share:14}, {name:'Mathematics & Physics', share:10} ] },

  { name: 'Indian Institute of Technology Delhi (IIT Delhi)', domain: 'iitd.ac.in', country: 'Индия', countryCode: 'in', state: 'Дели', city: 'Нью-Дели',
    system: 'asia', livingCost: '≈ $3,000 / год',
    minGPA: 3.6, minIELTS: 6.5, rate: 1, tuition: '≈ ₹200,000 / год',
    photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/IIT_Delhi_Main_building.jpg?width=800',
    description: 'Один из ведущих технических университетов Индии, входит в число самых селективных вузов мира по проценту поступления.',
    facts: ['Приём производится централизованно через экзамен JEE Advanced.', 'Сильная инженерная и предпринимательская экосистема.', 'Один из лидеров технологических стартапов Индии среди выпускников.'],
    majors: [ {name:'Engineering', share:28, top:true}, {name:'Computer Science', share:26}, {name:'Data Science & AI', share:16}, {name:'Mathematics & Physics', share:10} ] },

  { name: 'Sciences Po', domain: 'sciencespo.fr', country: 'Франция', countryCode: 'fr', state: null, city: 'Париж',
    system: 'europe', livingCost: '≈ €12,000 / год',
    minGPA: 3.5, minIELTS: 7.0, rate: 17, tuition: '≈ €14,000 / год (зависит от дохода семьи)',
    photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sciences_Po_Paris,_28_rue_des_Saints-P%C3%A8res,_Paris_7e_3.jpg?width=800',
    description: 'Ведущая французская школа социальных и политических наук, кузница дипломатов, политиков и журналистов.',
    facts: ['Среди выпускников — множество президентов Франции и глав международных организаций.', 'Стоимость обучения зависит от дохода семьи студента.', 'Сильнейшая программа по международным отношениям в континентальной Европе.'],
    majors: [ {name:'Political Science / IR', share:32, top:true}, {name:'Law', share:16}, {name:'Business & Economics', share:14}, {name:'Design & Architecture', share:8} ] },

  { name: 'Sorbonne University', domain: 'sorbonne-universite.fr', country: 'Франция', countryCode: 'fr', state: null, city: 'Париж',
    system: 'europe', livingCost: '≈ €12,000 / год',
    minGPA: 3.4, minIELTS: 6.5, rate: 40, tuition: '≈ €3,770 / год (гос. тариф)',
    photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sorbonne_university_main_building_entrance.jpg?width=800',
    description: 'Один из старейших университетов мира, наследник средневекового парижского университета, силён в гуманитарных и естественных науках.',
    facts: ['Исторические корни восходят к XIII веку.', 'Государственные французские вузы — один из самых доступных вариантов обучения в Европе.', 'Расположен в самом центре Латинского квартала Парижа.'],
    majors: [ {name:'Biology & Life Sciences', share:18, top:true}, {name:'Mathematics & Physics', share:16}, {name:'Political Science / IR', share:12}, {name:'Medicine', share:10} ] },

  { name: 'Bocconi University', domain: 'unibocconi.it', country: 'Италия', countryCode: 'it', state: null, city: 'Милан',
    system: 'europe', livingCost: '≈ €11,000 / год',
    minGPA: 3.6, minIELTS: 7.0, rate: 18, tuition: '≈ €14,000 / год (зависит от дохода семьи)',
    photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Universit%C3%A0_degli_studi_Luigi_Bocconi_-_Milano.jpg?width=800',
    description: 'Ведущая бизнес-школа Италии и одна из сильнейших в Европе, известна тесными связями с международным финансовым сектором.',
    facts: ['Считается итальянским эквивалентом London Business School.', 'Стоимость обучения гибко зависит от финансового положения семьи.', 'Сильные карьерные связи с инвестбанками Лондона и Милана.'],
    majors: [ {name:'Business & Economics', share:34, top:true}, {name:'Data Science & AI', share:14}, {name:'Political Science / IR', share:12}, {name:'Law', share:8} ] },

  { name: 'Politecnico di Milano', domain: 'polimi.it', country: 'Италия', countryCode: 'it', state: null, city: 'Милан',
    system: 'europe', livingCost: '≈ €11,000 / год',
    minGPA: 3.4, minIELTS: 6.0, rate: 35, tuition: '≈ €3,900 / год (зависит от дохода семьи)',
    photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Politecnico_di_Milano.jpg?width=800',
    description: 'Ведущий технический университет Италии, особенно силён в архитектуре, дизайне и инженерии.',
    facts: ['Одна из сильнейших в мире школ промышленного дизайна.', 'Стоимость обучения одна из самых доступных среди топовых технических вузов Европы.', 'Тесно связан с итальянской автомобильной и дизайнерской индустрией.'],
    majors: [ {name:'Engineering', share:26, top:true}, {name:'Design & Architecture', share:22}, {name:'Computer Science', share:14}, {name:'Mathematics & Physics', share:10} ] },

  { name: 'Delft University of Technology (TU Delft)', domain: 'tudelft.nl', country: 'Нидерланды', countryCode: 'nl', state: null, city: 'Делфт',
    system: 'europe', livingCost: '≈ €11,000 / год',
    minGPA: 3.5, minIELTS: 6.5, rate: 35, tuition: '≈ €18,000 / год (для не-ЕС)',
    photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Aerial_view_of_TU_Delft_campus.jpg?width=800',
    description: 'Крупнейший и самый престижный технический университет Нидерландов, известен сильной программой по инженерии и архитектуре.',
    facts: ['Родина многих инноваций в области водного строительства и гидротехники.', 'Тесно сотрудничает с крупнейшими европейскими инженерными компаниями.', 'Один из лидеров в исследованиях устойчивой энергетики в Европе.'],
    majors: [ {name:'Engineering', share:30, top:true}, {name:'Computer Science', share:18}, {name:'Design & Architecture', share:16}, {name:'Mathematics & Physics', share:10} ] },

  { name: 'University of Amsterdam', domain: 'uva.nl', country: 'Нидерланды', countryCode: 'nl', state: null, city: 'Амстердам',
    system: 'europe', livingCost: '≈ €14,000 / год',
    minGPA: 3.4, minIELTS: 6.5, rate: 40, tuition: '≈ €15,000 / год (для не-ЕС)',
    photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/University_of_Amsterdam_235_2094.jpg?width=800',
    description: 'Один из крупнейших исследовательских университетов Европы, силён в социальных науках, экономике и медиа.',
    facts: ['Один из самых интернациональных студенческих городов Европы.', 'Много программ преподаётся полностью на английском языке.', 'Расположен в самом центре одного из самых популярных городов Европы у студентов.'],
    majors: [ {name:'Business & Economics', share:20, top:true}, {name:'Political Science / IR', share:16}, {name:'Psychology', share:14}, {name:'Data Science & AI', share:10} ] },

  { name: 'KTH Royal Institute of Technology', domain: 'kth.se', country: 'Швеция', countryCode: 'se', state: null, city: 'Стокгольм',
    system: 'europe', livingCost: '≈ SEK 120,000 / год',
    minGPA: 3.5, minIELTS: 6.5, rate: 20, tuition: '≈ SEK 180,000 / год (для не-ЕС)',
    photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Royal_institute_of_technology_Sweden_20050616.jpg?width=800',
    description: 'Крупнейший технический университет Швеции, известен сильными программами в IT, инженерии и устойчивом развитии.',
    facts: ['Один из ведущих технических вузов Северной Европы.', 'Тесно связан с технологической экосистемой Стокгольма (родина Spotify, Klarna).', 'Активная программа обменов с ведущими техническими вузами мира.'],
    majors: [ {name:'Engineering', share:26, top:true}, {name:'Computer Science', share:22}, {name:'Data Science & AI', share:14}, {name:'Mathematics & Physics', share:10} ] },

  { name: 'Lund University', domain: 'lu.se', country: 'Швеция', countryCode: 'se', state: null, city: 'Лунд',
    system: 'europe', livingCost: '≈ SEK 95,000 / год',
    minGPA: 3.4, minIELTS: 6.5, rate: 25, tuition: '≈ SEK 150,000 / год (для не-ЕС)',
    photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Lund_University_main_building.jpg?width=800',
    description: 'Один из старейших и самых престижных университетов Скандинавии, силён в широком спектре дисциплин от права до инженерии.',
    facts: ['Основан в 1666 году.', 'Один из самых популярных университетов Швеции среди иностранных студентов.', 'Уютный студенческий город с богатой академической традицией.'],
    majors: [ {name:'Business & Economics', share:16, top:true}, {name:'Engineering', share:16}, {name:'Law', share:12}, {name:'Political Science / IR', share:10} ] },

  { name: 'University of Copenhagen', domain: 'ku.dk', country: 'Дания', countryCode: 'dk', state: null, city: 'Копенгаген',
    system: 'europe', livingCost: '≈ DKK 100,000 / год',
    minGPA: 3.4, minIELTS: 6.5, rate: 30, tuition: '≈ DKK 200,000 / год (для не-ЕС)',
    photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/University_Main_Building.jpg?width=800',
    description: 'Крупнейший университет Дании, силён в медицине, естественных науках и социальных исследованиях.',
    facts: ['Один из старейших университетов Северной Европы, основан в 1479 году.', 'Сильная научная традиция в физике и биомедицине.', 'Копенгаген регулярно входит в топ самых комфортных для жизни городов мира.'],
    majors: [ {name:'Medicine', share:18, top:true}, {name:'Biology & Life Sciences', share:16}, {name:'Political Science / IR', share:12}, {name:'Law', share:10} ] },

  { name: 'Trinity College Dublin', domain: 'tcd.ie', country: 'Ирландия', countryCode: 'ie', state: null, city: 'Дублин',
    system: 'europe', livingCost: '≈ €14,000 / год',
    minGPA: 3.5, minIELTS: 6.5, rate: 28, tuition: '≈ €25,000 / год',
    photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Trinity_College_Dublin_Campanile.jpg?width=800',
    description: 'Старейший университет Ирландии, известен своей исторической библиотекой и сильной гуманитарной школой.',
    facts: ['Основан в 1592 году королевой Елизаветой I.', 'Хранит знаменитую средневековую рукопись Book of Kells.', 'Ирландия — популярное направление благодаря англоязычному обучению и близости к ЕС.'],
    majors: [ {name:'Business & Economics', share:16, top:true}, {name:'Computer Science', share:14}, {name:'Law', share:12}, {name:'Medicine', share:10} ] },

  { name: 'University College Dublin (UCD)', domain: 'ucd.ie', country: 'Ирландия', countryCode: 'ie', state: null, city: 'Дублин',
    system: 'europe', livingCost: '≈ €14,000 / год',
    minGPA: 3.4, minIELTS: 6.5, rate: 32, tuition: '≈ €24,000 / год',
    photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/University_College_Dublin_Campus_Photo1.jpg?width=800',
    description: 'Крупнейший университет Ирландии, известен сильной бизнес-школой и тесными связями с технологическими компаниями Дублина.',
    facts: ['Дублин — европейский офисный хаб Google, Facebook и других техгигантов.', 'Одна из крупнейших ирландских бизнес-школ (Smurfit).', 'Активная программа стажировок с международными компаниями.'],
    majors: [ {name:'Business & Economics', share:18, top:true}, {name:'Computer Science', share:16}, {name:'Engineering', share:12}, {name:'Law', share:10} ] },

  { name: 'University of Edinburgh', domain: 'ed.ac.uk', country: 'Великобритания', countryCode: 'gb', state: null, city: 'Эдинбург',
    system: 'uk', livingCost: '≈ £11,500 / год',
    minGPA: 3.6, minIELTS: 6.5, rate: 40, tuition: '≈ £26,000 / год',
    photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Old_College_of_Edinburgh_University.JPG?width=800',
    description: 'Один из старейших и самых престижных университетов Шотландии, силён в медицине, науках о данных и гуманитарных дисциплинах.',
    facts: ['Основан в 1583 году, один из старейших вузов англоязычного мира.', 'Здесь учился и работал Чарльз Дарвин.', 'Один из самых атмосферных студенческих городов Европы.'],
    majors: [ {name:'Medicine', share:16, top:true}, {name:'Data Science & AI', share:14}, {name:'Business & Economics', share:12}, {name:'Psychology', share:10} ] },

  { name: "King's College London", domain: 'kcl.ac.uk', country: 'Великобритания', countryCode: 'gb', state: null, city: 'Лондон',
    system: 'uk', livingCost: '≈ £16,000 / год (самый дорогой город Великобритании)',
    minGPA: 3.5, minIELTS: 7.0, rate: 13, tuition: '≈ £28,000 / год',
    photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kingsbuilding.jpg?width=800',
    description: 'Один из основателей Лондонского университета, известен сильной медицинской и юридической школами в самом центре Лондона.',
    facts: ['Одна из старейших медицинских школ Великобритании.', 'Расположен в самом центре Лондона, рядом с парламентом и Темзой.', 'Сильные связи с NHS (Национальной службой здравоохранения Великобритании).'],
    majors: [ {name:'Medicine', share:18, top:true}, {name:'Law', share:14}, {name:'Political Science / IR', share:12}, {name:'Business & Economics', share:10} ] },

  { name: 'University of Manchester', domain: 'manchester.ac.uk', country: 'Великобритания', countryCode: 'gb', state: null, city: 'Манчестер',
    system: 'uk', livingCost: '≈ £10,500 / год',
    minGPA: 3.4, minIELTS: 6.5, rate: 56, tuition: '≈ £26,000 / год',
    photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/University_of_Manchester.jpg?width=800',
    description: 'Один из крупнейших исследовательских университетов Великобритании, известен сильной инженерной и научной школой.',
    facts: ['Здесь был расщеплён атом Эрнестом Резерфордом.', 'Один из крупнейших студенческих городов Великобритании.', 'Сильная программа по материаловедению — родина графена.'],
    majors: [ {name:'Engineering', share:18, top:true}, {name:'Business & Economics', share:16}, {name:'Computer Science', share:12}, {name:'Biology & Life Sciences', share:10} ] },

  { name: 'University of Cape Town', domain: 'uct.ac.za', country: 'ЮАР', countryCode: 'za', state: null, city: 'Кейптаун',
    system: 'other', livingCost: '≈ $6,000 / год',
    minGPA: 3.2, minIELTS: 6.5, rate: 20, tuition: '≈ $8,000 / год (для иностранцев)',
    photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Jameson_Hall_-_University_of_Cape_Town.jpg?width=800',
    description: 'Самый престижный университет Африки, лидер континента по большинству мировых рейтингов.',
    facts: ['Постоянно занимает первое место среди африканских университетов в мировых рейтингах.', 'Расположен у подножия горы Столовая гора — один из самых живописных кампусов мира.', 'Сильная программа по медицине и наукам об окружающей среде.'],
    majors: [ {name:'Business & Economics', share:16, top:true}, {name:'Medicine', share:14}, {name:'Law', share:12}, {name:'Engineering', share:10} ] },

  { name: 'University of São Paulo (USP)', domain: 'usp.br', country: 'Бразилия', countryCode: 'br', state: 'Сан-Паулу', city: 'Сан-Паулу',
    system: 'other', livingCost: '≈ $5,000 / год',
    minGPA: 3.3, minIELTS: 6.0, rate: 10, tuition: 'Бесплатно для местных студентов, спецпрограммы для иностранцев',
    photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cidade_universit%C3%A1ria_da_Universidade_de_S%C3%A3o_Paulo_(USP).jpg?width=800',
    description: 'Крупнейший и самый престижный университет Латинской Америки, силён практически во всех областях науки.',
    facts: ['Постоянно занимает 1 место среди университетов Латинской Америки.', 'Государственное образование в Бразилии бесплатно даже на топовом уровне.', 'Один из крупнейших исследовательских центров Южного полушария.'],
    majors: [ {name:'Engineering', share:18, top:true}, {name:'Medicine', share:16}, {name:'Law', share:12}, {name:'Business & Economics', share:10} ] },

  { name: 'Tecnológico de Monterrey', domain: 'tec.mx', country: 'Мексика', countryCode: 'mx', state: 'Нуэво-Леон', city: 'Монтеррей',
    system: 'other', livingCost: '≈ $6,500 / год',
    minGPA: 3.4, minIELTS: 6.5, rate: 65, tuition: '≈ $9,000 / год',
    photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Tecnol%C3%B3gico_de_Monterrey,_Campus_Monterrey_-_panoramio.jpg?width=800',
    description: 'Ведущий частный технический университет Латинской Америки, известен тесными связями с международным бизнесом.',
    facts: ['Один из самых предпринимательских университетов Латинской Америки.', 'Сильные партнёрства с MIT и другими техническими вузами США.', 'Множество кампусов по всей Мексике, объединённых в единую систему.'],
    majors: [ {name:'Business & Economics', share:20, top:true}, {name:'Engineering', share:18}, {name:'Computer Science', share:14}, {name:'Design & Architecture', share:10} ] },

  { name: 'American University of Beirut (AUB)', domain: 'aub.edu.lb', country: 'Ливан', countryCode: 'lb', state: null, city: 'Бейрут',
    system: 'other', livingCost: '≈ $8,000 / год',
    minGPA: 3.3, minIELTS: 6.5, rate: 40, tuition: '≈ $20,000 / год',
    photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/American_University_of_Beirut_(AUB).jpg?width=800',
    description: 'Старейший американский по модели университет на Ближнем Востоке, известен сильной медицинской школой.',
    facts: ['Основан в 1866 году американскими миссионерами.', 'Обучение полностью на английском языке по американской модели.', 'Один из самых уважаемых вузов арабского мира.'],
    majors: [ {name:'Medicine', share:18, top:true}, {name:'Business & Economics', share:16}, {name:'Engineering', share:12}, {name:'Political Science / IR', share:10} ] },

  { name: 'KAUST (King Abdullah University of Science and Technology)', domain: 'kaust.edu.sa', country: 'Саудовская Аравия', countryCode: 'sa', state: null, city: 'Тувал',
    system: 'other', livingCost: 'Проживание на кампусе включено в стипендию',
    minGPA: 3.6, minIELTS: 6.5, rate: 3, tuition: 'Полностью покрывается стипендией для всех студентов',
    photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/KAUST01.JPG?width=800',
    description: 'Исследовательский университет для магистратуры и PhD, полностью финансируемый государством — обучение бесплатно для всех принятых студентов.',
    facts: ['Все принятые студенты получают полную стипендию, включая проживание.', 'Кампус построен "с нуля" как международный исследовательский хаб.', 'Один из самых щедро финансируемых университетов мира на одного студента.'],
    majors: [ {name:'Engineering', share:28, top:true}, {name:'Data Science & AI', share:22}, {name:'Biology & Life Sciences', share:16}, {name:'Mathematics & Physics', share:12} ] },

  { name: 'University of Vienna', domain: 'univie.ac.at', country: 'Австрия', countryCode: 'at', state: null, city: 'Вена',
    system: 'europe', livingCost: '≈ €10,000 / год',
    minGPA: 3.2, minIELTS: 6.5, rate: 70, tuition: '≈ €1,500 / год (для не-ЕС)',
    photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Universit%C3%A4t_Wien_Front.JPG?width=800',
    description: 'Старейший университет немецкоязычного мира, известен сильной гуманитарной и естественнонаучной традицией.',
    facts: ['Основан в 1365 году.', 'Один из самых доступных по стоимости университетов Западной Европы.', 'Тесно связан с богатой музыкальной и философской традицией Вены.'],
    majors: [ {name:'Psychology', share:14, top:true}, {name:'Biology & Life Sciences', share:12}, {name:'Political Science / IR', share:12}, {name:'Law', share:10} ] },

  { name: 'HSE University (Высшая школа экономики)', domain: 'hse.ru', country: 'Россия', countryCode: 'ru', state: null, city: 'Москва',
    system: 'other', livingCost: '≈ ₽350,000 / год',
    minGPA: 3.6, minIELTS: 6.5, rate: 20, tuition: '≈ ₽500,000 / год',
    photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Moscow_Durasov_Palace_asv2018-08.jpg?width=800',
    description: 'Один из самых современных и быстрорастущих университетов России, известен сильной экономической и IT-школой.',
    facts: ['Один из самых востребованных вузов России среди работодателей.', 'Активно развивает программы двойных дипломов с зарубежными вузами.', 'Сильная связь с технологическим и финансовым сектором Москвы.'],
    majors: [ {name:'Business & Economics', share:24, top:true}, {name:'Computer Science', share:20}, {name:'Data Science & AI', share:16}, {name:'Political Science / IR', share:10} ] },

  { name: 'Lomonosov Moscow State University (МГУ)', domain: 'msu.ru', country: 'Россия', countryCode: 'ru', state: null, city: 'Москва',
    system: 'other', livingCost: '≈ ₽350,000 / год',
    minGPA: 3.7, minIELTS: 6.5, rate: 15, tuition: '≈ ₽450,000 / год',
    photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Main_Building_of_Moscow_State_University.jpg?width=800',
    description: 'Старейший и самый престижный университет России, лидер практически во всех академических рейтингах страны.',
    facts: ['Основан в 1755 году.', 'Главное здание МГУ — одна из знаменитых "сталинских высоток" Москвы.', 'Сильнейшая фундаментальная научная школа в физике и математике.'],
    majors: [ {name:'Mathematics & Physics', share:20, top:true}, {name:'Biology & Life Sciences', share:14}, {name:'Law', share:12}, {name:'Political Science / IR', share:10} ] }
];

const DOC_SYSTEMS = {
  us: ["Common App / Coalition App анкета", "School transcript (табель успеваемости) с переводом", "Результаты SAT/ACT (многие вузы test-optional — уточни на сайте)", "2 рекомендательных письма от учителей", "Personal essay (Common App essay, ~650 слов)", "IELTS/TOEFL для не-носителей языка", "Финансовая справка для визы F-1"],
  uk: ["Анкета UCAS + Personal Statement", "School transcript / предсказанные оценки (predicted grades)", "Референс от учителя/школы через UCAS", "IELTS/TOEFL сертификат", "Копия загранпаспорта", "Подтверждение финансирования для Student visa"],
  canada: ["Заявка через портал университета", "School transcript с переводом", "Мотивационное письмо / эссе", "1-2 рекомендательных письма", "IELTS/TOEFL сертификат", "Подтверждение финансирования для Study Permit"],
  europe: ["Заявка через национальный портал приёма (uni-assist, Studielink и т.п.)", "Аттестат/диплом с апостилем и переводом", "Мотивационное письмо", "IELTS/TOEFL сертификат (или язык страны обучения)", "Копия загранпаспорта", "Подтверждение финансирования (напр. блокированный счёт)"],
  australia: ["Заявка через портал университета", "School transcript с переводом", "IELTS/TOEFL сертификат", "Мотивационное письмо (для части программ)", "Подтверждение финансирования для визы subclass 500"],
  asia: ["Заявка через портал университета", "School transcript с переводом и апостилем", "IELTS/TOEFL сертификат", "Мотивационное письмо", "1-2 рекомендательных письма", "Копия загранпаспорта"],
  other: ["Заявка через портал университета", "Аттестат/диплом с переводом", "Мотивационное письмо", "IELTS/TOEFL сертификат (если программа на английском)", "Копия загранпаспорта"]
};

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
    photo: uni.photo || null,
    livingCost: uni.livingCost || null,
    documents: DOC_SYSTEMS[uni.system] || DOC_SYSTEMS.other
  };
}

const DB = RAW_UNIVERSITIES.map(u => autoEnrichUniversityData(u, 'rich'));

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
      uni.livingCost ? { icon: 'home', label: 'Проживание', value: uni.livingCost } : null,
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

  const docsBox = document.getElementById('modalUniDocuments');
  if (docsBox) {
    docsBox.innerHTML = uni.documents.map(doc => `
      <li class="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
        <i data-lucide="file-text" class="w-4 h-4 text-indigo-500 shrink-0 mt-0.5"></i>
        <span>${doc}</span>
      </li>
    `).join('') + `<p class="text-[10px] text-slate-400 pt-1 col-span-full">Список стандартный для системы образования этой страны — точный набор документов и дедлайны всегда уточняй в приёмной комиссии вуза.</p>`;
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
