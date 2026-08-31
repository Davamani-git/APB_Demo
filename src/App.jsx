import { useMemo, useState } from 'react';
import Header from './components/Header';
import TwoColumnSection from './components/TwoColumnSection';
import Insights from './components/Insights';
import HelpCenter from './components/HelpCenter';
import Footer from './components/Footer';

const categoryData = {
  'Getting Started': {
    title: 'Getting Started',
    intro: 'Start using Equity Master support resources quickly with practical onboarding guidance and clear next steps.',
    items: [
      'Create or access your account securely using your registered details.',
      'Review portfolio information, recent activity and available documents.',
      'Explore support topics, videos and frequently asked questions.',
      'Use chat support when you need immediate guidance.'
    ]
  },
  FAQs: {
    title: 'Frequently Asked Questions',
    intro: 'Browse common questions about the platform, access, documents and support options.',
    faqs: [
      {
        question: 'How do I access my shareholder or employee information?',
        answer: 'Sign in using your registered account details to access holdings, activity, plan information and downloadable resources in one place.'
      },
      {
        question: 'Where can I download my documents?',
        answer: 'Relevant statements and available documents can be downloaded directly from the platform once you are signed in and viewing your account area.'
      },
      {
        question: 'Can I get help without leaving the website?',
        answer: 'Yes. The Help Center includes guided content, tutorials, searchable support information and interactive chat support for immediate assistance.'
      },
      {
        question: 'Is the Help Center available on mobile?',
        answer: 'Yes. The Help Center is designed to remain responsive so resources, FAQs and tutorials can be accessed comfortably across devices.'
      }
    ]
  },
  'How-To Guides': {
    title: 'How-To Guides',
    intro: 'Step-by-step support materials for common actions across the Equity Master experience.',
    guides: [
      'How to review portfolio holdings and price history',
      'How to monitor recent activity efficiently',
      'How to download documents instantly',
      'How to use support options for faster assistance'
    ]
  },
  'Video Tutorials': {
    title: 'Video Tutorials',
    intro: 'Watch responsive embedded tutorials directly within the Help Center.',
    videos: [
      {
        id: 'Mt0Y5X6885I',
        title: 'Video Tutorial 1',
        url: 'https://youtu.be/Mt0Y5X6885I'
      },
      {
        id: '6dSVaAaKWSQ',
        title: 'Video Tutorial 2',
        url: 'https://www.youtube.com/watch?v=6dSVaAaKWSQ'
      },
      {
        id: '8qaLG730bDw',
        title: 'Video Tutorial 3',
        url: 'https://www.youtube.com/watch?v=8qaLG730bDw&t=20s&pp=ygUWbWFzaGFibGUgbW9ybmluZyB3aSBLS9IHCQkaDAGHKiGM7w%3D%3D'
      }
    ]
  },
  'Help Materials': {
    title: 'Help Materials',
    intro: 'Reference materials that support confident use of the platform.',
    materials: [
      'Platform overview and service introduction',
      'Account access and support guidance',
      'Document access and viewing guidance',
      'Support pathways for common user needs'
    ]
  },
  Troubleshooting: {
    title: 'Troubleshooting',
    intro: 'Use these checks to resolve common issues before contacting support.',
    tips: [
      'Confirm you are using the correct registered login details.',
      'Refresh the page and retry the task if data appears delayed.',
      'Check your internet connection when content fails to load fully.',
      'Use chat support if the issue continues and you need immediate guidance.'
    ]
  },
  'Chat Support': {
    title: 'Chat Support',
    intro: 'Ask a question and receive an immediate predefined response directly inside the Help Center.'
  }
};

const allSearchResources = [
  { category: 'Getting Started', title: 'Create or access your account securely', text: 'Create or access your account securely using your registered details.' },
  { category: 'Getting Started', title: 'Review portfolio information', text: 'Review portfolio information, recent activity and available documents.' },
  { category: 'Getting Started', title: 'Explore support topics', text: 'Explore support topics, videos and frequently asked questions.' },
  { category: 'Getting Started', title: 'Use chat support', text: 'Use chat support when you need immediate guidance.' },
  { category: 'FAQs', title: 'How do I access my shareholder or employee information?', text: 'Sign in using your registered account details to access holdings, activity, plan information and downloadable resources in one place.' },
  { category: 'FAQs', title: 'Where can I download my documents?', text: 'Relevant statements and available documents can be downloaded directly from the platform once you are signed in and viewing your account area.' },
  { category: 'FAQs', title: 'Can I get help without leaving the website?', text: 'The Help Center includes guided content, tutorials, searchable support information and interactive chat support for immediate assistance.' },
  { category: 'FAQs', title: 'Is the Help Center available on mobile?', text: 'The Help Center is designed to remain responsive so resources, FAQs and tutorials can be accessed comfortably across devices.' },
  { category: 'How-To Guides', title: 'How to review portfolio holdings and price history', text: 'Step-by-step support for holdings and price history.' },
  { category: 'How-To Guides', title: 'How to monitor recent activity efficiently', text: 'Guidance for monitoring recent activity.' },
  { category: 'How-To Guides', title: 'How to download documents instantly', text: 'Guidance for downloading documents instantly.' },
  { category: 'How-To Guides', title: 'How to use support options for faster assistance', text: 'Guidance for using support options.' },
  { category: 'Video Tutorials', title: 'Video Tutorial 1', text: 'Watch responsive embedded tutorial 1.' },
  { category: 'Video Tutorials', title: 'Video Tutorial 2', text: 'Watch responsive embedded tutorial 2.' },
  { category: 'Video Tutorials', title: 'Video Tutorial 3', text: 'Watch responsive embedded tutorial 3.' },
  { category: 'Help Materials', title: 'Platform overview and service introduction', text: 'Reference material for platform overview.' },
  { category: 'Help Materials', title: 'Account access and support guidance', text: 'Reference material for account access.' },
  { category: 'Help Materials', title: 'Document access and viewing guidance', text: 'Reference material for document access.' },
  { category: 'Troubleshooting', title: 'Confirm registered login details', text: 'Confirm you are using the correct registered login details.' },
  { category: 'Troubleshooting', title: 'Refresh and retry', text: 'Refresh the page and retry the task if data appears delayed.' },
  { category: 'Troubleshooting', title: 'Check connection', text: 'Check your internet connection when content fails to load fully.' },
  { category: 'Chat Support', title: 'Immediate support guidance', text: 'Ask a question and receive an immediate predefined response directly inside the Help Center.' }
];

const investorBullets = [
  'Portfolio holdings and price history',
  'Monitor recent activity',
  'Download documents instantly',
  'Virtual assistance'
];

const empShareBullets = [
  'Intuitive and user-friendly',
  'Real-time data',
  'Simplify tax calculations',
  'Mobile app'
];

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [activeHelpCategory, setActiveHelpCategory] = useState('Getting Started');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeVideoId, setActiveVideoId] = useState('Mt0Y5X6885I');

  const defaultChatMessages = useMemo(
    () => [
      {
        sender: 'bot',
        text: 'Welcome to Chat Support. Ask a question and I will provide immediate guidance.'
      }
    ],
    []
  );

  const [chatMessages, setChatMessages] = useState(defaultChatMessages);
  const [chatInput, setChatInput] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const handleNavigate = (sectionId) => {
    if (sectionId === 'help-center') {
      setActiveSection('help-center');
      setActiveHelpCategory('Getting Started');
      setSearchResults([]);
      setSearchTerm('');
      requestAnimationFrame(() => {
        const element = document.getElementById('help-center');
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      return;
    }
    setActiveSection(sectionId);
    requestAnimationFrame(() => {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleCategorySelect = (category) => {
    setActiveHelpCategory(category);
    setSearchResults([]);
    if (category !== 'FAQs') setOpenFaqIndex(null);
    if (category === 'Video Tutorials') {
      setActiveVideoId(categoryData['Video Tutorials'].videos[0].id);
    }
  };

  const handleSearch = () => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setSearchResults([]);
      setActiveHelpCategory('Getting Started');
      return;
    }
    const matches = allSearchResources.filter((item) =>
      [item.category, item.title, item.text].some((value) => value.toLowerCase().includes(term))
    );
    setSearchResults(matches);
  };

  const handleFaqToggle = (index) => {
    setOpenFaqIndex((current) => (current === index ? null : index));
  };

  const getChatResponse = (question) => {
    const normalized = question.toLowerCase();
    if (normalized.includes('document')) return 'You can review and download available documents directly within the platform after signing in.';
    if (normalized.includes('login') || normalized.includes('access')) return 'Please use your registered details to access your account and review platform information securely.';
    if (normalized.includes('video') || normalized.includes('tutorial')) return 'Open the Video Tutorials category to view responsive embedded tutorials directly within the Help Center.';
    if (normalized.includes('faq') || normalized.includes('question')) return 'You can browse the FAQs category to quickly find answers using the expandable accordion controls.';
    return 'Thank you for your question. Please review the relevant Help Center category or continue the chat for more guidance.';
  };

  const handleChatSubmit = (event) => {
    event.preventDefault();
    const question = chatInput.trim();
    if (!question) return;
    setChatMessages((current) => [...current, { sender: 'user', text: question }]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages((current) => [...current, { sender: 'bot', text: getChatResponse(question) }]);
    }, 700);
  };

  return (
    <div className="app-shell" id="top">
      <Header activeSection={activeSection} onNavigate={handleNavigate} />
      <main>
        <TwoColumnSection
          id="investor-centre"
          eyebrow="For shareholders"
          title="Investor Centre"
          description="Introducing the new Investor Centre experience. A modern, intuitive and seamless way to manage your investments online."
          bullets={investorBullets}
          imageUrl="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
          imageAlt="Investor Centre technology platform"
        />
        <TwoColumnSection
          id="empshare"
          eyebrow="For employee share plan holders"
          title="EmpShare"
          description="EmpShare provides a clear and accessible experience for plan holders, helping them stay informed and act with confidence."
          bullets={empShareBullets}
          imageUrl="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
          imageAlt="Employee experience collaboration"
          reverse
          alternate
        />
        <TwoColumnSection
          id="about-us"
          eyebrow="About us"
          title="Purpose-built digital experiences for financial services"
          description="Equity Master delivers practical, enterprise-focused platforms that support investors, employees and organisations with secure, approachable digital journeys."
          secondaryDescription="We combine domain understanding, scalable technology and user-centred delivery to create experiences that feel simple while handling complex business needs."
          imageUrl="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80"
          imageAlt="Business professionals discussing digital experiences"
        />
        <Insights id="insights" />
        <HelpCenter
          id="help-center"
          categories={Object.keys(categoryData)}
          activeCategory={activeHelpCategory}
          onCategorySelect={handleCategorySelect}
          categoryData={categoryData}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearch={handleSearch}
          searchResults={searchResults}
          activeVideoId={activeVideoId}
          onVideoSelect={setActiveVideoId}
          openFaqIndex={openFaqIndex}
          onFaqToggle={handleFaqToggle}
          chatMessages={chatMessages}
          chatInput={chatInput}
          onChatInputChange={setChatInput}
          onChatSubmit={handleChatSubmit}
        />
      </main>
      <Footer />
    </div>
  );
}

export default App;
