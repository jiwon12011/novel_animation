// ── 장식 레이어 주입 (별똥별 + 천체 블룸 + 추가 반딧불) ──
(function injectDecor() {
    const subpage = document.querySelector('.subpage');
    if (!subpage) return;

    // 천체 블룸 (배경 뒤)
    if (!subpage.querySelector('.celestial-glow')) {
        const glow = document.createElement('div');
        glow.className = 'celestial-glow';
        glow.setAttribute('aria-hidden', 'true');
        subpage.prepend(glow);
    }

    // 별똥별 (콘텐츠 shell 아래)
    if (!subpage.querySelector('.shooting-stars')) {
        const stars = document.createElement('div');
        stars.className = 'shooting-stars';
        stars.setAttribute('aria-hidden', 'true');
        stars.innerHTML = '<span class="shooting-star"></span><span class="shooting-star"></span><span class="shooting-star"></span>';
        const shell = subpage.querySelector('.shell');
        subpage.insertBefore(stars, shell || null);
    }

    // 반딧불 입자 6 → 12개로 보강
    const layer = subpage.querySelector('.particle-layer');
    if (layer) {
        for (let i = layer.querySelectorAll('span').length; i < 12; i++) {
            layer.appendChild(document.createElement('span'));
        }
    }
})();

const siteHeader = document.querySelector('.site-header');
const menuToggle = document.getElementById('menuToggle');
const mediaQuery = window.matchMedia('(max-width: 720px), (orientation: portrait) and (max-width: 960px)');
const navLinks = document.querySelectorAll('#mainNav a');
const musicBtn = document.getElementById('musicBtn');
const STORAGE_KEY_PLAYING = 'bgMusicPlaying';
const STORAGE_KEY_TIME = 'bgMusicCurrentTime';

let bgMusic = document.getElementById('bgMusic');

if (!bgMusic) {
    bgMusic = document.createElement('audio');
    bgMusic.id = 'bgMusic';
    bgMusic.src = 'img/music.mp4';
    bgMusic.loop = true;
    bgMusic.preload = 'auto';
    document.body.appendChild(bgMusic);
}

function syncMusicButton() {
    if (!musicBtn || !bgMusic) return;

    const isPlaying = !bgMusic.paused;
    musicBtn.classList.toggle('playing', isPlaying);
    musicBtn.setAttribute('aria-label', isPlaying ? '음악 정지' : '음악 재생');
}

function saveMusicState() {
    if (!bgMusic) return;

    sessionStorage.setItem(STORAGE_KEY_PLAYING, String(!bgMusic.paused));
    sessionStorage.setItem(STORAGE_KEY_TIME, String(bgMusic.currentTime || 0));
}

const savedTime = Number(sessionStorage.getItem(STORAGE_KEY_TIME) || '0');

if (savedTime > 0) {
    bgMusic.currentTime = savedTime;
}

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
            bgMusic.play().then(() => {
                saveMusicState();
                syncMusicButton();
            }).catch(() => {
                syncMusicButton();
            });
        } else {
            bgMusic.pause();
            saveMusicState();
            syncMusicButton();
        }
    });
}

bgMusic.addEventListener('play', () => {
    saveMusicState();
    syncMusicButton();
});

bgMusic.addEventListener('pause', () => {
    saveMusicState();
    syncMusicButton();
});

window.addEventListener('beforeunload', saveMusicState);

if (sessionStorage.getItem(STORAGE_KEY_PLAYING) === 'true') {
    bgMusic.play().then(() => {
        syncMusicButton();
    }).catch(() => {
        syncMusicButton();
    });
} else {
    syncMusicButton();
}
