function Header({ activeSection, onNavigate }) {
  const links = [
    { label: 'Investor Centre', id: 'investor-centre' },
    { label: 'EmpShare', id: 'empshare' },
    { label: 'About us', id: 'about-us' },
    { label: 'Insights', id: 'insights' },
    { label: 'Help Center', id: 'help-center' }
  ];

  return (
    <header className="site-header">
      <div className="container header-inner">
        <button className="brand-block" type="button" onClick={() => onNavigate('top')} aria-label="Go to top">
          <span className="brand-mark">Ascendion Portal</span>
          <span className="brand-name">Equity Master</span>
        </button>
        <nav className="primary-nav" aria-label="Primary navigation">
          {links.map((link) => (
            <button
              key={link.id}
              type="button"
              className={`nav-link ${activeSection === link.id ? 'is-active' : ''}`}
              onClick={() => onNavigate(link.id)}
            >
              {link.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
