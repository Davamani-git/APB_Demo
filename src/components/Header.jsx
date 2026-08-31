export default function Header() {
  return (
    <header className="header" id="top">
      <div className="container header-inner">
        <div className="brand" aria-label="Equity Master branding">
          <div className="brand-mark" aria-hidden="true">EM</div>
          <div className="brand-text">
            <span className="brand-kicker">Equity Portal</span>
            <span className="brand-title">Equity Master</span>
          </div>
        </div>
        <nav className="nav" aria-label="Main navigation">
          <a href="#platforms">Investor Centre</a>
          <a href="#platforms">EmpShare</a>
          <a href="#about">About us</a>
          <a href="#insights">Insights</a>
          <a href="#help-center">Help Center</a>
        </nav>
      </div>
    </header>
  );
}
