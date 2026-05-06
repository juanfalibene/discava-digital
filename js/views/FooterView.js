/**
 * FooterView.js
 * Responsabilidad: Generar el footer común para todas las páginas.
 */

export function initFooter() {
  const footerContainer = document.querySelector('footer');

  if (!footerContainer) return;

  const currentYear = new Date().getFullYear();

  footerContainer.innerHTML = `
    <div class="footer-content">
      
      <div class="footer-links">
        <small>Send me a vinyl from my
          <a href="https://www.discogs.com/wantlist?user=juanignaciofalibene" target="_blank" class="wantlist-link">Discogs Wantlist</a>
        </small>
        <span class="footer-separator">|</span>
        <small>
          <a href="./faqs.html">FAQs</a>
        </small>
        <span class="footer-separator">|</span>
        <small>
          <a href="./cookies.html">Cookie Policy</a>
        </small>
      </div>
      <small>© ${currentYear} Discava! @ SEPE 11-23</small>
    </div>
  `;
}
