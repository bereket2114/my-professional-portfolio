/**
 * Theme Manager for Bereket Woldemariyam Portfolio
 */

(function () {
  const THEME_KEY = 'bereket_portfolio_theme';

  function applyTheme(theme) {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
    updateToggleIcons(theme);
  }

  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function updateToggleIcons(theme) {
    const sunIcons = document.querySelectorAll('.theme-icon-sun');
    const moonIcons = document.querySelectorAll('.theme-icon-moon');

    sunIcons.forEach(icon => {
      if (theme === 'dark') {
        icon.classList.remove('hidden');
      } else {
        icon.classList.add('hidden');
      }
    });

    moonIcons.forEach(icon => {
      if (theme === 'dark') {
        icon.classList.add('hidden');
      } else {
        icon.classList.remove('hidden');
      }
    });
  }

  function initTheme() {
    const currentTheme = getPreferredTheme();
    applyTheme(currentTheme);

    const toggleButtons = document.querySelectorAll('.theme-toggle-btn');
    toggleButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const isDark = document.documentElement.classList.contains('dark');
        applyTheme(isDark ? 'light' : 'dark');
      });
    });

    // Listen for OS preference changes if user hasn't explicitly set preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(THEME_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // Run on DOM loaded or immediately if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }

  window.ThemeManager = {
    applyTheme,
    getPreferredTheme,
    toggleTheme: () => {
      const isDark = document.documentElement.classList.contains('dark');
      applyTheme(isDark ? 'light' : 'dark');
    }
  };
})();
