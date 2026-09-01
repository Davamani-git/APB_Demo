import { useState } from 'react';

export default function Header({ onHelpCenterClick }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleHelpClick = () => {
    onHelpCenterClick();
    setMobileOpen(false);
    const target = document.getElementById('help-center');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="brand">Equity Portal</div>
        <button
          type="button"
          className="mobile-toggle"
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((current) => !current)}
        >
          ☰
        </button>
        <nav className={`main-nav ${mobileOpen ? 'open' : ''}`} aria-label="Primary navigation">
          <a href="#investor-centre" onClick={() => setMobileOpen(false)}>
            Investor Centre
          </a>
          <a href="#empshare" onClick={() => setMobileOpen(false)}>
            EmpShare
          </a>
          <a href="#about-us" onClick={() => setMobileOpen(false)}>
            About us
          </a>
          <a href="#insights" onClick={() => setMobileOpen(false)}>
            Insights
          </a>
          <button type="button" onClick={handleHelpClick}>
            Help Center
          </button>
        </nav>
      </div>
    </header>
  );
}
