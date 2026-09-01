function Header({ activeSection, onNavClick, mobileNavOpen, onToggleMobileNav }) {
  const navItems = [
    { id: 'investor', label: 'Investor Centre' },
    { id: 'empShare', label: 'EmpShare' },
    { id: 'about', label: 'About us' },
    { id: 'insights', label: 'Insights' },
    { id: 'help', label: 'Help Center' }
  ];

  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="branding">Equity Portal</div>
        <button
          type="button"
          className="mobile-nav-toggle"
          aria-label="Toggle navigation"
          aria-expanded={mobileNavOpen}
          onClick={onToggleMobileNav}
        >
          ☰
        </button>
        <nav className={`site-nav ${mobileNavOpen ? 'open' : ''}`} aria-label="Primary">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={activeSection === item.id ? 'is-active' : ''}
              onClick={() => onNavClick(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
