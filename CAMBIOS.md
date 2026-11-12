# CAMBIOS

Registro de despliegues de `pagina-nueva/`. Un renglón por cambio: fecha y
hora, código, qué cambió, qué señal mirar, resultado a 24 y 48 horas.
Para volver atrás: `git revert <commit>` del código correspondiente, o
promover el despliegue anterior en Vercel.

## 2026-11-11 — D1 a D8 (lote único, brief "Molde Carmencita")

Commit anterior a este lote: `d4efd5c` (último despliegue estable previo).

| Hora aprox. | Código | Qué cambió | Dónde | Señal a mirar | Resultado 24 h | Resultado 48 h |
|---|---|---|---|---|---|---|
| — | D1 | Checkout de Whop en español (`locale: "es"`, confirmado que funciona sin texto de respaldo) + atribución de origen (`?v=` → `attribution.utmSource/utmCampaign` + `metadata.v`) | `js/script.js` | Clics muertos/abandonos en el pago (Clarity); pagos en Whop con etiqueta de origen | Pendiente | Pendiente |
| — | D2 | Línea de "cómo llega el libro" bajo el botón del hero | `index.html`, hero | Clics en "¿Cómo recibo el libro?" y clic para comprar | Pendiente | Pendiente |
| — | D3 | "Las recetas por dentro": acordeón de 10 capítulos con nombres reales (sin número por capítulo), reemplaza el carrusel de 4 tarjetas | `index.html`, `#dentro` | Clics en esa zona, profundidad de desplazamiento | Pendiente | Pendiente |
| — | D4 | Receta completa de muestra (pan de lentejas, pág. 23 del PDF) con botón al final | `index.html`, `#receta-muestra` | Tiempo en la sección, clic para comprar | Pendiente | Pendiente |
| — | D5 | "Quién es Olivia": bienvenida del recetario + aviso de personaje creado con IA | `index.html`, `#quien-es-olivia` | Profundidad de desplazamiento, clic para comprar | Pendiente | Pendiente |
| — | D6 | Franja de cifras reales de Instagram/Facebook/YouTube, con fecha (panel, 11/11/2026) | `index.html`, `#cifras` | Clic para comprar por sesión | Pendiente | Pendiente |
| — | D8 | Garantía de 7 días + las 3 dudas más abiertas (cómo recibo el libro, si cobran cada mes, si es adecuado con diabetes/prediabetes/celiaquía) junto al botón de pago | `index.html`, `#comprar` | Clics en preguntas frecuentes | Pendiente | Pendiente |
| — | D7 | Pago en ventana dentro de la página: los botones "Quiero el libro" abren `#comprar` como ventana superpuesta (portada, nombre, precio, garantía, dudas, complementos y formulario de Whop) en vez de bajar 7.000+ px. Respaldo: si el JS falla, los enlaces siguen siendo anclas normales a `#comprar` | `index.html`, `css/styles.css`, `js/script.js` | Pagos por clic para comprar; `InitiateCheckout` y pagos completados en Whop | Pendiente | Pendiente |

Marca en Clarity de este lote: `clarity("set", "cambio", "D1-D8")`.

Probado en este despliegue: vista de 375 px (sin desplazamiento horizontal en
toda la página), apertura/cierre de la ventana de pago (botón, fondo, tecla
Escape), checkout de Whop en español, atribución con `?v=` de ejemplo.

No probado: navegador interno de Instagram/TikTok (no disponible en este
entorno de pruebas); moneda e idioma del pago desde otros países.
