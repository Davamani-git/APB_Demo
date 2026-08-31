import { useState } from 'react';

export default function Header({ activeNav, onNavigate, onHelpCenterAccess }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'investor-centre', label: 'Investor Centre' },
    { id: 'empshare', label: 'EmpShare' },
    { id: 'about-us', label: 'About us' },
    { id: 'insights', label: 'Insights' }
  ];

  const handleNavClick = (id) => {
    setMobileOpen(false);
    onNavigate(id);
  };

  const handleHelpClick = () => {
    setMobileOpen(false);
    onHelpCenterAccess();
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="brand-mark" aria-label="Equity Master branding">
          <div className="brand-title">Equity Master</div>
          <div className="brand-subtitle">Demonstration experience</div>
        </div>
        <button
          type="button"
          className="nav-link-button"
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((value) => !value)}
        >
          Menu
        </button>
        <nav className="primary-nav" style={{ display: mobileOpen || window.innerWidth > 980 ? 'flex' : 'none' }} aria-label="Primary">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-link-button ${activeNav === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            className={`nav-link-button ${activeNav === 'help-center' ? 'active' : ''}`}
            onClick={handleHelpClick}
          >
            Help Center
          </button>
        </nav>
      </div>
    </header>
  );
}