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
    answer: 'Use the Equity Portal Help Center navigation to reach the area that applies to your shareholder or employee services, then review the guidance available in Getting Started and FAQs.'
  },
  {
    question: 'Where can I download my documents?',
    answer: 'Open Help Materials to access downloadable employee guides and reference materials available for offline use.'
  },
  {
    question: 'Can I get help without leaving the website?',
    answer: 'Yes. Chat Support allows you to send a question and receive an automated response directly within the Help Center.'
  },
  {
    question: 'Is the Help Center available on mobile?',
    answer: 'Yes. The Help Center is designed to respond across screen sizes so support content remains accessible on mobile devices.'
  }
];

const categoryArticles = {
  'Getting Started': [
    'Create a simple starting point for new portal users',
    'Understand where to find support resources',
    'Review common guidance before contacting support'
  ],
  FAQs: faqItems.map((item) => item.question),
  'How-To Guides': [
    'Use search to locate support topics quickly',
    'Open category content from the Help Center menu',
    'Find downloadable guidance for offline review'
  ],
  'Video Tutorials': [
    'Play embedded tutorial content directly in the Help Center',
    'View guidance with standard YouTube playback controls',
    'Stay on the website while learning visually'
  ],
  'Help Materials': [
    'Download the Employee Share Document Guide',
    'Download the Employee Share Vesting Guide',
    'Download the Employee Quick Reference'
  ],
  Troubleshooting: [
    'Resolve common access and document support questions',
    'Use FAQs and search together to narrow results',
    'Move to chat support when immediate help is needed'
  ],
  'Chat Support': [
    'Send a support question and receive an automated response',
    'Keep interactions inside the Help Center experience',
    'Use secure website delivery over HTTPS'
  ]
};

const automatedResponses = [
  'Thanks for your question. Please review the matching Help Center category while our assistant highlights the most relevant support option.',
  'We can help with platform access, documents, guides and support resources. Try search or open FAQs for quick answers.',
  'For offline guidance, please review Help Materials. For visual learning, open Video Tutorials. You can continue chatting here anytime.'
];

function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="brand">Equity Portal</div>
        <nav className="primary-nav" aria-label="Primary">
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

function SplitSection({ id, title, text, image, imageAlt, reverse = false }) {
  return (
    <section id={id} className="split-section section">
      <div className={`container split-grid ${reverse ? 'reverse' : ''}`}>
        <div className="split-copy">
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
    <section id="technology-platforms" className="section tech-section">
      <div className="container">
        <h2>Learn more about our technology platforms</h2>
        <div className="tech-grid">
          {items.map((item) => (
            <div key={item} className="tech-item">
              <span className="tech-accent" />
              <h3>{item}</h3>
              <p>
                Explore focused support content that reflects the platform capabilities and service experience available through Equity Portal.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SearchResults({ results, term }) {
  if (!term) return null;

  return (
    <div className="help-search-results" aria-live="polite">
      <h3>Search Results</h3>
      <p>
        Showing results for <strong>{term}</strong>
      </p>
      {results.length > 0 ? (
        <ul>
          {results.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>No matching help content found.</p>
      )}
    </div>
  );
}

function FAQView({ openFaq, onToggle }) {
  return (
    <div className="help-panel">
      <h3>Frequently Asked Questions</h3>
      <p>Browse common questions about the platform, access, documents and support options.</p>
      <div className="panel-divider" />
      <div className="faq-list">
        {faqItems.map((item, index) => {
          const isOpen = openFaq === index;
          return (
            <div key={item.question} className="faq-item">
              <button className="faq-toggle" onClick={() => onToggle(index)} aria-expanded={isOpen}>
                <span className="faq-question">{item.question}</span>
                <span className="faq-icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && <div className="faq-answer">{item.answer}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ArticleListView({ category, items }) {
  return (
    <div className="help-panel">
      <h3>{category}</h3>
      <p>Browse relevant help articles within this category.</p>
      <div className="panel-divider" />
      <ul className="article-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function VideoTutorialsView() {
  const videos = [
    'https://www.youtube.com/embed/Mt0Y5X6885I',
    'https://www.youtube.com/embed/6dSVaAaKWSQ',
    'https://www.youtube.com/embed/8qaLG730bDw'
  ];

  return (
    <div className="help-panel">
      <h3>Video Tutorials</h3>
      <p>Play tutorial content directly within the Help Center using standard controls.</p>
      <div className="panel-divider" />
      <div className="video-grid">
        {videos.map((video, index) => (
          <div key={video} className="video-item">
            <iframe
              src={video}
              title={`Video Tutorial ${index + 1}`}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function HelpMaterialsView() {
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
      <p>Download user guides and reference materials for offline access.</p>
      <div className="panel-divider" />
      <ul className="materials-list">
        {materials.map((item) => (
          <li key={item.title}>
            <span>{item.title}</span>
            <a href={item.href} target="_blank" rel="noreferrer">
              Download PDF
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ChatSupportView() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([
    {
      sender: 'assistant',
      text: 'Welcome to Chat Support. Ask a support question to receive an automated response.'
    }
  ]);
  const [isSending, setIsSending] = useState(false);

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed || isSending) return;

    setChat((prev) => [...prev, { sender: 'user', text: trimmed }]);
    setMessage('');
    setIsSending(true);

    window.setTimeout(() => {
      const response = automatedResponses[chat.length % automatedResponses.length];
      setChat((prev) => [...prev, { sender: 'assistant', text: response }]);
      setIsSending(false);
    }, 1200);
  };

  return (
    <div className="help-panel">
      <h3>Chat Support</h3>
      <p>Send and receive support messages directly within the Help Center.</p>
      <div className="panel-divider" />
      <div className="chat-note">Chat interactions are delivered through this secure HTTPS application experience.</div>
      <div className="chat-thread">
        {chat.map((entry, index) => (
          <div key={`${entry.sender}-${index}`} className={`chat-message ${entry.sender}`}>
            {entry.text}
          </div>
        ))}
      </div>
      <div className="chat-input-row">
        <input
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') handleSend();
          }}
          placeholder="Type your support question"
          aria-label="Type your support question"
        />
        <button onClick={handleSend} disabled={isSending}>
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

function HelpCenter() {
  const [selectedCategory, setSelectedCategory] = useState('FAQs');
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const searchResults = useMemo(() => {
    if (!searchTerm) return [];
    const normalized = searchTerm.toLowerCase();
    return categories.flatMap((category) =>
      categoryArticles[category]
        .filter((item) => item.toLowerCase().includes(normalized))
        .map((item) => `${category}: ${item}`)
    );
  }, [searchTerm]);

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchTerm(searchInput.trim());
  };

  const renderContent = () => {
    if (selectedCategory === 'FAQs') {
      return <FAQView openFaq={openFaq} onToggle={(index) => setOpenFaq(openFaq === index ? null : index)} />;
    }
    if (selectedCategory === 'Video Tutorials') {
      return <VideoTutorialsView />;
    }
    if (selectedCategory === 'Help Materials') {
      return <HelpMaterialsView />;
    }
    if (selectedCategory === 'Chat Support') {
      return <ChatSupportView />;
    }
    return <ArticleListView category={selectedCategory} items={categoryArticles[selectedCategory]} />;
  };

  return (
    <section id="help-center" className="section help-center">
      <div className="container">
        <div className="help-center-intro">
          <div className="section-label">SUPPORT</div>
          <h2>Help Center</h2>
          <p>Find practical guidance, searchable support content, video tutorials and immediate chat assistance.</p>
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
        <SearchResults results={searchResults} term={searchTerm} />
        <div className="help-center-layout">
          <aside className="help-sidebar" aria-label="Help Center categories">
            {categories.map((category) => (
              <button
                key={category}
                className={selectedCategory === category ? 'active' : ''}
                onClick={() => {
                  setSelectedCategory(category);
                  if (category !== 'FAQs') setOpenFaq(null);
                }}
              >
                {category}
              </button>
            ))}
          </aside>
          <div className="help-main">{renderContent()}</div>
        </div>
        <div className="help-support-image">
          <img
            src="https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=1200&q=80"
            alt="Support team collaboration"
          />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>Equity Portal</div>
        <div>Professional support resources for investors and employees.</div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <main>
        <SplitSection
          id="investor-centre"
          title="Investor Centre"
          text="Access clear investor-focused information presented in a clean, spacious layout designed for a professional financial-services experience."
          image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
          imageAlt="Investor technology dashboard"
        />
        <SplitSection
          id="empshare"
          title="EmpShare / Employee Share"
          text="Support employee share participants with practical content, accessible guidance and a consistent corporate visual language across the experience."
          image="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
          imageAlt="Employee collaboration meeting"
          reverse
        />
        <SplitSection
          id="about-us"
          title="About Us"
          text="Equity Portal delivers straightforward access to platform guidance, support materials and digital service experiences with clarity and professionalism."
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
