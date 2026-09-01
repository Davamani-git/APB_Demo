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
    answer: 'Use your existing secure account credentials to sign in through the portal, then open the relevant holdings or employee plan area to review personal records and account information.'
  },
  {
    question: 'Where can I download my documents?',
    answer: 'Documents are available from the statements and documents areas within the platform, where you can download forms, notices and historical files relevant to your account.'
  },
  {
    question: 'Can I get help without leaving the website?',
    answer: 'Yes. The Help Center includes searchable content, categorized guidance, embedded video tutorials and an in-page chat support experience for immediate assistance.'
  },
  {
    question: 'Is the Help Center available on mobile?',
    answer: 'Yes. The Help Center uses the same responsive layout patterns as the rest of the application, allowing access across mobile, tablet and desktop devices.'
  }
];

const contentMap = {
  'Getting Started': [
    { title: 'Create and access your account', body: 'Learn the first steps for signing in, verifying your access and navigating the portal securely.' },
    { title: 'Understand your dashboard', body: 'A practical guide to key platform areas, common account actions and where to locate important information.' },
    { title: 'Prepare your profile details', body: 'Review contact details, preferences and account settings to ensure you receive the right communications.' }
  ],
  'How-To Guides': [
    { title: 'Download statements and notices', body: 'Follow the standard path for locating and downloading available account documents.' },
    { title: 'Review transaction history', body: 'See how to locate historical transactions and interpret activity information in the platform.' },
    { title: 'Update your communication preferences', body: 'Manage contact choices and preferences while preserving secure access requirements.' }
  ],
  'Help Materials': [
    { title: 'Account Access Checklist (PDF)', body: 'Download a concise checklist for first-time access, password readiness and account verification.' },
    { title: 'Document Retrieval Guide (PDF)', body: 'A reference guide explaining where to locate statements, notices and downloadable files.' },
    { title: 'Mobile Usage Overview (PDF)', body: 'Best-practice guidance for using portal functions and support features on smaller screens.' }
  ],
  'Troubleshooting': [
    { title: 'I cannot sign in', body: 'Check your credentials, browser settings and any recent password reset messages before retrying securely.' },
    { title: 'A document is not appearing', body: 'Confirm the document type, availability period and the correct platform area for your account.' },
    { title: 'A page is slow to load', body: 'Refresh the page, check your connection and retry the task. If needed, use chat support for immediate assistance.' }
  ]
};

const videos = [
  {
    title: 'Platform Setup Overview',
    description: 'A quick visual introduction to getting started with the portal and locating support content.',
    embed: 'https://www.youtube.com/embed/Mt0Y5X6885I'
  },
  {
    title: 'Using Support Content Effectively',
    description: 'See how to navigate help categories and find practical guidance relevant to your tasks.',
    embed: 'https://www.youtube.com/embed/6dSVaAaKWSQ'
  },
  {
    title: 'Onboarding Walkthrough',
    description: 'A guided onboarding video demonstrating common user actions and help pathways.',
    embed: 'https://www.youtube.com/embed/8qaLG730bDw'
  }
];

const initialMessages = [
  {
    sender: 'assistant',
    text: 'Hello. I can help with account access, documents, navigation and support options. How can I assist you today?'
  }
];

function HelpCenter() {
  const [selectedCategory, setSelectedCategory] = useState('Getting Started');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState(initialMessages);

  const searchIndex = useMemo(() => {
    const articleEntries = Object.entries(contentMap).flatMap(([category, items]) =>
      items.map((item) => ({ type: category === 'Help Materials' ? 'Material' : 'Article', category, ...item }))
    );
    const faqEntries = faqItems.map((item) => ({
      type: 'FAQ',
      category: 'FAQs',
      title: item.question,
      body: item.answer
    }));
    const videoEntries = videos.map((item) => ({
      type: 'Video',
      category: 'Video Tutorials',
      title: item.title,
      body: item.description
    }));
    return [...articleEntries, ...faqEntries, ...videoEntries];
  }, []);

  const runSearch = () => {
    const term = searchInput.trim().toLowerCase();
    if (!term) {
      setSearchResults([]);
      return;
    }
    const results = searchIndex.filter((item) => {
      const haystack = `${item.title} ${item.body} ${item.category} ${item.type}`.toLowerCase();
      return haystack.includes(term);
    });
    setSearchResults(results);
  };

  const handleFaqToggle = (index) => {
    setExpandedFaq((current) => (current === index ? null : index));
  };

  const activateCategory = (category) => {
    setSelectedCategory(category);
    if (category === 'Chat Support') {
      setChatOpen(true);
    }
  };

  const handleChatOpen = () => {
    setSelectedCategory('Chat Support');
    setChatOpen(true);
  };

  const handleSendMessage = () => {
    const value = chatInput.trim();
    if (!value) return;
    const userMessage = { sender: 'user', text: value };
    const lower = value.toLowerCase();
    let reply = 'Thanks for your message. A support response has been prepared and your request can continue within this chat window.';
    if (lower.includes('document')) reply = 'You can usually find documents in the statements or documents area of the platform. If you tell me the document type, I can guide you further.';
    if (lower.includes('access') || lower.includes('login') || lower.includes('sign in')) reply = 'For access issues, confirm your credentials, then retry sign-in securely. If the issue persists, use the password reset process or continue here for more help.';
    if (lower.includes('personal') || lower.includes('gdpr') || lower.includes('privacy')) reply = 'This chat experience is presented over a secure connection and is designed to support GDPR-conscious handling of personal information. Please avoid sharing unnecessary sensitive data.';
    setMessages((current) => [...current, userMessage, { sender: 'assistant', text: reply }]);
    setChatInput('');
  };

  const renderCategoryContent = () => {
    if (searchInput.trim() && searchResults.length > 0) {
      return (
        <div className="help-content">
          <h3>Search Results</h3>
          <p className="section-copy">Relevant results including articles, videos, and downloadable materials are displayed below.</p>
          <div className="divider" />
          <div className="search-results">
            {searchResults.map((result, index) => (
              <div className="search-result-item" key={`${result.type}-${result.title}-${index}`}>
                <h4>{result.title}</h4>
                <p>{result.body}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (searchInput.trim() && searchResults.length === 0) {
      return (
        <div className="help-content">
          <h3>Search Results</h3>
          <p className="section-copy">No relevant content was found for the current keyword. Try another term to search across articles, videos and materials.</p>
          <div className="divider" />
          <p className="empty-state">No results available.</p>
        </div>
      );
    }

    if (selectedCategory === 'FAQs') {
      return (
        <div className="help-content">
          <h3>Frequently Asked Questions</h3>
          <p className="section-copy">Browse common questions about the platform, access, documents and support options.</p>
          <div className="divider" />
          <div className="faq-list">
            {faqItems.map((item, index) => {
              const expanded = expandedFaq === index;
              return (
                <div className="faq-item" key={item.question}>
                  <button className="faq-question" onClick={() => handleFaqToggle(index)} aria-expanded={expanded}>
                    <span>{item.question}</span>
                    <span className="circle-toggle" aria-hidden="true">{expanded ? '−' : '+'}</span>
                  </button>
                  {expanded ? <div className="faq-answer">{item.answer}</div> : null}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (selectedCategory === 'Video Tutorials') {
      return (
        <div className="help-content">
          <h3>Video Tutorials</h3>
          <p className="section-copy">Watch embedded tutorials that support product setup, onboarding and common tasks without leaving the Help Center.</p>
          <div className="divider" />
          <div className="video-grid">
            {videos.map((video) => (
              <div className="video-card" key={video.title}>
                {video.embed ? (
                  <div className="video-embed">
                    <iframe
                      src={video.embed}
                      title={video.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="video-unavailable">Video unavailable for embedding at this time.</div>
                )}
                <h4>{video.title}</h4>
                <p>{video.description}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (selectedCategory === 'Help Materials') {
      return (
        <div className="help-content">
          <h3>Help Materials</h3>
          <p className="section-copy">Access downloadable reference materials and practical guides for common support needs.</p>
          <div className="divider" />
          <div className="material-list">
            {contentMap['Help Materials'].map((item) => (
              <div className="material-item" key={item.title}>
                <h4>{item.title}</h4>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (selectedCategory === 'Chat Support') {
      return (
        <div className="help-content">
          <h3>Chat Support</h3>
          <p className="section-copy">Get immediate assistance in a secure in-page chat experience designed for urgent support needs.</p>
          <div className="divider" />
          <div className="chat-panel">
            <h4>Support Assistant</h4>
            <p className="chat-meta">Chat window opens in-page and supports sending and receiving messages.</p>
            {chatOpen ? (
              <>
                <div className="chat-window" aria-live="polite">
                  {messages.map((message, index) => (
                    <div className={`chat-message ${message.sender}`} key={`${message.sender}-${index}`}>
                      {message.text}
                    </div>
                  ))}
                </div>
                <div className="chat-input-row">
                  <textarea
                    value={chatInput}
                    onChange={(event) => setChatInput(event.target.value)}
                    placeholder="Type your message"
                    aria-label="Chat message"
                  />
                  <button className="primary-button" onClick={handleSendMessage}>Send</button>
                </div>
                <p className="chat-disclaimer">Secure chat support is presented over HTTPS and is designed to support GDPR-conscious handling of personal information.</p>
              </>
            ) : (
              <button className="primary-button" onClick={handleChatOpen}>Open Chat Assistant</button>
            )}
          </div>
        </div>
      );
    }

    const items = contentMap[selectedCategory] || contentMap['Getting Started'];
    return (
      <div className="help-content">
        <h3>{selectedCategory}</h3>
        <p className="section-copy">Browse relevant articles and practical guidance for this support area.</p>
        <div className="divider" />
        <div className="article-list">
          {items.map((item) => (
            <div className="article-item" key={item.title}>
              <h4>{item.title}</h4>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="help-center" id="help-center">
      <div className="container">
        <div className="help-center-intro">
          <p className="section-label">SUPPORT</p>
          <h2>Help Center</h2>
          <p>Find practical guidance, searchable support content, video tutorials and immediate chat assistance.</p>
        </div>

        <div className="help-center-search">
          <input
            type="text"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search Help Center content"
            aria-label="Search Help Center content"
          />
          <button className="primary-button" onClick={runSearch}>Search</button>
        </div>

        <div className="help-center-layout">
          <div className="help-sidebar" role="tablist" aria-label="Help Center categories">
            {categories.map((category) => (
              <button
                key={category}
                className={`help-sidebar-item${selectedCategory === category ? ' is-selected' : ''}`}
                onClick={() => activateCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          {renderCategoryContent()}
        </div>
      </div>
    </section>
  );
}

export default HelpCenter;
