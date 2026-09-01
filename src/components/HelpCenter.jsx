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
    answer: 'Sign in through the relevant portal area to review your profile, holdings, plan details and recent activity from a secure account dashboard.'
  },
  {
    question: 'Where can I download my documents?',
    answer: 'Documents are available from the relevant statements, communications or plan-document areas where downloadable files can be opened or saved for offline access.'
  },
  {
    question: 'Can I get help without leaving the website?',
    answer: 'Yes. The Help Center provides FAQs, guides, materials, embedded video tutorials and automated chat support directly within the website.'
  },
  {
    question: 'Is the Help Center available on mobile?',
    answer: 'Yes. The Help Center layout and interactions are designed to remain usable and visually consistent across mobile and desktop devices.'
  }
];

const materials = [
  {
    title: 'User Guide PDF',
    description: 'Platform overview, account access steps and document guidance in downloadable PDF format.',
    filename: 'equity-portal-user-guide.pdf',
    content: 'Equity Portal User Guide\n\nThis document provides support guidance for account access, document retrieval, mobile use and help resources.'
  },
  {
    title: 'Employee Share Guide PDF',
    description: 'Offline support material covering EmpShare navigation and common actions.',
    filename: 'empshare-guide.pdf',
    content: 'EmpShare Guide\n\nThis guide covers employee share-plan support topics, access help and resource navigation.'
  }
];

const videos = [
  {
    title: 'Getting started tutorial',
    url: 'https://www.youtube.com/embed/Mt0Y5X6885I',
    fallback: 'https://youtu.be/Mt0Y5X6885I'
  },
  {
    title: 'Platform navigation walkthrough',
    url: 'https://www.youtube.com/embed/6dSVaAaKWSQ',
    fallback: 'https://www.youtube.com/watch?v=6dSVaAaKWSQ'
  },
  {
    title: 'Support and onboarding overview',
    url: 'https://www.youtube.com/embed/8qaLG730bDw?start=20',
    fallback: 'https://www.youtube.com/watch?v=8qaLG730bDw&t=20s&pp=ygUWbWFzaGFibGUgbW9ybmluZyB3aSBLS9IHCQkaDAGHKiGM7w%3D%3D'
  }
];

function HelpCenter({ searchValue, onSearchChange, onSearch, searchQuery, searchResults }) {
  const [selectedCategory, setSelectedCategory] = useState('FAQs');
  const [openFaq, setOpenFaq] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello. I can help with access, documents, mobile support, downloads and tutorials.'
    }
  ]);

  const searchFeedback = useMemo(() => {
    if (!searchQuery.trim()) return '';
    if (searchResults.length) {
      return `Showing ${searchResults.length} result${searchResults.length > 1 ? 's' : ''} for "${searchQuery}".`;
    }
    return `No matching Help Center content found for "${searchQuery}".`;
  }, [searchQuery, searchResults]);

  const handleFaqToggle = (index) => {
    setOpenFaq((current) => (current === index ? null : index));
  };

  const handleMaterialDownload = (material) => {
    const blob = new Blob([material.content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = material.filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const getChatReply = (message) => {
    const value = message.toLowerCase();
    if (value.includes('document') || value.includes('download')) {
      return 'You can use Help Materials to download guides and PDFs, or open the relevant document sections in the platform.';
    }
    if (value.includes('mobile')) {
      return 'The Help Center is designed to work on mobile devices with the same core content and features available.';
    }
    if (value.includes('video') || value.includes('tutorial')) {
      return 'Open the Video Tutorials category to watch embedded tutorials directly within the Help Center.';
    }
    if (value.includes('access') || value.includes('login') || value.includes('sign in')) {
      return 'Start with Getting Started for account access guidance, then review FAQs for additional platform and support details.';
    }
    return 'I can help with platform access, documents, downloadable materials, tutorials, troubleshooting and mobile support.';
  };

  const handleSendChat = () => {
    const message = chatInput.trim();
    if (!message) return;
    setChatMessages((current) => [
      ...current,
      { role: 'user', text: message },
      { role: 'assistant', text: getChatReply(message) }
    ]);
    setChatInput('');
  };

  return (
    <section id="help-center" className="help-center-section">
      <div className="container">
        <div className="help-center-intro">
          <p className="kicker">SUPPORT</p>
          <h2>Help Center</h2>
          <p>Find practical guidance, searchable support content, video tutorials and immediate chat assistance.</p>
        </div>

        <div className="help-center-search">
          <input
            type="text"
            placeholder="Search Help Center content"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search Help Center content"
          />
          <button type="button" className="search-button" onClick={onSearch}>Search</button>
        </div>

        {searchFeedback ? (
          <div className="help-search-feedback" aria-live="polite">
            {searchFeedback}
            {searchResults.length > 0 ? ` ${searchResults.join(' · ')}` : ''}
          </div>
        ) : null}

        <div className="help-center-layout">
          <aside className="help-sidebar" aria-label="Help Center categories">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`help-sidebar-button ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </aside>

          <div className="help-panel">
            {selectedCategory === 'Getting Started' && (
              <div>
                <div className="help-panel-header">
                  <h3>Getting Started</h3>
                  <p>Use these first steps to access your account, understand the platform and locate support resources quickly.</p>
                </div>
                <ul className="getting-started-list">
                  <li>Sign in using your assigned account credentials through the relevant platform entry point.</li>
                  <li>Review your dashboard for holdings, employee share-plan details, statements and recent updates.</li>
                  <li>Use the Help Center search to locate support articles, downloadable guides and video tutorials.</li>
                </ul>
              </div>
            )}

            {selectedCategory === 'FAQs' && (
              <div>
                <div className="help-panel-header">
                  <h3>Frequently Asked Questions</h3>
                  <p>Browse common questions about the platform, access, documents and support options.</p>
                </div>
                <div>
                  {faqItems.map((item, index) => {
                    const isOpen = openFaq === index;
                    return (
                      <div className="accordion-item" key={item.question}>
                        <button
                          type="button"
                          className="accordion-row"
                          onClick={() => handleFaqToggle(index)}
                          aria-expanded={isOpen}
                        >
                          <span className="accordion-question">{item.question}</span>
                          <span className="accordion-toggle" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                        </button>
                        {isOpen ? <div className="accordion-answer">{item.answer}</div> : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedCategory === 'How-To Guides' && (
              <div>
                <div className="help-panel-header">
                  <h3>How-To Guides</h3>
                  <p>Follow practical instructions for common tasks and self-service actions across the platform.</p>
                </div>
                <ul className="how-to-list">
                  <li>How to review shareholder or employee account information securely.</li>
                  <li>How to locate and open documents, statements and support files.</li>
                  <li>How to use search, support categories and embedded tutorials effectively.</li>
                </ul>
              </div>
            )}

            {selectedCategory === 'Video Tutorials' && (
              <div>
                <div className="help-panel-header">
                  <h3>Video Tutorials</h3>
                  <p>Watch embedded tutorials directly inside the Help Center using the existing support content area.</p>
                </div>
                <div className="video-list">
                  {videos.map((video) => (
                    <div className="video-card" key={video.title}>
                      <div>
                        <iframe
                          className="video-frame"
                          src={video.url}
                          title={video.title}
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                      <div className="video-content">
                        <h4>{video.title}</h4>
                        <p>If playback is unavailable, open the tutorial directly: <a href={video.fallback} target="_blank" rel="noreferrer">View video</a></p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedCategory === 'Help Materials' && (
              <div>
                <div className="help-panel-header">
                  <h3>Help Materials</h3>
                  <p>Download support materials, user guides and PDF resources for offline use.</p>
                </div>
                <div className="material-list">
                  {materials.map((material) => (
                    <div className="material-row" key={material.title}>
                      <div className="material-content">
                        <h4>{material.title}</h4>
                        <p className="material-description">{material.description}</p>
                      </div>
                      <button type="button" className="material-download" onClick={() => handleMaterialDownload(material)}>
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedCategory === 'Troubleshooting' && (
              <div>
                <div className="help-panel-header">
                  <h3>Troubleshooting</h3>
                  <p>Review common support guidance for access, content visibility and playback issues.</p>
                </div>
                <ul className="troubleshooting-list">
                  <li>Refresh your browser session and confirm that your sign-in details are current.</li>
                  <li>Check your connection if documents, media or support content do not load as expected.</li>
                  <li>Use Chat Support for immediate guidance if the issue remains unresolved.</li>
                </ul>
              </div>
            )}

            {selectedCategory === 'Chat Support' && (
              <div className="chat-panel">
                <div className="help-panel-header">
                  <h3>Chat Support</h3>
                  <p>Ask a question and receive immediate automated assistance within the Help Center.</p>
                </div>
                <div className="chat-window">
                  <div className="chat-messages" aria-live="polite">
                    {chatMessages.map((message, index) => (
                      <div key={`${message.role}-${index}`} className={`chat-message ${message.role}`}>
                        {message.text}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="chat-input-row">
                  <textarea
                    placeholder="Ask a question"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    aria-label="Ask a question"
                  />
                  <button type="button" className="chat-send-button" onClick={handleSendChat}>
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HelpCenter;
