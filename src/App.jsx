import { useMemo, useState } from 'react';

const navItems = [
  { id: 'investor-centre', label: 'Investor Centre' },
  { id: 'empshare', label: 'EmpShare' },
  { id: 'about-us', label: 'About Us' },
  { id: 'technology-platforms', label: 'Technology Platforms' },
  { id: 'help-center', label: 'Help Center' }
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
      'Use the Equity Portal home experience to navigate to Investor Centre or EmpShare and review the support articles linked in the Help Center for account access guidance.'
  },
  {
    question: 'Where can I download my documents?',
    answer:
      'Documents and reference files are available from the Help Materials area, where downloadable guides are provided for offline use.'
  },
  {
    question: 'Can I get help without leaving the website?',
    answer:
      'Yes. The integrated chat assistant and embedded tutorials are available directly inside the Help Center so you can stay on the same page.'
  },
  {
    question: 'Is the Help Center available on mobile?',
    answer:
      'Yes. The Help Center layout is responsive and adapts to smaller screens for mobile access.'
  }
];

const articles = [
  {
    title: 'Access shareholder information',
    category: 'Getting Started',
    keywords: ['access', 'shareholder', 'information', 'login', 'account'],
    description: 'Find practical steps to view shareholder information and navigate support resources.'
  },
  {
    title: 'Employee share account access',
    category: 'Getting Started',
    keywords: ['employee', 'share', 'account', 'access', 'empshare'],
    description: 'Learn how to locate employee share information and the most relevant Help Center sections.'
  },
  {
    title: 'Download documents and reference files',
    category: 'Help Materials',
    keywords: ['download', 'documents', 'pdf', 'guide', 'materials'],
    description: 'Review downloadable help guides and PDF materials for offline support.'
  },
  {
    title: 'Watch help video tutorials',
    category: 'Video Tutorials',
    keywords: ['video', 'tutorials', 'watch', 'playback', 'training'],
    description: 'Play embedded video tutorials directly within the Help Center.'
  },
  {
    title: 'Use chat support for immediate help',
    category: 'Chat Support',
    keywords: ['chat', 'support', 'assistant', 'help', 'question'],
    description: 'Open the interactive chat assistant and receive immediate responses with article links.'
  },
  {
    title: 'Common support questions',
    category: 'FAQs',
    keywords: ['faq', 'questions', 'support', 'mobile', 'documents'],
    description: 'Browse frequently asked questions about access, documents and support options.'
  }
];

const howToGuides = [
  'Open the Help Center from the Home Page header or main support section.',
  'Use the search bar to locate help content by keyword.',
  'Switch categories from the left navigation to find the right support format.',
  'Use chat support when you need real-time answers without leaving the page.'
];

const troubleshootingItems = [
  'If search returns no direct matches, try broader terms such as access, documents, or support.',
  'If a video is unavailable in your browser, use the direct watch link provided beneath the tutorial.',
  'If a PDF does not open immediately, use the browser option to open in a new tab or download it directly.',
  'If you need immediate assistance, open Chat Support for a quick guided response.'
];

const materials = [
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

const videos = [
  {
    title: 'Video Tutorial 1',
    embed: 'https://www.youtube.com/embed/Mt0Y5X6885I',
    watch: 'https://youtu.be/Mt0Y5X6885I'
  },
  {
    title: 'Video Tutorial 2',
    embed: 'https://www.youtube.com/embed/6dSVaAaKWSQ',
    watch: 'https://www.youtube.com/watch?v=6dSVaAaKWSQ'
  },
  {
    title: 'Video Tutorial 3',
    embed: 'https://www.youtube.com/embed/8qaLG730bDw',
    watch: 'https://www.youtube.com/watch?v=8qaLG730bDw&t=20s&pp=ygUWbWFzaGFibGUgbW9ybmluZyB3aSBLS9IHCQkaDAGHKiGM7w%3D%3D'
  }
];

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="#top">Equity Portal</a>
        <button
          className="mobile-nav-toggle"
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <nav className={`primary-nav ${mobileOpen ? 'open' : ''}`}>
          {navItems.map((item) => (
            <a key={item.id} href={`#${item.id}`} onClick={() => setMobileOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

function SplitSection({ id, eyebrow, title, description, image, alt, reverse = false, cta }) {
  return (
    <section id={id} className="split-section section">
      <div className={`container split-grid ${reverse ? 'reverse' : ''}`}>
        <div className="split-copy">
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <p>{description}</p>
          {cta ? (
            <a className="text-link" href={cta.href}>
              {cta.label}
            </a>
          ) : null}
        </div>
        <div className="split-media">
          <img src={image} alt={alt} />
        </div>
      </div>
    </section>
  );
}

function TechnologyPlatforms() {
  const items = [
    {
      title: 'Experience',
      text: 'Simple support journeys designed to help users find answers quickly.'
    },
    {
      title: 'Expertise',
      text: 'Focused guidance across investor, employee share and help workflows.'
    },
    {
      title: 'Innovation',
      text: 'Integrated digital support with search, video and immediate chat assistance.'
    },
    {
      title: 'Technology',
      text: 'Lightweight responsive delivery aligned to a modern React application.'
    }
  ];

  return (
    <section id="technology-platforms" className="section tech-section">
      <div className="container">
        <p className="eyebrow">TECHNOLOGY PLATFORMS</p>
        <h2>Learn more about our technology platforms</h2>
        <div className="tech-grid">
          {items.map((item) => (
            <div className="tech-item" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection({ expandedFaq, onToggle }) {
  return (
    <div className="help-panel-content">
      <h3>Frequently Asked Questions</h3>
      <p className="help-panel-description">
        Browse common questions about the platform, access, documents and support options.
      </p>
      <div className="help-divider"></div>
      <div className="faq-list">
        {faqItems.map((item, index) => {
          const expanded = expandedFaq === index;
          return (
            <div className="faq-item" key={item.question}>
              <button className="faq-question" onClick={() => onToggle(index)}>
                <span>{item.question}</span>
                <span className="faq-icon" aria-hidden="true">{expanded ? '−' : '+'}</span>
              </button>
              {expanded ? <p className="faq-answer">{item.answer}</p> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SearchResults({ query, results }) {
  return (
    <div className="search-results" aria-live="polite">
      <h3>Search Results</h3>
      <p className="help-panel-description">
        {query
          ? `${results.length} result${results.length === 1 ? '' : 's'} for "${query}"`
          : 'Enter a keyword to search help articles, videos and materials.'}
      </p>
      <div className="help-divider"></div>
      {query && results.length === 0 ? (
        <p className="empty-state">No matching help content found. Try a broader keyword.</p>
      ) : null}
      <div className="search-results-list">
        {results.map((result) => (
          <div className="search-result-item" key={`${result.category}-${result.title}`}>
            <p className="search-result-category">{result.category}</p>
            <h4>{result.title}</h4>
            <p>{result.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function VideoTutorials() {
  return (
    <div className="help-panel-content">
      <h3>Video Tutorials</h3>
      <p className="help-panel-description">
        Play video tutorials directly within the Help Center with standard playback controls.
      </p>
      <div className="help-divider"></div>
      <div className="video-grid">
        {videos.map((video) => (
          <div className="video-item" key={video.title}>
            <div className="video-frame-wrap">
              <iframe
                src={video.embed}
                title={video.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <div className="video-meta">
              <h4>{video.title}</h4>
              <a href={video.watch} target="_blank" rel="noreferrer">Open in YouTube if unavailable</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HelpMaterials() {
  return (
    <div className="help-panel-content">
      <h3>Help Materials</h3>
      <p className="help-panel-description">
        View and download help materials including user guides and PDFs for offline access.
      </p>
      <div className="help-divider"></div>
      <div className="materials-list">
        {materials.map((material) => (
          <a className="material-link" href={material.url} target="_blank" rel="noreferrer" key={material.title}>
            <span>{material.title}</span>
            <span>Download</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function ChatSupport() {
  const [chatOpen, setChatOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: 'Hello. Ask a question about access, documents, videos, mobile support, or help materials.'
    }
  ]);

  const buildRecommendations = (text) => {
    const lower = text.toLowerCase();
    const recs = [];

    if (lower.includes('document') || lower.includes('pdf') || lower.includes('download')) {
      recs.push('Help Materials', 'Download documents and reference files');
    }
    if (lower.includes('video') || lower.includes('tutorial')) {
      recs.push('Video Tutorials', 'Watch help video tutorials');
    }
    if (lower.includes('access') || lower.includes('login') || lower.includes('account') || lower.includes('shareholder') || lower.includes('employee')) {
      recs.push('Getting Started', 'Access shareholder information', 'Employee share account access');
    }
    if (lower.includes('mobile') || lower.includes('faq') || lower.includes('question')) {
      recs.push('FAQs', 'Common support questions');
    }

    return Array.from(new Set(recs));
  };

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const recommendations = buildRecommendations(trimmed);
    const assistantText = recommendations.length
      ? `Recommended help resources: ${recommendations.join(' • ')}`
      : 'I can help with access, documents, video tutorials, FAQs, and support guidance. Try asking about a specific topic.';

    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: trimmed },
      { sender: 'assistant', text: assistantText }
    ]);
    setInput('');
  };

  return (
    <div className="help-panel-content help-center-chat">
      <h3>Chat Support</h3>
      <p className="help-panel-description">
        Activate an interactive chat assistant for immediate support and article recommendations.
      </p>
      <div className="help-divider"></div>
      {!chatOpen ? (
        <button className="button-primary" onClick={() => setChatOpen(true)}>
          Open Chat Assistant
        </button>
      ) : (
        <div className="chat-widget">
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div className={`chat-bubble ${message.sender}`} key={`${message.sender}-${index}`}>
                {message.text}
              </div>
            ))}
          </div>
          <div className="chat-input-row">
            <input
              type="text"
              value={input}
              placeholder="Ask about access, documents, videos or support"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendMessage();
              }}
            />
            <button className="button-primary" onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

function HelpCenter() {
  const [selectedCategory, setSelectedCategory] = useState('FAQs');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const normalized = searchQuery.toLowerCase();
    return articles.filter((article) => {
      const haystack = `${article.title} ${article.category} ${article.description} ${article.keywords.join(' ')}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [searchQuery]);

  const renderContent = () => {
    if (searchQuery.trim()) {
      return <SearchResults query={searchQuery} results={searchResults} />;
    }

    switch (selectedCategory) {
      case 'Getting Started':
        return (
          <div className="help-panel-content">
            <h3>Getting Started</h3>
            <p className="help-panel-description">
              Start here to access the integrated support experience directly from the Home Page.
            </p>
            <div className="help-divider"></div>
            <ul className="content-list">
              <li>Use the Help Center entry point from the Home Page header navigation.</li>
              <li>Browse categorized support content without leaving the current application.</li>
              <li>Use search, video tutorials, help materials and chat support in one place.</li>
            </ul>
          </div>
        );
      case 'FAQs':
        return <FAQSection expandedFaq={expandedFaq} onToggle={(index) => setExpandedFaq(expandedFaq === index ? null : index)} />;
      case 'How-To Guides':
        return (
          <div className="help-panel-content">
            <h3>How-To Guides</h3>
            <p className="help-panel-description">
              Follow straightforward steps to navigate support content and complete common tasks.
            </p>
            <div className="help-divider"></div>
            <ul className="content-list">
              {howToGuides.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        );
      case 'Video Tutorials':
        return <VideoTutorials />;
      case 'Help Materials':
        return <HelpMaterials />;
      case 'Troubleshooting':
        return (
          <div className="help-panel-content">
            <h3>Troubleshooting</h3>
            <p className="help-panel-description">
              Use these quick checks when content, downloads or support actions need clarification.
            </p>
            <div className="help-divider"></div>
            <ul className="content-list">
              {troubleshootingItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        );
      case 'Chat Support':
        return <ChatSupport />;
      default:
        return null;
    }
  };

  return (
    <section id="help-center" className="section help-center-section">
      <div className="container">
        <div className="help-center-top">
          <div className="help-intro-copy">
            <p className="eyebrow">SUPPORT</p>
            <h2>Help Center</h2>
            <p>
              Find practical guidance, searchable support content, video tutorials and immediate chat assistance.
            </p>
          </div>
          <div className="help-intro-image">
            <img
              src="https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=1200&q=80"
              alt="Support team collaboration"
            />
          </div>
        </div>

        <div className="help-center-search">
          <input
            type="text"
            value={searchInput}
            placeholder="Search Help Center content"
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setSearchQuery(searchInput.trim());
            }}
          />
          <button className="button-primary" onClick={() => setSearchQuery(searchInput.trim())}>Search</button>
        </div>

        <div className="help-center-layout">
          <aside className="help-sidebar">
            {helpCategories.map((category) => {
              const isActive = !searchQuery.trim() && selectedCategory === category;
              return (
                <button
                  key={category}
                  className={`help-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCategory(category);
                    setSearchQuery('');
                    setSearchInput('');
                  }}
                >
                  {category}
                </button>
              );
            })}
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
        <div>
          <p className="footer-brand">Equity Portal</p>
          <p className="footer-copy">Corporate support, investor access and employee share guidance in one experience.</p>
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
  );
}

export default function App() {
  return (
    <div id="top">
      <Header />
      <main>
        <SplitSection
          id="investor-centre"
          eyebrow="INVESTOR CENTRE"
          title="Investor Centre"
          description="Access investor-focused information through a clean, simple home experience designed for quick understanding and support discovery. The section introduces users to available resources and provides a direct path toward help content when needed."
          image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
          alt="Professional technology and analytics workspace"
          cta={{ href: '#help-center', label: 'Go to Help Center' }}
        />

        <SplitSection
          id="empshare"
          eyebrow="EMPSHARE / EMPLOYEE SHARE"
          title="Employee Share"
          description="Explore employee share support information with a responsive two-column layout that keeps key content visible and easy to navigate. This area aligns with the same corporate visual language used across the full application."
          image="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
          alt="Employees in a professional meeting"
          reverse
        />

        <SplitSection
          id="about-us"
          eyebrow="ABOUT US"
          title="About Us"
          description="Equity Portal presents a unified, minimal experience focused on investor, employee share and support content. The page structure is intentionally simple, responsive and designed for professional financial-services communication."
          image="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80"
          alt="Business professionals collaborating"
        />

        <TechnologyPlatforms />
        <HelpCenter />
      </main>
      <Footer />
    </div>
  );
}
