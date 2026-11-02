/* ======================================================================
   Script compartido para las páginas de upsell y downsell.
   Cada página define su propio OFFER_CONFIG antes de incluir este
   archivo (ver upsell.html / downsell.html).
   ====================================================================== */

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

let whopScriptLoaded = false;
let whopScriptLoading = false;

function loadWhopScript(onReady) {
  if (whopScriptLoaded) { onReady(); return; }
  if (whopScriptLoading) {
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

function mountWhopCheckout(containerId, planId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (!planId) {
    container.innerHTML =
      '<p class="whop-embed-placeholder">Estamos conectando el pago. Mientras tanto este botón no completa la compra — avisa a Alejandra si lo ves en producción.</p>';
    return;
  }
  container.innerHTML = "";
  const mountPoint = document.createElement("div");
  mountPoint.id = containerId + "-mount";
  container.appendChild(mountPoint);
  loadWhopScript(() => {
    const checkout = window.WhopElements().checkout.create({ plan: planId });
    checkout.create("checkout").mount("#" + mountPoint.id);
  });
}

/* ====================== Cronómetro real por sesión ======================
   No es un timer genérico que se reinicia para cualquier visitante: la
   fecha límite se fija la primera vez que ESTA persona ve esta pantalla
   (se guarda en sessionStorage) y no se mueve aunque recargue la página.
   Si cierra la pestaña y vuelve a entrar más tarde, cuenta como una
   sesión nueva — igual que "esta oferta, en esta visita".
   ========================================================================= */
function setupCountdown(config) {
  const minEl = document.getElementById(config.minutesId);
  const secEl = document.getElementById(config.secondsId);
  const wrapEl = document.getElementById(config.wrapId);
  if (!minEl || !secEl) return;

  const storageKey = "psc_offer_deadline_" + config.key;
  let deadline = parseInt(sessionStorage.getItem(storageKey) || "0", 10);
  if (!deadline) {
    deadline = Date.now() + config.minutes * 60 * 1000;
    sessionStorage.setItem(storageKey, String(deadline));
  }

  function render() {
    const remaining = Math.max(0, deadline - Date.now());
    const totalSeconds = Math.floor(remaining / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    minEl.textContent = String(m).padStart(2, "0");
    secEl.textContent = String(s).padStart(2, "0");
    if (remaining <= 0) {
      clearInterval(timer);
      if (wrapEl) wrapEl.classList.add("countdown-ended");
    }
  }

  render();
  const timer = setInterval(render, 1000);
}

function trackInitiateCheckout(source) {
  if (window.fbq) window.fbq("track", "InitiateCheckout", { content_name: source });
}

function setupCtaTracking() {
  document.querySelectorAll(".js-cta").forEach((el) => {
    el.addEventListener("click", () => trackInitiateCheckout(el.dataset.cta || "cta"));
  });
}

function initOfferPage(config) {
  document.addEventListener("DOMContentLoaded", () => {
    loadMetaPixel(config.metaPixelId);
    loadClarity(config.clarityId);
    mountWhopCheckout(config.checkoutContainerId, config.whopPlanId);
    if (config.countdown) setupCountdown(config.countdown);
    setupCtaTracking();
  });
}
