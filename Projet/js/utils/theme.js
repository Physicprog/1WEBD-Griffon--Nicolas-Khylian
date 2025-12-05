const themeToggle = document.getElementById("DarkLightMode");
const light = 'theme-light';
const dark = 'theme-dark';

let currentTheme = localStorage.getItem('theme');
if (!currentTheme) {
  currentTheme = light;
}

export function applyTheme(theme) {
  document.body.classList.remove(light, dark);
  document.body.classList.add(theme);
  if (themeToggle) {
    if (theme === dark) {
      themeToggle.classList.add(dark);
    } else {
      themeToggle.classList.remove(dark);
    }
  }
  localStorage.setItem('theme', theme);
  currentTheme = theme;
}

export function toggleTheme() {
  if (currentTheme === dark) {
    applyTheme(light);
  } else {
    applyTheme(dark);
  }
}


if (themeToggle) {
  themeToggle.addEventListener('click', toggleTheme);
}
applyTheme(currentTheme);