document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle Logic
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  
  function applySavedTheme() {
    const savedTheme = localStorage.getItem('eduflow-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const icon = document.getElementById('theme-icon');
    if (icon) {
      updateThemeIcon(savedTheme, icon);
    }
  }

  // Apply on initial load
  applySavedTheme();

  // Listen to bfcache restore (when user presses back button)
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      applySavedTheme();
    }
  });

  // Listen to storage changes across tabs
  window.addEventListener('storage', (e) => {
    if (e.key === 'eduflow-theme') {
      applySavedTheme();
    }
  });
  
  if (themeToggle && themeIcon) {
    themeToggle.addEventListener('click', () => {
      let currentTheme = document.documentElement.getAttribute('data-theme');
      let newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('eduflow-theme', newTheme);
      updateThemeIcon(newTheme, themeIcon);
    });
  }

  // Active Navbar/Sidebar Links
  const currentUrl = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  const sidebarItems = document.querySelectorAll('.sidebar-item');

  navLinks.forEach(link => {
    if (link.getAttribute('href') && currentUrl.includes(link.getAttribute('href'))) {
      link.classList.add('active');
    }
  });

  sidebarItems.forEach(item => {
    let href = item.getAttribute('href');
    if (href && currentUrl.includes(href)) {
      if (item.closest('.sidebar').classList.contains('tutor-sidebar')) {
        item.classList.add('active-tutor');
      } else {
        item.classList.add('active');
      }
    }
  });

  // Intersection Observer for animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll('.fade-up, .fade-up-stagger');
  animatedElements.forEach(el => observer.observe(el));

  // Navbar Scroll Shadow
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }
});

function updateThemeIcon(theme, iconEl) {
  // Assuming Google Material Symbols Outlined
  if (theme === 'dark') {
    iconEl.textContent = 'light_mode'; // sun icon
  } else {
    iconEl.textContent = 'dark_mode'; // moon icon
  }
}
