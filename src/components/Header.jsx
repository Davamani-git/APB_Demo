function Header({ navItems, mobileNavOpen, setMobileNavOpen, helpEntryTarget }) {
  const handleLinkClick = () => setMobileNavOpen(false);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-brand" aria-label="Equity Master branding">
          <div className="site-brand__logo" aria-hidden="true">EM</div>
          <div>
            <div className="site-brand__name">Equity Master</div>
            <div className="site-brand__sub">Menu</div>
          </div>
        </div>
        <button
          type="button"
          className="mobile-menu-button"
          aria-expanded={mobileNavOpen}
          aria-controls="site-navigation"
          onClick={() => setMobileNavOpen((value) => !value)}
        >
          Menu
        </button>
        <nav id="site-navigation" className={`site-nav ${mobileNavOpen ? 'site-nav--open' : ''}`}>
          {navItems.map((item) => (
            <a key={item.label} href={item.href} onClick={handleLinkClick}>
              {item.label}
            </a>
          ))}
          <button
            type="button"
            className="help-center-link"
            onClick={() => {
              handleLinkClick();
              const element = document.querySelector(helpEntryTarget);
              if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            Open Help Center
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
