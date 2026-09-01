import { useMemo, useState } from 'react';
import Header from './components/Header';
import PlatformSection from './components/PlatformSection';
import Insights from './components/Insights';
import HelpCenter from './components/HelpCenter';
import Footer from './components/Footer';

const sections = {
  investor: {
    id: 'investor-centre',
    title: 'Investor Centre',
    body: 'Investor Centre gives shareholders a clear digital experience for accessing holdings, statements, transaction history and important company documentation using a secure, responsive interface aligned to existing corporate servicing needs.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Financial technology dashboard on screen'
  },
  empshare: {
    id: 'empshare',
    title: 'EmpShare',
    body: 'EmpShare supports employee share plan participants with simple access to plan information, vested holdings, grant activity and documents, preserving the established two-column layout and content style already used throughout the platform.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Business team collaborating at a table'
  },
  about: {
    id: 'about-us',
    title: 'About Us',
    body: 'We deliver dependable digital servicing for equity-related experiences with a focus on reliability, clarity and continuity, maintaining the same corporate financial-services presentation, spacing and visual hierarchy used across the application.',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Business professionals in discussion'
  }
};

function App() {
  const [activeNav, setActiveNav] = useState('home');

  const navItems = useMemo(
    () => [
      { key: 'home', label: 'Home', href: '#top' },
      { key: 'investor', label: 'Investor Centre', href: '#investor-centre' },
      { key: 'empshare', label: 'EmpShare', href: '#empshare' },
      { key: 'about', label: 'About us', href: '#about-us' },
      { key: 'help', label: 'Help Center', href: '#help-center' }
    ],
    []
  );

  const handleNavClick = (key) => setActiveNav(key);

  return (
    <div className="app-shell" id="top">
      <Header navItems={navItems} activeNav={activeNav} onNavClick={handleNavClick} />
      <main>
        <section className="hero-intro">
          <div className="container narrow-center">
            <h1>Learn more about our technology platforms</h1>
            <p>
              Explore our existing digital servicing platforms and access practical support content designed to help shareholders,
              employees and administrators complete key tasks with confidence.
            </p>
          </div>
        </section>

        <PlatformSection {...sections.investor} />
        <PlatformSection {...sections.empshare} reverse />
        <PlatformSection {...sections.about} />
        <Insights />
        <HelpCenter />
      </main>
      <Footer />
    </div>
  );
}

export default App;
