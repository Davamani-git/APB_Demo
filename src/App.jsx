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
      'Open the relevant Investor Centre or Employee Share area, then use the Help Center guidance to locate access instructions, platform details and support options.'
  },
  {
    question: 'Where can I download my documents?',
    answer:
      'Documents and reference materials can be accessed through the Help Materials section, where downloadable guides and support PDFs are provided over secure links.'
  },
  {
    question: 'Can I get help without leaving the website?',
    answer:
      'Yes. Use the built-in chat support and embedded tutorials inside the Help Center to get immediate assistance and linked resources without leaving the site.'
  },
  {
    question: 'Is the Help Center available on mobile?',
    answer:
      'Yes. The Help Center layout is responsive and supports browsing categories, searching content and opening support resources on smaller screens.'
  }
];

const helpData = {
  'Getting Started': [
    {
      type: 'article',
      title: 'Access your Equity Portal support resources',
      description: 'Start with the Help Center categories, keyword search and guided support options to find the right content quickly.'
    },
    {
      type: 'article',
      title: 'Choose the right support path',
      description: 'Browse FAQs, how-to guides, downloadable materials, tutorials and chat support from one location.'
    }
  ],
  'How-To Guides': [
    {
      type: 'guide',
      title: 'How to search the Help Center',
      description: 'Enter a keyword to return relevant help articles, videos and materials ranked by relevance.'
    },
    {
      type: 'guide',
      title: 'How to browse support by category',
      description: 'Use the left navigation to switch between Getting Started, FAQs, tutorials, downloadable materials and troubleshooting.'
    },
    {
      type: 'guide',
      title: 'How to use chat support',
      description: 'Open chat support, submit a question and review the assistant response with suggested help links.'
    }
  ],
  Troubleshooting: [
    {
      type: 'issue',
      title: 'Search is not returning enough results',
      description: 'Try shorter keywords such as documents, mobile, chat or access to broaden the result set.'
    },
    {
      type: 'issue',
      title: 'A help material is unavailable',
      description: 'The application displays a meaningful unavailable message if a downloadable resource cannot be opened.'
    },
    {
      type: 'issue',
      title: 'Video cannot be embedded',
      description: 'Unavailable videos show an explanatory message instead of a broken player area.'
    }
  ]
};

const searchableItems = [
  {
    type: 'article',
    category: 'Getting Started',
    title: 'Access your Equity Portal support resources',
    description: 'Start with the Help Center categories, keyword search and guided support options to find the right content quickly.',
    keywords: ['access', 'help center', 'support', 'getting started'],
    rank: 98
  },
  {
    type: 'article',
    category: 'Getting Started',
    title: 'Choose the right support path',
    description: 'Browse FAQs, how-to guides, downloadable materials, tutorials and chat support from one location.',
    keywords: ['faqs', 'guides', 'materials', 'tutorials', 'chat'],
    rank: 91
  },
  {
    type: 'faq',
    category: 'FAQs',
    title: 'How do I access my shareholder or employee information?',
    description: 'Guidance for finding access instructions and support options.',
    keywords: ['access', 'shareholder', 'employee', 'information'],
    rank: 96
  },
  {
    type: 'faq',
    category: 'FAQs',
    title: 'Where can I download my documents?',
    description: 'Find downloadable help materials and secure document links.',
    keywords: ['download', 'documents', 'materials', 'pdf'],
    rank: 95
  },
  {
    type: 'faq',
    category: 'FAQs',
    title: 'Can I get help without leaving the website?',
    description: 'Use embedded support features directly within the Help Center.',
    keywords: ['help', 'website', 'chat', 'video'],
    rank: 90
  },
  {
    type: 'faq',
    category: 'FAQs',
    title: 'Is the Help Center available on mobile?',
    description: 'Responsive support content is available across screen sizes.',
    keywords: ['mobile', 'responsive', 'help center'],
    rank: 88
  },
  {
    type: 'guide',
    category: 'How-To Guides',
    title: 'How to search the Help Center',
    description: 'Enter a keyword to return relevant help articles, videos and materials ranked by relevance.',
    keywords: ['search', 'keyword', 'relevance', 'results'],
    rank: 99
  },
  {
    type: 'guide',
    category: 'How-To Guides',
    title: 'How to browse support by category',
    description: 'Use the left navigation to switch between support content types.',
    keywords: ['category', 'navigation', 'browse', 'articles'],
    rank: 87
  },
  {
    type: 'video',
    category: 'Video Tutorials',
    title: 'Video Tutorial 1',
    description: 'Embedded visual tutorial available within the Help Center.',
    keywords: ['video', 'tutorial', 'playback', 'learn'],
    rank: 93
  },
  {
    type: 'video',
    category: 'Video Tutorials',
    title: 'Video Tutorial 2',
    description: 'Additional embedded support video with playback controls.',
    keywords: ['video', 'tutorial', 'controls', 'support'],
    rank: 89
  },
  {
    type: 'video',
    category: 'Video Tutorials',
    title: 'Video Tutorial 3',
    description: 'Embedded tutorial content for visual learning inside the site.',
    keywords: ['video', 'embedded', 'visual', 'tutorial'],
    rank: 86
  },
  {
    type: 'material',
    category: 'Help Materials',
    title: 'Employee Share Document Guide',
    description: 'Downloadable PDF support guide for offline access.',
    keywords: ['pdf', 'download', 'document guide', 'employee share'],
    rank: 94
  },
  {
    type: 'material',
    category: 'Help Materials',
    title: 'Employee Share Vesting Guide',
    description: 'Downloadable PDF explaining vesting-related help information.',
    keywords: ['pdf', 'vesting', 'guide', 'download'],
    rank: 92
  },
  {
    type: 'material',
    category: 'Help Materials',
    title: 'Employee Quick Reference',
    description: 'Quick offline reference material for help and support topics.',
    keywords: ['pdf', 'quick reference', 'help material'],
    rank: 85
  },
  {
    type: 'issue',
    category: 'Troubleshooting',
    title: 'Search is not returning enough results',
    description: 'Use broader keywords such as access, documents, mobile or chat.',
    keywords: ['search', 'results', 'keyword', 'troubleshooting'],
    rank: 84
  },
  {
    type: 'chat',
    category: 'Chat Support',
    title: 'Interactive chat assistant',
    description: 'Submit a question and receive a real-time response with relevant help links.',
    keywords: ['chat', 'assistant', 'real-time', 'help'],
    rank: 97
  }
];

const videos = [
  {
    title: 'Video Tutorial 1',
    url: 'https://youtu.be/Mt0Y5X6885I',
    embed: 'https://www.youtube.com/embed/Mt0Y5X6885I',
    available: true
  },
  {
    title: 'Video Tutorial 2',
    url: 'https://www.youtube.com/watch?v=6dSVaAaKWSQ',
    embed: 'https://www.youtube.com/embed/6dSVaAaKWSQ',
    available: true
  },
  {
    title: 'Video Tutorial 3',
    url: 'https://www.youtube.com/watch?v=8qaLG730bDw&t=20s&pp=ygUWbWFzaGFibGUgbW9ybmluZyB3aSBLS9IHCQkaDAGHKiGM7w%3D%3D',
    embed: 'https://www.youtube.com/embed/8qaLG730bDw',
    available: true
  }
];

const materials = [
  {
    title: 'Employee Share Document Guide',
    description: 'Download a practical guide covering support materials and document access.',
    url: 'https://drive.google.com/file/d/1HqLeSEbVZz3JWwxSX5TgsJd7Q0x3xdVk/view?usp=drive_link',
    available: true
  },
  {
    title: 'Employee Share Vesting Guide',
    description: 'Download vesting-related support guidance for offline reference.',
    url: 'https://drive.google.com/file/d/1Uc5E21E6CIummBqCDs5zYk2mLbZ_ur5y/view?usp=drive_link',
    available: true
  },
  {
    title: 'Employee Quick Reference',
    description: 'Download a concise employee help reference document.',
    url: 'https://drive.google.com/file/d/1ErTOSOIThyzHUCLz8QilIwZ3u5A6ENk9/view?usp=drive_link',
    available: true
  }
];

const chatReplies = {
  access:
    'For access help, review Getting Started and FAQs. Helpful links: Access your Equity Portal support resources, How do I access my shareholder or employee information?',
  documents:
    'For documents, open Help Materials or review the FAQ: Where can I download my documents? Helpful links: Employee Share Document Guide, Employee Quick Reference.',
  video:
    'For visual guidance, open Video Tutorials. Helpful links: Video Tutorial 1, Video Tutorial 2, Video Tutorial 3.',
  mobile:
    'Mobile support is available through the responsive Help Center. Helpful link: Is the Help Center available on mobile?',
  chat:
    'You are already in Chat Support. Helpful links: Interactive chat assistant, How to use chat support.',
  default:
    'I found support options for your request. Helpful links: How to search the Help Center, Choose the right support path, Interactive chat assistant.'
};

function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="#top">Equity Portal</a>
        <nav className="primary-nav" aria-label="Primary navigation">
          <a href="#investor-centre">Investor Centre</a>
          <a href="#emp-share">EmpShare / Employee Share</a>
          <a href="#about-us">About Us</a>
          <a href="#technology-platforms">Technology Platforms</a>
          <a href="#help-center">Help Center</a>
        </nav>
      </div>
    </header>
  );
}

function TwoColumnSection({ id, eyebrow, title, text, image, reverse = false }) {
  return (
    <section id={id} className="section two-column-section">
      <div className={`container split-layout ${reverse ? 'reverse' : ''}`}>
        <div className="section-copy">
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <div className="section-visual">
          <img src={image} alt={title} />
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
        <p className="eyebrow">PLATFORMS</p>
        <h2>Learn more about our technology platforms</h2>
        <div className="tech-grid">
          {items.map((item) => (
            <div key={item} className="tech-item">
              <span className="tech-accent" aria-hidden="true"></span>
              <h3>{item}</h3>
              <p>
                {item === 'Experience' && 'Accessible support content designed for efficient discovery across the portal.'}
                {item === 'Expertise' && 'Structured guidance and practical resources organized for quick decision-making.'}
                {item === 'Innovation' && 'Integrated tutorials, chat assistance and search-led support journeys.'}
                {item === 'Technology' && 'Responsive digital tooling that keeps support resources within easy reach.'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SearchResults({ query, results }) {
  if (!query) return null;

  return (
    <div className="help-search-results">
      <div className="help-search-header">
        <h3>Search Results</h3>
        <p>
          {results.length > 0
            ? `${results.length} result${results.length === 1 ? '' : 's'} matched your search.`
            : 'No results matched your search.'}
        </p>
      </div>
      {results.length > 0 ? (
        <div className="search-result-list">
          {results.map((result) => (
            <div key={`${result.category}-${result.title}`} className="search-result-item">
              <div>
                <p className="result-meta">{result.category} • {result.type}</p>
                <h4>{result.title}</h4>
                <p>{result.description}</p>
              </div>
              <span className="result-rank">Rank {result.rank}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="help-state">Try searching for access, documents, mobile, chat or video.</div>
      )}
    </div>
  );
}

function FAQSection({ expandedFaqs, toggleFaq }) {
  return (
    <div className="help-panel">
      <h3>Frequently Asked Questions</h3>
      <p>Browse common questions about the platform, access, documents and support options.</p>
      <div className="panel-divider"></div>
      <div className="faq-list">
        {faqItems.map((item, index) => {
          const expanded = expandedFaqs.includes(index);
          return (
            <div key={item.question} className="faq-item">
              <button className="faq-question" onClick={() => toggleFaq(index)} aria-expanded={expanded}>
                <span>{item.question}</span>
                <span className="faq-toggle" aria-hidden="true">{expanded ? '−' : '+'}</span>
              </button>
              {expanded ? <div className="faq-answer"><p>{item.answer}</p></div> : null}
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
      <p>Play support tutorials directly within the Help Center.</p>
      <div className="panel-divider"></div>
      <div className="video-grid">
        {videos.map((video) => (
          <div key={video.title} className="video-item">
            <h4>{video.title}</h4>
            {video.available ? (
              <div className="video-frame-wrap">
                <iframe
                  src={video.embed}
                  title={video.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div className="help-state">This video is currently unavailable for embedding. Please try again later.</div>
            )}
            <a href={video.url} target="_blank" rel="noreferrer" className="text-link">Open source video</a>
          </div>
        ))}
      </div>
    </div>
  );
}

function HelpMaterials() {
  const [errorIndex, setErrorIndex] = useState(null);

  const handleDownload = (item, index) => {
    if (!item.available) {
      setErrorIndex(index);
      return;
    }
    setErrorIndex(null);
    window.open(item.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="help-panel">
      <h3>Help Materials</h3>
      <p>Download user guides and support PDFs for offline access.</p>
      <div className="panel-divider"></div>
      <div className="material-list">
        {materials.map((item, index) => (
          <div key={item.title} className="material-item">
            <div>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
              {errorIndex === index ? (
                <p className="inline-error">This file is currently unavailable. Please try again later.</p>
              ) : null}
            </div>
            <button className="secondary-button" onClick={() => handleDownload(item, index)}>
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArticleList({ title, description, items }) {
  return (
    <div className="help-panel">
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="panel-divider"></div>
      <div className="article-list">
        {items.map((item) => (
          <div key={item.title} className="article-item">
            <h4>{item.title}</h4>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatSupport() {
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: 'Hello. Ask a support question and I will return relevant help article links.'
    }
  ]);
  const [input, setInput] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const lower = trimmed.toLowerCase();
    let reply = chatReplies.default;

    if (lower.includes('access') || lower.includes('login') || lower.includes('employee') || lower.includes('shareholder')) {
      reply = chatReplies.access;
    } else if (lower.includes('document') || lower.includes('pdf') || lower.includes('download')) {
      reply = chatReplies.documents;
    } else if (lower.includes('video') || lower.includes('tutorial')) {
      reply = chatReplies.video;
    } else if (lower.includes('mobile') || lower.includes('phone')) {
      reply = chatReplies.mobile;
    } else if (lower.includes('chat') || lower.includes('assistant')) {
      reply = chatReplies.chat;
    }

    setMessages((current) => [
      ...current,
      { sender: 'user', text: trimmed },
      { sender: 'assistant', text: reply }
    ]);
    setInput('');
  };

  return (
    <div className="help-panel">
      <h3>Chat Support</h3>
      <p>Open the assistant and submit a question for immediate guidance and relevant help links.</p>
      <div className="panel-divider"></div>
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={`${message.sender}-${index}`} className={`chat-message ${message.sender}`}>
            <span className="chat-role">{message.sender === 'assistant' ? 'Assistant' : 'You'}</span>
            <p>{message.text}</p>
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
        <button type="submit" className="search-button">Send</button>
      </form>
    </div>
  );
}

function HelpCenter() {
  const [selectedCategory, setSelectedCategory] = useState('FAQs');
  const [expandedFaqs, setExpandedFaqs] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    return searchableItems
      .filter((item) => {
        const text = `${item.title} ${item.description} ${item.category} ${item.keywords.join(' ')}`.toLowerCase();
        return text.includes(trimmed);
      })
      .sort((a, b) => b.rank - a.rank);
  }, [query]);

  const handleSearch = (event) => {
    event.preventDefault();
    setQuery(searchInput.trim());
  };

  const toggleFaq = (index) => {
    setExpandedFaqs((current) =>
      current.includes(index) ? current.filter((item) => item !== index) : [...current, index]
    );
  };

  const renderContent = () => {
    if (selectedCategory === 'FAQs') {
      return <FAQSection expandedFaqs={expandedFaqs} toggleFaq={toggleFaq} />;
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

    if (selectedCategory === 'Getting Started') {
      return (
        <ArticleList
          title="Getting Started"
          description="Begin with practical guidance to locate support content and use Help Center tools effectively."
          items={helpData['Getting Started']}
        />
      );
    }

    if (selectedCategory === 'How-To Guides') {
      return (
        <ArticleList
          title="How-To Guides"
          description="Follow practical steps for using support tools, navigation and search."
          items={helpData['How-To Guides']}
        />
      );
    }

    if (selectedCategory === 'Troubleshooting') {
      return (
        <ArticleList
          title="Troubleshooting"
          description="Review common support issues and practical next steps."
          items={helpData.Troubleshooting}
        />
      );
    }

    return <div className="help-state">Select a category to view support content.</div>;
  };

  return (
    <section id="help-center" className="section help-center">
      <div className="container">
        <div className="help-center-intro">
          <p className="eyebrow">SUPPORT</p>
          <h2>Help Center</h2>
          <p>Find practical guidance, searchable support content, video tutorials and immediate chat assistance.</p>
        </div>

        <form className="help-center-search" onSubmit={handleSearch}>
          <input
            type="text"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search Help Center content"
            aria-label="Search Help Center content"
          />
          <button type="submit" className="search-button">Search</button>
        </form>

        <SearchResults query={query} results={results} />

        <div className="help-center-layout">
          <aside className="help-sidebar" aria-label="Help Center categories">
            {categories.map((category) => (
              <button
                key={category}
                className={`help-nav-item ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </aside>
          <div className="help-content">{renderContent()}</div>
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
          <h3>Equity Portal</h3>
          <p>Investor information, employee share support and practical help resources in one place.</p>
        </div>
        <a href="#top" className="text-link footer-link">Back to top</a>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div id="top" className="app-shell">
      <Header />
      <main>
        <TwoColumnSection
          id="investor-centre"
          eyebrow="INVESTOR CENTRE"
          title="Investor Centre"
          text="Access a streamlined view of corporate support information, platform guidance and practical resources designed to help investors locate relevant information efficiently."
          image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
        />
        <TwoColumnSection
          id="emp-share"
          eyebrow="EMPSHARE / EMPLOYEE SHARE"
          title="EmpShare / Employee Share"
          text="Explore employee-share support resources, help guidance and practical assistance designed for clear navigation and efficient access to information."
          image="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
          reverse
        />
        <TwoColumnSection
          id="about-us"
          eyebrow="ABOUT US"
          title="About Us"
          text="We provide a professional, technology-led experience that brings together support content, practical guidance and responsive access across key Equity Portal services."
          image="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80"
        />
        <TechnologyPlatforms />
        <HelpCenter />
      </main>
      <Footer />
    </div>
  );
}
