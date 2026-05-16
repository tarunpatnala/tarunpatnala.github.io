/* ============================================================
   TARUN.PATNALA — Portfolio interactions
   ============================================================ */

(function () {
    'use strict';

    /* ---------- Live clock (Sydney) ---------- */
    const clockEl = document.getElementById('clock');
    if (clockEl) {
        const tick = () => {
            try {
                const fmt = new Intl.DateTimeFormat('en-AU', {
                    timeZone: 'Australia/Sydney',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                });
                clockEl.textContent = fmt.format(new Date());
            } catch (_) {
                const d = new Date();
                clockEl.textContent = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
            }
        };
        tick();
        setInterval(tick, 30 * 1000);
    }

    /* ---------- Year ---------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- Mobile nav ---------- */
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const open = navLinks.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', String(open));
        });
        navLinks.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                navLinks.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /* ---------- Scroll-spy on nav ---------- */
    const navAnchors = Array.from(document.querySelectorAll('.nav__links a[href^="#"]'));
    const spyTargets = navAnchors
        .map(a => document.querySelector(a.getAttribute('href')))
        .filter(Boolean);
    if (spyTargets.length && 'IntersectionObserver' in window) {
        const spy = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = '#' + entry.target.id;
                        navAnchors.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === id));
                    }
                });
            },
            { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
        );
        spyTargets.forEach(t => spy.observe(t));
    }

    /* ---------- Reveal on scroll ---------- */
    const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
    if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        fillBarsIn(entry.target);
                        obs.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: '0px 0px -10% 0px', threshold: 0.08 }
        );
        revealEls.forEach(el => obs.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('is-visible'));
        fillBarsIn(document);
    }

    function fillBarsIn(scope) {
        const bars = scope.querySelectorAll('[data-fill]');
        bars.forEach(b => {
            const pct = Math.max(0, Math.min(100, parseFloat(b.getAttribute('data-fill'))));
            requestAnimationFrame(() => { b.style.width = pct + '%'; });
        });
    }

    /* ---------- Loadout filter ---------- */
    const tabs = document.querySelectorAll('#loadoutTabs .loadout__tab');
    const cards = document.querySelectorAll('#loadoutGrid .loadout__card');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('is-active'));
            tab.classList.add('is-active');
            const filter = tab.dataset.filter;
            cards.forEach(c => {
                const show = filter === 'all' || c.dataset.cat === filter;
                c.style.display = show ? '' : 'none';
            });
        });
    });

    /* ---------- Quest card spotlight follow ---------- */
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('pointermove', (e) => {
            const rect = card.getBoundingClientRect();
            const mx = ((e.clientX - rect.left) / rect.width) * 100;
            const my = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mx', mx + '%');
            card.style.setProperty('--my', my + '%');
        });
    });

    /* ---------- Custom cursor ---------- */
    const ring = document.getElementById('cursor-ring');
    const dot = document.getElementById('cursor-dot');
    const supportsHover = window.matchMedia('(hover: hover)').matches;
    if (ring && dot && supportsHover) {
        let mx = window.innerWidth / 2, my = window.innerHeight / 2;
        let rx = mx, ry = my;
        window.addEventListener('pointermove', (e) => {
            mx = e.clientX; my = e.clientY;
            dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
        });
        const loop = () => {
            rx += (mx - rx) * 0.18;
            ry += (my - ry) * 0.18;
            ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
            requestAnimationFrame(loop);
        };
        loop();

        const hoverSelector = 'a, button, [data-tilt], .loadout__card, .trophy, .cred, .channel, .btn';
        document.querySelectorAll(hoverSelector).forEach(el => {
            el.addEventListener('pointerenter', () => ring.classList.add('is-hover'));
            el.addEventListener('pointerleave', () => ring.classList.remove('is-hover'));
        });
    }

    /* ---------- Hero word rotator (subtle) ---------- */
    const rotator = document.querySelector('[data-rotator]');
    if (rotator) {
        const words = JSON.parse(rotator.getAttribute('data-words') || '[]');
        let i = 0;
        if (words.length) {
            setInterval(() => {
                i = (i + 1) % words.length;
                rotator.style.opacity = '0';
                setTimeout(() => {
                    rotator.textContent = words[i];
                    rotator.style.opacity = '1';
                }, 220);
            }, 2400);
        }
    }
})();
