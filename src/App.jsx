import { useMemo, useState } from 'react';

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
    question: 'How do I access my shareholder or employee information?',
    answer:
      'Use the relevant Equity Portal section to review your available shareholder or employee share information and support content from a single responsive experience.'
  },
  {
    question: 'Where can I download my documents?',
    answer:
      'Open Help Materials in the Help Center to access downloadable guides and reference documents over secure HTTPS links.'
  },
  {
    question: 'Can I get help without leaving the website?',
    answer:
      'Yes. You can use searchable help content, embedded video tutorials, FAQs, and the integrated chat assistant directly inside the Help Center.'
  },
  {
    question: 'Is the Help Center available on mobile?',
    answer:
      'Yes. The Help Center is optimized for smartphones and tablets so navigation, content, and support interactions remain usable without truncation.'
  }
];

const searchableContent = [
  {
    category: 'Getting Started',
    title: 'Accessing support categories',
    text: 'Browse practical support content using the Help Center category navigation and responsive layout.'
  },
  {
    category: 'FAQs',
    title: 'Frequently Asked Questions',
    text: 'Browse common questions about the platform, access, documents and support options.'
  },
  {
    category: 'How-To Guides',
    title: 'Using portal guidance',
    text: 'Follow step-by-step guidance for finding platform help content and support pathways.'
  },
  {
    category: 'Video Tutorials',
    title: 'Embedded video tutorial playback',
    text: 'Play video tutorials directly within the Help Center without leaving the site.'
  },
  {
    category: 'Help Materials',
    title: 'Downloadable help materials',
    text: 'Download user guides, PDFs, and training documents for offline troubleshooting and learning.'
  },
  {
    category: 'Troubleshooting',
    title: 'Troubleshooting support',
    text: 'Find practical troubleshooting guidance for access, documents, and support usage.'
  },
  {
    category: 'Chat Support',
    title: 'Interactive chat assistant',
    text: 'Receive immediate responses and relevant help article suggestions based on your query.'
  }
];

const materials = [
  {
    title: 'Employee Share Document Guide',
    href: 'https://drive.google.com/file/d/1HqLeSEbVZz3JWwxSX5TgsJd7Q0x3xdVk/view?usp=drive_link'
  },
  {
    title: 'Employee Share Vesting Guide',
    href: 'https://drive.google.com/file/d/1Uc5E21E6CIummBqCDs5zYk2mLbZ_ur5y/view?usp=drive_link'
  },
  {
    title: 'Employee Quick Reference',
    href: 'https://drive.google.com/file/d/1ErTOSOIThyzHUCLz8QilIwZ3u5A6ENk9/view?usp=drive_link'
  }
];

const videos = [
  {
    title: 'Help Center Overview',
    embed: 'https://www.youtube.com/embed/Mt0Y5X6885I'
  },
  {
    title: 'Support Navigation Tutorial',
    embed: 'https://www.youtube.com/embed/6dSVaAaKWSQ'
  },
  {
    title: 'Quick Learning Session',
    embed: 'https://www.youtube.com/embed/8qaLG730bDw?start=20'
  }
];

function Header({ onNavigate, menuOpen, setMenuOpen }) {
  const links = [
    { label: 'Investor Centre', id: 'investor-centre' },
    { label: 'EmpShare', id: 'empshare' },
    { label: 'About Us', id: 'about-us' },
    { label: 'Technology Platforms', id: 'technology-platforms' },
    { label: 'Help Center', id: 'help-center' }
  ];

  return (
    <header className="site-header">
      <div className="container header-inner">
        <button
          className="mobile-menu-button"
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          ☰
        </button>
        <a
          href="#top"
          className="brand"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('top');
            setMenuOpen(false);
          }}
        >
          Equity Portal
        </a>
        <nav className={`primary-nav ${menuOpen ? 'open' : ''}`} aria-label="Primary">
          {links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(link.id);
                setMenuOpen(false);
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

function HeroSection({ id, title, text, image, imageAlt, reverse = false }) {
  return (
    <section id={id} className="content-section">
      <div className={`container split-layout ${reverse ? 'reverse' : ''}`}>
        <div className="split-copy">
          <p className="eyebrow">EQUITY PORTAL</p>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <div className="split-media">
          <img src={image} alt={imageAlt} />
        </div>
      </div>
    </section>
  );
}

function TechnologyPlatforms() {
  const items = [
    {
      title: 'Experience',
      text: 'Simple, accessible support experiences designed for investors and employees across devices.'
    },
    {
      title: 'Expertise',
      text: 'Structured guidance that helps users find answers, materials, and support quickly.'
    },
    {
      title: 'Innovation',
      text: 'Modern help interactions including search, video learning, and immediate chat assistance.'
    },
    {
      title: 'Technology',
      text: 'A lightweight React application built for responsive, dependable content delivery.'
    }
  ];

  return (
    <section id="technology-platforms" className="content-section alt-section">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">PLATFORMS</p>
          <h2>Learn more about our technology platforms</h2>
        </div>
        <div className="platform-grid">
          {items.map((item) => (
            <div key={item.title} className="platform-item">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HelpCenter() {
  const [activeCategory, setActiveCategory] = useState('FAQs');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedTerm, setSubmittedTerm] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello. I can help with search, FAQs, videos, downloadable materials, and troubleshooting guidance.'
    }
  ]);

  const searchResults = useMemo(() => {
    const query = submittedTerm.trim().toLowerCase();
    if (!query) return [];

    const faqResults = faqItems
      .filter(
        (item) =>
          item.question.toLowerCase().includes(query) || item.answer.toLowerCase().includes(query)
      )
      .map((item) => ({ category: 'FAQs', title: item.question, text: item.answer }));

    const materialResults = materials
      .filter((item) => item.title.toLowerCase().includes(query))
      .map((item) => ({
        category: 'Help Materials',
        title: item.title,
        text: 'Downloadable help material available through secure document link.'
      }));

    const videoResults = videos
      .filter((item) => item.title.toLowerCase().includes(query))
      .map((item) => ({
        category: 'Video Tutorials',
        title: item.title,
        text: 'Embedded video tutorial available within the Help Center.'
      }));

    return [...searchableContent, ...faqResults, ...materialResults, ...videoResults].filter(
      (entry) =>
        entry.category.toLowerCase().includes(query) ||
        entry.title.toLowerCase().includes(query) ||
        entry.text.toLowerCase().includes(query)
    );
  }, [submittedTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSubmittedTerm(searchTerm);
  };

  const handleChatSend = (e) => {
    e.preventDefault();
    const message = chatInput.trim();
    if (!message) return;

    const lower = message.toLowerCase();
    const suggestions = [];
    if (lower.includes('video')) suggestions.push('Video Tutorials');
    if (lower.includes('download') || lower.includes('pdf') || lower.includes('document')) suggestions.push('Help Materials');
    if (lower.includes('faq') || lower.includes('question')) suggestions.push('FAQs');
    if (lower.includes('trouble') || lower.includes('issue') || lower.includes('problem')) suggestions.push('Troubleshooting');
    if (lower.includes('start') || lower.includes('access')) suggestions.push('Getting Started');
    if (suggestions.length === 0) suggestions.push('FAQs', 'Getting Started');

    const assistantResponse = `Immediate support: review ${[...new Set(suggestions)].join(', ')} for relevant help article recommendations related to "${message}".`;

    setChatMessages((prev) => [
      ...prev,
      { role: 'user', text: message },
      { role: 'assistant', text: assistantResponse }
    ]);
    setChatOpen(true);
    setActiveCategory('Chat Support');
    setChatInput('');
  };

  const renderContent = () => {
    if (submittedTerm.trim()) {
      return (
        <div className="help-panel">
          <h3>Search Results</h3>
          <p className="panel-description">
            Results for <strong>{submittedTerm}</strong>
          </p>
          <div className="panel-divider" />
          {searchResults.length > 0 ? (
            <div className="search-results">
              {searchResults.map((result, index) => (
                <div className="search-result" key={`${result.category}-${result.title}-${index}`}>
                  <span className="result-category">{result.category}</span>
                  <h4>{result.title}</h4>
                  <p>{result.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No matching help content was found. Try another keyword or browse the categories.</p>
            </div>
          )}
        </div>
      );
    }

    if (activeCategory === 'FAQs') {
      return (
        <div className="help-panel">
          <h3>Frequently Asked Questions</h3>
          <p className="panel-description">
            Browse common questions about the platform, access, documents and support options.
          </p>
          <div className="panel-divider" />
          <div className="faq-list">
            {faqItems.map((item, index) => {
              const open = openFaqIndex === index;
              return (
                <div className="faq-item" key={item.question}>
                  <button
                    type="button"
                    className="faq-button"
                    onClick={() => setOpenFaqIndex(open ? null : index)}
                    aria-expanded={open}
                  >
                    <span>{item.question}</span>
                    <span className="faq-icon" aria-hidden="true">
                      {open ? '−' : '+'}
                    </span>
                  </button>
                  {open && <p className="faq-answer">{item.answer}</p>}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (activeCategory === 'Video Tutorials') {
      return (
        <div className="help-panel help-center-video">
          <h3>Video Tutorials</h3>
          <p className="panel-description">
            Play tutorial content directly within the Help Center using accessible embedded players.
          </p>
          <div className="panel-divider" />
          <div className="video-grid">
            {videos.map((video) => (
              <div className="video-item" key={video.title}>
                <h4>{video.title}</h4>
                <div className="video-frame">
                  <iframe
                    src={video.embed}
                    title={video.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeCategory === 'Help Materials') {
      return (
        <div className="help-panel help-center-materials">
          <h3>Help Materials</h3>
          <p className="panel-description">
            Download user guides, PDFs, and training documents for offline reference and learning.
          </p>
          <div className="panel-divider" />
          <div className="materials-list">
            {materials.map((item) => (
              <a
                key={item.title}
                className="material-link"
                href={item.href}
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
    }

    if (activeCategory === 'Chat Support') {
      return (
        <div className="help-panel help-center-chat">
          <div className="chat-header-row">
            <div>
              <h3>Chat Support</h3>
              <p className="panel-description">
                Receive immediate responses with relevant help article recommendations.
              </p>
            </div>
            <button type="button" className="secondary-button" onClick={() => setChatOpen((prev) => !prev)}>
              {chatOpen ? 'Hide Chat' : 'Open Chat'}
            </button>
          </div>
          <div className="panel-divider" />
          {chatOpen ? (
            <div className="chat-window" aria-live="polite">
              <div className="chat-messages">
                {chatMessages.map((message, index) => (
                  <div key={`${message.role}-${index}`} className={`chat-message ${message.role}`}>
                    {message.text}
                  </div>
                ))}
              </div>
              <form className="chat-form" onSubmit={handleChatSend}>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask for help or article suggestions"
                  aria-label="Chat support input"
                />
                <button type="submit">Send</button>
              </form>
            </div>
          ) : (
            <div className="empty-state">
              <p>Activate the chat assistant to begin real-time support.</p>
            </div>
          )}
        </div>
      );
    }

    if (activeCategory === 'Getting Started') {
      return (
        <div className="help-panel">
          <h3>Getting Started</h3>
          <p className="panel-description">
            Start with the Help Center search, category navigation, and support content sections to find guidance quickly.
          </p>
        </div>
      );
    }

    if (activeCategory === 'How-To Guides') {
      return (
        <div className="help-panel">
          <h3>How-To Guides</h3>
          <p className="panel-description">
            Use this section to review practical support guidance for navigating the platform and finding help resources.
          </p>
        </div>
      );
    }

    if (activeCategory === 'Troubleshooting') {
      return (
        <div className="help-panel">
          <h3>Troubleshooting</h3>
          <p className="panel-description">
            Review troubleshooting guidance for access issues, document support, and general Help Center usage.
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <section id="help-center" className="help-center-section">
      <div className="container help-center">
        <div className="help-intro">
          <p className="eyebrow">SUPPORT</p>
          <h2>Help Center</h2>
          <p>
            Find practical guidance, searchable support content, video tutorials and immediate chat assistance.
          </p>
        </div>

        <form className="help-center-search" onSubmit={handleSearch}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Help Center content"
            aria-label="Search Help Center content"
          />
          <button type="submit">Search</button>
        </form>

        <div className="help-layout">
          <aside className="help-sidebar" aria-label="Help Center categories">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                className={`sidebar-item ${activeCategory === item && !submittedTerm ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory(item);
                  setSubmittedTerm('');
                }}
              >
                {item}
              </button>
            ))}
          </aside>

          <div className="help-main">{renderContent()}</div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>Equity Portal</p>
        <p>Professional support experience for investors and employee share participants.</p>
      </div>
    </footer>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigate = (id) => {
    const target = id === 'top' ? document.body : document.getElementById(id);
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="app-shell" id="top">
      <Header onNavigate={handleNavigate} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main>
        <HeroSection
          id="investor-centre"
          title="Investor Centre"
          text="Access a clean, professional investor-focused experience with straightforward information pathways and responsive support access."
          image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
          imageAlt="Business analytics displayed on a monitor"
        />

        <HeroSection
          id="empshare"
          title="EmpShare / Employee Share"
          text="Support employee share participants with a spacious, easy-to-navigate experience that aligns with the broader Equity Portal design language."
          image="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
          imageAlt="Employees collaborating in a meeting"
          reverse
        />

        <HeroSection
          id="about-us"
          title="About Us"
          text="We deliver a corporate financial-services style experience focused on clarity, trust, and accessible support content for users across devices."
          image="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80"
          imageAlt="Business professionals working together"
        />

        <TechnologyPlatforms />
        <HelpCenter />
      </main>

      <Footer />
    </div>
  );
}
