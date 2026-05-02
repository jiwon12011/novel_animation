const siteHeader = document.querySelector('.site-header');
const menuToggle = document.getElementById('menuToggle');
const mediaQuery = window.matchMedia('(orientation: portrait), (max-width: 720px)');
const navLinks = document.querySelectorAll('#mainNav a');
const musicBtn = document.getElementById('musicBtn');
const bgMusic = document.getElementById('bgMusic');

function syncMobileMenu() {
    if (!siteHeader || !menuToggle) return;
    if (!mediaQuery.matches) {
        siteHeader.classList.remove('menu-open');
        menuToggle.setAttribute('aria-expanded', 'false');
    }
}

if (menuToggle && siteHeader) {
    menuToggle.addEventListener('click', () => {
        if (!mediaQuery.matches) return;
        const isOpen = siteHeader.classList.toggle('menu-open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
}

navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        if (!mediaQuery.matches || !siteHeader || !menuToggle) return;
        siteHeader.classList.remove('menu-open');
        menuToggle.setAttribute('aria-expanded', 'false');
    });
});

document.addEventListener('click', (event) => {
    if (!siteHeader || !menuToggle) return;
    if (!mediaQuery.matches || !siteHeader.classList.contains('menu-open')) return;
    if (!siteHeader.contains(event.target)) {
        siteHeader.classList.remove('menu-open');
        menuToggle.setAttribute('aria-expanded', 'false');
    }
});

if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', syncMobileMenu);
} else if (typeof mediaQuery.addListener === 'function') {
    mediaQuery.addListener(syncMobileMenu);
}

if (musicBtn && bgMusic) {
    musicBtn.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicBtn.classList.add('playing');
            musicBtn.setAttribute('aria-label', '음악 정지');
        } else {
            bgMusic.pause();
            musicBtn.classList.remove('playing');
            musicBtn.setAttribute('aria-label', '음악 재생');
        }
    });
}
