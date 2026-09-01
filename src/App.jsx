import { useMemo, useState } from 'react';
import Header from './components/Header';
import InvestorCentre from './components/InvestorCentre';
import EmpShare from './components/EmpShare';
import AboutUs from './components/AboutUs';
import Insights from './components/Insights';
import HelpCenter from './components/HelpCenter';
import Footer from './components/Footer';

const faqItems = [
  {
    question: 'How do I access my shareholder or employee information?',
    answer:
      'Use your secure portal login from the Equity Portal homepage. Once signed in, your shareholder or employee information is available within the relevant account area.'
  },
  {
    question: 'Where can I download my documents?',
    answer:
      'Documents are available from the Help Materials and account document areas, where guides and downloadable PDFs can be opened or saved for offline access.'
  },
  {
    question: 'Can I get help without leaving the website?',
    answer:
      'Yes. The Help Center includes FAQs, how-to guidance, embedded video tutorials and an on-page chat assistant so you can get support without leaving the site.'
  },
  {
    question: 'Is the Help Center available on mobile?',
    answer:
      'Yes. The Help Center is designed to remain responsive on mobile devices so all categories, search, downloads, videos and chat support stay usable.'
  }
];

const guideItems = [
  'Sign in and reset access credentials',
  'Locate shareholder and employee records',
  'Find and review platform documents',
  'Use support resources from any device'
];

const videoItems = [
  {
    title: 'Platform Overview',
    url: 'https://www.youtube.com/embed/Mt0Y5X6885I'
  },
  {
    title: 'Using Support Resources',
    url: 'https://www.youtube.com/embed/6dSVaAaKWSQ'
  },
  {
    title: 'Getting Help Quickly',
    url: 'https://www.youtube.com/embed/8qaLG730bDw'
  }
];

const materialItems = [
  {
    title: 'User Guide 1',
    url: 'https://drive.google.com/file/d/1HqLeSEbVZz3JWwxSX5TgsJd7Q0x3xdVk/view?usp=drive_link'
  },
  {
    title: 'User Guide 2',
    url: 'https://drive.google.com/file/d/1Uc5E21E6CIummBqCDs5zYk2mLbZ_ur5y/view?usp=drive_link'
  },
  {
    title: 'User Guide 3',
    url: 'https://drive.google.com/file/d/1ErTOSOIThyzHUCLz8QilIwZ3u5A6ENk9/view?usp=drive_link'
  },
  {
    title: 'User Guide 4',
    url: 'https://drive.google.com/file/d/1punlgjU4E2kxuZBq3LwPKpivtSCrUhms/view?usp=drive_link'
  },
  {
    title: 'User Guide 5',
    url: 'https://drive.google.com/file/d/1qEIXB74Sv2row9t8OQdLcPN7BQB0e01d/view?usp=drive_link'
  },
  {
    title: 'User Guide 6',
    url: 'https://drive.google.com/file/d/1cpOfBS-R96wW4jzsxZ8ldFWwG166T9ob/view?usp=drive_link'
  }
];

const categories = [
  'Getting Started',
  'FAQs',
  'How-To Guides',
  'Video Tutorials',
  'Help Materials',
  'Troubleshooting',
  'Chat Support'
];

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [helpCategory, setHelpCategory] = useState('Getting Started');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello. I can help with access, documents, videos and support resources.'
    }
  ]);

  const filteredFaq = useMemo(() => {
    if (!searchQuery.trim()) return faqItems;
    const value = searchQuery.toLowerCase();
    return faqItems.filter(
      (item) =>
        item.question.toLowerCase().includes(value) ||
        item.answer.toLowerCase().includes(value)
    );
  }, [searchQuery]);

  const filteredGuides = useMemo(() => {
    if (!searchQuery.trim()) return guideItems;
    const value = searchQuery.toLowerCase();
    return guideItems.filter((item) => item.toLowerCase().includes(value));
  }, [searchQuery]);

  const filteredMaterials = useMemo(() => {
    if (!searchQuery.trim()) return materialItems;
    const value = searchQuery.toLowerCase();
    return materialItems.filter((item) => item.title.toLowerCase().includes(value));
  }, [searchQuery]);

  const filteredVideos = useMemo(() => {
    if (!searchQuery.trim()) return videoItems;
    const value = searchQuery.toLowerCase();
    return videoItems.filter((item) => item.title.toLowerCase().includes(value));
  }, [searchQuery]);

  const handleNavClick = (section) => {
    setActiveSection(section);
    if (section === 'help') {
      setHelpCategory('Getting Started');
      setTimeout(() => {
        document.getElementById('help-center')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
    }
    setMobileNavOpen(false);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchQuery(searchTerm.trim());
  };

  const handleChatSubmit = (event) => {
    event.preventDefault();
    const value = chatInput.trim();
    if (!value) return;
    const userMessage = { role: 'user', text: value };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput('');
    window.setTimeout(() => {
      const lower = value.toLowerCase();
      let response = 'I can help with account access, downloadable materials, video tutorials and support navigation.';
      if (lower.includes('document') || lower.includes('pdf') || lower.includes('download')) {
        response = 'You can open Help Materials to download the available user guides and PDF resources for offline use.';
      } else if (lower.includes('video') || lower.includes('tutorial')) {
        response = 'Open Video Tutorials in the Help Center to play the embedded guidance videos directly on the page.';
      } else if (lower.includes('login') || lower.includes('access') || lower.includes('sign in')) {
        response = 'Start with Getting Started for access guidance, then use FAQs if you need more information about login or account records.';
      } else if (lower.includes('mobile') || lower.includes('phone')) {
        response = 'The Help Center is fully responsive, so navigation, search, materials, videos and chat all remain usable on mobile devices.';
      }
      setChatMessages((prev) => [...prev, { role: 'assistant', text: response }]);
    }, 800);
  };

  return (
    <div className="app-shell">
      <Header
        activeSection={activeSection}
        onNavClick={handleNavClick}
        mobileNavOpen={mobileNavOpen}
        onToggleMobileNav={() => setMobileNavOpen((prev) => !prev)}
      />
      <main>
        <InvestorCentre />
        <EmpShare />
        <AboutUs />
        <Insights />
        <HelpCenter
          categories={categories}
          activeCategory={helpCategory}
          onCategoryChange={setHelpCategory}
          faqItems={filteredFaq}
          expandedFaq={expandedFaq}
          onToggleFaq={(index) => setExpandedFaq((current) => (current === index ? null : index))}
          guideItems={filteredGuides}
          videoItems={filteredVideos}
          materialItems={filteredMaterials}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearch={handleSearch}
          chatInput={chatInput}
          onChatInputChange={setChatInput}
          onChatSubmit={handleChatSubmit}
          chatMessages={chatMessages}
          searchQuery={searchQuery}
        />
      </main>
      <Footer />
    </div>
  );
}

export default App;
