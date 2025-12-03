const themeToggle = document.getElementById("DarkLightMode");

const THEME_KEY = 'theme'; //la cles dans le local storage
const LIGHT = 'theme-light';
const DARK = 'theme-dark';

if (!localStorage.getItem(THEME_KEY)) {
  localStorage.setItem(THEME_KEY, LIGHT);
}

export function applyTheme(theme) {
  if (theme === DARK) {
    document.body.classList.add(DARK);
    document.body.classList.remove(LIGHT);
    if (themeToggle) themeToggle.classList.add(DARK);
    localStorage.setItem(THEME_KEY, DARK);
  } else {
    document.body.classList.add(LIGHT);
    document.body.classList.remove(DARK);
    if (themeToggle) themeToggle.classList.remove(DARK);
    localStorage.setItem(THEME_KEY, LIGHT);
  }
}

export function toggleTheme() {
  const current = localStorage.getItem(THEME_KEY) || LIGHT;
  applyTheme(current === DARK ? LIGHT : DARK);
}

export function initTheme() {
  applyTheme(localStorage.getItem(THEME_KEY));
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      toggleTheme();
    });
  }
}
