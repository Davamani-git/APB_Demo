export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <h2 className="footer-title">Equity Master</h2>
            <p className="footer-copy">Equity Master demonstration experience.</p>
          </div>
          <div>
            <div className="footer-copy">Contact</div>
            <a className="footer-link" href="mailto:support@equitymaster.demo">support@equitymaster.demo</a>
            <a className="footer-link" href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Back to top</a>
          </div>
        </div>
        <div className="footer-bottom">© Equity Master</div>
      </div>
    </footer>
  );
}