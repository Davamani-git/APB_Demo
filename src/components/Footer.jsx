export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <h2 className="footer-brand">Equity Master</h2>
          <p className="footer-copy">Equity Master demonstration experience.</p>
        </div>
        <div className="footer-links">
          <p className="footer-contact-label">Contact</p>
          <a href="mailto:support@equitymaster.demo">support@equitymaster.demo</a>
          <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Back to top</a>
        </div>
      </div>
      <div className="container footer-bottom">© Equity Master</div>
    </footer>
  );
}