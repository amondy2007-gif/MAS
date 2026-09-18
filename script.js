/* =====================================================
   MONDY AUTO SERVICE - JAVASCRIPT
   Language toggle, animations, navigation, counters
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ---- Loader ----
    const loader = document.getElementById('loader');
    document.body.classList.add('loading');

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.classList.remove('loading');
        }, 800);
    });

    // Fallback: hide loader after 3 seconds max
    setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.remove('loading');
    }, 3000);

    // ---- Language Toggle ----
    let currentLang = 'ar';
    const langToggle = document.getElementById('langToggle');
    const langLabel = langToggle.querySelector('.lang-label');

    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'ar' ? 'en' : 'ar';
        langLabel.textContent = currentLang === 'ar' ? 'EN' : 'عر';

        if (currentLang === 'en') {
            document.body.classList.add('en');
            document.documentElement.setAttribute('dir', 'ltr');
            document.documentElement.setAttribute('lang', 'en');
        } else {
            document.body.classList.remove('en');
            document.documentElement.setAttribute('dir', 'rtl');
            document.documentElement.setAttribute('lang', 'ar');
        }

        // Update all translatable elements
        document.querySelectorAll('[data-ar][data-en]').forEach(el => {
            const text = el.getAttribute(`data-${currentLang}`);
            if (text) {
                // Check if element has child elements we should preserve
                const hasChildElements = el.querySelector('span, svg, div');
                if (hasChildElements && el.childNodes.length > 1) {
                    // Update only text nodes
                    for (const node of el.childNodes) {
                        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                            node.textContent = text;
                            break;
                        }
                    }
                } else if (el.querySelector('span')) {
                    el.querySelector('span').textContent = text;
                } else {
                    el.textContent = text;
                }
            }
        });
    });

    // ---- Navbar Scroll ----
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // ---- Active Nav Link ----
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function updateActiveLink() {
        const scrollY = window.pageYOffset + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
                mobileLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);

    // ---- Mobile Menu ----
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ---- Scroll Animations ----
    const animateElements = document.querySelectorAll('[data-animate]');

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => observer.observe(el));

    // Also observe product cards and service cards
    document.querySelectorAll('.product-card, .service-card').forEach(el => {
        observer.observe(el);
    });

    // ---- Counter Animation ----
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;

        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const counter = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(counter);
                }

                if (target >= 1000) {
                    stat.textContent = Math.floor(current).toLocaleString();
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, 16);
        });

        countersAnimated = true;
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }

    // ---- Smooth Scroll for all anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'));
                const targetPosition = targetElement.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---- Parallax effect on hero ----
    const heroBg = document.querySelector('.hero-bg img');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (scrolled < window.innerHeight) {
                heroBg.style.transform = `scale(1.1) translateY(${scrolled * 0.15}px)`;
            }
        });
    }
});
