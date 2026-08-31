import { useMemo, useState } from 'react';
import Accordion from './Accordion';

const categories = [
  'Getting Started',
  'FAQs',
  'How-To Guides',
  'Video Tutorials',
  'Help Materials',
  'Troubleshooting',
  'Chat Support'
];

const faqItems = [
  {
    id: 'faq-1',
    title: 'How do I access Investor Centre or EmpShare?',
    keywords: ['access', 'login', 'investor centre', 'empshare'],
    content: (
      <p>
        Use your existing account details to sign in to the relevant service. Investor Centre supports shareholders, while EmpShare supports employee share plan holders.
      </p>
    )
  },
  {
    id: 'faq-2',
    title: 'Where can I download documents instantly?',
    keywords: ['documents', 'download', 'statements'],
    content: (
      <p>
        Documents are available within the relevant account area after sign-in. Recent account materials and service documents can be downloaded directly from the platform.
      </p>
    )
  },
  {
    id: 'faq-3',
    title: 'Can I monitor recent activity and price history?',
    keywords: ['activity', 'price history', 'portfolio'],
    content: (
      <p>
        Yes. Investor Centre provides portfolio holdings, recent activity visibility and price history to help you review your investments with confidence.
      </p>
    )
  },
  {
    id: 'faq-4',
    title: 'Is help available for tax calculations and employee plans?',
    keywords: ['tax', 'employee plans', 'help'],
    content: (
      <p>
        EmpShare is designed to simplify tax calculations and present plan information clearly, with additional help materials and support content available in this Help Center.
      </p>
    )
  }
];

const gettingStarted = [
  {
    id: 'start-1',
    title: 'Create your account',
    keywords: ['create', 'account', 'registration'],
    content: (
      <p>
        Follow your organisation or shareholder onboarding instructions to create your account, verify your details and set up secure access.
      </p>
    )
  },
  {
    id: 'start-2',
    title: 'Prepare your first sign-in',
    keywords: ['sign-in', 'password', 'access'],
    content: (
      <p>
        Have your user details ready, confirm your contact information and use the sign-in prompts to complete first-time access.
      </p>
    )
  }
];

const howToGuides = [
  {
    id: 'guide-1',
    title: 'Review your holdings and account information',
    description: 'A step-by-step guide to checking holdings, balances and recent activity.'
  },
  {
    id: 'guide-2',
    title: 'Download service documents and statements',
    description: 'Find and export the documents relevant to your account or plan.'
  },
  {
    id: 'guide-3',
    title: 'Update account details and preferences',
    description: 'Manage profile information and preferences using the same platform workflow.'
  }
];

const materials = [
  {
    title: 'Platform Overview PDF',
    meta: 'Reference guide for Investor Centre and EmpShare account areas.'
  },
  {
    title: 'Account Access Checklist',
    meta: 'A simple checklist for registration, sign-in and support readiness.'
  },
  {
    title: 'Support Contact Summary',
    meta: 'Includes support@equitymaster.demo and guidance on when to contact support.'
  }
];

const troubleshooting = [
  {
    id: 'trouble-1',
    title: 'I cannot sign in to my account',
    keywords: ['cannot sign in', 'login', 'password'],
    content: (
      <p>
        Recheck your sign-in details, ensure your account is activated and try the recovery options available on the sign-in page before contacting support.
      </p>
    )
  },
  {
    id: 'trouble-2',
    title: 'My documents are not appearing',
    keywords: ['documents', 'missing'],
    content: (
      <p>
        Refresh the account area, confirm the selected account context and review recent activity. If the issue continues, contact support for assistance.
      </p>
    )
  }
];

const videos = [
  {
    title: 'Video Tutorial 1',
    description: 'Overview of platform access and key tasks.',
    embed: 'https://www.youtube.com/embed/Mt0Y5X6885I'
  },
  {
    title: 'Video Tutorial 2',
    description: 'A walkthrough of common help tasks and navigation.',
    embed: 'https://www.youtube.com/embed/6dSVaAaKWSQ'
  },
  {
    title: 'Video Tutorial 3',
    description: 'Practical guidance for support-related usage patterns.',
    embed: 'https://www.youtube.com/embed/8qaLG730bDw'
  }
];

function filterAccordionItems(items, query) {
  if (!query.trim()) return items;
  const lower = query.toLowerCase();
  return items.filter(
    (item) =>
      item.title.toLowerCase().includes(lower) ||
      (item.keywords || []).some((keyword) => keyword.toLowerCase().includes(lower))
  );
}

export default function HelpCenter() {
  const [activeCategory, setActiveCategory] = useState('FAQs');
  const [search, setSearch] = useState('');
  const [openFaq, setOpenFaq] = useState('faq-1');
  const [openStart, setOpenStart] = useState('start-1');
  const [openTrouble, setOpenTrouble] = useState('trouble-1');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, role: 'agent', text: 'Hello. How can we help you today?' }
  ]);

  const visibleFaqs = useMemo(() => filterAccordionItems(faqItems, search), [search]);
  const visibleStarts = useMemo(() => filterAccordionItems(gettingStarted, search), [search]);
  const visibleTroubleshooting = useMemo(() => filterAccordionItems(troubleshooting, search), [search]);

  const submitSearch = (e) => {
    e.preventDefault();
  };

  const sendChat = () => {
    const value = chatInput.trim();
    if (!value) return;
    setChatMessages((prev) => [
      ...prev,
      { id: Date.now(), role: 'user', text: value },
      {
        id: Date.now() + 1,
        role: 'agent',
        text: 'Thanks for your message. Please email support@equitymaster.demo if you need direct assistance.'
      }
    ]);
    setChatInput('');
  };

  const renderContent = () => {
    if (activeCategory === 'Getting Started') {
      return (
        <>
          <h3 className="help-content-title">Getting Started</h3>
          <p className="help-content-intro">Use these introductory topics to begin using the platform with confidence.</p>
          <Accordion items={visibleStarts} openItem={openStart} onToggle={(id) => setOpenStart(openStart === id ? null : id)} />
        </>
      );
    }
    if (activeCategory === 'FAQs') {
      return (
        <>
          <h3 className="help-content-title">Frequently Asked Questions</h3>
          <p className="help-content-intro">Find quick answers to common questions about Investor Centre, EmpShare and account support.</p>
          <Accordion items={visibleFaqs} openItem={openFaq} onToggle={(id) => setOpenFaq(openFaq === id ? null : id)} />
        </>
      );
    }
    if (activeCategory === 'How-To Guides') {
      const filtered = !search.trim()
        ? howToGuides
        : howToGuides.filter(
            (item) =>
              item.title.toLowerCase().includes(search.toLowerCase()) ||
              item.description.toLowerCase().includes(search.toLowerCase())
          );
      return (
        <>
          <h3 className="help-content-title">How-To Guides</h3>
          <p className="help-content-intro">Practical guidance presented using the same lightweight content style as the rest of the application.</p>
          <div className="help-card-list help-rich-text">
            {filtered.map((item) => (
              <div className="help-link-row" key={item.title}>
                <span className="help-link-title">{item.title}</span>
                <span className="help-link-meta">{item.description}</span>
              </div>
            ))}
          </div>
        </>
      );
    }
    if (activeCategory === 'Video Tutorials') {
      return (
        <>
          <h3 className="help-content-title">Video Tutorials</h3>
          <p className="help-content-intro">Video resources for users who prefer guided walkthroughs.</p>
          <div className="video-grid">
            {videos.map((video) => (
              <article className="video-card" key={video.title}>
                <iframe
                  className="video-thumb"
                  src={video.embed}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
                <div className="video-body help-rich-text">
                  <h4 className="video-title">{video.title}</h4>
                  <p>{video.description}</p>
                </div>
              </article>
            ))}
          </div>
        </>
      );
    }
    if (activeCategory === 'Help Materials') {
      const filtered = !search.trim()
        ? materials
        : materials.filter(
            (item) =>
              item.title.toLowerCase().includes(search.toLowerCase()) ||
              item.meta.toLowerCase().includes(search.toLowerCase())
          );
      return (
        <>
          <h3 className="help-content-title">Help Materials</h3>
          <p className="help-content-intro">Reference materials and support documents presented in a simple list format.</p>
          <div className="help-card-list help-rich-text">
            {filtered.map((item) => (
              <div className="help-link-row" key={item.title}>
                <span className="help-link-title">{item.title}</span>
                <span className="help-link-meta">{item.meta}</span>
              </div>
            ))}
          </div>
        </>
      );
    }
    if (activeCategory === 'Troubleshooting') {
      return (
        <>
          <h3 className="help-content-title">Troubleshooting</h3>
          <p className="help-content-intro">Use these common issue guides before contacting support.</p>
          <Accordion
            items={visibleTroubleshooting}
            openItem={openTrouble}
            onToggle={(id) => setOpenTrouble(openTrouble === id ? null : id)}
          />
        </>
      );
    }
    return (
      <>
        <h3 className="help-content-title">Chat Support</h3>
        <p className="help-content-intro">Use the support panel below to draft a help request. Text remains lightweight and consistent with the rest of the page.</p>
        <div className="chat-support-box help-rich-text">
          <p>Our support team can help with access, account guidance and general platform questions.</p>
          <div className="chat-window" aria-live="polite">
            {chatMessages.map((message) => (
              <div key={message.id} className={`chat-bubble ${message.role}`}>
                {message.text}
              </div>
            ))}
          </div>
          <div className="chat-input-row">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type your message"
              aria-label="Chat message"
            />
            <button type="button" onClick={sendChat}>Send</button>
          </div>
        </div>
      </>
    );
  };

  return (
    <section className="section help-center" id="help-center">
      <div className="container">
        <div className="help-center-intro">
          <h2 className="help-center-title">Help Center</h2>
          <p className="help-center-description">
            Search support topics, explore help categories and access frequently asked questions for Investor Centre and EmpShare.
          </p>
          <form className="help-center-search" onSubmit={submitSearch}>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search help topics"
              aria-label="Search help topics"
            />
            <button type="submit">Search</button>
          </form>
        </div>
        <div className="help-center-layout">
          <aside className="help-sidebar" aria-label="Help Center categories">
            {categories.map((category) => (
              <button
                key={category}
                className={`help-nav-item ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
                type="button"
              >
                {category}
              </button>
            ))}
          </aside>
          <div className="help-main">{renderContent()}</div>
        </div>
      </div>
    </section>
  );
}
