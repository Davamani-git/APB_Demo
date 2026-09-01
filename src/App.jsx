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
      'Open the relevant Help Center topic and follow the guided access instructions for shareholder and employee share information available within the portal.'
  },
  {
    question: 'Where can I download my documents?',
    answer:
      'Documents and downloadable references are listed in Help Materials, where you can open the available guides and quick reference files.'
  },
  {
    question: 'Can I get help without leaving the website?',
    answer:
      'Yes. The Help Center includes embedded tutorials, searchable support content and a chat assistant so support remains within the same experience.'
  },
  {
    question: 'Is the Help Center available on mobile?',
    answer:
      'Yes. The Help Center layout is responsive and adapts for smaller screens so customers can browse categories, search and access support on mobile devices.'
  }
];

const searchIndex = [
  {
    type: 'Article',
    category: 'Getting Started',
    title: 'Getting started with your Equity Portal account',
    description: 'A practical introduction to finding account information and navigating support resources.'
  },
  {
    type: 'Article',
    category: 'FAQs',
    title: 'Accessing shareholder or employee information',
    description: 'Answers to common platform, account and document questions.'
  },
  {
    type: 'Guide',
    category: 'How-To Guides',
    title: 'How to search the Help Center effectively',
    description: 'Use keywords to locate articles, videos and downloadable support materials quickly.'
  },
  {
    type: 'Video',
    category: 'Video Tutorials',
    title: 'Platform walkthrough tutorial',
    description: 'Embedded video tutorial for guided visual learning within the Help Center.'
  },
  {
    type: 'Material',
    category: 'Help Materials',
    title: 'Employee Share Document Guide',
    description: 'Downloadable help file covering employee share documentation and usage guidance.'
  },
  {
    type: 'Material',
    category: 'Help Materials',
    title: 'Employee Share Vesting Guide',
    description: 'Reference material explaining vesting-related support information.'
  },
  {
    type: 'Material',
    category: 'Help Materials',
    title: 'Employee Quick Reference',
    description: 'A concise downloadable guide for quick portal assistance.'
  },
  {
    type: 'Article',
    category: 'Troubleshooting',
    title: 'Troubleshooting sign-in and access questions',
    description: 'Helpful steps for resolving common account and support issues.'
  },
  {
    type: 'Article',
    category: 'Chat Support',
    title: 'Using chat support for immediate assistance',
    description: 'Learn how to open the assistant and receive guided article recommendations.'
  }
];

const articleLinks = [
  {
    label: 'Getting started with your Equity Portal account',
    category: 'Getting Started'
  },
  {
    label: 'Frequently asked questions about documents and access',
    category: 'FAQs'
  },
  {
    label: 'Troubleshooting sign-in and platform access',
    category: 'Troubleshooting'
  }
];

function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="brand">Equity Portal</div>
        <nav className="primary-nav" aria-label="Primary navigation">
          <a href="#investor-centre">Investor Centre</a>
          <a href="#empshare">EmpShare</a>
          <a href="#about-us">About Us</a>
          <a href="#technology-platforms">Technology Platforms</a>
          <a href="#help-center">Help Center</a>
        </nav>
      </div>
    </header>
  );
}

function TwoColumnSection({ id, eyebrow, title, text, image, imageAlt, reverse = false }) {
  return (
    <section id={id} className="section">
      <div className={`container split-section ${reverse ? 'reverse' : ''}`}>
        <div className="split-content">
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <div className="split-image-wrap">
          <img src={image} alt={imageAlt} className="split-image" />
        </div>
      </div>
    </section>
  );
}

function TechnologyPlatforms() {
  const items = [
    {
      title: 'Experience',
      text: 'Clean digital pathways that make support and platform discovery straightforward.'
    },
    {
      title: 'Expertise',
      text: 'Structured resources designed to help customers understand investor and employee share information.'
    },
    {
      title: 'Innovation',
      text: 'Modern support delivery through search, embedded tutorials and interactive assistance.'
    },
    {
      title: 'Technology',
      text: 'Reliable platform guidance presented in a lightweight, accessible and responsive format.'
    }
  ];

  return (
    <section id="technology-platforms" className="section alt-section">
      <div className="container">
        <p className="eyebrow">TECHNOLOGY PLATFORMS</p>
        <h2>Learn more about our technology platforms</h2>
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

function FAQContent({ expandedFaq, onToggleFaq }) {
  return (
    <div className="help-panel">
      <h3>Frequently Asked Questions</h3>
      <p className="panel-description">
        Browse common questions about the platform, access, documents and support options.
      </p>
      <div className="panel-divider" />
      <div className="faq-list">
        {faqItems.map((item, index) => {
          const isOpen = expandedFaq === index;
          return (
            <div key={item.question} className="faq-item">
              <button className="faq-question" onClick={() => onToggleFaq(index)} aria-expanded={isOpen}>
                <span>{item.question}</span>
                <span className="faq-icon">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && <p className="faq-answer">{item.answer}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function VideoTutorialsContent() {
  const videos = [
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

  return (
    <div className="help-panel">
      <h3>Video Tutorials</h3>
      <p className="panel-description">
        Play video tutorials directly within the Help Center using standard playback controls.
      </p>
      <div className="panel-divider" />
      <div className="video-grid">
        {videos.map((video) => (
          <div key={video.title} className="video-item">
            <div className="video-frame">
              <iframe
                src={video.embed}
                title={video.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <p>{video.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function HelpMaterialsContent() {
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

  return (
    <div className="help-panel">
      <h3>Help Materials</h3>
      <p className="panel-description">
        Access downloadable support materials and reference files directly from the Help Center.
      </p>
      <div className="panel-divider" />
      <div className="materials-list">
        {materials.map((item) => (
          <a key={item.title} href={item.href} target="_blank" rel="noreferrer" className="material-link">
            <span>{item.title}</span>
            <span>Open</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function ChatSupportContent({ chatOpen, setChatOpen, messages, inputValue, setInputValue, onSendMessage, onUseArticleCategory }) {
  return (
    <div className="help-panel">
      <h3>Chat Support</h3>
      <p className="panel-description">
        Activate the interactive chat assistant for immediate support and article recommendations.
      </p>
      <div className="panel-divider" />
      {!chatOpen ? (
        <button className="chat-activate" onClick={() => setChatOpen(true)}>
          Activate Chat Assistant
        </button>
      ) : (
        <div className="chat-window">
          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`chat-message ${message.sender}`}>
                <p>{message.text}</p>
                {message.links && message.links.length > 0 && (
                  <div className="chat-links">
                    {message.links.map((link) => (
                      <button key={link.label} className="chat-link" onClick={() => onUseArticleCategory(link.category)}>
                        {link.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <form className="chat-form" onSubmit={onSendMessage}>
            <input
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Ask a support question"
              aria-label="Ask a support question"
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

function DefaultContent({ category }) {
  const contentMap = {
    'Getting Started': {
      title: 'Getting Started',
      description:
        'Browse introductory help content to understand platform access, support pathways and key Help Center sections.'
    },
    'How-To Guides': {
      title: 'How-To Guides',
      description:
        'Follow practical guidance for common platform tasks, navigation and support activities.'
    },
    Troubleshooting: {
      title: 'Troubleshooting',
      description:
        'Review common issue resolution guidance for access, search and support questions.'
    }
  };

  const content = contentMap[category] || {
    title: category,
    description: 'Browse support content for this category.'
  };

  return (
    <div className="help-panel">
      <h3>{content.title}</h3>
      <p className="panel-description">{content.description}</p>
      <div className="panel-divider" />
      <div className="category-article-list">
        {searchIndex
          .filter((item) => item.category === category)
          .map((item) => (
            <div key={item.title} className="search-result-item static">
              <div>
                <span className="result-type">{item.type}</span>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

function SearchResults({ results, query }) {
  return (
    <div className="help-panel">
      <h3>Search Results</h3>
      <p className="panel-description">
        {results.length > 0
          ? `Showing relevant articles, videos, and materials for "${query}".`
          : `No results found for "${query}". Try a different keyword.`}
      </p>
      <div className="panel-divider" />
      <div className="search-results">
        {results.map((result) => (
          <div key={`${result.category}-${result.title}`} className="search-result-item">
            <div>
              <span className="result-type">{result.type}</span>
              <h4>{result.title}</h4>
              <p>{result.description}</p>
            </div>
            <span className="result-category">{result.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HelpCenter() {
  const [selectedCategory, setSelectedCategory] = useState('Getting Started');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: 'Welcome to Help Center chat. Ask a question for immediate guidance and relevant help article links.',
      links: []
    }
  ]);

  const searchResults = useMemo(() => {
    const term = submittedQuery.trim().toLowerCase();
    if (!term) return [];
    return searchIndex.filter((item) => {
      const haystack = `${item.type} ${item.category} ${item.title} ${item.description}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [submittedQuery]);

  const handleSearch = (event) => {
    event.preventDefault();
    setSubmittedQuery(searchInput.trim());
  };

  const handleToggleFaq = (index) => {
    setExpandedFaq((current) => (current === index ? null : index));
  };

  const handleChatSubmit = (event) => {
    event.preventDefault();
    const trimmed = chatInput.trim();
    if (!trimmed) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: trimmed
    };

    const assistantMessage = {
      id: Date.now() + 1,
      sender: 'assistant',
      text: 'Here are some helpful resources related to your query. You can open a recommended topic directly from the links below.',
      links: articleLinks
    };

    setMessages((current) => [...current, userMessage, assistantMessage]);
    setChatInput('');
  };

  const renderContent = () => {
    if (submittedQuery) {
      return <SearchResults results={searchResults} query={submittedQuery} />;
    }

    if (selectedCategory === 'FAQs') {
      return <FAQContent expandedFaq={expandedFaq} onToggleFaq={handleToggleFaq} />;
    }

    if (selectedCategory === 'Video Tutorials') {
      return <VideoTutorialsContent />;
    }

    if (selectedCategory === 'Help Materials') {
      return <HelpMaterialsContent />;
    }

    if (selectedCategory === 'Chat Support') {
      return (
        <ChatSupportContent
          chatOpen={chatOpen}
          setChatOpen={setChatOpen}
          messages={messages}
          inputValue={chatInput}
          setInputValue={setChatInput}
          onSendMessage={handleChatSubmit}
          onUseArticleCategory={(category) => {
            setSubmittedQuery('');
            setSelectedCategory(category);
          }}
        />
      );
    }

    return <DefaultContent category={selectedCategory} />;
  };

  return (
    <section id="help-center" className="section help-center-section">
      <div className="container">
        <div className="help-center-intro">
          <p className="eyebrow">SUPPORT</p>
          <h2>Help Center</h2>
          <p className="help-description">
            Find practical guidance, searchable support content, video tutorials and immediate chat assistance.
          </p>
        </div>

        <form className="help-center-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search Help Center content"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            aria-label="Search Help Center content"
          />
          <button type="submit">Search</button>
        </form>

        <div className="help-center-layout">
          <aside className="help-sidebar" aria-label="Help Center categories">
            {categories.map((category) => (
              <button
                key={category}
                className={`help-nav-item ${selectedCategory === category && !submittedQuery ? 'active' : ''}`}
                onClick={() => {
                  setSubmittedQuery('');
                  setSelectedCategory(category);
                }}
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

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <div className="footer-brand">Equity Portal</div>
          <p>Professional support and information access for investors and employee share participants.</p>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <main>
        <TwoColumnSection
          id="investor-centre"
          eyebrow="INVESTOR CENTRE"
          title="Investor Centre"
          text="Access clear investor-focused information in a spacious, corporate layout designed to help customers navigate essential equity-related content with confidence."
          image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
          imageAlt="Business analytics displayed on a screen"
        />
        <TwoColumnSection
          id="empshare"
          eyebrow="EMPSHARE / EMPLOYEE SHARE"
          title="EmpShare"
          text="Explore employee share support content and resources presented in the same clean visual language, helping customers quickly find relevant information and guidance."
          image="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
          imageAlt="Team collaboration meeting"
          reverse
        />
        <TwoColumnSection
          id="about-us"
          eyebrow="ABOUT US"
          title="About Us"
          text="Equity Portal provides a professional, straightforward digital experience for customers who need access to practical information, support guidance and platform resources."
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
