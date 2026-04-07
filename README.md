# Antonia Benz — Portfolio

Portafolio artístico 2D/3D con estética de fantasía oscura y terror.  
Diseñado para ser hosteado en **GitHub Pages** con actualización fácil vía JSON.

---

## Estructura del proyecto

```
/
├── index.html          → Sitio principal
├── admin.html          → Panel de administración
├── css/
│   └── styles.css      → Estilos completos
├── js/
│   ├── main.js         → Lógica del portafolio
│   └── admin.js        → Lógica del panel admin
├── data/
│   └── projects.json   → Tus proyectos y galería ← EDITAR AQUÍ
└── assets/
    └── cv-antoniabenz.pdf  → Tu CV (colocar aquí)
```

---

## Cómo agregar contenido

### Opción A — Panel Admin (recomendado)

1. Abre `admin.html` en tu navegador.
2. Completa el formulario con los datos del proyecto o pieza.
3. Haz clic en **"Generar JSON"** → **"Descargar projects.json"**.
4. Reemplaza `data/projects.json` en tu repo.
5. Haz push a GitHub → el sitio se actualiza automáticamente.

### Opción B — Editar el JSON directamente

Edita `data/projects.json` siguiendo la estructura existente:

**Estructura de un Proyecto:**
```json
{
  "id": "proj-001",
  "tipo": "proyecto",
  "titulo": "Nombre del proyecto",
  "categoria": "Modelado 3D / Texturizado",
  "descripcionCorta": "Frase corta para la card.",
  "descripcionCompleta": "Descripción larga para el modal.",
  "portada": "https://i.imgur.com/TU_IMAGEN.jpg",
  "galeria": [
    "https://i.imgur.com/img1.jpg",
    "https://i.imgur.com/img2.jpg"
  ],
  "herramientas": ["ZBrush", "Blender", "Substance Painter"],
  "rol": "Artista 3D Principal",
  "linkExterno": "https://itch.io/tu-juego",
  "destacado": true
}
```

**Estructura de un ítem de Galería:**
```json
{
  "id": "gal-001",
  "tipo": "galeria",
  "titulo": "Nombre de la pieza",
  "imagen": "https://i.imgur.com/TU_IMAGEN.jpg",
  "descripcion": "Descripción corta.",
  "herramientas": ["Photoshop", "Procreate"]
}
```

---

## Imágenes — Imgur

1. Sube tus imágenes en [imgur.com](https://imgur.com).
2. Copia el link directo (termina en `.jpg`, `.png`, etc.).
3. Pégalo en el JSON o en el admin.

---

## Despliegue en GitHub Pages

1. Sube todos los archivos a un repo de GitHub.
2. Ve a **Settings → Pages**.
3. En **Source**, selecciona la rama `main` (o `master`) y la carpeta `/ (root)`.
4. GitHub Pages generará la URL: `https://tuusuario.github.io/nombre-del-repo`.

---

## Personalización

### Cambiar datos de contacto
Edita `index.html` y busca la sección `#contacto`:
- Reemplaza `hola@antoniabenz.com` con tu correo.
- Reemplaza los links de Instagram, TikTok y ArtStation.

### Cambiar foto de perfil
En `index.html`, en la sección `#sobre-mi`:
```html
<!-- Reemplaza el span con: -->
<img src="assets/foto-antonia.jpg" alt="Antonia Benz">
```

### Cambiar colores
En `css/styles.css`, al inicio del archivo:
```css
:root {
  --crimson: #7a1525;    /* Rojo principal */
  --violet: #2d1b4e;     /* Violeta */
  --gold: #c9a84c;       /* Dorado / acento */
  /* ... */
}
```

---

## Tecnologías

- HTML5, CSS3, JavaScript (Vanilla — sin frameworks)
- Google Fonts: Cinzel Decorative + Cormorant Garamond
- Carga dinámica desde JSON
- Canvas API para fondo animado de partículas
- IntersectionObserver para animaciones de scroll

---

© 2026 Antonia Benz
