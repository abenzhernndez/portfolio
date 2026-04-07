/* ============================================================
   ANTONIA BENZ — PORTFOLIO — admin.js
   ============================================================ */

"use strict";

let datosActuales = { proyectos: [], galeria: [] };

document.addEventListener('DOMContentLoaded', () => {
  cargarDatosAdmin();
  initFormAdmin();
  initTabsAdmin();
});

// ============================================================
// CARGAR DATOS EXISTENTES
// ============================================================
async function cargarDatosAdmin() {
  try {
    const res = await fetch('data/projects.json');
    if (res.ok) {
      datosActuales = await res.json();
      renderListaAdmin();
      actualizarContadores();
    }
  } catch (e) {
    console.warn('JSON no encontrado, iniciando vacío.');
  }
}

// ============================================================
// TABS
// ============================================================
function initTabsAdmin() {
  const tabs = document.querySelectorAll('.admin-tab');
  const panels = document.querySelectorAll('.admin-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      const panel = document.getElementById('panel-' + target);
      if (panel) panel.classList.add('active');
    });
  });

  // Mostrar/ocultar campos según tipo
  const tipoSelect = document.getElementById('a-tipo');
  const camposProyecto = document.getElementById('campos-proyecto');
  if (tipoSelect && camposProyecto) {
    tipoSelect.addEventListener('change', () => {
      camposProyecto.style.display = tipoSelect.value === 'proyecto' ? 'block' : 'none';
    });
  }
}

// ============================================================
// FORMULARIO
// ============================================================
function initFormAdmin() {
  const form = document.getElementById('form-admin');
  if (!form) return;

  // Preview de imagen
  const imgInput = document.getElementById('a-imagen');
  const previewImg = document.getElementById('preview-img');
  if (imgInput && previewImg) {
    imgInput.addEventListener('input', () => {
      const url = imgInput.value.trim();
      if (url) {
        previewImg.src = url;
        previewImg.style.display = 'block';
      } else {
        previewImg.style.display = 'none';
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = leerFormulario();
    if (!data) return;

    // Agregar a la lista en memoria
    if (data.tipo === 'proyecto') {
      datosActuales.proyectos.push(data);
    } else {
      datosActuales.galeria.push(data);
    }

    renderListaAdmin();
    actualizarContadores();
    actualizarOutputJSON();
    mostrarMensaje('✦ Elemento agregado correctamente', 'success');
    form.reset();
    if (previewImg) previewImg.style.display = 'none';

    // Ir a tab de lista
    const tabLista = document.querySelector('[data-tab="lista"]');
    if (tabLista) tabLista.click();
  });

  // Botón generar JSON
  const btnJson = document.getElementById('btn-generar-json');
  if (btnJson) {
    btnJson.addEventListener('click', () => {
      actualizarOutputJSON();
      const panel = document.getElementById('panel-json');
      if (panel) {
        panel.classList.add('active');
        document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
        document.querySelector('[data-tab="json"]')?.classList.add('active');
        document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
        panel.classList.add('active');
      }
    });
  }

  // Copiar JSON
  const btnCopiar = document.getElementById('btn-copiar-json');
  if (btnCopiar) {
    btnCopiar.addEventListener('click', () => {
      const output = document.getElementById('json-output');
      if (output) {
        navigator.clipboard.writeText(output.value).then(() => {
          mostrarMensaje('JSON copiado al portapapeles', 'success');
        });
      }
    });
  }

  // Descargar JSON
  const btnDescargar = document.getElementById('btn-descargar-json');
  if (btnDescargar) {
    btnDescargar.addEventListener('click', () => {
      const jsonStr = JSON.stringify(datosActuales, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'projects.json';
      a.click();
      URL.revokeObjectURL(url);
      mostrarMensaje('Archivo descargado', 'success');
    });
  }
}

// ============================================================
// LEER FORMULARIO
// ============================================================
function leerFormulario() {
  const tipo = document.getElementById('a-tipo')?.value;
  const titulo = document.getElementById('a-titulo')?.value?.trim();
  const imagen = document.getElementById('a-imagen')?.value?.trim();
  const desc = document.getElementById('a-descripcion')?.value?.trim();
  const tools = document.getElementById('a-herramientas')?.value?.trim();

  if (!titulo) {
    mostrarMensaje('El título es obligatorio', 'error');
    return null;
  }

  const herramientas = tools ? tools.split(',').map(t => t.trim()).filter(Boolean) : [];
  const id = tipo + '-' + Date.now();

  if (tipo === 'proyecto') {
    const categoria = document.getElementById('a-categoria')?.value?.trim() || '';
    const descCompleta = document.getElementById('a-desc-completa')?.value?.trim() || desc;
    const galeriaRaw = document.getElementById('a-galeria')?.value?.trim() || '';
    const galeria = galeriaRaw ? galeriaRaw.split('\n').map(u => u.trim()).filter(Boolean) : (imagen ? [imagen] : []);
    const rol = document.getElementById('a-rol')?.value?.trim() || '';
    const link = document.getElementById('a-link')?.value?.trim() || '';
    const destacado = document.getElementById('a-destacado')?.checked || false;

    return { id, tipo, titulo, categoria, descripcionCorta: desc, descripcionCompleta: descCompleta,
             portada: imagen || (galeria[0] || ''), galeria, herramientas, rol, linkExterno: link, destacado };
  } else {
    return { id, tipo, titulo, imagen, descripcion: desc, herramientas };
  }
}

// ============================================================
// RENDER LISTA ADMIN
// ============================================================
function renderListaAdmin() {
  const lista = document.getElementById('lista-items');
  if (!lista) return;

  const todos = [
    ...datosActuales.proyectos.map(p => ({ ...p, _seccion: 'Proyecto' })),
    ...datosActuales.galeria.map(g => ({ ...g, _seccion: 'Galería' }))
  ];

  if (!todos.length) {
    lista.innerHTML = '<p class="admin-empty">No hay elementos todavía. Agrega uno desde el formulario.</p>';
    return;
  }

  lista.innerHTML = todos.map((item, i) => `
    <div class="admin-item">
      <div class="admin-item-thumb">
        ${(item.portada || item.imagen) && !(item.portada || item.imagen).includes('placeholder')
          ? `<img src="${item.portada || item.imagen}" alt="${item.titulo}">`
          : '<span class="admin-thumb-placeholder">✦</span>'}
      </div>
      <div class="admin-item-info">
        <span class="admin-item-tipo">${item._seccion}</span>
        <strong>${item.titulo}</strong>
        ${item.categoria ? `<small>${item.categoria}</small>` : ''}
      </div>
      <button class="admin-item-delete" onclick="eliminarItem('${item.id}', '${item._seccion}')">
        ✕
      </button>
    </div>
  `).join('');
}

// ============================================================
// ELIMINAR ITEM
// ============================================================
window.eliminarItem = function(id, seccion) {
  if (!confirm('¿Eliminar este elemento?')) return;

  if (seccion === 'Proyecto') {
    datosActuales.proyectos = datosActuales.proyectos.filter(p => p.id !== id);
  } else {
    datosActuales.galeria = datosActuales.galeria.filter(g => g.id !== id);
  }

  renderListaAdmin();
  actualizarContadores();
  actualizarOutputJSON();
  mostrarMensaje('Elemento eliminado', 'success');
};

// ============================================================
// JSON OUTPUT
// ============================================================
function actualizarOutputJSON() {
  const output = document.getElementById('json-output');
  if (output) {
    output.value = JSON.stringify(datosActuales, null, 2);
  }
}

// ============================================================
// CONTADORES
// ============================================================
function actualizarContadores() {
  const cProyectos = document.getElementById('count-proyectos');
  const cGaleria = document.getElementById('count-galeria');
  if (cProyectos) cProyectos.textContent = datosActuales.proyectos.length;
  if (cGaleria) cGaleria.textContent = datosActuales.galeria.length;
}

// ============================================================
// MENSAJES
// ============================================================
function mostrarMensaje(texto, tipo = 'success') {
  let toast = document.getElementById('admin-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'admin-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = texto;
  toast.className = 'admin-toast ' + tipo;
  toast.style.opacity = '1';
  setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}
