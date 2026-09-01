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
    answer: 'Open the relevant Equity Portal service area and review your account information, holdings and employee share details from the available support guidance.'
  },
  {
    question: 'Where can I download my documents?',
    answer: 'Use the Help Materials section to open downloadable reference documents and guides for common employee share topics.'
  },
  {
    question: 'Can I get help without leaving the website?',
    answer: 'Yes. The Help Center includes search, categorized guidance, embedded video tutorials and an interactive chat assistant within the same application.'
  },
  {
    question: 'Is the Help Center available on mobile?',
    answer: 'Yes. The Help Center is responsive and supports mobile browsing, navigation and content access.'
  }
];

const articleData = {
  'Getting Started': [
    'Create your first Help Center workflow',
    'Navigate the Equity Portal home sections',
    'Understand shareholder and employee support areas'
  ],
  FAQs: faqItems.map((item) => item.question),
  'How-To Guides': [
    'How to search support content efficiently',
    'How to find category-based assistance',
    'How to use the chat assistant for quick answers'
  ],
  'Video Tutorials': [
    'Platform overview tutorial',
    'Employee share support walkthrough',
    'Guided help experience video'
  ],
  'Help Materials': [
    'Employee Share Document Guide',
    'Employee Share Vesting Guide',
    'Employee Quick Reference'
  ],
  Troubleshooting: [
    'Resolve sign-in and access questions',
    'Fix common mobile browsing issues',
    'Find next steps when content is unavailable'
  ],
  'Chat Support': [
    'Ask for article recommendations',
    'Receive immediate automated answers',
    'Open guided support without leaving the site'
  ]
};

const searchableIndex = [
  ...categories.map((category) => ({ type: 'Category', title: category })),
  ...Object.entries(articleData).flatMap(([category, items]) =>
    items.map((title) => ({ type: category, title }))
  )
];

const youtubeEmbeds = [
  {
    title: 'Video Tutorial 1',
    embed: 'https://www.youtube.com/embed/Mt0Y5X6885I'
  },
  {
    title: 'Video Tutorial 2',
    embed: 'https://www.youtube.com/embed/6dSVaAaKWSQ'
  },
  {
    title: 'Video Tutorial 3',
    embed: 'https://www.youtube.com/embed/8qaLG730bDw'
  }
];

const pdfLinks = [
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

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="#top">Equity Portal</a>
        <button
          className="mobile-nav-toggle"
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setMobileOpen((value) => !value)}
        >
          ☰
        </button>
        <nav className={`primary-nav ${mobileOpen ? 'open' : ''}`}>
          <a href="#investor-centre" onClick={() => setMobileOpen(false)}>Investor Centre</a>
          <a href="#empshare" onClick={() => setMobileOpen(false)}>EmpShare</a>
          <a href="#about-us" onClick={() => setMobileOpen(false)}>About Us</a>
          <a href="#technology-platforms" onClick={() => setMobileOpen(false)}>Technology Platforms</a>
          <a href="#help-center" onClick={() => setMobileOpen(false)}>Help Center</a>
        </nav>
      </div>
    </header>
  );
}

function SplitSection({ id, title, text, image, imageAlt, reverse = false }) {
  return (
    <section id={id} className="split-section section">
      <div className={`container split-grid ${reverse ? 'reverse' : ''}`}>
        <div className="split-copy">
          <p className="eyebrow">Equity Portal</p>
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
    <section id="technology-platforms" className="section technology-section">
      <div className="container">
        <p className="eyebrow">Platforms</p>
        <h2>Learn more about our technology platforms</h2>
        <div className="technology-grid">
          {items.map((item) => (
            <div className="technology-column" key={item}>
              <span className="technology-accent" />
              <h3>{item}</h3>
              <p>
                Focused support content and platform guidance designed to help customers access the right information quickly.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HelpCenter() {
  const [selectedCategory, setSelectedCategory] = useState('Getting Started');
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');
  const [openFaqs, setOpenFaqs] = useState({});
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  const searchResults = useMemo(() => {
    const query = submittedSearch.trim().toLowerCase();
    if (!query) return [];
    return searchableIndex.filter((item) => item.title.toLowerCase().includes(query));
  }, [submittedSearch]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSubmittedSearch(searchTerm);
  };

  const toggleFaq = (question) => {
    setOpenFaqs((current) => ({
      ...current,
      [question]: !current[question]
    }));
  };

  const getChatResponse = (message) => {
    const lower = message.toLowerCase();
    if (lower.includes('document') || lower.includes('pdf') || lower.includes('guide')) {
      return {
        text: 'Relevant help articles: Employee Share Document Guide, Employee Share Vesting Guide, Employee Quick Reference.',
        links: pdfLinks.map((item) => ({ title: item.title, url: item.url }))
      };
    }
    if (lower.includes('video') || lower.includes('tutorial')) {
      return {
        text: 'Relevant help articles: Platform overview tutorial, Employee share support walkthrough, Guided help experience video.',
        links: youtubeEmbeds.map((item, index) => ({ title: item.title, url: `#video-${index + 1}` }))
      };
    }
    if (lower.includes('access') || lower.includes('login') || lower.includes('shareholder') || lower.includes('employee')) {
      return {
        text: 'Relevant help articles: How do I access my shareholder or employee information?, Resolve sign-in and access questions, Navigate the Equity Portal home sections.',
        links: [
          { title: 'How do I access my shareholder or employee information?', url: '#help-center' },
          { title: 'Resolve sign-in and access questions', url: '#help-center' },
          { title: 'Navigate the Equity Portal home sections', url: '#help-center' }
        ]
      };
    }
    return {
      text: 'Relevant help articles: Create your first Help Center workflow, How to search support content efficiently, Ask for article recommendations.',
      links: [
        { title: 'Create your first Help Center workflow', url: '#help-center' },
        { title: 'How to search support content efficiently', url: '#help-center' },
        { title: 'Ask for article recommendations', url: '#help-center' }
      ]
    };
  };

  const sendChatMessage = (event) => {
    event.preventDefault();
    const trimmed = chatInput.trim();
    if (!trimmed) return;
    const userMessage = { sender: 'user', text: trimmed };
    const response = getChatResponse(trimmed);
    const assistantMessage = { sender: 'assistant', text: response.text, links: response.links };
    setChatMessages((current) => [...current, userMessage, assistantMessage]);
    setChatInput('');
  };

  const renderDefaultContent = () => {
    if (selectedCategory === 'Getting Started') {
      return (
        <div className="help-panel-content">
          <h3>Getting Started</h3>
          <p>Browse foundational guidance to help you begin using Equity Portal support features and locate information quickly.</p>
          <div className="article-list">
            {articleData['Getting Started'].map((item) => (
              <div className="article-row" key={item}>{item}</div>
            ))}
          </div>
        </div>
      );
    }

    if (selectedCategory === 'FAQs') {
      return (
        <div className="help-panel-content">
          <h3>Frequently Asked Questions</h3>
          <p>Browse common questions about the platform, access, documents and support options.</p>
          <div className="section-divider" />
          <div className="faq-list">
            {faqItems.map((item) => {
              const open = !!openFaqs[item.question];
              return (
                <div className="faq-item" key={item.question}>
                  <button className="faq-question" type="button" onClick={() => toggleFaq(item.question)}>
                    <span>{item.question}</span>
                    <span className="faq-toggle" aria-hidden="true">{open ? '−' : '+'}</span>
                  </button>
                  {open ? <div className="faq-answer">{item.answer}</div> : null}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (selectedCategory === 'How-To Guides') {
      return (
        <div className="help-panel-content">
          <h3>How-To Guides</h3>
          <p>Step-by-step guidance for common support tasks and navigation actions.</p>
          <div className="article-list">
            {articleData['How-To Guides'].map((item) => (
              <div className="article-row" key={item}>{item}</div>
            ))}
          </div>
        </div>
      );
    }

    if (selectedCategory === 'Video Tutorials') {
      return (
        <div className="help-panel-content help-center-video">
          <h3>Video Tutorials</h3>
          <p>Play embedded tutorials directly within the Help Center using available playback controls.</p>
          <div className="video-grid">
            {youtubeEmbeds.map((video, index) => (
              <div className="video-item" key={video.title} id={`video-${index + 1}`}>
                <h4>{video.title}</h4>
                <div className="video-frame-wrap">
                  <iframe
                    src={video.embed}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (selectedCategory === 'Help Materials') {
      return (
        <div className="help-panel-content help-center-materials">
          <h3>Help Materials</h3>
          <p>Open practical reference files and support documents relevant to employee share topics.</p>
          <div className="materials-list">
            {pdfLinks.map((item) => (
              <a className="material-link" key={item.title} href={item.url} target="_blank" rel="noreferrer">
                {item.title}
              </a>
            ))}
          </div>
        </div>
      );
    }

    if (selectedCategory === 'Troubleshooting') {
      return (
        <div className="help-panel-content">
          <h3>Troubleshooting</h3>
          <p>Review practical solutions for common issues involving access, content discovery and mobile use.</p>
          <div className="article-list">
            {articleData.Troubleshooting.map((item) => (
              <div className="article-row" key={item}>{item}</div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="help-panel-content help-center-chat">
        <h3>Chat Support</h3>
        <p>Activate the interactive chat assistant to send messages and receive immediate automated answers with article recommendations.</p>
        <button className="chat-activate" type="button" onClick={() => setChatOpen(true)}>
          Open Chat Assistant
        </button>
        {chatOpen ? (
          <div className="chat-widget">
            <div className="chat-messages">
              {chatMessages.length === 0 ? (
                <div className="chat-placeholder">Ask a question about access, documents, tutorials or support.</div>
              ) : null}
              {chatMessages.map((message, index) => (
                <div key={`${message.sender}-${index}`} className={`chat-message ${message.sender}`}>
                  <p>{message.text}</p>
                  {message.links ? (
                    <div className="chat-links">
                      {message.links.map((link) => (
                        <a key={link.title} href={link.url} target={link.url.startsWith('http') ? '_blank' : undefined} rel={link.url.startsWith('http') ? 'noreferrer' : undefined}>
                          {link.title}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
            <form className="chat-form" onSubmit={sendChatMessage}>
              <input
                type="text"
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                placeholder="Type your support question"
              />
              <button type="submit">Send</button>
            </form>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <section id="help-center" className="section help-center">
      <div className="container">
        <div className="help-center-intro">
          <p className="eyebrow">SUPPORT</p>
          <h2>Help Center</h2>
          <p>Find practical guidance, searchable support content, video tutorials and immediate chat assistance.</p>
        </div>

        <form className="help-center-search" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search Help Center content"
            aria-label="Search Help Center content"
          />
          <button type="submit">Search</button>
        </form>

        {submittedSearch.trim() ? (
          <div className="search-results">
            <h3>Search Results</h3>
            {searchResults.length > 0 ? (
              <div className="article-list">
                {searchResults.map((item) => (
                  <div className="article-row" key={`${item.type}-${item.title}`}>
                    <strong>{item.type}:</strong>&nbsp;{item.title}
                  </div>
                ))}
              </div>
            ) : (
              <p>No matching help content found.</p>
            )}
          </div>
        ) : null}

        <div className="help-layout">
          <aside className="help-sidebar">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`help-nav-item ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </aside>
          <div className="help-main">
            {renderDefaultContent()}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>© 2024 Equity Portal</p>
        <p>Corporate support experience for investors and employee share participants.</p>
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
          title="Investor Centre"
          text="Access clear shareholder support information through a spacious, professional layout designed to direct customers toward practical guidance and relevant service areas."
          image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
          imageAlt="Investor Centre"
        />
        <SplitSection
          id="empshare"
          title="EmpShare / Employee Share"
          text="Explore employee share support information in a responsive two-column layout that keeps essential content visible and easy to navigate across devices."
          image="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
          imageAlt="Employee Share"
          reverse
        />
        <SplitSection
          id="about-us"
          title="About Us"
          text="Learn about the people, service approach and support focus behind Equity Portal through a simple corporate presentation with clear typography and imagery."
          image="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80"
          imageAlt="About Us"
        />
        <TechnologyPlatforms />
        <HelpCenter />
      </main>
      <Footer />
    </div>
  );
}
