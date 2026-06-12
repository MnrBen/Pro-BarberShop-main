// ============================================
// PRO BARBERSHOP — main.js
// ============================================ 

document.addEventListener('DOMContentLoaded', () => {
 
  // ---- Menú hamburguesa ----
  const hamburger = document.getElementById('hamburger');
  const menuMovil = document.getElementById('menu-movil');

  if (hamburger && menuMovil) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('abierto');
      menuMovil.classList.toggle('visible');
    });

    // Cerrar al hacer clic en un enlace
    menuMovil.querySelectorAll('a').forEach(enlace => {
      enlace.addEventListener('click', () => {
        hamburger.classList.remove('abierto');
        menuMovil.classList.remove('visible');
      });
    });
  }

  // ---- Scroll reveal ----
  const elementosReveal = document.querySelectorAll('.reveal');

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visible');
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elementosReveal.forEach(el => observador.observe(el));

  // ---- Nav activo según sección ----
  const secciones = document.querySelectorAll('section[id]');
  const navEnlaces = document.querySelectorAll('.nav-links a, .nav-menu-movil a');

  const observadorNav = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        const id = entrada.target.getAttribute('id');
        navEnlaces.forEach(a => {
          a.classList.remove('activo');
          if (a.getAttribute('href') === `#${id}`) {
            a.classList.add('activo');
          }
        });
      }
    });
  }, { threshold: 0.4 });

  secciones.forEach(s => observadorNav.observe(s));

  // ---- Hero bg loaded ----
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    setTimeout(() => heroBg.classList.add('loaded'), 100);
  }

  // ---- Smooth scroll para anclas ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const destino = document.querySelector(href);
      if (destino) {
        e.preventDefault();
        const offset = 68;
        const top = destino.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- Contador animado en stats ----
  const contadores = document.querySelectorAll('[data-count]');

  const observadorContador = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        const el = entrada.target;
        const objetivo = parseInt(el.getAttribute('data-count'));
        const sufijo = el.getAttribute('data-sufijo') || '';
        const duracion = 1800;
        const inicio = performance.now();

        const animar = (ahora) => {
          const progreso = Math.min((ahora - inicio) / duracion, 1);
          const ease = 1 - Math.pow(1 - progreso, 3);
          el.textContent = Math.floor(ease * objetivo) + sufijo;
          if (progreso < 1) requestAnimationFrame(animar);
        };

        requestAnimationFrame(animar);
        observadorContador.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  contadores.forEach(c => observadorContador.observe(c));

// ---- Lightbox galería ----
const lightbox        = document.getElementById('lightbox');
const lightboxImg     = document.getElementById('lightbox-img');
const lightboxCerrar  = document.getElementById('lightbox-cerrar');
const lightboxPrev    = document.getElementById('lightbox-prev');
const lightboxNext    = document.getElementById('lightbox-next');

const items = Array.from(document.querySelectorAll('.galeria-item'));
let indiceActual = 0;

function abrirLightbox(indice) {
  const img = items[indice].querySelector('img');
  if (!img) return;
  lightboxImg.setAttribute('src', img.getAttribute('src'));
  lightboxImg.setAttribute('alt', img.getAttribute('alt') || '');
  indiceActual = indice;
  lightbox.classList.add('activo');
  document.body.style.overflow = 'hidden';
}

function cerrarLightbox() {
  lightbox.classList.remove('activo');
  document.body.style.overflow = '';
  lightboxImg.setAttribute('src', '');
}

function irAnterior() {
  indiceActual = (indiceActual - 1 + items.length) % items.length;
  abrirLightbox(indiceActual);
}

function irSiguiente() {
  indiceActual = (indiceActual + 1) % items.length;
  abrirLightbox(indiceActual);
}

items.forEach((item, indice) => {
  item.addEventListener('click', () => abrirLightbox(indice));
});

lightboxCerrar.addEventListener('click', cerrarLightbox);
lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); irAnterior(); });
lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); irSiguiente(); });

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) cerrarLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('activo')) return;
  if (e.key === 'Escape')      cerrarLightbox();
  if (e.key === 'ArrowLeft')   irAnterior();
  if (e.key === 'ArrowRight')  irSiguiente();
});

});
