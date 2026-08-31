import { useMemo, useState } from 'react';
import Header from './components/Header';
import InvestorCentre from './components/InvestorCentre';
import EmpShare from './components/EmpShare';
import AboutUs from './components/AboutUs';
import Insights from './components/Insights';
import HelpCenter from './components/HelpCenter';
import Footer from './components/Footer';

const categories = [
  {
    id: 'getting-started',
    label: 'Getting Started',
    title: 'Getting Started',
    intro: 'Everything you need to begin using Equity Master confidently.',
    type: 'rich',
    sections: [
      {
        heading: 'Access your account',
        body: 'Sign in to Equity Master using your registered credentials to view holdings, activity and documents in one place.'
      },
      {
        heading: 'Explore your dashboard',
        body: 'Use the platform navigation to move between Investor Centre, EmpShare and support content with a clear, consistent experience.'
      },
      {
        heading: 'Download important documents',
        body: 'Retrieve statements and supporting files instantly from the relevant areas of your account.'
      }
    ]
  },
  {
    id: 'faqs',
    label: 'FAQs',
    title: 'Frequently Asked Questions',
    intro: 'Quick answers to common Equity Master support questions.',
    type: 'faq',
    items: [
      {
        question: 'How do I review my portfolio holdings and price history?',
        answer: 'Open Investor Centre after signing in to review current holdings, recent activity and historical information available for your account.'
      },
      {
        question: 'Where can I find employee share plan information?',
        answer: 'Select EmpShare to access employee share plan details, real-time data, tax-related support and mobile-friendly features.'
      },
      {
        question: 'Can I download documents from the platform?',
        answer: 'Yes. Relevant statements and supporting documents can be downloaded instantly from the available document areas within the experience.'
      },
      {
        question: 'How do I get support if I need help?',
        answer: 'Use Help Center navigation to browse support categories, search by keyword, watch tutorials or send a question through chat support.'
      }
    ]
  },
  {
    id: 'video-tutorials',
    label: 'Video Tutorials',
    title: 'Video Tutorials',
    intro: 'Watch responsive embedded tutorials without leaving the page.',
    type: 'videos',
    videos: [
      {
        id: 'dQw4w9WgXcQ',
        title: 'Getting Started with Equity Master',
        description: 'A quick walkthrough of navigation, account access and support resources.'
      },
      {
        id: 'M7lc1UVf-VE',
        title: 'Using Investor Centre',
        description: 'Learn how to review holdings, activity and available documents.'
      },
      {
        id: 'ysz5S6PUM-U',
        title: 'Understanding EmpShare',
        description: 'See how employee share plan holders can find key information quickly.'
      }
    ]
  },
  {
    id: 'how-to-guides',
    label: 'How-To Guides',
    title: 'How-To Guides',
    intro: 'Step-by-step guidance for common platform actions.',
    type: 'list',
    items: [
      'Update your contact information securely from your profile settings.',
      'Navigate to Investor Centre to check portfolio holdings and recent activity.',
      'Open EmpShare to review plan information and simplify tax-related tasks.',
      'Use the Search function in Help Center to find relevant support content quickly.'
    ]
  },
  {
    id: 'help-materials',
    label: 'Help Materials',
    title: 'Help Materials',
    intro: 'Useful references and support materials for day-to-day use.',
    type: 'cards',
    cards: [
      {
        title: 'Platform Overview',
        text: 'A concise reference to the main Equity Master sections and what each area provides.'
      },
      {
        title: 'Document Access',
        text: 'Guidance on locating and downloading available documents instantly.'
      },
      {
        title: 'Support Options',
        text: 'An overview of search, FAQs, tutorials and chat support available in Help Center.'
      }
    ]
  },
  {
    id: 'chat-support',
    label: 'Chat Support',
    title: 'Chat Support',
    intro: 'Ask a question and receive immediate predefined guidance.',
    type: 'chat'
  }
];

const searchIndex = [
  ...categories.flatMap((category) => {
    const base = [{ category: category.label, title: category.title, text: category.intro, target: category.id }];
    if (category.sections) {
      return [
        ...base,
        ...category.sections.map((item) => ({
          category: category.label,
          title: item.heading,
          text: item.body,
          target: category.id
        }))
      ];
    }
    if (category.items && category.type === 'faq') {
      return [
        ...base,
        ...category.items.map((item) => ({
          category: category.label,
          title: item.question,
          text: item.answer,
          target: category.id
        }))
      ];
    }
    if (category.items && category.type === 'list') {
      return [
        ...base,
        ...category.items.map((item, index) => ({
          category: category.label,
          title: `Guide ${index + 1}`,
          text: item,
          target: category.id
        }))
      ];
    }
    if (category.cards) {
      return [
        ...base,
        ...category.cards.map((item) => ({
          category: category.label,
          title: item.title,
          text: item.text,
          target: category.id
        }))
      ];
    }
    if (category.videos) {
      return [
        ...base,
        ...category.videos.map((item) => ({
          category: category.label,
          title: item.title,
          text: item.description,
          target: category.id
        }))
      ];
    }
    return base;
  }),
  {
    category: 'Investor Centre',
    title: 'Portfolio holdings and price history',
    text: 'Monitor investments through Investor Centre with clear access to holdings and price history.',
    target: 'getting-started'
  },
  {
    category: 'EmpShare',
    title: 'Simplify tax calculations',
    text: 'EmpShare provides accessible employee share plan support and tax-related guidance.',
    target: 'how-to-guides'
  }
];

export default function App() {
  const [activeNav, setActiveNav] = useState('investor-centre');
  const [activeHelpCategory, setActiveHelpCategory] = useState('getting-started');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(categories.find((c) => c.id === 'video-tutorials').videos[0].id);

  const activeHelpData = useMemo(
    () => categories.find((category) => category.id === activeHelpCategory) || categories[0],
    [activeHelpCategory]
  );

  const scrollToSection = (id) => {
    setActiveNav(id);
    if (id === 'help-center') {
      setActiveHelpCategory('getting-started');
    }
    requestAnimationFrame(() => {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleHelpCenterAccess = () => {
    setActiveNav('help-center');
    setActiveHelpCategory('getting-started');
    setSearchResults([]);
    requestAnimationFrame(() => {
      const element = document.getElementById('help-center');
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleCategorySelect = (categoryId) => {
    setActiveHelpCategory(categoryId);
    setSearchResults([]);
  };

  const handleSearch = (term) => {
    const normalized = term.trim().toLowerCase();
    if (!normalized) {
      setSearchResults([]);
      return;
    }
    const results = searchIndex.filter((item) => `${item.category} ${item.title} ${item.text}`.toLowerCase().includes(normalized));
    setSearchResults(results);
  };

  return (
    <div className="app-shell">
      <Header
        activeNav={activeNav}
        onNavigate={scrollToSection}
        onHelpCenterAccess={handleHelpCenterAccess}
      />
      <main>
        <InvestorCentre />
        <EmpShare />
        <AboutUs />
        <Insights />
        <HelpCenter
          categories={categories}
          activeCategory={activeHelpCategory}
          activeData={activeHelpData}
          onCategorySelect={handleCategorySelect}
          onSearch={handleSearch}
          searchResults={searchResults}
          selectedVideoId={selectedVideoId}
          onSelectVideo={setSelectedVideoId}
        />
      </main>
      <Footer />
    </div>
  );
}