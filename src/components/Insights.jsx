import { useState } from 'react';

const tabs = [
  {
    id: 'experience',
    title: 'Experience',
    content: 'Focused on intuitive digital journeys that support confidence and clarity across every interaction.'
  },
  {
    id: 'expertise',
    title: 'Expertise',
    content: 'Built with practical knowledge of shareholder, employee plan and enterprise servicing needs.'
  },
  {
    id: 'innovation',
    title: 'Innovation',
    content: 'Modern platform thinking applied carefully to existing business workflows without unnecessary complexity.'
  },
  {
    id: 'technology',
    title: 'Technology',
    content: 'Scalable delivery patterns, responsive experiences and maintainable solutions for evolving products.'
  }
];

function Insights() {
  const [activeTab, setActiveTab] = useState('experience');

  return (
    <section id="insights" className="content-section">
      <div className="container">
        <div className="insights-header">
          <h2 className="section-title">Learn more about our technology platforms</h2>
        </div>
        <div className="insights-tabs" role="tablist" aria-label="Insights tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`insights-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.title}
            </button>
          ))}
        </div>
        <div className="pillars-grid">
          {tabs.map((tab) => (
            <article key={tab.id} className="pillar-item" aria-live={activeTab === tab.id ? 'polite' : undefined}>
              <h3>{tab.title}</h3>
              <p>{tab.content}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Insights;
