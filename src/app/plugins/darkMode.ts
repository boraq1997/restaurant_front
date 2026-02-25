export function initDarkMode() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
  
  function applyTheme(dark: boolean) {
    if (dark) {
      document.documentElement.classList.add('dark-mode')
    } else {
      document.documentElement.classList.remove('dark-mode')
    }
  }

  // تطبيق عند التحميل
  applyTheme(prefersDark.matches)

  // متابعة التغيير
  prefersDark.addEventListener('change', (e) => applyTheme(e.matches))
}