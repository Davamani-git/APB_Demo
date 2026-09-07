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
    answer: 'Use the relevant Equity Portal area from the home page and follow the guided access steps provided in Getting Started to view your shareholder or employee information securely.'
  },
  {
    question: 'Where can I download my documents?',
    answer: 'Documents and supporting files are available in the Help Materials section, where downloadable PDF guides can be opened securely over HTTPS.'
  },
  {
    question: 'Can I get help without leaving the website?',
    answer: 'Yes. The integrated chat support experience provides immediate automated assistance and can recommend relevant help articles and materials directly within the Help Center.'
  },
  {
    question: 'Is the Help Center available on mobile?',
    answer: 'Yes. The Help Center is designed responsively so you can search, browse categories, view tutorials and access support content on smaller screens.'
  }
];

const helpContent = {
  'Getting Started': [
    'Create a smooth onboarding path by using the Help Center entry point from the Home Page.',
    'Browse categorized support topics to quickly find platform guidance and next steps.',
    'Use the search field to locate onboarding resources and support materials efficiently.'
  ],
  'How-To Guides': [
    'Find practical walkthroughs for common platform tasks and support journeys.',
    'Review guided steps for accessing information, documents and available help options.',
    'Use concise instructional content structured for fast scanning and easy follow-up.'
  ],
  Troubleshooting: [
    'Review issue-focused guidance organized by category to resolve common user problems.',
    'Use the Help Center search to locate troubleshooting topics using relevant keywords.',
    'Access recommended help content and support materials when additional assistance is needed.'
  ]
};

const pdfMaterials = [
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

const videoTutorials = [
  {
    title: 'Platform Overview Tutorial',
    embed: 'https://www.youtube.com/embed/Mt0Y5X6885I'
  },
  {
    title: 'Feature Walkthrough Tutorial',
    embed: 'https://www.youtube.com/embed/6dSVaAaKWSQ'
  },
  {
    title: 'Support Experience Tutorial',
    embed: 'https://www.youtube.com/embed/8qaLG730bDw'
  }
];

const searchableItems = [
  { type: 'Article', title: 'Getting Started with Equity Portal', category: 'Getting Started' },
  { type: 'Article', title: 'Frequently Asked Questions', category: 'FAQs' },
  { type: 'Article', title: 'Troubleshooting platform access and documents', category: 'Troubleshooting' },
  { type: 'Video', title: 'Platform Overview Tutorial', category: 'Video Tutorials' },
  { type: 'Video', title: 'Feature Walkthrough Tutorial', category: 'Video Tutorials' },
  { type: 'Material', title: 'Employee Share Document Guide', category: 'Help Materials' },
  { type: 'Material', title: 'Employee Share Vesting Guide', category: 'Help Materials' },
  { type: 'Material', title: 'Employee Quick Reference', category: 'Help Materials' }
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

function SplitSection({ id, title, text, image, reverse = false, eyebrow }) {
  return (
    <section id={id} className="split-section section">
      <div className={`container split-grid ${reverse ? 'reverse' : ''}`}>
        <div className="split-copy">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
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
    <section id="technology-platforms" className="section technology-section">
      <div className="container">
        <p className="eyebrow">PLATFORMS</p>
        <h2>Learn more about our technology platforms</h2>
        <div className="tech-grid">
          {items.map((item) => (
            <div key={item} className="tech-item">
              <span className="tech-accent" />
              <h3>{item}</h3>
              <p>
                Explore focused platform information designed to support efficient access,
                guidance and digital service delivery.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQs({ expandedFaq, onToggle }) {
  return (
    <div>
      <h3>Frequently Asked Questions</h3>
      <p className="help-description">
        Browse common questions about the platform, access, documents and support options.
      </p>
      <div className="content-divider" />
      <div className="faq-list">
        {faqItems.map((item, index) => {
          const isOpen = expandedFaq === index;
          return (
            <div className="faq-item" key={item.question}>
              <button className="faq-trigger" onClick={() => onToggle(index)} aria-expanded={isOpen}>
                <span>{item.question}</span>
                <span className="faq-icon">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen ? <p className="faq-answer">{item.answer}</p> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function VideoTutorials() {
  return (
    <div className="help-panel">
      <h3>Video Tutorials</h3>
      <p className="help-description">
        Watch embedded tutorials directly within the Help Center for visual guidance on key platform tasks.
      </p>
      <div className="content-divider" />
      <div className="video-grid">
        {videoTutorials.map((video) => (
          <div className="video-item" key={video.title}>
            <div className="video-frame">
              <iframe
                src={video.embed}
                title={video.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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

function HelpMaterials() {
  return (
    <div className="help-panel">
      <h3>Help Materials</h3>
      <p className="help-description">
        Download PDF user guides and training documents for secure offline access when needed.
      </p>
      <div className="content-divider" />
      <div className="materials-list">
        {pdfMaterials.map((item) => (
          <a key={item.title} className="material-link" href={item.url} target="_blank" rel="noreferrer">
            <span>{item.title}</span>
            <span>Download</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function ChatSupport() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello. Ask a question and I can provide immediate guidance along with relevant help article and material links.'
    }
  ]);
  const [input, setInput] = useState('');

  const buildResponse = (query) => {
    const lower = query.toLowerCase();
    if (lower.includes('document') || lower.includes('pdf') || lower.includes('download')) {
      return {
        text: 'You can access downloadable guidance in Help Materials. Recommended resources: Employee Share Document Guide and Employee Share Vesting Guide.',
        links: [
          { label: 'Employee Share Document Guide', href: pdfMaterials[0].url },
          { label: 'Employee Share Vesting Guide', href: pdfMaterials[1].url }
        ]
      };
    }
    if (lower.includes('trouble') || lower.includes('issue') || lower.includes('access')) {
      return {
        text: 'For troubleshooting, review category-based support content and start with access and onboarding guidance. I also recommend Frequently Asked Questions and Troubleshooting content.',
        links: [
          { label: 'Frequently Asked Questions', href: '#help-center' },
          { label: 'Troubleshooting', href: '#help-center' }
        ]
      };
    }
    if (lower.includes('video') || lower.includes('tutorial')) {
      return {
        text: 'Video tutorials are available directly in the Help Center and can be played in place with accessible controls.',
        links: [{ label: 'Video Tutorials', href: '#help-center' }]
      };
    }
    return {
      text: 'I can help with onboarding, access, tutorials, downloadable materials and troubleshooting. Try asking about documents, videos or platform access.',
      links: [{ label: 'Getting Started', href: '#help-center' }]
    };
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const response = buildResponse(trimmed);
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: trimmed },
      { role: 'assistant', text: response.text, links: response.links }
    ]);
    setInput('');
  };

  return (
    <div className="help-panel">
      <h3>Chat Support</h3>
      <p className="help-description">
        Receive immediate automated assistance and contextual links to relevant help articles and materials.
      </p>
      <div className="content-divider" />
      <div className="chat-box">
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`chat-message ${message.role}`}>
              <p>{message.text}</p>
              {message.links ? (
                <div className="chat-links">
                  {message.links.map((link) => (
                    <a key={link.label} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noreferrer' : undefined}>
                      {link.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <form className="chat-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask a support question"
            aria-label="Ask a support question"
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

function HelpCenter() {
  const [selectedCategory, setSelectedCategory] = useState('FAQs');
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const searchResults = useMemo(() => {
    const term = submittedSearch.trim().toLowerCase();
    if (!term) return [];
    return searchableItems.filter((item) => {
      return (
        item.title.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term) ||
        item.type.toLowerCase().includes(term)
      );
    });
  }, [submittedSearch]);

  const handleSearch = (event) => {
    event.preventDefault();
    setSubmittedSearch(searchTerm);
  };

  const handleToggleFaq = (index) => {
    setExpandedFaq((current) => (current === index ? null : index));
  };

  const renderMainContent = () => {
    if (submittedSearch.trim()) {
      return (
        <div className="help-panel">
          <h3>Search Results</h3>
          <p className="help-description">
            Relevant search results including articles, videos, and downloadable materials.
          </p>
          <div className="content-divider" />
          {searchResults.length ? (
            <div className="search-results">
              {searchResults.map((result) => (
                <div key={`${result.type}-${result.title}`} className="search-result-row">
                  <span>{result.title}</span>
                  <span>{result.type}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No matching help content was found for your search.</p>
          )}
        </div>
      );
    }

    if (selectedCategory === 'FAQs') {
      return <FAQs expandedFaq={expandedFaq} onToggle={handleToggleFaq} />;
    }
    if (selectedCategory === 'Video Tutorials') {
      return <VideoTutorials />;
    }
    if (selectedCategory === 'Help Materials') {
      return <HelpMaterials />;
    }
    if (selectedCategory === 'Chat Support') {
      return <ChatSupport />;
    }

    return (
      <div className="help-panel">
        <h3>{selectedCategory}</h3>
        <p className="help-description">
          Relevant help articles and materials are displayed for the selected support category.
        </p>
        <div className="content-divider" />
        <div className="text-list">
          {(helpContent[selectedCategory] || []).map((item) => (
            <div key={item} className="text-list-row">
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section id="help-center" className="section help-center">
      <div className="container">
        <div className="help-header">
          <p className="eyebrow">SUPPORT</p>
          <h2>Help Center</h2>
          <p className="help-intro">
            Find practical guidance, searchable support content, video tutorials and immediate chat assistance.
          </p>
        </div>

        <form className="help-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search Help Center content"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            aria-label="Search Help Center content"
          />
          <button type="submit">Search</button>
        </form>

        <div className="help-layout">
          <aside className="help-sidebar" aria-label="Help Center categories">
            {categories.map((category) => {
              const active = selectedCategory === category && !submittedSearch.trim();
              return (
                <button
                  key={category}
                  className={`help-nav-item ${active ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCategory(category);
                    setSubmittedSearch('');
                  }}
                  type="button"
                >
                  {category}
                </button>
              );
            })}
          </aside>
          <div className="help-main">{renderMainContent()}</div>
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
          <p>Corporate access to investor information, employee share resources and support content.</p>
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
        <SplitSection
          id="investor-centre"
          eyebrow="INVESTOR CENTRE"
          title="Investor Centre"
          text="Access core investor information through a clean, professional experience designed for efficient navigation, clear communications and dependable support content."
          image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
        />
        <SplitSection
          id="empshare"
          eyebrow="EMPLOYEE SHARE"
          title="EmpShare"
          text="Explore employee share information in a straightforward two-column layout that keeps access to guidance, documents and support pathways easy to understand."
          image="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
          reverse
        />
        <SplitSection
          id="about-us"
          eyebrow="ABOUT US"
          title="About Us"
          text="We provide a focused digital experience for investor and employee-share services with a simple, responsive interface aligned to corporate financial-services standards."
          image="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80"
        />
        <TechnologyPlatforms />
        <HelpCenter />
      </main>
      <Footer />
    </div>
  );
}
