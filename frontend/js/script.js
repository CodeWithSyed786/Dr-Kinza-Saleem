// === 1. FLOATING ANIMATIONS ===
function initFloatingElements() {
    const container = document.getElementById('floatingContainer');
    if (!container) return;

    // Emojis representing medical theme
    const items = ["❤️", "🫀", "💊", "💉", "🩺", "🩹", "🫧", "🦠", "🧬"];

    // Reduce count on mobile for performance
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 6 : 15;

    for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        el.textContent = items[Math.floor(Math.random() * items.length)];
        el.classList.add('floater');
        el.style.left = Math.random() * 100 + '%';
        el.style.top = Math.random() * 100 + '%';
        // Randomize speed and delay for natural feel
        el.style.animationDuration = (20 + Math.random() * 30) + 's';
        el.style.animationDelay = -(Math.random() * 10) + 's';
        el.style.fontSize = (1.5 + Math.random() * 1.5) + 'rem';
        container.appendChild(el);
    }

    const bubbleCount = isMobile ? 3 : 8;
    for (let i = 0; i < bubbleCount; i++) {
        const el = document.createElement('div');
        el.textContent = '🫧';
        el.classList.add('bubble');
        el.style.left = Math.random() * 100 + '%';
        el.style.animationDuration = (15 + Math.random() * 15) + 's';
        el.style.animationDelay = -(Math.random() * 5) + 's';
        container.appendChild(el);
    }
}

// === 2. SCROLL ANIMATIONS (IntersectionObserver) ===
function initScrollAnimations() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (reveals.length === 0) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(el => observer.observe(el));
}

// === 3. FORM SERVICE SELECTOR ===
function selectService(element, serviceName) {
    // Visual Selection
    document.querySelectorAll('.service-option').forEach(el => el.classList.remove('active'));
    element.classList.add('active');

    // Update Hidden Input
    const selectedServiceInput = document.getElementById('selectedService');
    if (selectedServiceInput) selectedServiceInput.value = serviceName;

    // Handle "Other" Input Visibility
    const otherInput = document.getElementById('otherServiceInput');
    const otherInputEl = document.querySelector('.other-service-input'); // Class selector

    if (serviceName === 'Other') {
        if (otherInput) {
            otherInput.style.display = 'block';
            otherInput.focus();
        }
    } else {
        if (otherInput) {
            otherInput.style.display = 'none';
            otherInput.value = '';
        }
    }
}

// === 4. 3D FLIP CARDS ===
function initCards() {
    const cards = document.querySelectorAll('.flip-card');
    cards.forEach(card => card.addEventListener('click', () => {
        // Only flip if not clicking a link or button
        card.classList.toggle('is-flipped');
    }));
}

// === 5. MOBILE MENU ===
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('mainNav');

    if (menuBtn && nav) {
        menuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');

            // Toggle Icon
            const isOpen = nav.classList.contains('active');
            menuBtn.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
            menuBtn.setAttribute('aria-expanded', isOpen);
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !menuBtn.contains(e.target) && nav.classList.contains('active')) {
                nav.classList.remove('active');
                menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                menuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

// === 6. THEME TOGGLE ===
function initThemeToggle() {
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');

            themeBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    // Load saved theme
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// === 7. SMOOTH SCROLL & ACTIVE LINK ===
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                // Mobile: Close menu on link click
                const nav = document.getElementById('mainNav');
                const menuBtn = document.getElementById('mobileMenuBtn');
                if (nav && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    if (menuBtn) {
                        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                        menuBtn.setAttribute('aria-expanded', 'false');
                    }
                }

                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// === 8. ACTIVE NAV HIGHLIGHT ===
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    if (sections.length === 0) return;

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPos = window.scrollY + 150; // Offset for header

        sections.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.clientHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                current = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// === 9. FORM SUBMISSION (WhatsApp) ===
function initFormSubmission() {
    const form = document.getElementById('appointmentForm');
    if (!form) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
        submitBtn.disabled = true;

        // Gather Data
        const service = document.getElementById('selectedService')?.value || 'General Consultation';
        const otherService = document.getElementById('otherServiceInput')?.value || '';
        const finalService = service === 'Other' ? `Other: ${otherService}` : service;

        const formData = {
            name: document.querySelector('input[placeholder*="Name"]')?.value.trim(),
            email: document.querySelector('input[type="email"]')?.value.trim(),
            phone: document.querySelector('input[type="tel"]')?.value.trim(),
            date: document.querySelector('input[type="date"]')?.value,
            location: document.querySelector('input[placeholder*="Location"]')?.value.trim(),
            service: finalService,
            symptoms: document.querySelector('textarea')?.value.trim() || 'None'
        };

        // Construct WhatsApp Message (Do this first)
        const whatsappNumber = "923123456789"; // Replace with actual number
        const message = `*📅 New Appointment Request*\n\n` +
            `*👤 Name:* ${formData.name}\n` +
            `*📞 Phone:* ${formData.phone}\n` +
            `*📧 Email:* ${formData.email}\n` +
            `*🗓️ Date:* ${formData.date}\n` +
            `*📍 Location:* ${formData.location}\n` +
            `*🩺 Service:* ${formData.service}\n` +
            `*📝 Symptoms:* ${formData.symptoms}\n\n` +
            `_Sent via Dr. Kinza Website_`;

        const whatsappURL = `https://wa.me/923411566420?text=${encodeURIComponent(message)}`;

        try {
            // Updated Logic: Try Backend, but proceed to WhatsApp regardless
            try {
                const response = await fetch('/api/appointment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                console.log('Backend response:', response.status);
            } catch (backendError) {
                console.warn('Backend unavailable (likely static hosting), proceeding to WhatsApp.', backendError);
            }

            // Always open WhatsApp after a short delay
            if (confirm(`Click OK to open WhatsApp and send your appointment details directly to Dr. Kinza.`)) {
                window.open(whatsappURL, '_blank');
            }

            // Reset Form on success path
            form.reset();
            const otherInput = document.getElementById('otherServiceInput');
            if (otherInput) otherInput.style.display = 'none';
            document.querySelectorAll('.service-option').forEach(el => el.classList.remove('active'));
            const firstOption = document.querySelector('.service-option');
            if (firstOption) firstOption.classList.add('active'); // Reset to first
            const selectedInput = document.getElementById('selectedService');
            if (selectedInput) selectedInput.value = 'General Consultation';

        } catch (error) {
            console.error('Error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });

    // Make functions global for inline onclick handlers
    window.selectService = selectService;
}

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
    initFloatingElements();
    initScrollAnimations();
    initCards();
    initMobileMenu();
    initThemeToggle();
    initSmoothScroll();
    initFormSubmission();
    initActiveNav();
});
