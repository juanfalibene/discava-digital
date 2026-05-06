/**
 * CookieBanner.js
 * Gestión simple de consentimiento de cookies para Discava!
 */

export function initCookieBanner() {
  // Si ya hay consentimiento, no hacemos nada
  if (localStorage.getItem('cookie_consent')) return;

  // Crear el HTML del banner
  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.innerHTML = `
    <div class="cookie-content">
      <p>We use cookies to enhance your vinyl digging experience and analyze our traffic. 
      By clicking "Accept", you consent to our use of cookies.</p>
    </div>
    <div class="cookie-actions">
      <button class="btn-cookie btn-decline" id="cookie-decline">Decline</button>
      <button class="btn-cookie btn-accept" id="cookie-accept">Accept</button>
    </div>
  `;

  document.body.appendChild(banner);

  // Mostrar con un pequeño delay para que la transición se vea
  setTimeout(() => {
    banner.classList.add('show');
  }, 1000);

  // Event Listeners
  document.getElementById('cookie-accept').addEventListener('click', () => {
    handleConsent('granted');
  });

  document.getElementById('cookie-decline').addEventListener('click', () => {
    handleConsent('denied');
  });

  function handleConsent(status) {
    localStorage.setItem('cookie_consent', status);
    banner.classList.remove('show');
    
    // Integración con GTM Consent Mode (opcional pero profesional)
    if (window.dataLayer) {
      window.dataLayer.push({
        'event': 'cookie_consent_update',
        'consent_status': status
      });
    }

    // Eliminar el elemento después de la animación
    setTimeout(() => {
      banner.remove();
    }, 600);
  }
}
