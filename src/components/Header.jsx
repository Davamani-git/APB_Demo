import { useState } from 'react';

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="#top" className="brand-block" aria-label="Equity Master home">
          <span className="brand-mark">EM</span>
          <span className="brand-text">Equity Master</span>
        </a>
        <button
          className="mobile-menu-button"
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="main-navigation"
        >
          Menu
        </button>
        <nav id="main-navigation" className={`main-nav ${open ? 'open' : ''}`}>
          <a href="#investor-centre" onClick={() => setOpen(false)}>Investor Centre</a>
          <a href="#empshare" onClick={() => setOpen(false)}>EmpShare</a>
          <a href="#about-us" onClick={() => setOpen(false)}>About us</a>
          <a href="#insights" onClick={() => setOpen(false)}>Insights</a>
          <a href="#help-center" onClick={() => setOpen(false)}>Help Center</a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
