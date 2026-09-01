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
      'Use the Equity Portal to navigate to the relevant investor or employee share area, where your account details, holdings and related information are available in one place.'
  },
  {
    question: 'Where can I download my documents?',
    answer:
      'Open Help Materials in the Help Center to access downloadable user guides, reference documents and supporting materials for offline use.'
  },
  {
    question: 'Can I get help without leaving the website?',
    answer:
      'Yes. Use Chat Support from within the Help Center to open the interactive assistant and exchange messages without leaving the site.'
  },
  {
    question: 'Is the Help Center available on mobile?',
    answer:
      'Yes. The Help Center is fully responsive and can be browsed, searched and used on mobile devices as well as desktop screens.'
  }
];

const helpData = {
  'Getting Started': [
    {
      title: 'Create a quick support path',
      description: 'Start by choosing a Help Center category to view the most relevant support content.'
    },
    {
      title: 'Use the search bar',
      description: 'Enter keywords to locate related help articles, tutorials and materials efficiently.'
    },
    {
      title: 'Explore integrated support',
      description: 'Browse guidance, watch tutorials, open documents and use chat support in one place.'
    }
  ],
  FAQs: faqItems,
  'How-To Guides': [
    {
      title: 'Access account-related information',
      description: 'Open the relevant section, review the available information and use Help Center guidance when needed.'
    },
    {
      title: 'Locate support documents',
      description: 'Browse Help Materials to find practical documents and quick references for common tasks.'
    },
    {
      title: 'Use search for task-based help',
      description: 'Search by action, platform term or support topic to quickly find applicable guidance.'
    }
  ],
  'Video Tutorials': [
    {
      title: 'Platform Introduction',
      url: 'https://www.youtube.com/embed/Mt0Y5X6885I'
    },
    {
      title: 'Guided Support Walkthrough',
      url: 'https://www.youtube.com/embed/6dSVaAaKWSQ'
    },
    {
      title: 'Using Help Content Effectively',
      url: 'https://www.youtube.com/embed/8qaLG730bDw'
    }
  ],
  'Help Materials': [
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
  ],
  Troubleshooting: [
    {
      title: 'Search not returning expected results',
      description: 'Try simpler keywords or browse a category directly to narrow down the relevant support content.'
    },
    {
      title: 'Video content unavailable',
      description: 'If a video cannot be played, use the related help materials or try another tutorial in the same section.'
    },
    {
      title: 'Need immediate support',
      description: 'Open Chat Support to ask a question and receive real-time assistance within the Help Center.'
    }
  ],
  'Chat Support': []
};

function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="#top">Equity Portal</a>
        <nav className="nav" aria-label="Primary navigation">
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

function HeroSection({ id, title, text, image, reverse = false, label }) {
  return (
    <section id={id} className="content-section">
      <div className={`container split-layout ${reverse ? 'reverse' : ''}`}>
        <div className="split-copy">
          {label ? <div className="section-label">{label}</div> : null}
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <div className="split-media">
          <img src={image} alt={title} />
        </div>
      </div>
    </section>
  );
}

function TechnologyPlatforms() {
  const items = ['Experience', 'Expertise', 'Innovation', 'Technology'];

  return (
    <section id="technology-platforms" className="technology-section">
      <div className="container">
        <h2>Learn more about our technology platforms</h2>
        <div className="technology-grid">
          {items.map((item) => (
            <div key={item} className="technology-item">
              <span className="technology-accent" />
              <h3>{item}</h3>
              <p>
                Practical platform support and information designed to help customers access the right resources quickly.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQView({ query }) {
  const [openIndex, setOpenIndex] = useState(null);

  const filtered = useMemo(() => {
    if (!query) return faqItems;
    return faqItems.filter(
      (item) =>
        item.question.toLowerCase().includes(query.toLowerCase()) ||
        item.answer.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <div className="help-panel">
      <h3>Frequently Asked Questions</h3>
      <p className="help-panel-description">
        Browse common questions about the platform, access, documents and support options.
      </p>
      <div className="help-divider" />
      <div className="faq-list">
        {filtered.length === 0 ? (
          <p className="empty-state">No FAQ results match your search.</p>
        ) : (
          filtered.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question} className="faq-item">
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <span>{item.question}</span>
                  <span className="faq-toggle">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen ? <p className="faq-answer">{item.answer}</p> : null}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function ListView({ title, description, items, query }) {
  const filtered = useMemo(() => {
    if (!query) return items;
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
    );
  }, [items, query]);

  return (
    <div className="help-panel">
      <h3>{title}</h3>
      <p className="help-panel-description">{description}</p>
      <div className="help-divider" />
      <div className="article-list">
        {filtered.length === 0 ? (
          <p className="empty-state">No help content matches your search.</p>
        ) : (
          filtered.map((item) => (
            <div key={item.title} className="article-row">
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function VideosView({ query }) {
  const items = helpData['Video Tutorials'];
  const filtered = useMemo(() => {
    if (!query) return items;
    return items.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));
  }, [items, query]);

  return (
    <div className="help-panel">
      <h3>Video Tutorials</h3>
      <p className="help-panel-description">
        Watch embedded tutorials directly within the Help Center to learn visually without leaving the site.
      </p>
      <div className="help-divider" />
      <div className="video-grid">
        {filtered.length === 0 ? (
          <p className="empty-state">No video tutorials match your search.</p>
        ) : (
          filtered.map((video) => (
            <div key={video.title} className="video-item">
              <h4>{video.title}</h4>
              <div className="video-frame">
                <iframe
                  src={video.url}
                  title={video.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function MaterialsView({ query }) {
  const items = helpData['Help Materials'];
  const filtered = useMemo(() => {
    if (!query) return items;
    return items.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));
  }, [items, query]);

  return (
    <div className="help-panel">
      <h3>Help Materials</h3>
      <p className="help-panel-description">
        Download user guides and reference documents for offline access.
      </p>
      <div className="help-divider" />
      <div className="materials-list">
        {filtered.length === 0 ? (
          <p className="empty-state">No downloadable materials match your search.</p>
        ) : (
          filtered.map((item) => (
            <div key={item.title} className="material-row">
              <div>
                <h4>{item.title}</h4>
                <p>Download and open this support document offline.</p>
              </div>
              <a href={item.url} target="_blank" rel="noreferrer" className="text-link">
                Download
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ChatSupportView() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: 'Welcome to Chat Support. Ask a question and receive immediate assistance here.'
    }
  ]);

  const handleSend = () => {
    const value = input.trim();
    if (!value) return;
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: value },
      {
        sender: 'assistant',
        text: 'Thanks for your message. Please review the suggested Help Center categories or continue the conversation here for further assistance.'
      }
    ]);
    setInput('');
  };

  return (
    <div className="help-panel">
      <h3>Chat Support</h3>
      <p className="help-panel-description">
        Open the interactive assistant to send and receive messages in real time.
      </p>
      <div className="help-divider" />
      <button type="button" className="chat-launch" onClick={() => setIsOpen((prev) => !prev)}>
        {isOpen ? 'Close Chat Assistant' : 'Open Chat Assistant'}
      </button>
      {isOpen ? (
        <div className="chat-window">
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={`${message.sender}-${index}`} className={`chat-message ${message.sender}`}>
                {message.text}
              </div>
            ))}
          </div>
          <div className="chat-input-row">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question"
              aria-label="Chat message"
            />
            <button type="button" className="search-button" onClick={handleSend}>
              Send
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function HelpCenter() {
  const [selectedCategory, setSelectedCategory] = useState('FAQs');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
  };

  const renderContent = () => {
    if (selectedCategory === 'FAQs') return <FAQView query={searchQuery} />;
    if (selectedCategory === 'Getting Started') {
      return (
        <ListView
          title="Getting Started"
          description="Browse introductory guidance and quick steps to begin using Help Center resources effectively."
          items={helpData['Getting Started']}
          query={searchQuery}
        />
      );
    }
    if (selectedCategory === 'How-To Guides') {
      return (
        <ListView
          title="How-To Guides"
          description="Review step-based guidance that helps you complete common tasks using the platform and support content."
          items={helpData['How-To Guides']}
          query={searchQuery}
        />
      );
    }
    if (selectedCategory === 'Video Tutorials') return <VideosView query={searchQuery} />;
    if (selectedCategory === 'Help Materials') return <MaterialsView query={searchQuery} />;
    if (selectedCategory === 'Troubleshooting') {
      return (
        <ListView
          title="Troubleshooting"
          description="Find practical support guidance for common issues and quick next steps."
          items={helpData.Troubleshooting}
          query={searchQuery}
        />
      );
    }
    return <ChatSupportView />;
  };

  return (
    <section id="help-center" className="help-center">
      <div className="container help-center-container">
        <div className="split-layout help-intro-layout">
          <div className="split-copy">
            <div className="section-label">SUPPORT</div>
            <h2>Help Center</h2>
            <p>
              Find practical guidance, searchable support content, video tutorials and immediate chat assistance.
            </p>
          </div>
          <div className="split-media help-media">
            <img
              src="https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=1200&q=80"
              alt="Support team collaborating"
            />
          </div>
        </div>

        <form className="help-center-search" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search Help Center content"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            aria-label="Search Help Center content"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>

        <div className="help-center-layout">
          <aside className="help-sidebar" aria-label="Help Center category navigation">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`sidebar-item ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
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
        <div>© Equity Portal</div>
        <div>Investor information, employee share support and practical help resources.</div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div id="top" className="app-shell">
      <Header />
      <main>
        <HeroSection
          id="investor-centre"
          label="INVESTOR CENTRE"
          title="Investor Centre"
          text="Access a clean, corporate information area designed to help customers review shareholder-related information with confidence and clarity."
          image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
        />
        <HeroSection
          id="empshare"
          label="EMPSHARE"
          title="EmpShare / Employee Share"
          text="Explore employee share information in a responsive two-column layout that mirrors the Investor Centre experience and supports straightforward access to guidance."
          image="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
          reverse
        />
        <HeroSection
          id="about-us"
          label="ABOUT US"
          title="About Us"
          text="We provide a professional digital experience focused on clarity, practical support and dependable access to platform information for customers."
          image="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80"
        />
        <TechnologyPlatforms />
        <HelpCenter />
      </main>
      <Footer />
    </div>
  );
}
