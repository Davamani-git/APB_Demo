export default function Header({ tabs, activeTab, onTabChange }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="branding">
          <div>
            <div className="brand-name">Equity Master</div>
            <div className="menu-label">Menu</div>
          </div>
        </div>
        <nav className="main-nav" aria-label="Primary navigation">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
