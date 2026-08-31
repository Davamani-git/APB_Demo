import { useState } from 'react';
import Header from './components/Header';
import InvestorCentre from './components/InvestorCentre';
import EmpShare from './components/EmpShare';
import AboutUs from './components/AboutUs';
import Insights from './components/Insights';
import HelpCenter from './components/HelpCenter';
import Footer from './components/Footer';

const tabs = [
  { id: 'investor-centre', label: 'Investor Centre' },
  { id: 'empshare', label: 'EmpShare' },
  { id: 'about-us', label: 'About us' },
  { id: 'insights', label: 'Insights' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('investor-centre');

  return (
    <div className="site-shell">
      <Header tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <main>
        <section className="hero-section">
          <div className="container">
            <h1 className="hero-title">Learn more about our technology platforms</h1>
            <div className="section-tabs" role="tablist" aria-label="Platform sections">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`section-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  type="button"
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="container content-flow">
          <InvestorCentre hidden={activeTab !== 'investor-centre'} />
          <EmpShare hidden={activeTab !== 'empshare'} />
          <AboutUs hidden={activeTab !== 'about-us'} />
          <Insights hidden={activeTab !== 'insights'} />
          <HelpCenter />
        </div>
      </main>
      <Footer />
    </div>
  );
}
