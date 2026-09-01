function Header({ mobileNavOpen, setMobileNavOpen, onNavigate, onHelpEntry }) {
  return (
    <header className="site-header">
      <div className="container header-bar">
        <div className="branding">Equity Portal</div>
        <button
          type="button"
          className="mobile-menu-button"
          aria-label="Toggle navigation"
          aria-expanded={mobileNavOpen}
          onClick={() => setMobileNavOpen((open) => !open)}
        >
          ☰
        </button>
        <nav className={`primary-nav ${mobileNavOpen ? 'open' : ''}`} aria-label="Primary">
          <a href="#investor-centre" onClick={(e) => { e.preventDefault(); onNavigate('investor-centre'); }}>Investor Centre</a>
          <a href="#empshare" onClick={(e) => { e.preventDefault(); onNavigate('empshare'); }}>EmpShare</a>
          <a href="#about-us" onClick={(e) => { e.preventDefault(); onNavigate('about-us'); }}>About us</a>
          <a href="#insights" onClick={(e) => { e.preventDefault(); onNavigate('insights'); }}>Insights</a>
          <button type="button" onClick={onHelpEntry}>Help Center</button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
