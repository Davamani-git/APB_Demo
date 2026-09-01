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
    answer: 'Use the relevant Investor Centre or Employee Share area to review available platform information and support guidance tailored to your needs.'
  },
  {
    question: 'Where can I download my documents?',
    answer: 'Open Help Materials from the Help Center to access downloadable guides and reference documents for offline use.'
  },
  {
    question: 'Can I get help without leaving the website?',
    answer: 'Yes. The integrated chat support experience allows you to ask questions and receive immediate automated assistance directly within the Help Center.'
  },
  {
    question: 'Is the Help Center available on mobile?',
    answer: 'Yes. The Help Center is fully responsive so navigation, search, FAQs, videos, materials and chat remain usable on smaller screens.'
  }
];

const guideItems = [
  'Access your support resources from the Help Center entry point in the header navigation or by scrolling to the Support section.',
  'Use the search field to quickly locate guidance, tutorials and downloadable support documents.',
  'Browse category navigation to switch between FAQs, how-to guidance, video tutorials, downloadable materials, troubleshooting and chat support.'
];

const videoItems = [
  {
    title: 'Platform Walkthrough',
    embed: 'https://www.youtube.com/embed/Mt0Y5X6885I'
  },
  {
    title: 'Support Experience Overview',
    embed: 'https://www.youtube.com/embed/6dSVaAaKWSQ'
  },
  {
    title: 'User Guidance Tutorial',
    embed: 'https://www.youtube.com/embed/8qaLG730bDw'
  }
];

const materialItems = [
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

function App() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('FAQs');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello. I can help with access, documents, tutorials and general Help Center questions.'
    }
  ]);

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchQuery(searchInput.trim());
  };

  const filteredFaqs = useMemo(() => {
    if (!searchQuery) return faqItems;
    const q = searchQuery.toLowerCase();
    return faqItems.filter((item) => item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q));
  }, [searchQuery]);

  const filteredGuides = useMemo(() => {
    if (!searchQuery) return guideItems;
    const q = searchQuery.toLowerCase();
    return guideItems.filter((item) => item.toLowerCase().includes(q));
  }, [searchQuery]);

  const filteredVideos = useMemo(() => {
    if (!searchQuery) return videoItems;
    const q = searchQuery.toLowerCase();
    return videoItems.filter((item) => item.title.toLowerCase().includes(q));
  }, [searchQuery]);

  const filteredMaterials = useMemo(() => {
    if (!searchQuery) return materialItems;
    const q = searchQuery.toLowerCase();
    return materialItems.filter((item) => item.title.toLowerCase().includes(q));
  }, [searchQuery]);

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;
    const q = searchQuery.toLowerCase();
    return categories.filter((item) => item.toLowerCase().includes(q));
  }, [searchQuery]);

  const submitChat = (event) => {
    event.preventDefault();
    const value = chatInput.trim();
    if (!value) return;
    const nextMessages = [...chatMessages, { role: 'user', text: value }];
    const lower = value.toLowerCase();
    let response = 'I can help you explore FAQs, how-to guides, video tutorials, downloadable materials and troubleshooting steps.';
    if (lower.includes('document') || lower.includes('download') || lower.includes('pdf')) {
      response = 'For downloadable support resources, open Help Materials to access the available user guides and PDF references.';
    } else if (lower.includes('video') || lower.includes('tutorial')) {
      response = 'Open Video Tutorials to play embedded guidance directly inside the Help Center.';
    } else if (lower.includes('mobile') || lower.includes('phone')) {
      response = 'The Help Center is responsive and supports navigation, search and support interactions on mobile devices.';
    } else if (lower.includes('access') || lower.includes('login') || lower.includes('shareholder') || lower.includes('employee')) {
      response = 'You can use the Help Center content to find guidance for shareholder and employee information access.';
    }
    setChatMessages([...nextMessages, { role: 'assistant', text: response }]);
    setChatInput('');
    setSelectedCategory('Chat Support');
  };

  const renderHelpContent = () => {
    switch (selectedCategory) {
      case 'Getting Started':
        return (
          <div className="help-panel">
            <h3>Getting Started</h3>
            <p>Start here to understand the support experience and locate the right resources quickly.</p>
            <div className="divider" />
            <ul className="simple-list">
              {guideItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        );
      case 'FAQs':
        return (
          <div className="help-panel">
            <h3>Frequently Asked Questions</h3>
            <p>Browse common questions about the platform, access, documents and support options.</p>
            <div className="divider" />
            {(filteredFaqs.length ? filteredFaqs : []).map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div className="faq-item" key={item.question}>
                  <button
                    className="faq-question"
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <span>{item.question}</span>
                    <span className="faq-toggle">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && <div className="faq-answer">{item.answer}</div>}
                </div>
              );
            })}
            {!filteredFaqs.length && <p className="empty-state">No FAQ results matched your search.</p>}
          </div>
        );
      case 'How-To Guides':
        return (
          <div className="help-panel">
            <h3>How-To Guides</h3>
            <p>Follow practical guidance to find support content and use Help Center resources efficiently.</p>
            <div className="divider" />
            {filteredGuides.length ? (
              <ol className="simple-list ordered">
                {filteredGuides.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            ) : (
              <p className="empty-state">No how-to guidance matched your search.</p>
            )}
          </div>
        );
      case 'Video Tutorials':
        return (
          <div className="help-panel">
            <h3>Video Tutorials</h3>
            <p>Watch embedded tutorials directly in the Help Center without leaving the application.</p>
            <div className="divider" />
            {filteredVideos.length ? (
              <div className="video-grid">
                {filteredVideos.map((video) => (
                  <div className="help-center-video" key={video.title}>
                    <h4>{video.title}</h4>
                    <div className="video-frame-wrap">
                      <iframe
                        src={video.embed}
                        title={video.title}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No video tutorials matched your search.</p>
            )}
          </div>
        );
      case 'Help Materials':
        return (
          <div className="help-panel">
            <h3>Help Materials</h3>
            <p>Download user guides and PDF reference materials for offline access.</p>
            <div className="divider" />
            {filteredMaterials.length ? (
              <div className="materials-list">
                {filteredMaterials.map((item) => (
                  <div className="material-row" key={item.title}>
                    <div>
                      <h4>{item.title}</h4>
                      <p>PDF support material for offline reference.</p>
                    </div>
                    <a className="download-btn" href={item.url} target="_blank" rel="noreferrer">
                      Download
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No help materials matched your search.</p>
            )}
          </div>
        );
      case 'Troubleshooting':
        return (
          <div className="help-panel">
            <h3>Troubleshooting</h3>
            <p>Use these quick checks when you need immediate support guidance.</p>
            <div className="divider" />
            <ul className="simple-list">
              <li>Confirm you are in the correct support category for the issue you are trying to solve.</li>
              <li>Use search to locate matching FAQs, guides, videos or downloadable materials.</li>
              <li>If you still need assistance, open Chat Support for immediate automated help.</li>
            </ul>
          </div>
        );
      case 'Chat Support':
        return (
          <div className="help-panel">
            <h3>Chat Support</h3>
            <p>Receive immediate automated answers directly within the Help Center.</p>
            <div className="divider" />
            <div className="help-center-chat">
              <div className="chat-messages">
                {chatMessages.map((message, index) => (
                  <div key={`${message.role}-${index}`} className={`chat-message ${message.role}`}>
                    {message.text}
                  </div>
                ))}
              </div>
              <form className="chat-form" onSubmit={submitChat}>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask a support question"
                  aria-label="Ask a support question"
                />
                <button type="submit">Send</button>
              </form>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const navItems = [
    { label: 'Investor Centre', href: '#investor-centre' },
    { label: 'Employee Share', href: '#employee-share' },
    { label: 'About Us', href: '#about-us' },
    { label: 'Technology Platforms', href: '#technology-platforms' },
    { label: 'Help Center', href: '#help-center' }
  ];

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#top">Equity Portal</a>
          <button
            className="mobile-nav-toggle"
            type="button"
            onClick={() => setMobileNavOpen((prev) => !prev)}
            aria-expanded={mobileNavOpen}
            aria-label="Toggle navigation"
          >
            ☰
          </button>
          <nav className={`site-nav ${mobileNavOpen ? 'open' : ''}`}>
            {navItems.map((item) => (
              <a key={item.label} href={item.href} onClick={() => setMobileNavOpen(false)}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <section id="investor-centre" className="content-section split-section container">
          <div className="section-copy">
            <p className="eyebrow">Investor Centre</p>
            <h1>Focused support for investors seeking clear access to essential platform information</h1>
            <p>
              Equity Portal provides a streamlined corporate experience for visitors who need investor-focused guidance,
              support content and practical access to relevant information.
            </p>
          </div>
          <div className="section-media">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
              alt="Investor technology dashboard on a professional workspace"
            />
          </div>
        </section>

        <section id="employee-share" className="content-section split-section split-reverse container">
          <div className="section-media">
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
              alt="Employees collaborating in a professional meeting"
            />
          </div>
          <div className="section-copy">
            <p className="eyebrow">EmpShare / Employee Share</p>
            <h2>Support resources for employees navigating share-related experiences</h2>
            <p>
              The Employee Share area complements the wider support journey with clear guidance, practical materials and
              responsive access across devices.
            </p>
          </div>
        </section>

        <section id="about-us" className="content-section split-section container">
          <div className="section-copy">
            <p className="eyebrow">About Us</p>
            <h2>A corporate support experience built around clarity, access and trust</h2>
            <p>
              Equity Portal delivers a professional, minimal and responsive experience designed to help users find the
              support information they need quickly and confidently.
            </p>
          </div>
          <div className="section-media">
            <img
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80"
              alt="Business professionals collaborating in an office"
            />
          </div>
        </section>

        <section id="technology-platforms" className="content-section tech-section container">
          <p className="eyebrow">Technology Platforms</p>
          <h2>Learn more about our technology platforms</h2>
          <div className="tech-grid">
            <div className="tech-item">
              <span className="tech-accent" />
              <h3>Experience</h3>
              <p>Simple, responsive support journeys across desktop and mobile experiences.</p>
            </div>
            <div className="tech-item">
              <span className="tech-accent" />
              <h3>Expertise</h3>
              <p>Practical guidance, FAQs and structured support resources in one place.</p>
            </div>
            <div className="tech-item">
              <span className="tech-accent" />
              <h3>Innovation</h3>
              <p>Embedded tutorials, downloadable help materials and immediate chat support.</p>
            </div>
            <div className="tech-item">
              <span className="tech-accent" />
              <h3>Technology</h3>
              <p>Modern, lightweight interfaces built for clarity, speed and maintainability.</p>
            </div>
          </div>
        </section>

        <section id="help-center" className="content-section help-center-section container">
          <div className="help-center-intro-grid">
            <div className="help-center-intro">
              <p className="eyebrow">SUPPORT</p>
              <h2>Help Center</h2>
              <p>
                Find practical guidance, searchable support content, video tutorials and immediate chat assistance.
              </p>
            </div>
            <div className="help-center-intro-image">
              <img
                src="https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=1200&q=80"
                alt="Customer support professionals working with technology"
              />
            </div>
          </div>

          <form className="help-center-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search Help Center content"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              aria-label="Search Help Center content"
            />
            <button type="submit">Search</button>
          </form>

          <div className="help-center-layout">
            <aside className="help-sidebar">
              {(filteredCategories.length ? filteredCategories : categories).map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`help-nav-item ${selectedCategory === item ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(item)}
                >
                  {item}
                </button>
              ))}
            </aside>
            <div className="help-main">{renderHelpContent()}</div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <h3>Equity Portal</h3>
            <p>Professional investor and employee support resources in one responsive experience.</p>
          </div>
          <p>© Equity Portal</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
