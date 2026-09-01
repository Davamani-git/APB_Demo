function Header({ navItems, activeNav, onNavClick }) {
  return (
    <header className="site-header">
      <div className="container header-bar">
        <div className="brand-block">
          <div className="brand-title">Equity Portal</div>
          <div className="brand-subtitle">Technology Platforms</div>
        </div>
        <nav className="main-nav" aria-label="Primary">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className={activeNav === item.key ? 'is-active' : ''}
              onClick={() => onNavClick(item.key)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
