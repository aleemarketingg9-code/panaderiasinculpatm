/* ======================================================================
   CONFIGURACIÓN — todo lo que cambia seguido vive aquí, en un solo lugar.
   Ver LEEME.md para instrucciones de cada campo.
   ====================================================================== */
const CONFIG = {
  // Medición (reutilizados de la página actual en vivo — ya miden igual)
  CLARITY_ID: "z6r5mlnddf",
  META_PIXEL_ID: "4039427159523335",

  // Checkout real de Whop. Cambia según qué adicionales (order bumps)
  // estén marcados arriba del checkout.
  WHOP_PLAN_ID: "plan_GTR0eMPQQz1WM",
  WHOP_PLAN_VARIANTS: {
    none: "plan_GTR0eMPQQz1WM",
    addon1: "plan_9BKyukF8bdF54",
    addon2: "plan_PxmrmPHV84oYs",
    both: "plan_pW7NT7xJkHbWv",
  },

  // Enlace directo de respaldo (se usa solo si WHOP_PLAN_ID queda vacío).
  WHOP_FALLBACK_URL: "https://whop.com/checkout/plan_GTR0eMPQQz1WM",

  // Precio. Si no hay precio regular confirmado todavía, deja REGULAR_PRICE
  // en null: se muestra solo "$12.99 USD" sin tachado ni cuenta regresiva.
  PRICE: "$12.99 USD",
  REGULAR_PRICE: null, // ej: "$47 USD"
  OFFER_END_ISO: null, // ej: "2026-12-15T23:59:59-05:00" (fecha real, no se reinicia)

  // Contacto y legales — si quedan vacíos, esos enlaces no se muestran
  // (mejor ocultarlos que mostrar un enlace roto).
  SUPPORT_EMAIL: "",
  TERMS_URL: "",
  PRIVACY_URL: "",
};

/* ====================== Utilidades de tracking ====================== */
function getOriginParam() {
  const url = new URL(window.location.href);
  let v = url.searchParams.get("v");
  if (v) {
    try { sessionStorage.setItem("psc_v", v); } catch (e) {}
  } else {
    try { v = sessionStorage.getItem("psc_v"); } catch (e) {}
  }
  return v;
}

function loadMetaPixel(pixelId) {
  if (!pixelId) return;
  /* eslint-disable */
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */
  window.fbq("init", pixelId);
  window.fbq("track", "PageView");
}

function loadClarity(clarityId) {
  if (!clarityId) return;
  /* eslint-disable */
  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", clarityId);
  /* eslint-enable */
}

function trackInitiateCheckout(source) {
  if (window.fbq) window.fbq("track", "InitiateCheckout", { content_name: source });
}

/* ====================== Precio / oferta ====================== */
function renderPrice() {
  const now = new Date();
  const offerEnd = CONFIG.OFFER_END_ISO ? new Date(CONFIG.OFFER_END_ISO) : null;
  const offerActive = offerEnd && now < offerEnd;
  const showStrike = CONFIG.REGULAR_PRICE && offerActive;

  const priceHtml = showStrike
    ? `<span class="price-regular">${CONFIG.REGULAR_PRICE}</span> ${CONFIG.PRICE}`
    : CONFIG.PRICE;

  const priceDisplay = document.getElementById("priceDisplay");
  if (priceDisplay) priceDisplay.innerHTML = priceHtml;
  const stickyPrice = document.getElementById("stickyPriceDisplay");
  if (stickyPrice) stickyPrice.textContent = CONFIG.PRICE;
}

/* ====================== Checkout (Whop) ====================== */
let whopScriptLoaded = false;
let whopScriptLoading = false;

function loadWhopScript(onReady) {
  if (whopScriptLoaded) { onReady(); return; }
  if (whopScriptLoading) {
    // ya se está cargando: espera a que termine
    const check = setInterval(() => {
      if (whopScriptLoaded) { clearInterval(check); onReady(); }
    }, 50);
    return;
  }
  whopScriptLoading = true;
  const script = document.createElement("script");
  script.src = "https://cdn.whop.com/elements/amber/elements.js";
  script.setAttribute("data-whop-elements", "");
  script.onload = () => {
    whopScriptLoaded = true;
    onReady();
  };
  document.head.appendChild(script);
}

function mountWhopCheckout(planId) {
  const container = document.getElementById("whopEmbedContainer");
  container.innerHTML = "";
  const mountPoint = document.createElement("div");
  mountPoint.id = "whop-checkout";
  container.appendChild(mountPoint);

  loadWhopScript(() => {
    const checkout = window.WhopElements().checkout.create({ plan: planId });
    checkout.create("checkout").mount("#whop-checkout");
  });
}

function getSelectedPlan() {
  const addon1 = document.getElementById("addon1")?.checked;
  const addon2 = document.getElementById("addon2")?.checked;
  const variants = CONFIG.WHOP_PLAN_VARIANTS;
  if (addon1 && addon2) return variants.both;
  if (addon1) return variants.addon1;
  if (addon2) return variants.addon2;
  return variants.none;
}

function updateAddonTotal() {
  const checkboxes = document.querySelectorAll(".addon-checkbox");
  let total = 0;
  checkboxes.forEach((cb, i) => {
    const confirmEl = document.getElementById("addonConfirm" + (i + 1));
    if (cb.checked) {
      total += parseFloat(cb.dataset.price || "0");
      if (confirmEl) {
        confirmEl.querySelector("span").textContent = cb.dataset.name || "";
        confirmEl.hidden = false;
      }
    } else if (confirmEl) {
      confirmEl.hidden = true;
    }
  });
  const totalEl = document.getElementById("addonTotal");
  const totalValueEl = document.getElementById("addonTotalValue");
  if (!totalEl || !totalValueEl) return;
  if (total > 0) {
    totalValueEl.textContent = "$" + total.toFixed(2) + " USD";
    totalEl.hidden = false;
  } else {
    totalEl.hidden = true;
  }
}

function setupAddonOffers() {
  const checkboxes = document.querySelectorAll(".addon-checkbox");
  if (!checkboxes.length) return;
  checkboxes.forEach((cb) => {
    cb.addEventListener("change", () => {
      updateAddonTotal();
      mountWhopCheckout(getSelectedPlan());
    });
  });
}

function setupCheckout() {
  const container = document.getElementById("whopEmbedContainer");
  const mainLink = document.getElementById("mainCheckoutLink");

  if (CONFIG.WHOP_PLAN_ID) {
    // Embed oficial de Whop (snippet "JavaScript" generado desde el panel de
    // Whop para este plan): queda en la página, sin salir ni abrir pestañas,
    // lo que funciona bien también dentro del navegador interno de Instagram.
    mountWhopCheckout(getSelectedPlan());
    setupAddonOffers();

    if (mainLink) mainLink.style.display = "none";
  } else if (CONFIG.WHOP_FALLBACK_URL) {
    if (mainLink) mainLink.href = CONFIG.WHOP_FALLBACK_URL;
  } else {
    container.innerHTML =
      '<p class="whop-embed-placeholder">Estamos conectando el pago. Mientras tanto este botón no completa la compra — avisa a Alejandra si lo ves en producción.</p>';
  }
}

/* ====================== Enlaces de contacto / legales ====================== */
function setupFooterLinks() {
  const terms = document.getElementById("termsLink");
  const privacy = document.getElementById("privacyLink");
  const contact = document.getElementById("contactLink");

  if (CONFIG.TERMS_URL) { terms.href = CONFIG.TERMS_URL; terms.target = "_blank"; terms.rel = "noopener"; }
  else terms.hidden = true;

  if (CONFIG.PRIVACY_URL) { privacy.href = CONFIG.PRIVACY_URL; privacy.target = "_blank"; privacy.rel = "noopener"; }
  else privacy.hidden = true;

  if (CONFIG.SUPPORT_EMAIL) {
    contact.href = "mailto:" + CONFIG.SUPPORT_EMAIL;
    contact.hidden = false;
  }
}

/* ====================== Testimonios (apagados hasta tener 3+) ====================== */
async function setupTestimonials() {
  try {
    const res = await fetch("testimonios.json");
    const items = await res.json();
    if (!Array.isArray(items) || items.length < 3) return;

    const grid = document.getElementById("testimonialGrid");
    grid.innerHTML = items
      .map(
        (t) => `
      <li class="testimonial-card">
        ${t.foto ? `<img src="${t.foto}" alt="" loading="lazy">` : ""}
        <p>"${t.texto}"</p>
        <p class="testimonial-name">${t.nombre}${t.ciudad ? " — " + t.ciudad : ""}</p>
      </li>`
      )
      .join("");
    document.getElementById("testimonios").hidden = false;
  } catch (e) {
    // sin testimonios.json o vacío: la sección se queda oculta
  }
}

/* ====================== Barra fija móvil ====================== */
function setupStickyBar() {
  const bar = document.getElementById("stickyBar");
  const hero = document.querySelector(".hero");
  if (!bar || !hero) return;

  const io = new IntersectionObserver(
    ([entry]) => {
      bar.hidden = entry.isIntersecting;
    },
    { threshold: 0, rootMargin: "-10% 0px 0px 0px" }
  );
  io.observe(hero);
}

/* ====================== ViewContent al llegar al pago ====================== */
function setupViewContentTracking() {
  const buySection = document.getElementById("comprar");
  if (!buySection) return;
  let fired = false;
  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !fired) {
        fired = true;
        if (window.fbq) window.fbq("track", "ViewContent");
        io.disconnect();
      }
    },
    { threshold: 0.4 }
  );
  io.observe(buySection);
}

/* ====================== Carrusel ====================== */
function setupCarousel() {
  const track = document.getElementById("carouselTrack");
  const prev = document.querySelector(".carousel-prev");
  const next = document.querySelector(".carousel-next");
  if (!track || !prev || !next) return;

  const scrollByCard = (dir) => {
    const card = track.querySelector(".recipe-card");
    const gap = 16;
    const amount = card ? card.offsetWidth + gap : 200;
    track.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  prev.addEventListener("click", () => scrollByCard(-1));
  next.addEventListener("click", () => scrollByCard(1));

  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") scrollByCard(1);
    if (e.key === "ArrowLeft") scrollByCard(-1);
  });
}

/* ====================== CTA clicks ====================== */
function setupCtaTracking() {
  document.querySelectorAll(".js-cta").forEach((el) => {
    el.addEventListener("click", () => trackInitiateCheckout(el.dataset.cta || "cta"));
  });
}

/* ====================== Pasar el origen (?v=) al checkout ====================== */
function appendOriginToCheckoutLinks() {
  const v = getOriginParam();
  if (!v) return;
  const link = document.getElementById("mainCheckoutLink");
  if (link && link.href && link.href !== "#" && !link.href.endsWith("#")) {
    try {
      const u = new URL(link.href);
      u.searchParams.set("utm_source", v);
      link.href = u.toString();
    } catch (e) {}
  }
}

/* ====================== Init ====================== */
document.addEventListener("DOMContentLoaded", () => {
  getOriginParam();
  loadMetaPixel(CONFIG.META_PIXEL_ID);
  loadClarity(CONFIG.CLARITY_ID);
  renderPrice();
  setupCheckout();
  appendOriginToCheckoutLinks();
  setupFooterLinks();
  setupTestimonials();
  setupStickyBar();
  setupViewContentTracking();
  setupCarousel();
  setupCtaTracking();
});
