// src/utils/theme.js
export const initializeTheme = () => {
  // Check for saved theme preference or respect system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (systemPrefersDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }
  
  // Create theme toggle button
  createThemeToggle();
};

const createThemeToggle = () => {
  // Remove existing toggle if present
  const existingToggle = document.querySelector('.theme-toggle');
  if (existingToggle) return;
  
  const toggle = document.createElement('button');
  toggle.className = 'theme-toggle';
  toggle.setAttribute('aria-label', 'Toggle theme');
  
  // Add icon based on current theme
  updateThemeIcon();
  
  toggle.addEventListener('click', toggleTheme);
  
  // Add to body
  document.body.appendChild(toggle);
};

const updateThemeIcon = () => {
  const theme = document.documentElement.getAttribute('data-theme');
  const toggle = document.querySelector('.theme-toggle');
  
  if (toggle) {
    if (theme === 'dark') {
      toggle.innerHTML = '☀️'; // Sun icon for dark mode
    } else {
      toggle.innerHTML = '🌙'; // Moon icon for light mode
    }
  }
};

export const toggleTheme = () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  updateThemeIcon();
};

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  const savedTheme = localStorage.getItem('theme');
  if (!savedTheme) {
    document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    updateThemeIcon();
  }
});