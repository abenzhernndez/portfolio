/* ============================================================
   ANTONIA BENZ — PORTFOLIO — main.js
   ============================================================ */

"use strict";

// ============================================================
// ESTADO GLOBAL
// ============================================================
let todosLosDatos = { proyectos: [], galeria: [] };
let filtroActual = 'todos';

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initCanvas();
  initNavbar();
  initHamburger();
  initReveal();
  cargarDatos();
  initModal();
});

// ============================================================
// CURSOR PERSONALIZADO
// ============================================================
function initCursor() {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  // Suavizar el anillo
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover en elementos interactivos
  const interactivos = ['a', 'button', '.project-card', '.gallery-item', '.filtro-btn', '.modal-close'];
  interactivos.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
  });
}

// ============================================================
// CANVAS — PARTÍCULAS / ESTRELLAS
// ============================================================
function initCanvas() {
  const canvas = document.getElementById('canvas-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  const particles = [];
  const COUNT = 120;

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.2,
      speed: Math.random() * 0.3 + 0.05,
      opacity: Math.random() * 0.5 + 0.1,
      drift: (Math.random() - 0.5) * 0.2,
      phase: Math.random() * Math.PI * 2
    });
  }

  // Líneas decorativas (cúmulos)
  const clusters = [
    { x: W * 0.15, y: H * 0.3, color: 'rgba(107, 63, 160,' },
    { x: W * 0.85, y: H * 0.6, color: 'rgba(122, 21, 37,' },
    { x: W * 0.5, y: H * 0.85, color: 'rgba(201, 168, 76,' }
  ];

  let t = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 0.008;

    // Nebulosas de fondo
    clusters.forEach((c, i) => {
      const pulse = Math.sin(t + i * 2) * 0.03 + 0.06;
      const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, 250);
      grad.addColorStop(0, c.color + pulse + ')');
      grad.addColorStop(1, c.color + '0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    });

    // Partículas
    particles.forEach(p => {
      p.y -= p.speed;
      p.x += Math.sin(t + p.phase) * p.drift;
      if (p.y < -5) {
        p.y = H + 5;
        p.x = Math.random() * W;
      }

      const flicker = Math.sin(t * 2 + p.phase) * 0.2 + p.opacity;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 210, 255, ${Math.max(0.05, flicker)})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  draw();

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });
}

// ============================================================
// NAVBAR — SCROLL
// ============================================================
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  // Active link según sección
  const links = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    links.forEach(l => {
      l.classList.remove('active');
      if (l.getAttribute('href') === '#' + current) l.classList.add('active');
    });
  });
}

// ============================================================
// HAMBURGER MENU
// ============================================================
function initHamburger() {
  const btn = document.querySelector('.hamburger');
  const links = document.querySelector('.nav-links');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    links.classList.toggle('open');
    const spans = btn.querySelectorAll('span');
    if (links.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Cerrar al hacer clic en un link
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      btn.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

// ============================================================
// SCROLL REVEAL
// ============================================================
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ============================================================
// CARGAR DATOS
// ============================================================
async function cargarDatos() {
  try {
    const res = await fetch('data/projects.json');
    if (!res.ok) throw new Error('No se pudo cargar el JSON');
    todosLosDatos = await res.json();
    renderProyectos(todosLosDatos.proyectos);
    renderGaleria(todosLosDatos.galeria);
    renderHeroPreview(todosLosDatos.proyectos);
    initFiltros();
    initRevealDinamico();
  } catch (err) {
    console.warn('Error cargando datos:', err);
    renderEstadoVacio();
  }
}

// ============================================================
// RENDER — HERO PREVIEW
// ============================================================
function renderHeroPreview(proyectos) {
  const grid = document.getElementById('hero-preview-grid');
  if (!grid) return;
  const destacados = proyectos.filter(p => p.destacado).slice(0, 3);
  if (!destacados.length) return;

  grid.innerHTML = '';
  destacados.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'preview-card';
    card.innerHTML = `
      ${p.portada && !p.portada.includes('placeholder')
        ? `<img src="${p.portada}" alt="${p.titulo}" loading="lazy">`
        : `<div class="img-placeholder">✦</div>`}
      <div class="project-card-overlay"></div>
      <span class="preview-card-label">${p.categoria}</span>
    `;
    card.addEventListener('click', () => abrirModalProyecto(p));
    grid.appendChild(card);
  });
}

// ============================================================
// RENDER — PROYECTOS
// ============================================================
function renderProyectos(proyectos) {
  const grid = document.getElementById('proyectos-grid');
  if (!grid) return;

  grid.innerHTML = '';
  if (!proyectos.length) {
    grid.innerHTML = '<p class="empty-state">Próximamente...</p>';
    return;
  }

  proyectos.forEach((p, i) => {
    const card = crearCardProyecto(p, i);
    grid.appendChild(card);
  });
}

function crearCardProyecto(p, i) {
  const card = document.createElement('article');
  card.className = 'project-card reveal reveal-delay-' + Math.min((i % 4) + 1, 4);
  card.setAttribute('data-categoria', p.categoria);

  card.innerHTML = `
    <div class="project-card-image">
      ${p.portada && !p.portada.includes('placeholder')
        ? `<img src="${p.portada}" alt="${p.titulo}" loading="lazy">`
        : `<div class="img-placeholder">✦</div>`}
      <div class="project-card-overlay"></div>
      <span class="project-card-categoria">${p.categoria}</span>
    </div>
    <div class="project-card-body">
      <h3 class="project-card-title">${p.titulo}</h3>
      <p class="project-card-desc">${p.descripcionCorta}</p>
      <div class="project-card-tools">
        ${p.herramientas.map(h => `<span class="tool-chip">${h}</span>`).join('')}
      </div>
    </div>
    <div class="project-card-cta">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
      Ver proyecto
    </div>
  `;

  card.addEventListener('click', () => abrirModalProyecto(p));
  return card;
}

// ============================================================
// RENDER — GALERÍA
// ============================================================
function renderGaleria(items) {
  const grid = document.getElementById('galeria-grid');
  if (!grid) return;

  grid.innerHTML = '';
  if (!items.length) {
    grid.innerHTML = '<p class="empty-state">Próximamente...</p>';
    return;
  }

  items.forEach((item, i) => {
    const el = crearItemGaleria(item, i);
    grid.appendChild(el);
  });
}

function crearItemGaleria(item, i) {
  const div = document.createElement('div');
  div.className = 'gallery-item reveal reveal-delay-' + Math.min((i % 4) + 1, 4);

  div.innerHTML = `
    ${item.imagen && !item.imagen.includes('placeholder')
      ? `<img src="${item.imagen}" alt="${item.titulo || 'Arte'}" loading="lazy">`
      : `<div class="img-placeholder" style="aspect-ratio:1">✦</div>`}
    <div class="gallery-item-overlay">
      <div class="gallery-item-info">
        ${item.titulo ? `<div class="gallery-item-title">${item.titulo}</div>` : ''}
        ${item.herramientas && item.herramientas.length
          ? `<div class="gallery-item-tools">${item.herramientas.join(' · ')}</div>`
          : ''}
      </div>
    </div>
  `;

  div.addEventListener('click', () => abrirModalGaleria(item));
  return div;
}

// ============================================================
// FILTROS
// ============================================================
function initFiltros() {
  const contenedor = document.getElementById('filtros');
  if (!contenedor) return;

  const categorias = ['todos', ...new Set(todosLosDatos.proyectos.map(p => p.categoria))];

  contenedor.innerHTML = categorias.map(c => `
    <button class="filtro-btn ${c === 'todos' ? 'active' : ''}" data-cat="${c}">
      ${c === 'todos' ? 'Todos' : c}
    </button>
  `).join('');

  contenedor.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      contenedor.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filtroActual = btn.dataset.cat;

      const filtrados = filtroActual === 'todos'
        ? todosLosDatos.proyectos
        : todosLosDatos.proyectos.filter(p => p.categoria === filtroActual);

      const grid = document.getElementById('proyectos-grid');
      if (grid) {
        grid.style.opacity = '0';
        grid.style.transform = 'translateY(10px)';
        setTimeout(() => {
          renderProyectos(filtrados);
          initRevealDinamico();
          grid.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          grid.style.opacity = '1';
          grid.style.transform = 'translateY(0)';
        }, 250);
      }
    });
  });
}

// ============================================================
// REVEAL DINÁMICO
// ============================================================
function initRevealDinamico() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.05 });

  document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
}

// ============================================================
// SISTEMA MODAL
// ============================================================
let modalOverlay;
let modalEl;

function initModal() {
  modalOverlay = document.getElementById('modal-overlay');
  modalEl = document.getElementById('modal');
  if (!modalOverlay) return;

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) cerrarModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrarModal();
  });

  const closeBtn = document.getElementById('modal-close');
  if (closeBtn) closeBtn.addEventListener('click', cerrarModal);
}

function abrirModal(contenidoHTML) {
  const body = document.getElementById('modal-content');
  if (!body) return;
  body.innerHTML = contenidoHTML;
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function cerrarModal() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

// ============================================================
// MODAL — PROYECTO
// ============================================================
function abrirModalProyecto(p) {
  const galeriaHTML = p.galeria && p.galeria.length
    ? `<img id="modal-main-img" class="modal-main-img" src="${p.galeria[0]}" alt="${p.titulo}">
       <div class="modal-gallery-strip">
         ${p.galeria.map((img, i) => `
           <div class="modal-gallery-thumb ${i === 0 ? 'active' : ''}" onclick="cambiarImgModal('${img}', this)">
             <img src="${img}" alt="Imagen ${i+1}" loading="lazy">
           </div>
         `).join('')}
       </div>`
    : '';

  const linkHTML = p.linkExterno
    ? `<a href="${p.linkExterno}" target="_blank" rel="noopener" class="modal-link">
         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
         Ver proyecto completo
       </a>`
    : '';

  abrirModal(`
    ${galeriaHTML}
    <div class="modal-body">
      <span class="modal-categoria">${p.categoria}</span>
      <h2 class="modal-title">${p.titulo}</h2>
      <p class="modal-desc">${p.descripcionCompleta}</p>
      <div class="modal-meta">
        <div class="modal-meta-item">
          <label>Rol</label>
          <p>${p.rol || '—'}</p>
        </div>
        <div class="modal-meta-item">
          <label>Herramientas</label>
          <div class="modal-tools">
            ${(p.herramientas || []).map(h => `<span class="tool-chip">${h}</span>`).join('')}
          </div>
        </div>
      </div>
      ${linkHTML}
    </div>
  `);
}

// Cambiar imagen en modal de proyecto
window.cambiarImgModal = function(src, thumb) {
  const img = document.getElementById('modal-main-img');
  if (img) {
    img.style.opacity = '0';
    setTimeout(() => {
      img.src = src;
      img.style.opacity = '1';
    }, 200);
    img.style.transition = 'opacity 0.2s ease';
  }
  document.querySelectorAll('.modal-gallery-thumb').forEach(t => t.classList.remove('active'));
  if (thumb) thumb.classList.add('active');
};

// ============================================================
// MODAL — GALERÍA
// ============================================================
function abrirModalGaleria(item) {
  const imgHTML = item.imagen && !item.imagen.includes('placeholder')
    ? `<img class="modal-gallery-img" src="${item.imagen}" alt="${item.titulo || 'Arte'}">`
    : `<div class="img-placeholder" style="height:300px;">✦</div>`;

  abrirModal(`
    ${imgHTML}
    <div class="modal-body">
      ${item.titulo ? `<h2 class="modal-title">${item.titulo}</h2>` : ''}
      ${item.descripcion ? `<p class="modal-desc">${item.descripcion}</p>` : ''}
      ${item.herramientas && item.herramientas.length ? `
        <div>
          <div class="tools-title" style="font-family:var(--font-heading);font-size:0.6rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold);margin-bottom:0.8rem;opacity:0.7;">Herramientas</div>
          <div class="modal-tools">
            ${item.herramientas.map(h => `<span class="tool-chip">${h}</span>`).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `);
}

// ============================================================
// ESTADO VACÍO
// ============================================================
function renderEstadoVacio() {
  const grid = document.getElementById('proyectos-grid');
  if (grid) grid.innerHTML = `<p style="text-align:center;color:var(--text-muted);font-style:italic;padding:3rem;">Los proyectos se cargarán pronto...</p>`;
  const gGrid = document.getElementById('galeria-grid');
  if (gGrid) gGrid.innerHTML = `<p style="text-align:center;color:var(--text-muted);font-style:italic;padding:3rem;">La galería se cargará pronto...</p>`;
}
