'use strict';

/* ============================================================
   El contenido (productos, packs, textos) está en index.html.
   Este archivo solo añade comportamiento: si no se carga,
   la página se sigue viendo completa.
============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initTabs();
    initScrollAnimations();
    initMapa();
    initYear();
});


/* ============================================================
   NAVBAR
============================================================ */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                navbar.classList.toggle('scrolled', window.scrollY > 55);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const id = anchor.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight - 12;
            window.scrollTo({ top, behavior: 'smooth' });
            closeMobileMenu();
        });
    });
}


/* ============================================================
   MENÚ MÓVIL
============================================================ */
function initMobileMenu() {
    const btn  = document.getElementById('hamburger');
    const menu = document.getElementById('navMenu');
    if (!btn || !menu) return;
    btn.addEventListener('click', () => {
        const open = menu.classList.toggle('open');
        btn.classList.toggle('active', open);
        btn.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
    });
    document.addEventListener('click', e => {
        if (!btn.contains(e.target) && !menu.contains(e.target)) closeMobileMenu();
    });
}

function closeMobileMenu() {
    const btn  = document.getElementById('hamburger');
    const menu = document.getElementById('navMenu');
    if (!menu) return;
    menu.classList.remove('open');
    btn && btn.classList.remove('active');
    btn && btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}


/* ============================================================
   PESTAÑAS DE PRODUCTOS
   Sin JavaScript se ven todas las categorías seguidas.
============================================================ */
function initTabs() {
    const tabs = Array.from(document.querySelectorAll('.tab-btn'));
    if (!tabs.length) return;

    const activar = (tab, foco) => {
        tabs.forEach(t => {
            const on = t === tab;
            t.classList.toggle('active', on);
            t.setAttribute('aria-selected', String(on));
            t.tabIndex = on ? 0 : -1;
            const panel = document.getElementById(t.getAttribute('aria-controls'));
            if (panel) panel.classList.toggle('is-active', on);
        });
        if (foco) tab.focus();
    };

    tabs.forEach((tab, i) => {
        tab.addEventListener('click', () => activar(tab, false));
        tab.addEventListener('keydown', e => {
            let next = null;
            if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
            if (e.key === 'ArrowLeft')  next = tabs[(i - 1 + tabs.length) % tabs.length];
            if (e.key === 'Home')       next = tabs[0];
            if (e.key === 'End')        next = tabs[tabs.length - 1];
            if (next) { e.preventDefault(); activar(next, true); }
        });
    });
}


/* ============================================================
   ANIMACIONES SCROLL
============================================================ */
function initScrollAnimations() {
    const items = document.querySelectorAll('.beneficio-item, .paso, .pack-card');
    if (!('IntersectionObserver' in window)) {
        items.forEach(el => el.classList.add('visible'));
        return;
    }
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    items.forEach(el => observer.observe(el));
}


/* ============================================================
   MAPA
   Google Maps instala cookies de terceros, así que el mapa
   solo se carga cuando el visitante pulsa el botón.
============================================================ */
function initMapa() {
    const box = document.getElementById('mapa');
    const btn = document.getElementById('mapaCargar');
    if (!box || !btn) return;
    btn.addEventListener('click', () => {
        const iframe = document.createElement('iframe');
        iframe.src = box.dataset.src;
        iframe.title = 'Mapa: Adolfo Martínez Gourmet, Calle San Juan de Dios 50, Granada';
        iframe.loading = 'lazy';
        iframe.referrerPolicy = 'no-referrer-when-downgrade';
        iframe.allowFullscreen = true;
        box.innerHTML = '';
        box.appendChild(iframe);
        box.classList.add('is-loaded');
    });
}


/* ============================================================
   AÑO DEL COPYRIGHT
============================================================ */
function initYear() {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
}
