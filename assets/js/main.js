document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. INTEGRATED NAV CONTROLS ---
    const menuBtn = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu-container');
    const iconOpen = document.getElementById('icon-open');
    const iconClose = document.getElementById('icon-close');
    const navOverlay = document.getElementById('nav-overlay');

    // Re-implemented toggle within the nav bar to prevent overlapping content
    // Use the "active" class (matches CSS) and provide explicit open/close logic.
    const toggleMenu = (open) => {
        const shouldOpen = typeof open === 'boolean' ? open : !navMenu.classList.contains('active');

        if (shouldOpen) {
            navMenu.classList.add('active');
            if (iconOpen) iconOpen.classList.add('hidden');
            if (iconClose) iconClose.classList.remove('hidden');
            if (navOverlay) navOverlay.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
            if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
        } else {
            navMenu.classList.remove('active');
            if (iconOpen) iconOpen.classList.remove('hidden');
            if (iconClose) iconClose.classList.add('hidden');
            if (navOverlay) navOverlay.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
            if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
        }
    };

    if (menuBtn) menuBtn.addEventListener('click', () => toggleMenu());
    if (navOverlay) navOverlay.addEventListener('click', () => toggleMenu(false));

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            toggleMenu(false);
        }
    });

    // If viewport is resized to desktop, ensure mobile menu is closed
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1280 && navMenu.classList.contains('active')) {
            toggleMenu(false);
        }
    });

    // Close mobile menu when clicking a navigation link (mobile only)
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 1280 && navMenu.classList.contains('active')) {
                toggleMenu(false);
            }
        });
    });

    // Handle Mobile Sub-menus (Dropdowns) on Click
    const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
    dropdownTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            if (window.innerWidth < 1280) { // xl breakpoint
                e.preventDefault();
                const menu = trigger.nextElementSibling;
                const isHidden = menu.classList.toggle('hidden');
                
                // Toggle active style for the label
                trigger.classList.toggle('text-brand-accent', !isHidden);
                
                // Close other open sub-menus to keep sidebar tidy
                document.querySelectorAll('.dropdown-menu').forEach(other => {
                    if (other !== menu && !other.parentElement.contains(trigger)) {
                        other.classList.add('hidden');
                        if(other.previousElementSibling) {
                            other.previousElementSibling.classList.remove('text-brand-accent');
                        }
                    }
                });
            }
        });
    });

    // --- 2. INTERSECTION OBSERVER (Reveal logic) ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-text, .section-title').forEach(el => revealObserver.observe(el));


    // --- 3. HERO SLIDER ---
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let slideTimer;

    function showSlide(index) {
        slides.forEach((s, i) => {
            if (i === index) {
                s.classList.replace('opacity-0', 'opacity-100');
                s.classList.add('active');
            } else {
                s.classList.replace('opacity-100', 'opacity-0');
                s.classList.remove('active');
            }
        });

        dots.forEach((d, i) => {
            if (i === index) {
                d.classList.replace('bg-transparent', 'bg-white');
                d.classList.add('active');
            } else {
                d.classList.replace('bg-white', 'bg-transparent');
                d.classList.remove('active');
            }
        });

        currentSlide = index;
    }

    function nextSlide() {
        let index = (currentSlide + 1) % slides.length;
        showSlide(index);
    }

    function startAutoSlide() {
        clearInterval(slideTimer);
        slideTimer = setInterval(nextSlide, 5000);
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'));
            showSlide(index);
            startAutoSlide();
        });
    });

    if (slides.length > 0) {
        showSlide(0);
        startAutoSlide();
    }
});