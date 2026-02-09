(() => {
  const STORAGE_KEY = "cookieConsent";
  const COOKIE_KEY = "cookie_consent";
  const MAX_AGE_DAYS = 180;

  function getCookie(name) {
    const match = document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${name}=`));
    if (!match) return null;
    return decodeURIComponent(match.split("=").slice(1).join("="));
  }

  function setCookie(name, value, days) {
    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
  }

  function getConsent() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "all" || stored === "necessary") return stored;
    const fromCookie = getCookie(COOKIE_KEY);
    if (fromCookie === "all" || fromCookie === "necessary") return fromCookie;
    return null;
  }

  function setConsent(value) {
    localStorage.setItem(STORAGE_KEY, value);
    setCookie(COOKIE_KEY, value, MAX_AGE_DAYS);
    window.dispatchEvent(new CustomEvent("cookieconsentchange", { detail: { consent: value } }));
  }

  function removeBanner() {
    const el = document.querySelector(".cookie-banner");
    if (el) el.remove();
  }

  function createBanner() {
    const banner = document.createElement("div");
    banner.className = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-modal", "false");
    banner.setAttribute("aria-label", "Cookie-Einstellungen");

    banner.innerHTML = `
      <div class="cookie-banner__inner">
        <div class="cookie-banner__copy">
          <div class="cookie-banner__title">Cookies</div>
          <div class="cookie-banner__text">
            Wir verwenden notwendige Cookies, um diese Website zu betreiben. Optionale Cookies helfen uns, die Website zu verbessern.
            <a class="cookie-banner__link" href="datenschutz.html">Mehr Infos</a>
          </div>
        </div>
        <div class="cookie-banner__actions">
          <button class="cookie-banner__btn secondary" type="button" data-consent="necessary">Nur notwendige</button>
          <button class="cookie-banner__btn" type="button" data-consent="all">Alle akzeptieren</button>
        </div>
      </div>
    `;

    banner.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const btn = target.closest("[data-consent]");
      if (!(btn instanceof HTMLElement)) return;
      const value = btn.getAttribute("data-consent");
      if (value !== "all" && value !== "necessary") return;
      setConsent(value);
      removeBanner();
    });

    document.body.appendChild(banner);
  }

  if (!getConsent()) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", createBanner, { once: true });
    } else {
      createBanner();
    }
  }
})();

