document.addEventListener('DOMContentLoaded', () => {
  // Dil Yönetimi
  let currentLang = localStorage.getItem('lang') || 'tr';
  let translations = {};

  // ServerStatusManager sınıfı
  class ServerStatusManager {
    constructor() {
      // DOMContentLoaded içinde olduğumuzdan emin olmak için setTimeout kullanıyoruz
      setTimeout(() => {
        this.init();
      }, 0);
    }

    init() {
      console.log('ServerStatusManager: init başladı');
      this.serverStatusMini = document.querySelector('.server-status-mini');
      console.log('ServerStatusManager: serverStatusMini element:', this.serverStatusMini);
      
      if (this.serverStatusMini) {
        this.dropdownMenu = this.serverStatusMini.querySelector('.dropdown-menu');
        console.log('ServerStatusManager: dropdownMenu element:', this.dropdownMenu);
        
        if (this.dropdownMenu) {
          console.log('ServerStatusManager: Event listener\'lar ekleniyor...');
          this.setupInitialState();
          this.addEventListeners();
        } else {
          console.error('ServerStatusManager: dropdownMenu bulunamadı!');
        }
      } else {
        console.error('ServerStatusManager: serverStatusMini bulunamadı!');
      }
    }

    setupInitialState() {
      // Başlangıç durumunu ayarla
      this.dropdownMenu.style.display = 'none';
      this.dropdownMenu.style.opacity = '0';
      this.dropdownMenu.style.visibility = 'hidden';
      this.dropdownMenu.style.transform = 'translateY(-10px)';
    }

    addEventListeners() {
      // Server status tıklama olayı
      this.serverStatusMini.addEventListener('click', (e) => {
        console.log('ServerStatusManager: Server status tıklandı!');
        e.stopPropagation();
        this.toggleDropdown();
      });

      // Dışarı tıklama olayı
      document.addEventListener('click', (e) => {
        const isClickInside = e.target.closest('.server-status-mini');
        if (!isClickInside && this.serverStatusMini.classList.contains('active')) {
          console.log('ServerStatusManager: Dışarı tıklandı, dropdown kapanıyor');
          this.closeDropdown();
        }
      });

      // ESC tuşu ile kapatma
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.serverStatusMini.classList.contains('active')) {
          console.log('ServerStatusManager: ESC tuşuna basıldı, dropdown kapanıyor');
          this.closeDropdown();
        }
      });

      // Responsive kontrol
      window.addEventListener('resize', () => {
        if (window.innerWidth <= 768 && this.serverStatusMini.classList.contains('active')) {
          this.closeDropdown();
        }
      });
    }

    toggleDropdown() {
      const isActive = this.serverStatusMini.classList.contains('active');
      console.log('ServerStatusManager: Toggle dropdown, mevcut durum:', isActive);
      
      if (isActive) {
        this.closeDropdown();
      } else {
        this.openDropdown();
      }
    }

    openDropdown() {
      console.log('ServerStatusManager: Dropdown açılıyor');
      this.serverStatusMini.classList.add('active');
      this.dropdownMenu.style.display = 'block';
      // Force reflow
      this.dropdownMenu.offsetHeight;
      this.dropdownMenu.style.visibility = 'visible';
      this.dropdownMenu.style.opacity = '1';
      this.dropdownMenu.style.transform = 'translateY(0)';
      document.body.classList.add('dropdown-open');
    }

    closeDropdown() {
      console.log('ServerStatusManager: Dropdown kapanıyor');
      this.serverStatusMini.classList.remove('active');
      this.dropdownMenu.style.opacity = '0';
      this.dropdownMenu.style.transform = 'translateY(-10px)';
      
      // Animasyon bittikten sonra visibility ve display'i gizle
      setTimeout(() => {
        if (!this.serverStatusMini.classList.contains('active')) {
          this.dropdownMenu.style.visibility = 'hidden';
          this.dropdownMenu.style.display = 'none';
        }
      }, 300); // CSS transition süresiyle eşleşmeli

      document.body.classList.remove('dropdown-open');
    }
  }

  // NavigationManager sınıfı
  class NavigationManager {
    constructor() {
      setTimeout(() => {
        this.init();
      }, 0);
    }

    init() {
      this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
      this.navLinks = document.getElementById('navLinks');
      this.navOverlay = document.getElementById('navOverlay');
      this.isWikiPage = document.body.classList.contains('wiki-page');
      this.wikiSidebar = this.isWikiPage ? document.querySelector('.wiki-sidebar') : null;
      this.serverStatusMini = document.querySelector('.server-status-mini');
      
      if (this.mobileMenuBtn && this.navLinks && this.navOverlay) {
        this.setupEventListeners();
        this.setupWikiMobileNav();
      }
    }

    setupWikiMobileNav() {
      if (this.isWikiPage && this.wikiSidebar) {
        // Wiki sayfasında mobil menü için özel işlevsellik
        const wikiNavLinks = this.wikiSidebar.querySelectorAll('a');
        
        wikiNavLinks.forEach(link => {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
              // Menüyü kapat
              this.closeMobileMenu();
              
              // Scroll to target with offset
              const headerOffset = 80;
              const elementPosition = targetElement.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
              });
            }
          });
        });
      }
    }

    setupEventListeners() {
      // Mobil menü tıklama
      this.mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMobileMenu();
        
        // Wiki sayfasında sidebar'ı göster/gizle
        if (this.isWikiPage && this.wikiSidebar) {
          this.wikiSidebar.classList.toggle('active');
        }
      });

      // Overlay tıklama
      this.navOverlay.addEventListener('click', () => {
        this.closeMobileMenu();
        if (this.isWikiPage && this.wikiSidebar) {
          this.wikiSidebar.classList.remove('active');
        }
      });

      // Dışarı tıklama
      document.addEventListener('click', (e) => {
        const isMenuClick = e.target.closest('.nav-links');
        const isWikiSidebarClick = this.isWikiPage && e.target.closest('.wiki-sidebar');
        const isMobileMenuBtnClick = e.target.closest('.mobile-menu-btn');
        
        if (!isMenuClick && !isWikiSidebarClick && !isMobileMenuBtnClick) {
          this.closeAll();
        }
      });

      // ESC tuşu
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeAll();
        }
      });

      // Responsive kontrol
      window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
          this.closeAll();
        }
      });
    }

    toggleMobileMenu() {
      this.mobileMenuBtn.classList.toggle('active');
      this.navLinks.classList.toggle('active');
      this.navOverlay.classList.toggle('active');
      document.body.classList.toggle('menu-open');

      // Wiki sayfasında sidebar kontrolü
      if (this.isWikiPage && this.wikiSidebar) {
        if (this.wikiSidebar.classList.contains('active')) {
          this.wikiSidebar.classList.remove('active');
        }
      }
    }

    toggleServerStatus() {
      if (this.serverStatusMini) {
        const isActive = this.serverStatusMini.classList.contains('active');
        
        // Diğer açık menüleri kapat
        if (!isActive) {
          this.closeMobileMenu();
          if (this.isWikiPage && this.wikiSidebar) {
            this.wikiSidebar.classList.remove('active');
          }
        }
        
        this.serverStatusMini.classList.toggle('active');
      }
    }

    closeMobileMenu() {
      this.mobileMenuBtn.classList.remove('active');
      this.navLinks.classList.remove('active');
      this.navOverlay.classList.remove('active');
      document.body.classList.remove('menu-open');
    }

    closeServerStatus() {
      if (this.serverStatusMini) {
        this.serverStatusMini.classList.remove('active');
      }
    }

    closeAll() {
      this.closeMobileMenu();
      this.closeServerStatus();
      if (this.isWikiPage && this.wikiSidebar) {
        this.wikiSidebar.classList.remove('active');
      }
    }
  }

  // Sayfa yüklendiğinde yöneticileri başlat
  const navigationManager = new NavigationManager();
  const serverStatusManager = new ServerStatusManager();

  // Paket kartları için animasyon
  const packageCards = document.querySelectorAll('.package-card');
  packageCards.forEach((card, index) => {
    card.style.setProperty('--card-index', index);
  });

  // Paket slider'ı için kaydırma işlevselliği
  const packagesSlider = document.querySelector('.packages-slider');
  if (packagesSlider) {
    let isDown = false;
    let startX;
    let scrollLeft;

    packagesSlider.addEventListener('mousedown', (e) => {
      isDown = true;
      packagesSlider.classList.add('active');
      startX = e.pageX - packagesSlider.offsetLeft;
      scrollLeft = packagesSlider.scrollLeft;
    });

    packagesSlider.addEventListener('mouseleave', () => {
      isDown = false;
      packagesSlider.classList.remove('active');
    });

    packagesSlider.addEventListener('mouseup', () => {
      isDown = false;
      packagesSlider.classList.remove('active');
    });

    packagesSlider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - packagesSlider.offsetLeft;
      const walk = (x - startX) * 2;
      packagesSlider.scrollLeft = scrollLeft - walk;
    });

    // Dokunmatik cihazlar için
    packagesSlider.addEventListener('touchstart', (e) => {
      isDown = true;
      packagesSlider.classList.add('active');
      startX = e.touches[0].pageX - packagesSlider.offsetLeft;
      scrollLeft = packagesSlider.scrollLeft;
    });

    packagesSlider.addEventListener('touchend', () => {
      isDown = false;
      packagesSlider.classList.remove('active');
    });

    packagesSlider.addEventListener('touchmove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.touches[0].pageX - packagesSlider.offsetLeft;
      const walk = (x - startX) * 2;
      packagesSlider.scrollLeft = scrollLeft - walk;
    });
  }

  // async function loadTranslations() {
  //   try {
  //     const response = await fetch('lang.json');
  //     translations = await response.json();
  //     await setLanguage(currentLang);
  //   } catch (error) {
  //     console.error('Dil dosyası yüklenemedi:', error);
  //   }
  // }

  // async function setLanguage(lang) {
  //   if (!translations[lang]) return;
    
  //   currentLang = lang;
  //   localStorage.setItem('lang', lang);

  //   // Dil butonunu güncelle
  //   const langBtn = document.querySelector('.lang-btn');
  //   if (langBtn) {
  //     const img = langBtn.querySelector('img');
  //     const span = langBtn.querySelector('span');
  //     img.src = `https://flagcdn.com/w20/${lang === 'tr' ? 'tr' : 'gb'}.png`;
  //     img.alt = lang.toUpperCase();
  //     span.textContent = lang.toUpperCase();
  //   }

  //   // Sayfa içeriğini güncelle
  //   const content = translations[lang];
    
  //   // Hero section güncelleme
  //   updateTextContent('.hero-content h1', content.hero.title);
  //   updateTextContent('.hero-content h1 span', content.hero.subtitle);
  //   updateTextContent('.hero-content p', content.hero.description);
  //   updateTextContent('.primary-btn', content.hero.start_button);
  //   updateTextContent('.secondary-btn', content.hero.discord_button);

  //   // Özellikler güncelleme
  //   const features = document.querySelectorAll('.feature-card');
  //   features.forEach((card, index) => {
  //     const feature = content.features[Object.keys(content.features)[index]];
  //     if (feature) {
  //       card.querySelector('h3').textContent = feature.title;
  //       card.querySelector('p').textContent = feature.description;
  //     }
  //   });

  //   // Diğer içerikler
  //   document.querySelectorAll('[data-translate]').forEach(element => {
  //     const key = element.getAttribute('data-translate');
  //     if (content[key]) {
  //       element.textContent = content[key];
  //     }
  //   });

  //   // HTML lang attribute güncelleme
  //   document.documentElement.lang = lang;
  // }

  function updateTextContent(selector, text) {
    const element = document.querySelector(selector);
    if (element && text) {
      element.textContent = text;
    }
  }

  // Dil seçeneklerine tıklama
  document.querySelectorAll('.lang-option').forEach(option => {
    option.addEventListener('click', async (e) => {
      e.preventDefault();
      const lang = option.getAttribute('data-lang');
      await setLanguage(lang);
      document.querySelector('.lang-dropdown').classList.remove('show');
    });
  });

  // Dil menüsü
  const langBtn = document.querySelector('.lang-btn');
  const langDropdown = document.querySelector('.lang-dropdown');
  
  if (langBtn && langDropdown) {
    langBtn.addEventListener('click', () => {
      langDropdown.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.language-select')) {
        langDropdown.classList.remove('show');
      }
    });
  }

  // Sunucu Saati Güncelleme
  function updateServerTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    
    const serverTimeElements = document.querySelectorAll('.server-time');
    serverTimeElements.forEach(el => {
      el.textContent = timeString;
    });
  }

  updateServerTime();
  setInterval(updateServerTime, 60000);

  // Animasyonlar
  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        animationObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.feature-card, .news-card, .vip-card, .server-card, .platform-card, .event-card, .wiki-article').forEach(el => {
    animationObserver.observe(el);
  });

  // Slider Fonksiyonları
  const slides = document.querySelectorAll('.slide');
  if (slides.length > 0) {
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
      slides.forEach(slide => slide.classList.remove('active'));
      slides[index].classList.add('active');

      // Animasyon sıfırlama
      const content = slides[index].querySelector('.slide-content');
      content.style.animation = 'none';
      content.offsetHeight;
      content.style.animation = null;
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }

    function prevSlide() {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
    }

    // Slider başlatma
    showSlide(currentSlide);
    slideInterval = setInterval(nextSlide, 5000);

    // Slider kontrolleri
    const prevButton = document.querySelector('.prev-slide');
    const nextButton = document.querySelector('.next-slide');

    if (prevButton && nextButton) {
      prevButton.addEventListener('click', () => {
        clearInterval(slideInterval);
        prevSlide();
        slideInterval = setInterval(nextSlide, 5000);
      });

      nextButton.addEventListener('click', () => {
        clearInterval(slideInterval);
        nextSlide();
        slideInterval = setInterval(nextSlide, 5000);
      });
    }
  }

  // Sayfa yüklendiğinde ve her sayfa değişiminde çalışacak fonksiyon
  function initializePage() {
    // loadTranslations();
    initThemeToggle();
  }

  // Tema değiştirici
  function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;
    const storedTheme = localStorage.getItem('theme') || 'dark';
    
    if (themeToggle) {
      root.setAttribute('data-theme', storedTheme);
      themeToggle.checked = storedTheme === 'light';

      themeToggle.addEventListener('change', () => {
        const newTheme = themeToggle.checked ? 'light' : 'dark';
        root.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
      });
    }
  }

  initializePage();

  // Sayfa içi linklere tıklandığında
  document.querySelectorAll('a').forEach(link => {
    if (link.getAttribute('href') && !link.getAttribute('href').startsWith('#')) {
      link.addEventListener('click', (e) => {
        // Eğer aynı domain içindeyse
        if (link.hostname === window.location.hostname) {
          e.preventDefault();
          const href = link.getAttribute('href');
          
          // Sayfa geçişi animasyonu
          document.body.style.opacity = '0';
          
          setTimeout(() => {
            window.location.href = href;
          }, 300);
        }
      });
    }
  });

  // Sayfa geçişi tamamlandığında
  window.addEventListener('pageshow', () => {
    document.body.style.opacity = '1';
    initializePage();
  });

  // Tarayıcı geri/ileri butonları için
  window.addEventListener('popstate', () => {
    initializePage();
  });

  // Wiki mobil dropdown menüsü
  if (document.querySelector('.mobile-wiki-nav')) {
    const wikiMenuBtn = document.querySelector('.wiki-menu-btn');
    const mobileWikiNav = document.querySelector('.mobile-wiki-nav');
    const wikiDropdown = document.querySelector('.wiki-dropdown');
    const wikiDropdownItems = document.querySelectorAll('.wiki-dropdown-item');

    wikiMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileWikiNav.classList.toggle('active');
    });

    wikiDropdownItems.forEach(item => {
      item.addEventListener('click', () => {
        mobileWikiNav.classList.remove('active');
        const targetId = item.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.mobile-wiki-nav')) {
        mobileWikiNav.classList.remove('active');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        mobileWikiNav.classList.remove('active');
      }
    });
  }
}); 