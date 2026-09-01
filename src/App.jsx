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
    id: 'faq-1',
    question: 'How do I access my shareholder or employee information?',
    answer:
      'Use your secure portal login to access your shareholder or employee information. Once signed in, navigate to your account dashboard to view holdings, plans, statements and related records.'
  },
  {
    id: 'faq-2',
    question: 'Where can I download my documents?',
    answer:
      'Documents can be downloaded from the relevant account and document areas within the portal. Statements, forms, guides and reference files are also available in Help Center materials.'
  },
  {
    id: 'faq-3',
    question: 'Can I get help without leaving the website?',
    answer:
      'Yes. The Help Center includes searchable support content, embedded video tutorials and an interactive chat assistant so you can get guidance without leaving the site.'
  },
  {
    id: 'faq-4',
    question: 'Is the Help Center available on mobile?',
    answer:
      'Yes. The Help Center is fully responsive and available across desktop, tablet and mobile layouts using the same navigation and support content.'
  }
];

const videos = [
  {
    id: 'video-1',
    title: 'Getting started with platform navigation',
    url: 'https://www.youtube.com/embed/Mt0Y5X6885I',
    fallback: 'https://youtu.be/Mt0Y5X6885I'
  },
  {
    id: 'video-2',
    title: 'Managing account support tasks',
    url: 'https://www.youtube.com/embed/6dSVaAaKWSQ',
    fallback: 'https://www.youtube.com/watch?v=6dSVaAaKWSQ'
  },
  {
    id: 'video-3',
    title: 'Using online help resources',
    url: 'https://www.youtube.com/embed/8qaLG730bDw',
    fallback: 'https://www.youtube.com/watch?v=8qaLG730bDw&t=20s&pp=ygUWbWFzaGFibGUgbW9ybmluZyB3aSBLS9IHCQkaDAGHKiGM7w%3D%3D'
  }
];

const materials = [
  {
    id: 'pdf-1',
    title: 'Account access guide',
    type: 'PDF',
    url: 'https://drive.google.com/file/d/1HqLeSEbVZz3JWwxSX5TgsJd7Q0x3xdVk/view?usp=drive_link'
  },
  {
    id: 'pdf-2',
    title: 'Document retrieval reference',
    type: 'PDF',
    url: 'https://drive.google.com/file/d/1Uc5E21E6CIummBqCDs5zYk2mLbZ_ur5y/view?usp=drive_link'
  },
  {
    id: 'pdf-3',
    title: 'Platform support user guide',
    type: 'PDF',
    url: 'https://drive.google.com/file/d/1ErTOSOIThyzHUCLz8QilIwZ3u5A6ENk9/view?usp=drive_link'
  },
  {
    id: 'pdf-4',
    title: 'Troubleshooting checklist',
    type: 'PDF',
    url: 'https://drive.google.com/file/d/1punlgjU4E2kxuZBq3LwPKpivtSCrUhms/view?usp=drive_link'
  },
  {
    id: 'pdf-5',
    title: 'Employee plan help file',
    type: 'PDF',
    url: 'https://drive.google.com/file/d/1qEIXB74Sv2row9t8OQdLcPN7BQB0e01d/view?usp=drive_link'
  },
  {
    id: 'pdf-6',
    title: 'Support quick reference',
    type: 'PDF',
    url: 'https://drive.google.com/file/d/1cpOfBS-R96wW4jzsxZ8ldFWwG166T9ob/view?usp=drive_link'
  }
];

const categoryContent = {
  'Getting Started': {
    heading: 'Getting Started',
    description:
      'Start with essential guidance for accessing the platform, navigating core areas and finding support content quickly.',
    articles: [
      'Access your account securely using your registered credentials.',
      'Use the main navigation to move between Investor Centre, EmpShare, About Us and Help Center.',
      'Search support content to find FAQs, tutorials, downloadable materials and troubleshooting guidance.'
    ]
  },
  FAQs: {
    heading: 'Frequently Asked Questions',
    description:
      'Browse common questions about the platform, access, documents and support options.',
    faqs: faqItems
  },
  'How-To Guides': {
    heading: 'How-To Guides',
    description:
      'Follow practical step-by-step guidance for common support tasks and platform actions.',
    articles: [
      'How to sign in and verify account access.',
      'How to locate and download statements and reference documents.',
      'How to use Help Center search to find support topics by keyword.'
    ]
  },
  'Video Tutorials': {
    heading: 'Video Tutorials',
    description:
      'Watch short visual walkthroughs directly within the Help Center.',
    videos
  },
  'Help Materials': {
    heading: 'Help Materials',
    description:
      'Download reference materials and user guides for offline access.',
    materials
  },
  Troubleshooting: {
    heading: 'Troubleshooting',
    description:
      'Review common issue-resolution guidance for access, documents and general support.',
    articles: [
      'If sign-in fails, confirm your credentials and retry using the secure login flow.',
      'If a document does not appear, refresh the relevant account area and verify the document category.',
      'If you need further assistance, use chat support for immediate guidance and related help links.'
    ]
  },
  'Chat Support': {
    heading: 'Chat Support',
    description:
      'Open the chat assistant for immediate conversational support and helpful article links.',
    chat: true
  }
};

const searchIndex = [
  ...faqItems.map((item) => ({
    id: item.id,
    type: 'FAQ',
    title: item.question,
    text: `${item.question} ${item.answer}`,
    category: 'FAQs'
  })),
  ...videos.map((item) => ({
    id: item.id,
    type: 'Video',
    title: item.title,
    text: item.title,
    category: 'Video Tutorials',
    url: item.fallback
  })),
  ...materials.map((item) => ({
    id: item.id,
    type: item.type,
    title: item.title,
    text: item.title,
    category: 'Help Materials',
    url: item.url
  })),
  {
    id: 'article-1',
    type: 'Article',
    title: 'Getting started with account access',
    text: 'getting started account access login support secure portal',
    category: 'Getting Started'
  },
  {
    id: 'article-2',
    type: 'Article',
    title: 'How to download platform documents',
    text: 'download documents statements files help materials guides',
    category: 'How-To Guides'
  },
  {
    id: 'article-3',
    type: 'Article',
    title: 'Troubleshooting sign-in and support issues',
    text: 'troubleshooting access sign-in support issues help assistant',
    category: 'Troubleshooting'
  }
];

export default function App() {
  const [activeCategory, setActiveCategory] = useState('Getting Started');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: 'Hello. I can help with access, documents, videos and support resources.',
      links: [
        { label: 'Frequently Asked Questions', category: 'FAQs' },
        { label: 'Help Materials', category: 'Help Materials' }
      ]
    }
  ]);

  const searchResults = useMemo(() => {
    const query = submittedSearch.trim().toLowerCase();
    if (!query) return [];
    return searchIndex.filter((item) => item.text.toLowerCase().includes(query) || item.title.toLowerCase().includes(query));
  }, [submittedSearch]);

  const handleSearch = (event) => {
    event.preventDefault();
    setSubmittedSearch(searchTerm);
  };

  const handleToggleFaq = (id) => {
    setExpandedFaq((current) => (current === id ? null : id));
  };

  const openCategory = (category) => {
    setActiveCategory(category);
  };

  const handleChatLink = (category) => {
    setActiveCategory(category);
    setChatOpen(false);
  };

  const buildReply = (text) => {
    const normalized = text.toLowerCase();
    if (normalized.includes('document') || normalized.includes('pdf') || normalized.includes('download')) {
      return {
        text: 'You can review downloadable files in Help Materials and platform document guidance in FAQs.',
        links: [
          { label: 'Help Materials', category: 'Help Materials' },
          { label: 'Frequently Asked Questions', category: 'FAQs' }
        ]
      };
    }
    if (normalized.includes('video') || normalized.includes('tutorial')) {
      return {
        text: 'Video Tutorials includes embedded support videos that play directly in the Help Center.',
        links: [{ label: 'Video Tutorials', category: 'Video Tutorials' }]
      };
    }
    if (normalized.includes('login') || normalized.includes('access') || normalized.includes('account')) {
      return {
        text: 'For access-related help, start with Getting Started and review the FAQs for common account questions.',
        links: [
          { label: 'Getting Started', category: 'Getting Started' },
          { label: 'Frequently Asked Questions', category: 'FAQs' }
        ]
      };
    }
    return {
      text: 'I can help you find guidance across Help Center categories, FAQs, videos, materials and troubleshooting.',
      links: [
        { label: 'Getting Started', category: 'Getting Started' },
        { label: 'Troubleshooting', category: 'Troubleshooting' }
      ]
    };
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    const trimmed = chatInput.trim();
    if (!trimmed) return;
    const userMessage = { id: Date.now(), sender: 'user', text: trimmed, links: [] };
    const reply = buildReply(trimmed);
    const assistantMessage = {
      id: Date.now() + 1,
      sender: 'assistant',
      text: reply.text,
      links: reply.links
    };
    setMessages((current) => [...current, userMessage, assistantMessage]);
    setChatInput('');
  };

  return (
    <div className="app-shell">
      <Header onHelpCenterClick={() => openCategory('Getting Started')} />
      <main>
        <InvestorCentre />
        <EmpShare />
        <AboutUs />
        <Insights />
        <HelpCenter
          activeCategory={activeCategory}
          setActiveCategory={openCategory}
          categoryContent={categoryContent}
          expandedFaq={expandedFaq}
          onToggleFaq={handleToggleFaq}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearch={handleSearch}
          searchResults={searchResults}
          submittedSearch={submittedSearch}
          chatOpen={chatOpen}
          setChatOpen={setChatOpen}
          chatInput={chatInput}
          setChatInput={setChatInput}
          onSendMessage={handleSendMessage}
          messages={messages}
          onChatLink={handleChatLink}
        />
      </main>
      <Footer />
    </div>
  );
}
