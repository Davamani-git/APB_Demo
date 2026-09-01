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

const faqs = [
  {
    question: 'How do I access my shareholder or employee information?',
    answer: 'Open the relevant Equity Portal area from the home page and review the available account, holding, and participation information presented for that experience.'
  },
  {
    question: 'Where can I download my documents?',
    answer: 'Go to Help Materials in the Help Center to open the available reference documents and downloadable guides over secure HTTPS links.'
  },
  {
    question: 'Can I get help without leaving the website?',
    answer: 'Yes. Use Chat Support for immediate assistance and article suggestions directly within the same Help Center experience.'
  },
  {
    question: 'Is the Help Center available on mobile?',
    answer: 'Yes. The Help Center is fully responsive so categories, content, search, downloads, and support interactions remain usable on mobile devices.'
  }
];

const videos = [
  {
    title: 'Platform Overview',
    embed: 'https://www.youtube.com/embed/Mt0Y5X6885I'
  },
  {
    title: 'Using Key Features',
    embed: 'https://www.youtube.com/embed/6dSVaAaKWSQ'
  },
  {
    title: 'Support Walkthrough',
    embed: 'https://www.youtube.com/embed/8qaLG730bDw'
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

const searchableItems = [
  ...faqs.map((item) => ({
    type: 'FAQ',
    title: item.question,
    description: item.answer,
    category: 'FAQs'
  })),
  ...videos.map((item) => ({
    type: 'Video',
    title: item.title,
    description: 'Watch an embedded tutorial directly in the Help Center.',
    category: 'Video Tutorials'
  })),
  ...materials.map((item) => ({
    type: 'Material',
    title: item.title,
    description: 'Open or download a help reference document.',
    category: 'Help Materials'
  })),
  {
    type: 'Guide',
    title: 'Getting started with the Help Center',
    description: 'Use categories, search, videos, downloads, and chat to find assistance quickly.',
    category: 'Getting Started'
  },
  {
    type: 'Guide',
    title: 'Use category navigation',
    description: 'Browse Getting Started, FAQs, How-To Guides, Video Tutorials, Help Materials, Troubleshooting, and Chat Support.',
    category: 'How-To Guides'
  },
  {
    type: 'Support',
    title: 'Troubleshoot access and content questions',
    description: 'Review common access, playback, and document guidance before using live support.',
    category: 'Troubleshooting'
  },
  {
    type: 'Support',
    title: 'Chat for immediate assistance',
    description: 'Use chat to receive immediate responses and relevant article suggestions.',
    category: 'Chat Support'
  }
];

function Header({ mobileOpen, setMobileOpen, scrollToHelp }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="#top" className="brand">Equity Portal</a>
        <button
          className="mobile-nav-toggle"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <nav className={`main-nav ${mobileOpen ? 'open' : ''}`}>
          <a href="#investor-centre" onClick={() => setMobileOpen(false)}>Investor Centre</a>
          <a href="#emp-share" onClick={() => setMobileOpen(false)}>EmpShare</a>
          <a href="#about-us" onClick={() => setMobileOpen(false)}>About Us</a>
          <a href="#technology-platforms" onClick={() => setMobileOpen(false)}>Technology Platforms</a>
          <button
            type="button"
            className="nav-link-button"
            onClick={() => {
              setMobileOpen(false);
              scrollToHelp();
            }}
          >
            Help Center
          </button>
        </nav>
      </div>
    </header>
  );
}

function TwoColumnSection({ id, title, text, image, imageAlt, reverse = false, sectionLabel }) {
  return (
    <section id={id} className="section">
      <div className={`container split-section ${reverse ? 'reverse' : ''}`}>
        <div className="split-copy">
          {sectionLabel ? <div className="section-label">{sectionLabel}</div> : null}
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
  const items = ['Experience', 'Expertise', 'Innovation', 'Technology'];
  return (
    <section id="technology-platforms" className="section section-alt">
      <div className="container">
        <h2>Learn more about our technology platforms</h2>
        <div className="platform-grid">
          {items.map((item) => (
            <div key={item} className="platform-item">
              <div className="platform-accent"></div>
              <h3>{item}</h3>
              <p>Focused platform support and guidance aligned to the Equity Portal experience.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQView({ openFaqIndex, setOpenFaqIndex }) {
  return (
    <div>
      <h3>Frequently Asked Questions</h3>
      <p className="help-description">Browse common questions about the platform, access, documents and support options.</p>
      <div className="content-divider"></div>
      <div className="faq-list">
        {faqs.map((item, index) => {
          const isOpen = openFaqIndex === index;
          return (
            <div key={item.question} className="faq-item">
              <button
                type="button"
                className="faq-question"
                onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
              >
                <span>{item.question}</span>
                <span className="faq-icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen ? <p className="faq-answer">{item.answer}</p> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function VideoTutorialsView() {
  return (
    <div className="help-center-video">
      <h3>Video Tutorials</h3>
      <p className="help-description">Play tutorials directly within the Help Center using embedded video players with accessible controls.</p>
      <div className="content-divider"></div>
      <div className="video-grid">
        {videos.map((video) => (
          <div key={video.title} className="video-item">
            <div className="video-frame-wrap">
              <iframe
                src={video.embed}
                title={video.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
            <h4>{video.title}</h4>
          </div>
        ))}
      </div>
    </div>
  );
}

function HelpMaterialsView() {
  return (
    <div className="help-center-materials">
      <h3>Help Materials</h3>
      <p className="help-description">Access downloadable user guides, PDFs, and training documents for offline reference.</p>
      <div className="content-divider"></div>
      <div className="materials-list">
        {materials.map((item) => (
          <a key={item.title} className="material-link" href={item.href} target="_blank" rel="noreferrer">
            <span>{item.title}</span>
            <span>Open</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function ChatSupportView({ messages, input, setInput, onSend }) {
  return (
    <div className="help-center-chat">
      <h3>Chat Support</h3>
      <p className="help-description">Get immediate assistance and relevant help article recommendations based on your query.</p>
      <div className="content-divider"></div>
      <div className="chat-window" aria-live="polite">
        {messages.map((message) => (
          <div key={message.id} className={`chat-message ${message.role}`}>
            <div className="chat-bubble">{message.text}</div>
          </div>
        ))}
      </div>
      <form className="chat-form" onSubmit={onSend}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for help"
          aria-label="Ask for help"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

function SearchResults({ results, onCategorySelect }) {
  return (
    <div>
      <h3>Search Results</h3>
      <p className="help-description">Relevant help articles, videos, FAQs, and downloadable materials are listed below.</p>
      <div className="content-divider"></div>
      {results.length ? (
        <div className="search-results">
          {results.map((result) => (
            <button
              key={`${result.category}-${result.title}`}
              type="button"
              className="search-result"
              onClick={() => onCategorySelect(result.category)}
            >
              <div>
                <strong>{result.title}</strong>
                <p>{result.description}</p>
              </div>
              <span>{result.type}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="empty-state">No matching help content found. Try another keyword.</div>
      )}
    </div>
  );
}

function DefaultContent({ activeCategory }) {
  const contentMap = {
    'Getting Started': {
      title: 'Getting Started',
      description: 'Use the Help Center categories, search, videos, downloadable materials, and chat support to quickly find the information you need.'
    },
    'How-To Guides': {
      title: 'How-To Guides',
      description: 'Browse guided support topics and use the search feature to jump directly to relevant guidance across the Help Center.'
    },
    Troubleshooting: {
      title: 'Troubleshooting',
      description: 'Review support guidance for access, documents, embedded content, and help interactions before escalating to live support.'
    }
  };
  const current = contentMap[activeCategory];
  return (
    <div>
      <h3>{current.title}</h3>
      <p className="help-description">{current.description}</p>
      <div className="content-divider"></div>
      <img
        className="support-image"
        src="https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=1200&q=80"
        alt="Support professionals collaborating"
      />
    </div>
  );
}

function HelpCenter() {
  const [activeCategory, setActiveCategory] = useState('FAQs');
  const [query, setQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      text: 'Hello. I can help with access, documents, videos, FAQs, and support guidance.'
    }
  ]);

  const results = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return [];
    return searchableItems.filter((item) => {
      const haystack = `${item.title} ${item.description} ${item.category} ${item.type}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(query.trim());
  };

  const handleSend = (e) => {
    e.preventDefault();
    const trimmed = chatInput.trim();
    if (!trimmed) return;

    const lower = trimmed.toLowerCase();
    let recommendation = 'Recommended articles: Frequently Asked Questions, Help Materials, and Troubleshooting.';

    if (lower.includes('video')) {
      recommendation = 'Recommended articles: Video Tutorials and Getting Started.';
    } else if (lower.includes('document') || lower.includes('pdf') || lower.includes('download')) {
      recommendation = 'Recommended articles: Help Materials and Frequently Asked Questions.';
    } else if (lower.includes('access') || lower.includes('login') || lower.includes('account')) {
      recommendation = 'Recommended articles: Frequently Asked Questions and Troubleshooting.';
    } else if (lower.includes('mobile')) {
      recommendation = 'Recommended articles: Frequently Asked Questions and Getting Started.';
    }

    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, role: 'user', text: trimmed },
      {
        id: prev.length + 2,
        role: 'assistant',
        text: `Immediate response: I can help with that. ${recommendation}`
      }
    ]);
    setChatInput('');
  };

  const renderContent = () => {
    if (searchTerm) {
      return <SearchResults results={results} onCategorySelect={setActiveCategory} />;
    }
    if (activeCategory === 'FAQs') {
      return <FAQView openFaqIndex={openFaqIndex} setOpenFaqIndex={setOpenFaqIndex} />;
    }
    if (activeCategory === 'Video Tutorials') {
      return <VideoTutorialsView />;
    }
    if (activeCategory === 'Help Materials') {
      return <HelpMaterialsView />;
    }
    if (activeCategory === 'Chat Support') {
      return <ChatSupportView messages={messages} input={chatInput} setInput={setChatInput} onSend={handleSend} />;
    }
    return <DefaultContent activeCategory={activeCategory} />;
  };

  return (
    <section id="help-center" className="section help-center-section">
      <div className="container help-center">
        <div className="help-center-intro">
          <div className="section-label">SUPPORT</div>
          <h2>Help Center</h2>
          <p>Find practical guidance, searchable support content, video tutorials and immediate chat assistance.</p>
        </div>

        <form className="help-center-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search Help Center content"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search Help Center content"
          />
          <button type="submit">Search</button>
        </form>

        <div className="help-center-layout">
          <aside className="help-sidebar" aria-label="Help Center category navigation">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`help-nav-item ${activeCategory === category && !searchTerm ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory(category);
                  setSearchTerm('');
                  setQuery('');
                }}
              >
                {category}
              </button>
            ))}
          </aside>

          <div className="help-main-content">{renderContent()}</div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>© 2026 Equity Portal</div>
        <div>Professional shareholder and employee share services</div>
      </div>
    </footer>
  );
}

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollToHelp = () => {
    const element = document.getElementById('help-center');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div id="top">
      <Header mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} scrollToHelp={scrollToHelp} />
      <main>
        <TwoColumnSection
          id="investor-centre"
          sectionLabel="INVESTOR CENTRE"
          title="Investor Centre"
          text="Access a clear and professional investor experience with straightforward information presentation, practical guidance, and responsive support pathways aligned to corporate financial-services expectations."
          image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
          imageAlt="Investor technology dashboard"
        />
        <TwoColumnSection
          id="emp-share"
          sectionLabel="EMPLOYEE SHARE"
          title="EmpShare / Employee Share"
          text="Support employee share participants with a polished experience that keeps key information accessible, easy to understand, and consistent across desktop, tablet, and mobile devices."
          image="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
          imageAlt="Employees in collaboration meeting"
          reverse
        />
        <TwoColumnSection
          id="about-us"
          sectionLabel="ABOUT US"
          title="About Us"
          text="We deliver a professional, modern portal experience focused on clarity, trusted communication, and reliable digital support for investor and employee-share audiences."
          image="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80"
          imageAlt="Business professionals in discussion"
        />
        <TechnologyPlatforms />
        <HelpCenter />
      </main>
      <Footer />
    </div>
  );
}
