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
      'Use the Equity Portal sign-in journey provided by your organisation to access your shareholder or employee share information from the Help Center experience.'
  },
  {
    question: 'Where can I download my documents?',
    answer:
      'Open Help Materials to access downloadable guides and reference documents over secure HTTPS links for offline use.'
  },
  {
    question: 'Can I get help without leaving the website?',
    answer:
      'Yes. You can search support content, review FAQs, watch embedded tutorials and use Chat Support directly inside the Help Center.'
  },
  {
    question: 'Is the Help Center available on mobile?',
    answer:
      'Yes. The Help Center is fully responsive so categories, search, content and chat remain usable on smartphones and tablets.'
  }
];

const guides = [
  'Use the search bar to find support articles, videos, FAQs and help materials by keyword.',
  'Choose a category from the left navigation to narrow the content shown in the Help Center.',
  'Open FAQs to review common platform and document questions in an accordion layout.',
  'Use Chat Support for immediate responses and related article suggestions.'
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

const searchIndex = [
  { type: 'FAQ', title: 'How do I access my shareholder or employee information?', category: 'FAQs' },
  { type: 'FAQ', title: 'Where can I download my documents?', category: 'FAQs' },
  { type: 'FAQ', title: 'Can I get help without leaving the website?', category: 'FAQs' },
  { type: 'FAQ', title: 'Is the Help Center available on mobile?', category: 'FAQs' },
  { type: 'Guide', title: 'Search Help Center content by keyword', category: 'Getting Started' },
  { type: 'Guide', title: 'Browse categories from the Help Center navigation', category: 'How-To Guides' },
  { type: 'Guide', title: 'Use chat support for immediate help', category: 'Chat Support' },
  { type: 'Video', title: 'Video Tutorial 1', category: 'Video Tutorials' },
  { type: 'Video', title: 'Video Tutorial 2', category: 'Video Tutorials' },
  { type: 'Video', title: 'Video Tutorial 3', category: 'Video Tutorials' },
  { type: 'Material', title: 'Employee Share Document Guide', category: 'Help Materials' },
  { type: 'Material', title: 'Employee Share Vesting Guide', category: 'Help Materials' },
  { type: 'Material', title: 'Employee Quick Reference', category: 'Help Materials' },
  { type: 'Support', title: 'Immediate chat assistance with article recommendations', category: 'Chat Support' },
  { type: 'Troubleshooting', title: 'Resolve access, search and playback issues', category: 'Troubleshooting' }
];

function Header({ mobileNavOpen, setMobileNavOpen, onNavigate }) {
  const items = ['Investor Centre', 'EmpShare', 'About Us', 'Technology Platforms', 'Help Center'];

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="#top" className="brand">Equity Portal</a>
        <button
          className="mobile-nav-toggle"
          aria-label="Toggle navigation"
          aria-expanded={mobileNavOpen}
          onClick={() => setMobileNavOpen((prev) => !prev)}
        >
          ☰
        </button>
        <nav className={`primary-nav ${mobileNavOpen ? 'open' : ''}`}>
          {items.map((item) => {
            const href = `#${item.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z-]/g, '')}`;
            return (
              <a
                key={item}
                href={href}
                onClick={() => {
                  setMobileNavOpen(false);
                  onNavigate?.();
                }}
              >
                {item}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

function TwoColumnSection({ id, eyebrow, title, text, image, imageAlt, reverse = false, ctaHref, ctaText }) {
  return (
    <section id={id} className="section">
      <div className={`container split-section ${reverse ? 'reverse' : ''}`}>
        <div className="section-copy">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h2>{title}</h2>
          <p>{text}</p>
          {ctaHref && ctaText ? (
            <a className="text-link" href={ctaHref}>
              {ctaText}
            </a>
          ) : null}
        </div>
        <div className="section-media">
          <img src={image} alt={imageAlt} />
        </div>
      </div>
    </section>
  );
}

function TechnologyPlatforms() {
  const items = ['Experience', 'Expertise', 'Innovation', 'Technology'];
  return (
    <section id="technology-platforms" className="section alt-bg">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">PLATFORMS</p>
          <h2>Learn more about our technology platforms</h2>
        </div>
        <div className="platform-grid">
          {items.map((item) => (
            <div key={item} className="platform-item">
              <span className="platform-accent" aria-hidden="true"></span>
              <h3>{item}</h3>
              <p>
                Explore {item.toLowerCase()} across the Equity Portal with clear, focused and support-ready digital experiences.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SearchResults({ results, onSelectCategory }) {
  if (!results.length) {
    return (
      <div className="search-results empty">
        <p>No matching help content was found. Try a different keyword.</p>
      </div>
    );
  }

  return (
    <div className="search-results">
      <h3>Search Results</h3>
      <ul>
        {results.map((result, index) => (
          <li key={`${result.title}-${index}`}>
            <div>
              <span className="result-type">{result.type}</span>
              <strong>{result.title}</strong>
              <p>{result.category}</p>
            </div>
            <button onClick={() => onSelectCategory(result.category)}>Open</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FAQContent({ openItems, toggleItem }) {
  return (
    <div className="help-content-block">
      <h3>Frequently Asked Questions</h3>
      <p>Browse common questions about the platform, access, documents and support options.</p>
      <div className="content-divider"></div>
      <div className="faq-list">
        {faqItems.map((item, index) => {
          const isOpen = openItems.includes(index);
          return (
            <div key={item.question} className="faq-item">
              <button className="faq-question" onClick={() => toggleItem(index)} aria-expanded={isOpen}>
                <span>{item.question}</span>
                <span className="faq-toggle">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen ? <div className="faq-answer"><p>{item.answer}</p></div> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function VideoTutorials() {
  return (
    <div className="help-content-block help-center-video">
      <h3>Video Tutorials</h3>
      <p>Play video tutorials directly in the Help Center without leaving the website.</p>
      <div className="video-grid">
        {videos.map((video) => (
          <div key={video.title} className="video-item">
            <div className="video-frame">
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

function HelpMaterials() {
  return (
    <div className="help-content-block help-center-materials">
      <h3>Help Materials</h3>
      <p>Download secure guides and reference materials for offline troubleshooting and learning.</p>
      <ul className="materials-list">
        {materials.map((item) => (
          <li key={item.title}>
            <div>
              <strong>{item.title}</strong>
              <p>HTTPS download link available for offline access.</p>
            </div>
            <a href={item.url} target="_blank" rel="noreferrer">Download</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ChatSupport({ messages, input, setInput, sendMessage }) {
  return (
    <div className="help-content-block help-center-chat">
      <h3>Chat Support</h3>
      <p>Receive immediate responses with relevant help article suggestions based on your query.</p>
      <div className="chat-window" aria-live="polite">
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.role}`}>
            <span>{message.role === 'assistant' ? 'Support' : 'You'}</span>
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      <form
        className="chat-form"
        onSubmit={(event) => {
          event.preventDefault();
          sendMessage();
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask for help"
          aria-label="Chat support input"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

function HelpCenter() {
  const [selectedCategory, setSelectedCategory] = useState('FAQs');
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');
  const [openItems, setOpenItems] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello. I can help with access, documents, videos, search and support topics.'
    }
  ]);

  const results = useMemo(() => {
    const term = submittedSearch.trim().toLowerCase();
    if (!term) return [];
    return searchIndex.filter((item) => {
      const combined = `${item.type} ${item.title} ${item.category}`.toLowerCase();
      return combined.includes(term);
    });
  }, [submittedSearch]);

  const toggleItem = (index) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index]));
  };

  const sendMessage = () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;

    const lower = trimmed.toLowerCase();
    let response = 'I can help with FAQs, video tutorials, downloadable materials and troubleshooting. Relevant article: Browse the Help Center categories for detailed guidance.';

    if (lower.includes('document') || lower.includes('pdf') || lower.includes('download')) {
      response = 'For documents and offline references, open Help Materials. Relevant article: Employee Share Document Guide.';
    } else if (lower.includes('video') || lower.includes('tutorial')) {
      response = 'Open Video Tutorials to play embedded support content directly in the Help Center. Relevant article: Video Tutorial 1.';
    } else if (lower.includes('access') || lower.includes('login') || lower.includes('shareholder') || lower.includes('employee')) {
      response = 'Access guidance is available in FAQs and Getting Started. Relevant article: How do I access my shareholder or employee information?';
    } else if (lower.includes('mobile') || lower.includes('phone') || lower.includes('tablet')) {
      response = 'The Help Center is responsive and usable on mobile devices. Relevant article: Is the Help Center available on mobile?';
    } else if (lower.includes('search')) {
      response = 'Use the Help Center search bar to find articles, videos, FAQs and downloadable materials quickly. Relevant article: Search Help Center content by keyword.';
    }

    setChatMessages((prev) => [
      ...prev,
      { role: 'user', text: trimmed },
      { role: 'assistant', text: response }
    ]);
    setChatInput('');
  };

  const renderContent = () => {
    switch (selectedCategory) {
      case 'Getting Started':
        return (
          <div className="help-content-block">
            <h3>Getting Started</h3>
            <p>Begin with the key support features available on the Help Center landing page.</p>
            <ul className="simple-list">
              <li>Use the main navigation entry point to access Help Center directly from the Home Page.</li>
              <li>Search support content using keywords to find answers quickly.</li>
              <li>Browse categories for FAQs, guides, tutorials, materials and chat assistance.</li>
            </ul>
          </div>
        );
      case 'FAQs':
        return <FAQContent openItems={openItems} toggleItem={toggleItem} />;
      case 'How-To Guides':
        return (
          <div className="help-content-block">
            <h3>How-To Guides</h3>
            <p>Follow practical guidance for finding support content and using Help Center features.</p>
            <ol className="simple-list ordered">
              {guides.map((guide) => (
                <li key={guide}>{guide}</li>
              ))}
            </ol>
          </div>
        );
      case 'Video Tutorials':
        return <VideoTutorials />;
      case 'Help Materials':
        return <HelpMaterials />;
      case 'Troubleshooting':
        return (
          <div className="help-content-block">
            <h3>Troubleshooting</h3>
            <p>Review quick guidance for common support issues.</p>
            <ul className="simple-list">
              <li>If search returns no results, try a broader keyword such as document, video or access.</li>
              <li>If a video does not load, use another tutorial in the list or refresh the page.</li>
              <li>If a download is unavailable, use Chat Support for alternatives and related guidance.</li>
            </ul>
          </div>
        );
      case 'Chat Support':
        return <ChatSupport messages={chatMessages} input={chatInput} setInput={setChatInput} sendMessage={sendMessage} />;
      default:
        return null;
    }
  };

  return (
    <section id="help-center" className="section help-center-section">
      <div className="container help-center">
        <div className="help-center-intro">
          <p className="eyebrow">SUPPORT</p>
          <h2>Help Center</h2>
          <p>Find practical guidance, searchable support content, video tutorials and immediate chat assistance.</p>
        </div>

        <form
          className="help-center-search"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmittedSearch(searchTerm);
          }}
        >
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
          <SearchResults results={results} onSelectCategory={setSelectedCategory} />
        ) : null}

        <div className="help-layout">
          <aside className="help-sidebar" aria-label="Help Center categories">
            {categories.map((category) => (
              <button
                key={category}
                className={selectedCategory === category ? 'active' : ''}
                onClick={() => setSelectedCategory(category)}
              >
                <span>{category}</span>
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
        <p>© 2024 Equity Portal</p>
        <p>Professional support for investor and employee share services.</p>
      </div>
    </footer>
  );
}

export default function App() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div id="top">
      <Header mobileNavOpen={mobileNavOpen} setMobileNavOpen={setMobileNavOpen} />
      <main>
        <TwoColumnSection
          id="investor-centre"
          eyebrow="INVESTOR CENTRE"
          title="Investor Centre"
          text="Access a clear and professional Equity Portal experience designed to support investors with streamlined information and dependable service pathways."
          image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
          imageAlt="Professional financial technology workspace"
          ctaHref="#help-center"
          ctaText="Go to Help Center"
        />
        <TwoColumnSection
          id="empshare"
          eyebrow="EMPLOYEE SHARE"
          title="EmpShare / Employee Share"
          text="Support employee share participants with accessible guidance, responsive layouts and straightforward routes to help content across devices."
          image="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
          imageAlt="Business team collaboration"
          reverse
        />
        <TwoColumnSection
          id="about-us"
          eyebrow="ABOUT US"
          title="About Us"
          text="Equity Portal presents a corporate financial-services experience focused on clarity, usability and practical support for users who need information quickly."
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
