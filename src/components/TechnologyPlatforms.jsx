import { useState } from 'react';

const tabs = [
  {
    id: 'investor',
    label: 'Investor Centre',
    eyebrow: 'For shareholders',
    title: 'Investor Centre',
    description: 'Introducing the new Investor Centre experience. A modern, intuitive and seamless way to manage your investments online.',
    bullets: [
      'Portfolio holdings and price history',
      'Monitor recent activity',
      'Download documents instantly',
      'Virtual assistance'
    ],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    alt: 'Investor technology platform'
  },
  {
    id: 'empshare',
    label: 'EmpShare',
    eyebrow: 'For employee share plan holders',
    title: 'EmpShare',
    description: 'EmpShare provides a clear and accessible experience for plan holders, helping them stay informed and act with confidence.',
    bullets: [
      'Intuitive and user-friendly',
      'Real-time data',
      'Simplify tax calculations',
      'Mobile app'
    ],
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    alt: 'Employee experience platform'
  }
];

export default function TechnologyPlatforms() {
  const [activeTab, setActiveTab] = useState('investor');
  const current = tabs.find((tab) => tab.id === activeTab) || tabs[0];

  return (
    <section className="section" id="platforms">
      <div className="container">
        <h2 className="center-heading">Learn more about our technology platforms</h2>
        <div className="tabs-bar" role="tablist" aria-label="Technology platforms">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="feature-section">
          <div
            className="two-column"
            role="tabpanel"
            id={`panel-${current.id}`}
            aria-labelledby={`tab-${current.id}`}
          >
            <div>
              <p className="eyebrow">{current.eyebrow}</p>
              <h3 className="section-title">{current.title}</h3>
              <p className="section-copy">{current.description}</p>
              <ul className="feature-list">
                {current.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="visual-panel">
              <img src={current.image} alt={current.alt} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
