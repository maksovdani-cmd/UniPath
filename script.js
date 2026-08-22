document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  const savedUser = localStorage.getItem('unipath_user');
  if (savedUser) {
    user = JSON.parse(savedUser);
    if(!user.avatar) user.avatar = currentAvatar;
    
    document.getElementById('authScreen').classList.add('opacity-0', 'pointer-events-none');
    setTimeout(() => document.getElementById('authScreen').classList.add('hidden'), 300);
    document.getElementById('mainApp').classList.remove('hidden');
    updateUI();
  }
});

function setMobileNavActive(el) {
  document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
    btn.classList.remove('bg-white', 'shadow-sm', 'text-indigo-600');
    btn.classList.add('text-indigo-400');
  });
  el.classList.remove('text-indigo-400');
  el.classList.add('bg-white', 'shadow-sm', 'text-indigo-600');
}

const RAW_UNIVERSITIES = [
  { name: 'Harvard University', logo: './image/harvard.png' },
  { name: 'Stanford University', logo: './image/stanford.svg' },
  { name: 'University of Oxford', logo: './image/oxford.jpg' },
  { name: 'New York University (NYU)', logo: './image/nyu.png' },
  { name: 'University of Toronto', logo: './image/toronto.png' }
];

function autoEnrichUniversityData(uni) {
  const name = uni.name.toLowerCase();
  
  let flag = 'https://flagcdn.com/w40/un.png';
  let location = 'Global Campus';
  let minGPA = 3.5;
  let minIELTS = 6.5;
  let rate = 20;
  let tuition = '$30,000 / year';
  let photo = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80';
  let description = 'Один из ведущих мировых университетов с богатой историей и выдающимися академическими программами.';
  let facts = ['Высокий процент трудоустройства выпускников.', 'Крупнейшая библиотека в регионе.', 'Передовые исследовательские центры.'];

  if (name.includes('harvard') || name.includes('mit')) {
    flag = 'https://flagcdn.com/w40/us.png';
    location = 'Cambridge, USA';
    minGPA = 3.9;
    minIELTS = 7.5;
    rate = 4;
    tuition = '$55,000 (Need-Blind Aid)';
    photo = 'https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?auto=format&fit=crop&w=800&q=80';
    description = 'Старейший вуз США (основан в 1636 г.) и член знаменитой Лиги Плюща. Признан мировым лидером в области научных исследований, бизнеса, права и медицины.';
    facts = ['Крупнейшая в мире академическая библиотека (более 20 млн томов).', 'Среди выпускников 8 президентов США и 161 лауреат Нобелевской премии.', 'Эндаумент университета превышает $50 миллиардов, что позволяет покрывать 100% нужд студентов (Full-Ride).'];
  } else if (name.includes('stanford')) {
    flag = 'https://flagcdn.com/w40/us.png';
    location = 'Stanford, USA';
    minGPA = 3.9;
    minIELTS = 7.5;
    rate = 4;
    tuition = '$55,000 (Need-Blind Aid)';
    photo = 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80';
    description = 'Расположен в самом сердце Кремниевой долины. Известен своей предпринимательской культурой, передовыми IT-программами и тесными связями с технологическими гигантами.';
    facts = ['Выпускники Стэнфорда основали Google, Nike, Netflix, HP и Instagram.', 'Университетский кампус — один из самых больших в мире (более 33 кв. км).', 'Собирает более $1 млрд внешнего финансирования на исследования ежегодно.'];
  } else if (name.includes('oxford')) {
    flag = 'https://flagcdn.com/w40/gb.png';
    location = 'Oxford, United Kingdom';
    minGPA = 3.8;
    minIELTS = 7.5;
    rate = 12;
    tuition = '£38,000 / year';
    photo = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80';
    description = 'Старейший англоязычный университет в мире. Уникален своей системой независимых колледжей и индивидуальными занятиями (тьюториалами), где преподаватель работает с 1-2 студентами.';
    facts = ['Обучение здесь ведется с 1096 года.', 'Оксфорд выпустил 30 премьер-министров Великобритании.', 'Слово "Оксфорд" во всем мире ассоциируется с самым авторитетным словарем английского языка (OED).'];
  } else if (name.includes('toronto')) {
    flag = 'https://flagcdn.com/w40/ca.png';
    location = 'Toronto, Canada';
    minGPA = 3.6;
    minIELTS = 7.0;
    rate = 40;
    tuition = 'CAD $45,000 / year';
    photo = 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80';
    description = 'Крупнейший и самый престижный исследовательский университет Канады. Мировой центр в области медицины, инженерии и развития искусственного интеллекта.';
    facts = ['Именно в стенах этого университета в 1921 году был открыт инсулин.', 'Считается родиной глубокого обучения (Deep Learning) благодаря работе Джеффри Хинтона.', 'Ежегодно получает самое большое финансирование среди канадских вузов.'];
  } else if (name.includes('nyu')) {
    flag = 'https://flagcdn.com/w40/us.png';
    location = 'New York, USA';
    minGPA = 3.7;
    minIELTS = 7.5;
    rate = 12;
    tuition = '$58,000 / year';
    photo = 'https://images.unsplash.com/photo-1541336032412-2048a678540d?auto=format&fit=crop&w=800&q=80';
    description = 'Глобальный университет с главным кампусом в престижном районе Манхэттена (Гринвич-Виллидж). Делает упор на международное образование и практический опыт в мегаполисе.';
    facts = ['Кампус не имеет традиционных границ: здания университета интегрированы прямо в улицы Нью-Йорка.', 'Имеет полноценные, выдающие дипломы кампусы в Абу-Даби и Шанхае.', 'Среди выпускников больше всего обладателей премии Оскар, чем у любого другого университета в мире.'];
  }

  return { ...uni, flag, location, minGPA, minIELTS, rate, tuition, photo, description, facts };
}

const DB = RAW_UNIVERSITIES.map(autoEnrichUniversityData);

let currentAvatar = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f98a.svg';
let user = { name: '', major: 'Computer Science', gpa: 3.8, ielts: 7.0, avatar: '' };

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
  user.major = document.getElementById('regMajor').value;
  user.gpa = parseFloat(document.getElementById('regGPA').value);
  user.ielts = parseFloat(document.getElementById('regIELTS').value);
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
  document.getElementById('regMajor').value = user.major || 'Computer Science';
  document.getElementById('regGPA').value = user.gpa;
  document.getElementById('regIELTS').value = user.ielts;
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
  if (user.ielts < 7.0) {
    recText.innerHTML = `Твой GPA: <b class="text-indigo-300">${user.gpa}</b>, IELTS: <b class="text-amber-300">${user.ielts}</b>. Рекомендуем поднять IELTS до 7.5 для топовых ВУЗов США. Ссылки на бесплатные тесты приведены ниже!`;
  } else {
    recText.innerHTML = `Отличный профиль! GPA: <b class="text-emerald-300">${user.gpa}</b>, IELTS: <b class="text-emerald-300">${user.ielts}</b>. У тебя высокие шансы в топовые Университеты Европы и Канады. Сосредоточься на Эссе!`;
  }

  renderUniversities();
}

function renderUniversities(filteredList = DB) {
  const list = document.getElementById('universityList');
  list.innerHTML = '';

  filteredList.forEach(uni => {
    let gpaRatio = user.gpa / uni.minGPA;
    let baseChance = (100 - uni.rate * 1.5) * (gpaRatio * 0.9);
    if(user.ielts < uni.minIELTS) baseChance -= 20;

    let finalMatch = Math.min(Math.max(Math.round(baseChance), 5), 98); 
    let barColor = finalMatch > 65 ? 'bg-emerald-500' : (finalMatch > 35 ? 'bg-amber-400' : 'bg-rose-500');
    let textColor = finalMatch > 65 ? 'text-emerald-600' : (finalMatch > 35 ? 'text-amber-600' : 'text-rose-600');

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
          <span class="text-xs md:text-sm font-extrabold ${textColor}">${finalMatch}% Шанс</span>
          <p class="text-[10px] text-slate-400">Мин. IELTS: ${uni.minIELTS}</p>
        </div>
      </div>
      <div class="space-y-1">
        <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div class="${barColor} h-1.5 rounded-full transition-all duration-1000" style="width: ${finalMatch}%"></div>
        </div>
      </div>
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
  
  const factsList = document.getElementById('modalUniFacts');
  factsList.innerHTML = uni.facts.map(fact => `
    <li class="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
      <div class="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
      <span>${fact}</span>
    </li>
  `).join('');

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

function filterUniversities() {
  const query = document.getElementById('uniSearchInput').value.toLowerCase();
  const filtered = DB.filter(u => u.name.toLowerCase().includes(query) || u.location.toLowerCase().includes(query));
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
  botDiv.className = 'bg-white p-3.5 rounded-2xl rounded-tl-none border border-slate-200/90 text-slate-800 max-w-[92%] text-xs shadow-sm leading-relaxed my-1.5';
  botDiv.innerHTML = '<span class="animate-pulse text-slate-400">ИИ думает...</span>';
  chat.appendChild(botDiv);
  chat.scrollTop = chat.scrollHeight;

  try {
    const response = await fetch('/.netlify/functions/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: text,
        userContext: user 
      })
    });
    
    const data = await response.json();
    botDiv.innerHTML = data.reply ? data.reply.replace(/\n/g, '<br>') : 'Ошибка получения ответа.';
  } catch (err) {
    botDiv.innerHTML = 'Не удалось связаться с сервером ИИ.';
  }
  
  chat.scrollTop = chat.scrollHeight;
  lucide.createIcons();
}