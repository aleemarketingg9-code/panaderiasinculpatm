# Panadería Sin Culpa™ — página nueva

Carpeta lista para publicar: `index.html` + `css/styles.css` + `js/script.js` + `images/` + `testimonios.json`. Sin frameworks, sin dependencias externas salvo Google Fonts y los códigos de medición.

## 1. Qué falta antes de publicar (IMPORTANTE)

La página está construida completa, pero **no debe publicarse todavía** porque faltan estos datos reales. Todos viven en un solo lugar para que sea rápido completarlos:

### a) El checkout — ✅ ya conectado
`CONFIG.WHOP_PLAN_ID` en `js/script.js` ya tiene tu plan real (`plan_kgDX8MRmOp1oy`, de `https://whop.com/checkout/plan_kgDX8MRmOp1oy`). Probé que el embed carga el iframe real de Whop con ese plan. Revisa en la sección "¿Lista para volver a comer pan sin miedo?" que el formulario de pago se vea y funcione bien para ti (nombre, precio, moneda).

**Cómo lo armé:** Whop tiene un checkout embebido oficial (`js.whop.com/static/checkout/loader.js` + un `<div data-whop-checkout-plan-id="...">`) que se queda dentro de la misma página, sin ventana emergente ni redirección — por eso funciona bien también en el navegador interno de Instagram/TikTok.

**Nota sobre medición:** como el pago queda embebido en tu propia página (el comprador nunca sale a otro dominio), Clarity y el Pixel de Meta ya capturan todo el recorrido con el parámetro `?v=` que uses en tus anuncios — no hace falta nada extra tipo `src`/`sck` de Hotmart.

### b) Precio regular / tachado
Mismo objeto `CONFIG`:
```js
REGULAR_PRICE: null,  // ej: "$47 USD"
OFFER_END_ISO: null,  // ej: "2026-12-15T23:59:59-05:00" (fecha real)
```
Mientras estén en `null`, se muestra solo "$12.99 USD" sin tachado ni urgencia falsa. Si me das el precio regular y la fecha real, lo activo.

### c) Correo de soporte y legales
```js
SUPPORT_EMAIL: "",
TERMS_URL: "",
PRIVACY_URL: "",
```
Vacíos, esos enlaces del pie de página simplemente no se muestran (mejor eso que un enlace roto). En cuanto me des el correo y los links de Términos/Privacidad (de Whop o propios), los activo.

### d) Desglose de recetas y nombres reales
En la primera pantalla (`index.html`, sección hero) las etiquetas "Panes / Tortas / Postres / Snacks" están sin número todavía. Y en "Lo que vas a poder preparar" las 4 tarjetas usan íconos en vez de fotos/nombres reales de recetas, porque aún no tengo el desglose de las +180 ni 3–6 nombres concretos. Me avisas cuando los tengas y los actualizo (es un cambio rápido).

### e) Portada del Bono 1
`images/bono-1.webp` trae impreso en el diseño "+35 recetas dulces" (no es texto editable, es parte de la imagen de Canva). El brief pide no mostrar esa cifra sin verificar — revísala y, si el número no es exacto, lo mejor es pedir una portada corregida en Canva.

### f) El libro de +180 recetas
Confirmar que ya está completo y entregable en Whop antes de publicar la página (así lo pide el brief).

## 2. Dónde cambiar cada cosa

| Qué | Dónde |
|---|---|
| Checkout (Whop), precio, correo, legales, Pixel/Clarity | `js/script.js`, objeto `CONFIG` al inicio del archivo |
| Textos de cualquier sección | `index.html`, buscar la sección por su comentario (`<!-- A. ENCABEZADO -->`, etc.) |
| Colores / tipografías | `css/styles.css`, bloque `:root` al inicio |
| Testimonios (cuando tengas 3+) | `testimonios.json` — formato: `[{"nombre":"...","ciudad":"...","texto":"...","foto":"images/..."}]`. La sección se activa sola al llegar a 3. |

## 3. Decisiones técnicas que tomé (documentadas, como pide el brief)

- **Medición:** reutilicé el Microsoft Clarity (`wn4dy34791`) y el Pixel de Meta (`4039427159523335`) que ya estaban activos en la página actual — así no se pierde el histórico. Eventos: `PageView` al cargar, `ViewContent` al llegar a la sección de pago, `InitiateCheckout` al tocar cualquier botón de compra.
- **Checkout embebido vs. ventana emergente:** usé el embed oficial de Whop (inline en la página) en vez de un popup, porque es más confiable dentro de navegadores internos como el de Instagram (sin bloqueo de ventanas emergentes).
- **Imágenes excluidas a propósito:** no usé `T1–T6` (como pide el brief), ni `P1–P6` (son retratos tipo testimonio, no fotos de producto/proceso), ni los `magnific_*`/`pan landing` (no aportaban a ninguna sección del brief).
- **Accesibilidad:** los acordeones (módulos y FAQ) usan `<details>/<summary>` nativo de HTML — funcionan con teclado y lector de pantalla sin JavaScript adicional. El carrusel tiene botones prev/next y responde a las flechas del teclado, además de deslizarse con el dedo en celular.
- **Imágenes optimizadas:** convertí todas a WebP y las redimensioné a su tamaño real de uso (por ejemplo, la portada pasó de 1.4 MB a ~120 KB). Carga diferida (`loading="lazy"`) en todo menos la portada del hero.

## 4. Cómo publicar en Vercel

1. Crea un repo en GitHub con el contenido de esta carpeta (`pagina-nueva/` pasa a ser la raíz del repo, o configura Vercel con ese subdirectorio como "Root Directory").
2. Conecta el repo en [vercel.com](https://vercel.com) → "Add New Project".
3. Al ser HTML/CSS/JS plano, no hace falta ningún "Build Command": déjalo vacío y "Output Directory" en `.` (raíz).
4. Cada push a `main` vuelve a publicar automáticamente (igual que en Crochet Academia).
5. Conecta tu dominio/subdominio en Vercel → Settings → Domains.

## 5. Pendientes de prueba antes de publicar

- [ ] Probar el checkout real de Whop embebido (con el plan id puesto).
- [ ] Correr PageSpeed Insights / Lighthouse sobre la URL ya publicada (no pude correr Lighthouse dentro de esta sesión porque necesita una URL pública; lo más cercano que verifiqué fue que el peso total de imágenes bajó de varios MB a ~650 KB en total, y que no hay scroll horizontal en 360/390/430/768/1440px).
- [ ] Abrir el link publicado desde el navegador interno de Instagram/TikTok para confirmar que el embed de Whop carga bien ahí.
- [ ] Revisar la portada del Bono 1 (ver punto 1.e).

## 6. Qué quedó pendiente de tu parte (resumen)

1. ~~Plan id (o link) real de Whop.~~ ✅ hecho.
2. Precio regular + fecha, si lo vas a tachar.
3. Correo de soporte.
4. Links de Términos y Privacidad.
5. Desglose de las +180 recetas y 3–6 nombres reales.
6. Confirmar si el +35 de la portada del Bono 1 es correcto.
7. Confirmar que el libro completo ya está entregable en Whop.
