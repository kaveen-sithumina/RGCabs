const languageToggle = document.getElementById('languageToggle');
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
let currentLanguage = 'en';

function setLanguage(language) {
  currentLanguage = language;
  document.documentElement.lang = language === 'si' ? 'si' : 'en';
  document.body.classList.toggle('si', language === 'si');
  document.querySelectorAll('[data-en][data-si]').forEach((element) => {
    const value = element.dataset[language];
    if (value !== undefined) element.innerHTML = value;
  });
  document.querySelectorAll('[data-placeholder-en][data-placeholder-si]').forEach((element) => {
    element.placeholder = element.dataset[language === 'si' ? 'placeholderSi' : 'placeholderEn'];
  });
  languageToggle.textContent = language === 'en' ? 'සිංහල' : 'English';
  languageToggle.setAttribute('aria-label', language === 'en' ? 'Switch to Sinhala' : 'Switch to English');
  document.title = language === 'en' ? 'R&G Cabs | Explore Sri Lanka With Us' : 'R&G Cabs | අප සමඟ ශ්‍රී ලංකාව ගවේෂණය කරන්න';
  try { localStorage.setItem('rg-cabs-language', language); } catch (e) {}
}
languageToggle.addEventListener('click', () => setLanguage(currentLanguage === 'en' ? 'si' : 'en'));

menuToggle.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

document.querySelectorAll('.vehicle-select').forEach(button => {
  button.addEventListener('click', () => {
    const vehicleSelect = document.querySelector('select[name="vehicle"]');
    vehicleSelect.value = button.dataset.vehicle;
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
    vehicleSelect.focus({ preventScroll: true });
    showToast(currentLanguage === 'en' ? `${button.dataset.vehicle} selected. Complete the booking form.` : `${button.dataset.vehicle} තෝරා ඇත. වෙන්කිරීමේ පෝරමය සම්පූර්ණ කරන්න.`);
  });
});

const dateInput = document.querySelector('input[name="date"]');
const today = new Date();
const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];
dateInput.min = localDate;
document.getElementById('year').textContent = new Date().getFullYear();

document.getElementById('bookingForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const labels = currentLanguage === 'en' ? {
    title: 'Hello R&G Cabs! I would like to request a taxi booking.',
    name: 'Name', phone: 'Contact number', pickup: 'Pickup location',
    destination: 'Destination', date: 'Travel date', time: 'Pickup time',
    vehicle: 'Vehicle', passengers: 'Passengers', notes: 'Additional details'
  } : {
    title: 'ආයුබෝවන් R&G Cabs! මට කැබ් රථයක් වෙන්කර ගැනීමට අවශ්‍යයි.',
    name: 'නම', phone: 'දුරකථන අංකය', pickup: 'ගමන ආරම්භ කරන ස්ථානය',
    destination: 'ගමනාන්තය', date: 'ගමන් දිනය', time: 'ගමන් ආරම්භ කරන වේලාව',
    vehicle: 'වාහනය', passengers: 'මගීන් ගණන', notes: 'අමතර විස්තර'
  };
  const lines = [
    labels.title, '',
    `${labels.name}: ${data.get('name')}`,
    `${labels.phone}: ${data.get('phone')}`,
    `${labels.pickup}: ${data.get('pickup')}`,
    `${labels.destination}: ${data.get('destination')}`,
    `${labels.date}: ${data.get('date')}`,
    `${labels.time}: ${data.get('time') || '-'}`,
    `${labels.vehicle}: ${data.get('vehicle')}`,
    `${labels.passengers}: ${data.get('passengers') || '-'}`,
    `${labels.notes}: ${data.get('notes') || '-'}`
  ];
  const whatsappUrl = `https://wa.me/94712824745?text=${encodeURIComponent(lines.join('\n'))}`;
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
});

let toastTimer;
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}

try {
  const savedLanguage = localStorage.getItem('rg-cabs-language');
  if (savedLanguage === 'si') setLanguage('si');
} catch (e) {}
