function HelpCenter({
  categories,
  activeCategory,
  onCategoryChange,
  faqItems,
  expandedFaq,
  onToggleFaq,
  guideItems,
  videoItems,
  materialItems,
  searchTerm,
  onSearchTermChange,
  onSearch,
  chatInput,
  onChatInputChange,
  onChatSubmit,
  chatMessages,
  searchQuery
}) {
  const renderContent = () => {
    if (activeCategory === 'Getting Started') {
      return (
        <div className="help-detail">
          <h3>Getting Started</h3>
          <p>
            Begin here for practical guidance on accessing platform information, using core features
            and locating support resources quickly.
          </p>
          <hr className="help-divider" />
          <ul className="guide-list">
            <li>Use the main website navigation to open the Help Center directly from the Home Page.</li>
            <li>Search the Help Center to quickly locate support content and downloadable materials.</li>
            <li>Browse categories to view FAQs, how-to guides, video tutorials and chat support.</li>
            <li>All Help Center content is available in a responsive layout for mobile and desktop use.</li>
          </ul>
        </div>
      );
    }

    if (activeCategory === 'FAQs') {
      return (
        <div className="help-detail">
          <h3>Frequently Asked Questions</h3>
          <p>
            Browse common questions about the platform, access, documents and support options.
          </p>
          <hr className="help-divider" />
          <div className="faq-list">
            {faqItems.map((item, index) => {
              const isExpanded = expandedFaq === index;
              return (
                <div key={item.question} className="faq-item">
                  <button
                    type="button"
                    className="faq-row"
                    onClick={() => onToggleFaq(index)}
                    aria-expanded={isExpanded}
                  >
                    <span className="faq-question">{item.question}</span>
                    <span className="faq-toggle" aria-hidden="true">{isExpanded ? '−' : '+'}</span>
                  </button>
                  {isExpanded && <div className="faq-answer">{item.answer}</div>}
                </div>
              );
            })}
            {!faqItems.length && <p className="search-caption">No FAQ results found for "{searchQuery}".</p>}
          </div>
        </div>
      );
    }

    if (activeCategory === 'How-To Guides') {
      return (
        <div className="help-detail">
          <h3>How-To Guides</h3>
          <p>Follow concise support steps for common platform actions and service tasks.</p>
          <hr className="help-divider" />
          <ul className="guide-list">
            {guideItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {!guideItems.length && <p className="search-caption">No guide results found for "{searchQuery}".</p>}
        </div>
      );
    }

    if (activeCategory === 'Video Tutorials') {
      return (
        <div className="help-detail">
          <h3>Video Tutorials</h3>
          <p>Watch embedded tutorials directly within the Help Center using standard playback controls.</p>
          <hr className="help-divider" />
          <div className="video-grid">
            {videoItems.map((item) => (
              <article key={item.title} className="video-card">
                <h4>{item.title}</h4>
                <div className="video-frame">
                  {item.url ? (
                    <iframe
                      src={item.url}
                      title={item.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <div className="video-unavailable">Video unavailable for this tutorial.</div>
                  )}
                </div>
              </article>
            ))}
          </div>
          {!videoItems.length && <p className="search-caption">No video results found for "{searchQuery}".</p>}
        </div>
      );
    }

    if (activeCategory === 'Help Materials') {
      return (
        <div className="help-detail">
          <h3>Help Materials</h3>
          <p>Download user guides and PDF help materials for offline access.</p>
          <hr className="help-divider" />
          <div className="material-list">
            {materialItems.map((item) => (
              <div key={item.title} className="material-item">
                <div>
                  <h4 className="material-title">{item.title}</h4>
                  <p className="material-link">Open or download the PDF help file using the link provided.</p>
                </div>
                <a
                  className="material-download"
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  download
                >
                  Download
                </a>
              </div>
            ))}
          </div>
          {!materialItems.length && <p className="search-caption">No material results found for "{searchQuery}".</p>}
        </div>
      );
    }

    if (activeCategory === 'Troubleshooting') {
      return (
        <div className="help-detail">
          <h3>Troubleshooting</h3>
          <p>Review quick actions for common issues before contacting support.</p>
          <hr className="help-divider" />
          <ul className="troubleshoot-list">
            <li>Check your login details and retry access using the current browser session.</li>
            <li>Refresh the page and confirm your internet connection is stable.</li>
            <li>Use the search box to find related FAQs, guides or downloadable materials.</li>
            <li>If you still need assistance, open Chat Support for immediate on-page help.</li>
          </ul>
        </div>
      );
    }

    return (
      <div className="help-detail">
        <h3>Chat Support</h3>
        <p>Ask a question and receive an automated response directly within the Help Center.</p>
        <hr className="help-divider" />
        <div className="chat-panel">
          <div className="chat-messages" aria-live="polite">
            {chatMessages.map((message, index) => (
              <p key={`${message.role}-${index}`} className={`chat-bubble ${message.role}`}>
                {message.text}
              </p>
            ))}
          </div>
          <form className="chat-form" onSubmit={onChatSubmit}>
            <input
              type="text"
              className="chat-input"
              placeholder="Ask a question"
              value={chatInput}
              onChange={(event) => onChatInputChange(event.target.value)}
            />
            <button type="submit" className="chat-send">
              Send
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <section className="help-center" id="help-center">
      <div className="container">
        <p className="help-label">SUPPORT</p>
        <h2 className="help-title">Help Center</h2>
        <p className="help-copy">
          Find practical guidance, searchable support content, video tutorials and immediate chat
          assistance.
        </p>
        <form className="help-search-form" onSubmit={onSearch}>
          <input
            type="text"
            className="help-search-input"
            placeholder="Search Help Center content"
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
          />
          <button type="submit" className="primary-button">
            Search
          </button>
        </form>
        <div className="help-layout">
          <div className="help-sidebar" role="tablist" aria-label="Help Center categories">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`help-sidebar-item ${activeCategory === category ? 'active' : ''}`}
                onClick={() => onCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="help-main">{renderContent()}</div>
        </div>
      </div>
    </section>
  );
}

export default HelpCenter;
