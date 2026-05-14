/**
 * FooterView.js
 * Responsabilidad: Generar el footer común para todas las páginas.
 */

export function initFooter() {
  const footerContainer = document.querySelector('footer');

  if (!footerContainer) return;

  footerContainer.innerHTML = `
    <div class="footer-content">
      
      <div class="footer-links">
        <small>Check out my
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
        <span class="footer-separator">|</span>
        <small>
          <a href="https://github.com/juanfalibene/discava-digital" target="_blank">GitHub</a>
        </small>
      </div>
      <small>© 2023 Discava! @ SEPE 11-23</small>
    </div>
  `;
}
