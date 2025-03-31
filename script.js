document.addEventListener('DOMContentLoaded', () => {
    // Slider Functionality
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');

        // Animate content
        const content = slides[index].querySelector('.slide-content');
        content.style.animation = 'none';
        content.offsetHeight; // Trigger reflow
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

    // Initialize slider
    showSlide(currentSlide);
    slideInterval = setInterval(nextSlide, 5000);

    // Add click events to slider controls
    document.querySelector('.slider-prev').addEventListener('click', () => {
        clearInterval(slideInterval);
        prevSlide();
        slideInterval = setInterval(nextSlide, 5000);
    });

    document.querySelector('.slider-next').addEventListener('click', () => {
        clearInterval(slideInterval);
        nextSlide();
        slideInterval = setInterval(nextSlide, 5000);
    });

    // Theme Switcher
    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;
    const storedTheme = localStorage.getItem('theme') || 'dark';
    
    root.setAttribute('data-theme', storedTheme);
    themeToggle.checked = storedTheme === 'light';

    themeToggle.addEventListener('change', () => {
        const newTheme = themeToggle.checked ? 'light' : 'dark';
        root.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Navigation Active State
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .wiki-card, .update-card').forEach(el => {
        observer.observe(el);
    });

    // Stats Counter Animation
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const countElements = entry.target.querySelectorAll('.count-up');
                countElements.forEach(el => {
                    const target = parseInt(el.getAttribute('data-target'));
                    animateValue(el, 0, target, 2000);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.server-stats').forEach(el => {
        statsObserver.observe(el);
    });
}); 

