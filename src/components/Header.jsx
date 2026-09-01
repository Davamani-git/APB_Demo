import { useState } from 'react';

export default function Header({ tabs, activeTab, onTabSelect }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSelect = (id) => {
    onTabSelect(id);
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="site-header" id="top">
      <div className="container header-inner">
        <a className="brand" href="#top">Equity Master</a>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="site-nav"
          onClick={() => setMenuOpen((value) => !value)}
        >
          Menu
        </button>
        <nav id="site-nav" className={`nav ${menuOpen ? 'nav-open' : ''}`} aria-label="Primary navigation">
          {tabs.map((tab) => (
            <a
              key={tab.id}
              href={`#${tab.id}`}
              aria-current={activeTab === tab.id ? 'page' : undefined}
              onClick={(event) => {
                event.preventDefault();
                handleSelect(tab.id);
              }}
            >
              {tab.label}
            </a>
          ))}
          <a
            href="#help-center"
            onClick={() => setMenuOpen(false)}
          >
            Support
          </a>
        </nav>
      </div>
    </header>
  );
}
