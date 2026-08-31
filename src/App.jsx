import { useMemo, useState } from 'react';

const tabs = ['Investor Centre', 'EmpShare', 'About us', 'Insights'];
const helpCategories = ['Getting Started', 'FAQs', 'How-To Guides', 'Video Tutorials', 'Help Materials', 'Troubleshooting', 'Chat Support'];
const faqItems = [
  {
    question: 'How do I access my shareholder or employee information?',
    answer: 'Use the relevant platform section to sign in and view your account details, holdings and plan information securely online.'
  },
  {
    question: 'Where can I download my documents?',
    answer: 'Documents can be downloaded instantly from the relevant platform area where statements, records and supporting files are made available.'
  },
  {
    question: 'Can I get help without leaving the website?',
    answer: 'Yes. The Help Center includes practical guidance and a chat support area designed to help you without leaving the website.'
  },
  {
    question: 'Is the Help Center available on mobile?',
    answer: 'Yes. The Help Center is designed to remain accessible across desktop, tablet and mobile devices.'
  }
];
const guides = [
  'Sign in and access your platform information',
  'Review holdings, activity and account details',
  'Download platform documents and records',
  'Use support options when you need assistance'
];
const materials = [
  'Platform access overview',
  'Document download guidance',
  'Support and escalation reference'
];
const troubleshooting = [
  'Check that your login details are entered correctly.',
  'Confirm your browser is up to date and try again.',
  'Retry on mobile or desktop if a session has timed out.',
  'Use Chat Support for immediate assistance if the issue continues.'
];
const videos = [
  { title: 'Video Tutorial 1', embed: 'https://www.youtube.com/embed/Mt0Y5X6885I' },
  { title: 'Video Tutorial 2', embed: 'https://www.youtube.com/embed/6dSVaAaKWSQ' },
  { title: 'Video Tutorial 3', embed: 'https://www.youtube.com/embed/8qaLG730bDw' }
];

function Header({ mobileOpen, setMobileOpen }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="#top" className="brand" aria-label="Equity Master home">Equity Master</a>
        <button className="menu-toggle" type="button" aria-label="Toggle navigation" aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}>
          Menu
        </button>
        <nav className={`nav ${mobileOpen ? 'nav-open' : ''}`}>
          <a href="#investor-centre">Investor Centre</a>
          <a href="#empshare">EmpShare</a>
          <a href="#about-us">About us</a>
          <a href="#insights">Insights</a>
        </nav>
      </div>
    </header>
  );
}

function SectionTabs({ activeTab, setActiveTab }) {
  return (
    <div className="tabs-wrap container">
      <p className="section-kicker centered">Learn more about our technology platforms</p>
      <div className="tabs" role="tablist" aria-label="Technology platform sections">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}

function TwoColumnSection({ id, eyebrow, title, description, points, image, imageAlt, reverse }) {
  return (
    <section id={id} className="feature-section">
      <div className={`container feature-grid ${reverse ? 'reverse' : ''}`}>
        <div className="feature-copy">
          {eyebrow ? <p className="section-kicker">{eyebrow}</p> : null}
          <h2>{title}</h2>
          {Array.isArray(description) ? description.map((text) => <p key={text}>{text}</p>) : <p>{description}</p>}
          {points?.length ? (
            <ul className="feature-list">
              {points.map((point) => <li key={point}>{point}</li>)}
            </ul>
          ) : null}
        </div>
        <div className="feature-visual">
          <img src={image} alt={imageAlt} />
        </div>
      </div>
    </section>
  );
}

function Insights() {
  const items = [
    {
      title: 'Experience',
      text: 'Focused on intuitive digital journeys that support confidence and clarity across every interaction.'
    },
    {
      title: 'Expertise',
      text: 'Built with practical knowledge of shareholder, employee plan and enterprise servicing needs.'
    },
    {
      title: 'Innovation',
      text: 'Modern platform thinking applied carefully to existing business workflows without unnecessary complexity.'
    },
    {
      title: 'Technology',
      text: 'Scalable delivery patterns, responsive experiences and maintainable solutions for evolving products.'
    }
  ];

  return (
    <section id="insights" className="insights-section">
      <div className="container insights-grid">
        {items.map((item) => (
          <article key={item.title} className="insight-item">
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function HelpCenter() {
  const [selectedCategory, setSelectedCategory] = useState('FAQs');
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: 'Hello. How can we help you today?' }
  ]);

  const normalizedSearch = submittedSearch.trim().toLowerCase();

  const filteredFaqItems = useMemo(() => {
    if (!normalizedSearch) return faqItems;
    return faqItems.filter((item) => `${item.question} ${item.answer}`.toLowerCase().includes(normalizedSearch));
  }, [normalizedSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSubmittedSearch(searchTerm);
    if (selectedCategory !== 'FAQs') setSelectedCategory('FAQs');
    setOpenFaq(null);
  };

  const handleChatSend = (e) => {
    e.preventDefault();
    const value = chatInput.trim();
    if (!value) return;
    setChatMessages((prev) => [
      ...prev,
      { role: 'user', text: value },
      { role: 'assistant', text: 'Thanks for your message. A support specialist will review your request shortly.' }
    ]);
    setChatInput('');
  };

  const renderContent = () => {
    if (selectedCategory === 'Getting Started') {
      return (
        <div className="help-panel">
          <h3>Getting Started</h3>
          <p>Start with practical guidance for accessing the platform, reviewing your information and navigating available support options.</p>
          <div className="help-divider" />
          <ul className="help-simple-list">
            <li>Choose the relevant platform section from the page above.</li>
            <li>Sign in to access your investor or employee information.</li>
            <li>Review your activity, documents and available assistance tools.</li>
          </ul>
        </div>
      );
    }

    if (selectedCategory === 'FAQs') {
      return (
        <div className="help-panel">
          <h3>Frequently Asked Questions</h3>
          <p>Browse common questions about the platform, access, documents and support options.</p>
          <div className="help-divider" />
          <div className="faq-list">
            {filteredFaqItems.length ? filteredFaqItems.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div className="faq-item" key={item.question}>
                  <button className="faq-question" type="button" onClick={() => setOpenFaq(isOpen ? null : index)} aria-expanded={isOpen}>
                    <span>{item.question}</span>
                    <span className="faq-icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen ? <div className="faq-answer"><p>{item.answer}</p></div> : null}
                </div>
              );
            }) : <p className="help-empty">No Help Center content matched your search.</p>}
          </div>
        </div>
      );
    }

    if (selectedCategory === 'How-To Guides') {
      return (
        <div className="help-panel">
          <h3>How-To Guides</h3>
          <p>Follow these concise guides for common tasks within the platform experience.</p>
          <div className="help-divider" />
          <ul className="help-simple-list">
            {guides.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      );
    }

    if (selectedCategory === 'Video Tutorials') {
      return (
        <div className="help-panel">
          <h3>Video Tutorials</h3>
          <p>Watch step-by-step tutorials within the Help Center using the existing content area.</p>
          <div className="help-divider" />
          <div className="video-grid">
            {videos.map((video) => (
              <div key={video.title} className="help-video">
                <h4>{video.title}</h4>
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
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (selectedCategory === 'Help Materials') {
      return (
        <div className="help-panel">
          <h3>Help Materials</h3>
          <p>Review practical support materials covering core platform topics.</p>
          <div className="help-divider" />
          <ul className="help-simple-list">
            {materials.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      );
    }

    if (selectedCategory === 'Troubleshooting') {
      return (
        <div className="help-panel">
          <h3>Troubleshooting</h3>
          <p>Use these steps when something is not working as expected.</p>
          <div className="help-divider" />
          <ul className="help-simple-list">
            {troubleshooting.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      );
    }

    return (
      <div className="help-panel">
        <h3>Chat Support</h3>
        <p>Use immediate chat assistance for support within the website.</p>
        <div className="help-divider" />
        <div className="chat-box">
          <div className="chat-messages" aria-live="polite">
            {chatMessages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`chat-message ${message.role}`}>
                <span>{message.text}</span>
              </div>
            ))}
          </div>
          <form className="chat-form" onSubmit={handleChatSend}>
            <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Type your message" aria-label="Type your message" />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <section id="help-center" className="help-center">
      <div className="container">
        <div className="help-center-intro">
          <p className="section-kicker">SUPPORT</p>
          <h2>Help Center</h2>
          <p>Find practical guidance, searchable support content, video tutorials and immediate chat assistance.</p>
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
        <div className="help-center-layout">
          <aside className="help-sidebar" aria-label="Help Center categories">
            {helpCategories.map((category) => (
              <button
                key={category}
                type="button"
                className={`help-category ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCategory(category);
                  setOpenFaq(null);
                }}
              >
                {category}
              </button>
            ))}
          </aside>
          <div className="help-content">
            {renderContent()}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h2>Equity Master</h2>
          <p>Equity Master demonstration experience.</p>
        </div>
        <div>
          <h3>Contact</h3>
          <p><a href="mailto:support@equitymaster.demo">support@equitymaster.demo</a></p>
          <p><a href="#top">Back to top</a></p>
        </div>
      </div>
      <div className="container footer-bottom">© Equity Master</div>
    </footer>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('Investor Centre');
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div id="top" className="app-shell">
      <Header mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <main>
        <SectionTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <TwoColumnSection
          id="investor-centre"
          eyebrow="For shareholders"
          title="Investor Centre"
          description="Introducing the new Investor Centre experience. A modern, intuitive and seamless way to manage your investments online."
          points={[
            'Portfolio holdings and price history',
            'Monitor recent activity',
            'Download documents instantly',
            'Virtual assistance'
          ]}
          image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
          imageAlt="Investor technology workspace"
        />
        <TwoColumnSection
          id="empshare"
          eyebrow="For employee share plan holders"
          title="EmpShare"
          description="EmpShare provides a clear and accessible experience for plan holders, helping them stay informed and act with confidence."
          points={[
            'Intuitive and user-friendly',
            'Real-time data',
            'Simplify tax calculations',
            'Mobile app'
          ]}
          image="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
          imageAlt="Employee collaboration and planning"
          reverse
        />
        <TwoColumnSection
          id="about-us"
          title="About us"
          description={[
            'Purpose-built digital experiences for financial services',
            'Equity Master delivers practical, enterprise-focused platforms that support investors, employees and organisations with secure, approachable digital journeys.',
            'We combine domain understanding, scalable technology and user-centred delivery to create experiences that feel simple while handling complex business needs.'
          ]}
          image="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80"
          imageAlt="Business professionals collaborating"
        />
        <Insights />
        <HelpCenter />
      </main>
      <Footer />
    </div>
  );
}
