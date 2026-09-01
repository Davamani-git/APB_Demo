import { useMemo, useState } from 'react';
import Header from './components/Header';
import SectionSplit from './components/SectionSplit';
import Insights from './components/Insights';
import HelpCenter from './components/HelpCenter';
import Footer from './components/Footer';

const fallbackResults = [
  'Getting started with your account',
  'Accessing shareholder and employee information',
  'Downloading statements and tax documents',
  'Using Help Center on mobile devices'
];

function App() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('investor-centre');
  const [helpSearchTerm, setHelpSearchTerm] = useState('');
  const [helpQuery, setHelpQuery] = useState('');

  const searchResults = useMemo(() => {
    const query = helpQuery.trim().toLowerCase();
    if (!query) return [];
    return fallbackResults.filter((item) => item.toLowerCase().includes(query));
  }, [helpQuery]);

  const handleNavigate = (sectionId) => {
    setActiveSection(sectionId);
    setMobileNavOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleHelpEntry = () => {
    handleNavigate('help-center');
  };

  const handleHelpSearch = () => {
    setHelpQuery(helpSearchTerm);
  };

  const sections = [
    {
      id: 'investor-centre',
      kicker: 'INVESTOR CENTRE',
      title: 'A streamlined platform for shareholder engagement',
      text: 'Our Investor Centre experience provides secure access to holdings, statements, communications and key transaction records through a clean and dependable interface designed for clarity.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      alt: 'Investor technology dashboard'
    },
    {
      id: 'empshare',
      kicker: 'EMPSHARE',
      title: 'Employee share-plan tools built for confidence',
      text: 'EmpShare helps employees review plan information, manage activity and stay connected to important updates using a straightforward experience that supports day-to-day participation.',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
      alt: 'Employee collaboration and share plan discussion',
      reverse: true
    },
    {
      id: 'about-us',
      kicker: 'ABOUT US',
      title: 'Trusted delivery across specialist equity solutions',
      text: 'We support organisations with technology and service capabilities shaped around regulated environments, dependable operations and practical digital experiences for investors and employees.',
      image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80',
      alt: 'Business professionals working together'
    }
  ];

  return (
    <div className="app-shell">
      <Header
        mobileNavOpen={mobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
        onNavigate={handleNavigate}
        onHelpEntry={handleHelpEntry}
      />
      <main>
        <section className="page-heading-section">
          <div className="container">
            <h1>Learn more about our technology platforms</h1>
          </div>
        </section>

        {sections.map((section) => (
          <SectionSplit key={section.id} {...section} />
        ))}

        <Insights />

        <HelpCenter
          searchValue={helpSearchTerm}
          onSearchChange={setHelpSearchTerm}
          onSearch={handleHelpSearch}
          searchQuery={helpQuery}
          searchResults={searchResults}
          activeSection={activeSection}
        />
      </main>
      <Footer />
    </div>
  );
}

export default App;
