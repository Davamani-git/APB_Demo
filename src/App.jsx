import { useMemo, useState } from 'react';

const navItems = [
  { label: 'Investor Centre', href: '#investor-centre' },
  { label: 'EmpShare', href: '#empshare' },
  { label: 'About Us', href: '#about-us' },
  { label: 'Technology Platforms', href: '#technology-platforms' },
  { label: 'Help Center', href: '#help-center' }
];

const helpCategories = [
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
    question: 'How do I access my shareholder or employee information?',
    answer:
      'Use the Help Center guidance for account access and navigation. If you need immediate assistance, the chat support area can direct you to the most relevant guidance and resources.'
  },
  {
    question: 'Where can I download my documents?',
    answer:
      'Downloadable materials and document guidance are available in Help Materials. You can also search for document-related topics using the Help Center search field.'
  },
  {
    question: 'Can I get help without leaving the website?',
    answer:
      'Yes. The integrated chat support section provides immediate automated responses and links to the most relevant help content directly within the same application.'
  },
  {
    question: 'Is the Help Center available on mobile?',
    answer:
      'Yes. The Help Center layout is responsive and adjusts for smaller screens so you can browse categories, search content, and access support on mobile devices.'
  }
];

const searchableContent = [
  {
    title: 'Getting Started with Equity Portal',
    type: 'Article',
    category: 'Getting Started',
    text: 'Learn the basics of accessing the portal, locating support resources, and finding onboarding materials for new users.'
  },
  {
    title: 'Frequently Asked Questions',
    type: 'Article',
    category: 'FAQs',
    text: 'Browse common questions about platform access, documents, support options, and mobile availability.'
  },
  {
    title: 'Account Access and Document Retrieval',
    type: 'Guide',
    category: 'How-To Guides',
    text: 'Follow practical instructions for locating account information, navigating help sections, and accessing downloadable materials.'
  },
  {
    title: 'Platform Walkthrough Video 1',
    type: 'Video',
    category: 'Video Tutorials',
    text: 'A video tutorial that introduces platform concepts and gives a quick overview of available support resources.'
  },
  {
    title: 'Employee Share Document Guide',
    type: 'Download',
    category: 'Help Materials',
    text: 'Download an employee share document guide for offline reference over HTTPS.'
  },
  {
    title: 'Employee Share Vesting Guide',
    type: 'Download',
    category: 'Help Materials',
    text: 'Access a vesting guide to understand employee share support materials and reference information.'
  },
  {
    title: 'Troubleshooting Access Issues',
    type: 'Article',
    category: 'Troubleshooting',
    text: 'Review practical steps for resolving common platform access issues and support questions.'
  },
  {
    title: 'Immediate Chat Assistance',
    type: 'Support',
    category: 'Chat Support',
    text: 'Open chat support to receive automated responses with relevant information or links to help articles.'
  }
];

const videoItems = [
  {
    title: 'Platform Overview',
    embedUrl: 'https://www.youtube.com/embed/Mt0Y5X6885I'
  },
  {
    title: 'Support Tutorial',
    embedUrl: 'https://www.youtube.com/embed/6dSVaAaKWSQ'
  },
  {
    title: 'Quick Guidance Video',
    embedUrl: 'https://www.youtube.com/embed/8qaLG730bDw'
  }
];

const helpMaterials = [
  {
    title: 'Employee Share Document Guide',
    url: 'https://drive.google.com/file/d/1HqLeSEbVZz3JWwxSX5TgsJd7Q0x3xdVk/view?usp=drive_link'
  },
  {
    title: 'Employee Share Vesting Guide',
    url: 'https://drive.google.com/file/d/1Uc5E21E6CIummBqCDs5zYk2mLbZ_ur5y/view?usp=drive_link'
  },
  {
    title: 'Employee Quick Reference',
    url: 'https://drive.google.com/file/d/1ErTOSOIThyzHUCLz8QilIwZ3u5A6ENk9/view?usp=drive_link'
  }
];

const quickResponses = {
  documents:
    'You can review Help Materials for downloadable guides and search for document-related content directly in the Help Center.',
  mobile:
    'The Help Center is responsive and available on mobile for browsing categories, FAQs, and support options.',
  access:
    'Start with Getting Started and FAQs for platform access guidance. If you need more help, use chat support for a quick answer.',
  default:
    'I can help with getting started, FAQs, downloadable materials, troubleshooting, and support guidance. Try asking about documents, access, or mobile support.'
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('FAQs');
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [chatOpen, setChatOpen] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'assistant',
      text: 'Welcome to chat support. Ask about access, documents, mobile support, or troubleshooting.'
    }
  ]);

  const filteredResults = useMemo(() => {
    const query = submittedSearch.trim().toLowerCase();
    if (!query) return [];
    return searchableContent.filter((item) => {
      const haystack = `${item.title} ${item.type} ${item.category} ${item.text}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [submittedSearch]);

  const handleSearch = (event) => {
    event.preventDefault();
    setSubmittedSearch(searchTerm);
    setSelectedCategory('Getting Started');
  };

  const handleFaqToggle = (index) => {
    setOpenFaqIndex((current) => (current === index ? null : index));
  };

  const handleChatSubmit = (event) => {
    event.preventDefault();
    const trimmed = chatInput.trim();
    if (!trimmed) return;

    const lower = trimmed.toLowerCase();
    let response = quickResponses.default;

    if (lower.includes('document') || lower.includes('pdf') || lower.includes('download')) {
      response = quickResponses.documents;
    } else if (lower.includes('mobile')) {
      response = quickResponses.mobile;
    } else if (lower.includes('access') || lower.includes('login') || lower.includes('account')) {
      response = quickResponses.access;
    }

    setChatMessages((current) => [
      ...current,
      { sender: 'user', text: trimmed },
      { sender: 'assistant', text: response }
    ]);
    setChatInput('');
  };

  const renderHelpContent = () => {
    if (submittedSearch.trim()) {
      return (
        <div className="help-panel">
          <h3>Search Results</h3>
          <p className="help-panel-intro">
            Relevant search results for articles, videos, and downloadable materials.
          </p>
          <div className="divider" />
          {filteredResults.length > 0 ? (
            <div className="search-results">
              {filteredResults.map((item) => (
                <div key={`${item.category}-${item.title}`} className="search-result-row">
                  <div>
                    <div className="search-result-type">{item.type}</div>
                    <h4>{item.title}</h4>
                    <p>{item.text}</p>
                  </div>
                  <span className="search-result-category">{item.category}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">
              No matching help content was found. Try a different keyword such as access, documents, video, or troubleshooting.
            </p>
          )}
        </div>
      );
    }

    switch (selectedCategory) {
      case 'Getting Started':
        return (
          <div className="help-panel">
            <h3>Getting Started</h3>
            <p className="help-panel-intro">
              Begin with practical onboarding guidance to understand the portal, support resources, and where to find the information you need.
            </p>
            <div className="divider" />
            <ul className="simple-list">
              <li>Access the Help Center from the main navigation on the Home Page.</li>
              <li>Browse help content by category to locate the most relevant guidance.</li>
              <li>Use search to find articles, videos, and downloadable materials quickly.</li>
            </ul>
          </div>
        );
      case 'FAQs':
        return (
          <div className="help-panel">
            <h3>Frequently Asked Questions</h3>
            <p className="help-panel-intro">
              Browse common questions about the platform, access, documents and support options.
            </p>
            <div className="divider" />
            <div className="faq-list">
              {faqItems.map((item, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={item.question} className="faq-item">
                    <button className="faq-question" onClick={() => handleFaqToggle(index)}>
                      <span>{item.question}</span>
                      <span className="faq-toggle" aria-hidden="true">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    {isOpen ? <p className="faq-answer">{item.answer}</p> : null}
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 'How-To Guides':
        return (
          <div className="help-panel">
            <h3>How-To Guides</h3>
            <p className="help-panel-intro">
              Follow step-by-step guidance to locate information, access support content, and use the portal more effectively.
            </p>
            <div className="divider" />
            <ul className="simple-list">
              <li>Find shareholder or employee information through the relevant portal sections.</li>
              <li>Use keyword search to locate articles, videos, and downloadable materials.</li>
              <li>Switch between help categories to narrow content to your specific need.</li>
            </ul>
          </div>
        );
      case 'Video Tutorials':
        return (
          <div className="help-panel">
            <h3>Video Tutorials</h3>
            <p className="help-panel-intro">
              Watch concise tutorials that support onboarding and practical platform guidance.
            </p>
            <div className="divider" />
            <div className="video-grid">
              {videoItems.map((video) => (
                <div key={video.title} className="help-center-video">
                  <div className="video-frame-wrap">
                    <iframe
                      src={video.embedUrl}
                      title={video.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                  <h4>{video.title}</h4>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Help Materials':
        return (
          <div className="help-panel">
            <h3>Help Materials</h3>
            <p className="help-panel-intro">
              Download support materials for offline reference, including guides and quick-reference documents.
            </p>
            <div className="divider" />
            <div className="materials-list">
              {helpMaterials.map((item) => (
                <a
                  key={item.title}
                  className="material-link"
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>{item.title}</span>
                  <span>Download</span>
                </a>
              ))}
            </div>
          </div>
        );
      case 'Troubleshooting':
        return (
          <div className="help-panel">
            <h3>Troubleshooting</h3>
            <p className="help-panel-intro">
              Review common issues and practical next steps to resolve access and support challenges efficiently.
            </p>
            <div className="divider" />
            <ul className="simple-list">
              <li>Confirm you are using the correct Help Center category for your issue.</li>
              <li>Search by keywords to locate the most relevant support content quickly.</li>
              <li>Use chat support for immediate automated guidance and content direction.</li>
            </ul>
          </div>
        );
      case 'Chat Support':
        return (
          <div className="help-panel help-center-chat">
            <div className="chat-header-row">
              <div>
                <h3>Chat Support</h3>
                <p className="help-panel-intro">
                  Receive immediate automated answers with relevant information or links to help content.
                </p>
              </div>
              <button className="chat-toggle-button" onClick={() => setChatOpen((current) => !current)}>
                {chatOpen ? 'Hide Chat' : 'Open Chat'}
              </button>
            </div>
            <div className="divider" />
            {chatOpen ? (
              <>
                <div className="chat-window">
                  {chatMessages.map((message, index) => (
                    <div
                      key={`${message.sender}-${index}`}
                      className={`chat-message ${message.sender === 'user' ? 'user' : 'assistant'}`}
                    >
                      {message.text}
                    </div>
                  ))}
                </div>
                <form className="chat-form" onSubmit={handleChatSubmit}>
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(event) => setChatInput(event.target.value)}
                    placeholder="Ask a support question"
                    aria-label="Ask a support question"
                  />
                  <button type="submit">Send</button>
                </form>
              </>
            ) : (
              <p className="empty-state">Open chat to start a support conversation.</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#top">
            Equity Portal
          </a>
          <button className="mobile-menu-button" onClick={() => setMenuOpen((current) => !current)}>
            Menu
          </button>
          <nav className={`site-nav ${menuOpen ? 'open' : ''}`}>
            {navItems.map((item) => (
              <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <section id="investor-centre" className="content-section">
          <div className="container split-layout">
            <div className="section-copy">
              <p className="eyebrow">Investor Centre</p>
              <h1>Confidence and clarity for investors</h1>
              <p>
                Equity Portal brings together professional investor information with a clear,
                corporate experience designed to make essential resources easy to access.
              </p>
            </div>
            <div className="section-image-wrap">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
                alt="Business analytics displayed on technology screens"
              />
            </div>
          </div>
        </section>

        <section id="empshare" className="content-section alt-section">
          <div className="container split-layout reverse-layout">
            <div className="section-image-wrap">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
                alt="Employees collaborating in a professional meeting"
              />
            </div>
            <div className="section-copy">
              <p className="eyebrow">EmpShare / Employee Share</p>
              <h2>Support for employee share engagement</h2>
              <p>
                A simple, professional environment for employees to understand available support,
                review guidance, and access help materials when needed.
              </p>
            </div>
          </div>
        </section>

        <section id="about-us" className="content-section">
          <div className="container split-layout">
            <div className="section-copy">
              <p className="eyebrow">About Us</p>
              <h2>Focused on practical digital support</h2>
              <p>
                We deliver a clean financial-services experience with responsive access to
                information, guidance, and help resources in one connected application.
              </p>
            </div>
            <div className="section-image-wrap">
              <img
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80"
                alt="Business professionals collaborating together"
              />
            </div>
          </div>
        </section>

        <section id="technology-platforms" className="content-section alt-section">
          <div className="container">
            <div className="section-heading-block">
              <p className="eyebrow">Technology Platforms</p>
              <h2>Learn more about our technology platforms</h2>
            </div>
            <div className="platform-grid">
              <div className="platform-item">
                <h3>Experience</h3>
                <p>Professional, lightweight interfaces that keep essential actions easy to find.</p>
              </div>
              <div className="platform-item">
                <h3>Expertise</h3>
                <p>Clear support structures that help users access guidance without unnecessary steps.</p>
              </div>
              <div className="platform-item">
                <h3>Innovation</h3>
                <p>Integrated search, categorized help content, and responsive support interactions.</p>
              </div>
              <div className="platform-item">
                <h3>Technology</h3>
                <p>Modern React-based delivery designed for responsive and maintainable experiences.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="help-center" className="help-center-section">
          <div className="container">
            <div className="help-center-top">
              <div className="help-center-intro">
                <p className="eyebrow">SUPPORT</p>
                <h2>Help Center</h2>
                <p>
                  Find practical guidance, searchable support content, video tutorials and immediate
                  chat assistance.
                </p>
              </div>
              <div className="help-center-support-image">
                <img
                  src="https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=1200&q=80"
                  alt="Support professional working at a computer"
                />
              </div>
            </div>

            <form className="help-center-search" onSubmit={handleSearch}>
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search Help Center content"
                aria-label="Search Help Center content"
              />
              <button type="submit">Search</button>
            </form>

            <div className="help-center-layout">
              <aside className="help-sidebar">
                {helpCategories.map((category) => (
                  <button
                    key={category}
                    className={`help-nav-item ${selectedCategory === category && !submittedSearch.trim() ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedCategory(category);
                      setSubmittedSearch('');
                    }}
                  >
                    {category}
                  </button>
                ))}
              </aside>
              <div className="help-content">{renderHelpContent()}</div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <div className="footer-brand">Equity Portal</div>
            <p>Professional access to investor, employee share, technology, and support content.</p>
          </div>
          <div className="footer-links">
            <a href="#investor-centre">Investor Centre</a>
            <a href="#empshare">EmpShare</a>
            <a href="#about-us">About Us</a>
            <a href="#technology-platforms">Technology Platforms</a>
            <a href="#help-center">Help Center</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
