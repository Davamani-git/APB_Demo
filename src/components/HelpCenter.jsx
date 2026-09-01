import Accordion from './help/Accordion';

const categories = [
  'Getting Started',
  'FAQs',
  'How-To Guides',
  'Video Tutorials',
  'Help Materials',
  'Troubleshooting',
  'Chat Support'
];

function SearchResults({ submittedSearch, searchResults }) {
  if (!submittedSearch.trim()) return null;
  return (
    <div>
      <p className="search-summary">
        {searchResults.length > 0
          ? `Search results for "${submittedSearch}"`
          : `No results found for "${submittedSearch}".`}
      </p>
      {searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map((item) => (
            <div key={item.id} className="search-result-item">
              <span className="search-type">{item.type}</span>
              <h4>{item.title}</h4>
              <p>{item.category}</p>
              {item.url && (
                <a className="material-link" href={item.url} target="_blank" rel="noreferrer">
                  Open resource
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function VideoTutorials({ videos }) {
  return (
    <div className="video-grid">
      {videos.map((video) => (
        <div key={video.id} className="video-card">
          <iframe
            src={video.url}
            title={video.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <h4>{video.title}</h4>
          <p>
            If the video cannot be embedded, use this{' '}
            <a className="inline-link" href={video.fallback} target="_blank" rel="noreferrer">
              alternate link
            </a>
            .
          </p>
        </div>
      ))}
    </div>
  );
}

function HelpMaterials({ materials }) {
  return (
    <div className="help-list">
      {materials.map((item) => (
        <div key={item.id} className="material-row">
          <h4>{item.title}</h4>
          <p>{item.type} download over secure HTTPS.</p>
          <a className="material-link" href={item.url} target="_blank" rel="noreferrer" download>
            Download file
          </a>
        </div>
      ))}
    </div>
  );
}

function ArticleList({ articles }) {
  return (
    <div className="help-list">
      {articles.map((article, index) => (
        <div key={index} className="help-list-item">
          <p>{article}</p>
        </div>
      ))}
    </div>
  );
}

function ChatSupportContent({ setChatOpen }) {
  return (
    <div className="help-list">
      <div className="help-list-item">
        <p>
          Open the chat assistant for immediate conversational support and links to relevant help articles.
        </p>
        <div className="chat-inline">
          <button type="button" className="button-primary" onClick={() => setChatOpen(true)}>
            Open Chat Assistant
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HelpCenter({
  activeCategory,
  setActiveCategory,
  categoryContent,
  expandedFaq,
  onToggleFaq,
  searchTerm,
  setSearchTerm,
  onSearch,
  searchResults,
  submittedSearch,
  chatOpen,
  setChatOpen,
  chatInput,
  setChatInput,
  onSendMessage,
  messages,
  onChatLink
}) {
  const current = categoryContent[activeCategory];

  return (
    <section className="help-center" id="help-center">
      <div className="container">
        <div className="help-center-top">
          <div className="eyebrow">Support</div>
          <h2 className="help-center-title">Help Center</h2>
          <p className="help-center-description">
            Find practical guidance, searchable support content, video tutorials and immediate chat assistance.
          </p>
        </div>

        <form className="help-center-search" onSubmit={onSearch}>
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search Help Center content"
            aria-label="Search Help Center content"
          />
          <button type="submit" className="button-primary">
            Search
          </button>
        </form>

        <SearchResults submittedSearch={submittedSearch} searchResults={searchResults} />

        <div className="help-center-layout">
          <aside className="help-sidebar" aria-label="Help Center categories">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={activeCategory === category ? 'active' : ''}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </aside>

          <div className="help-content">
            <h3 className="help-content-title">{current.heading}</h3>
            <p className="help-content-description">{current.description}</p>
            <div className="help-divider" />

            {current.faqs && (
              <div className="accordion-list">
                {current.faqs.map((item) => (
                  <Accordion
                    key={item.id}
                    title={item.question}
                    isOpen={expandedFaq === item.id}
                    onToggle={() => onToggleFaq(item.id)}
                  >
                    {item.answer}
                  </Accordion>
                ))}
              </div>
            )}

            {current.articles && <ArticleList articles={current.articles} />}
            {current.videos && <VideoTutorials videos={current.videos} />}
            {current.materials && <HelpMaterials materials={current.materials} />}
            {current.chat && <ChatSupportContent setChatOpen={setChatOpen} />}
          </div>
        </div>
      </div>

      <button
        type="button"
        className="chat-launcher"
        aria-label="Open chat assistant"
        onClick={() => setChatOpen((currentState) => !currentState)}
      >
        💬
      </button>

      {chatOpen && (
        <div className="chat-panel" role="dialog" aria-label="Chat assistant">
          <div className="chat-header">
            <h3>Chat Assistant</h3>
            <button type="button" className="chat-close" onClick={() => setChatOpen(false)} aria-label="Close chat">
              ×
            </button>
          </div>
          <div className="chat-body">
            {messages.map((message) => (
              <div key={message.id} className={`chat-message ${message.sender}`}>
                <div className="chat-bubble">{message.text}</div>
                {message.links?.length > 0 && (
                  <div className="chat-links">
                    {message.links.map((link) => (
                      <button key={link.category} type="button" onClick={() => onChatLink(link.category)}>
                        {link.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <form className="chat-form" onSubmit={onSendMessage}>
            <input
              type="text"
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              placeholder="Type your message"
              aria-label="Type your message"
            />
            <button type="submit" className="button-primary">
              Send
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
