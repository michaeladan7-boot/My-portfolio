// ================================
// Palette — script.js
// ================================

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- Mobile nav toggle ---------- */
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        // Overlay element, created once and reused
        const overlay = document.createElement('div');
        overlay.classList.add('nav-overlay');
        document.body.appendChild(overlay);

        const openMenu = () => {
            navMenu.classList.add('active');
            navToggle.classList.add('active');
            overlay.classList.add('active');
            navToggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        };

        const closeMenu = () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            overlay.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        };

        navToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.contains('active');
            isOpen ? closeMenu() : openMenu();
        });

        // Close when a nav link is tapped
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close when tapping outside the menu
        overlay.addEventListener('click', closeMenu);

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });

        // Close automatically if window is resized back to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) closeMenu();
        });
    }

    /* ---------- Scroll-reveal for portfolio items ---------- */
    const revealTargets = document.querySelectorAll('.portfolio-item');

    if ('IntersectionObserver' in window && revealTargets.length) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealTargets.forEach(item => revealObserver.observe(item));
    } else {
        // Fallback: no IntersectionObserver support, just show everything
        revealTargets.forEach(item => item.classList.add('in-view'));
    }

    /* ---------- Auto-update footer year ---------- */
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    /* ---------- Contact form (Netlify Forms) ---------- */
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        const submitBtn = document.getElementById('submit-btn');
        const messageEl = document.getElementById('form-message');

        const encodeForm = (data) => {
            return Object.keys(data)
                .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
                .join('&');
        };

        const showMessage = (text, type) => {
            if (!messageEl) return;
            messageEl.textContent = text;
            messageEl.className = 'form-message ' + type;
        };

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Basic phone sanity check beyond the browser's built-in validation
            const phoneInput = document.getElementById('phone');
            const phoneDigits = phoneInput ? phoneInput.value.replace(/\D/g, '') : '';
            if (phoneInput && phoneDigits.length < 7) {
                showMessage('Please enter a valid phone number.', 'error');
                phoneInput.focus();
                return;
            }

            const formData = new FormData(contactForm);
            const payload = {};
            formData.forEach((value, key) => { payload[key] = value; });

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
            }
            showMessage('', '');

            fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: encodeForm(payload)
            })
                .then(() => {
                    showMessage("Thanks — your message is in. I'll get back to you within 24 hours.", 'success');
                    contactForm.reset();
                })
                .catch(() => {
                    showMessage('Something went wrong sending that. Please try again or email me directly.', 'error');
                })
                .finally(() => {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Submit';
                    }
                });
        });
    }

});