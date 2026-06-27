// Scroll-triggered reveal animation
// Uses IntersectionObserver instead of a 'scroll' event listener because
// IntersectionObserver only fires when something actually enters/leaves the
// viewport — it doesn't run on every single scroll pixel, so it's much
// lighter on performance.

document.addEventListener('DOMContentLoaded', () => {
    const revealEls = document.querySelectorAll('.reveal');

    // If the browser doesn't support IntersectionObserver (very old browsers),
    // just show everything immediately instead of leaving it invisible.
    if (!('IntersectionObserver' in window)) {
        revealEls.forEach(el => el.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                // Element scrolled out of view — reset it so the
                // fade/move-up animation plays again next time it
                // scrolls back into view.
                entry.target.classList.remove('is-visible');
            }
        });
    }, {
        threshold: 0.15,        // fire when 15% of the element is visible
        rootMargin: '0px 0px -50px 0px' // trigger slightly before it's fully in view
    });

    revealEls.forEach(el => observer.observe(el));
});