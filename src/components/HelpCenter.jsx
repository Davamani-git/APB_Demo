import { useEffect, useMemo, useState } from 'react';
import Accordion from './Accordion';

function HelpSearch({ onSearch }) {
  const [term, setTerm] = useState('');

  return (
    <form
      className="help-search-bar"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch(term);
      }}
    >
      <input
        className="help-search-input"
        type="text"
        value={term}
        onChange={(event) => setTerm(event.target.value)}
        placeholder="Search Help Center"
        aria-label="Search Help Center"
      />
      <button className="help-search-button" type="submit">Search</button>
    </form>
  );
}

function SearchResults({ results, onOpenCategory }) {
  if (!results.length) return null;
  return (
    <div className="search-results" aria-live="polite">
      {results.map((result, index) => (
        <article key={`${result.title}-${index}`} className="search-result">
          <span className="search-result-meta">{result.category}</span>
          <h4>{result.title}</h4>
          <p>{result.text}</p>
          <button className="nav-link-button" type="button" onClick={() => onOpenCategory(result.target)} style={{ color: '#6d1f73', paddingLeft: 0 }}>
            Open category
          </button>
        </article>
      ))}
    </div>
  );
}

function HelpSidebar({ categories, activeCategory, onCategorySelect }) {
  return (
    <aside className="help-center-sidebar" aria-label="Help Center categories">
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          className={`help-center-tab ${activeCategory === category.id ? 'active' : ''}`}
          onClick={() => onCategorySelect(category.id)}
        >
          {category.label}
        </button>
      ))}
    </aside>
  );
}

function VideoTutorials({ videos, selectedVideoId, onSelectVideo }) {
  const activeVideo = useMemo(() => videos.find((video) => video.id === selectedVideoId) || videos[0], [videos, selectedVideoId]);
  return (
    <div className="video-layout">
      <div className="video-list">
        {videos.map((video) => (
          <button
            key={video.id}
            type="button"
            className={`video-select ${video.id === activeVideo.id ? 'active' : ''}`}
            onClick={() => onSelectVideo(video.id)}
          >
            {video.title}
          </button>
        ))}
      </div>
      <div className="video-player-shell">
        <div className="video-frame">
          <iframe
            src={`https://www.youtube.com/embed/${activeVideo.id}`}
            title={activeVideo.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="video-meta">
          <h4>{activeVideo.title}</h4>
          <p>{activeVideo.description}</p>
        </div>
      </div>
    </div>
  );
}

function ChatSupport() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', text: 'Hello. Ask a question about Equity Master and I will provide immediate guidance.' }
  ]);
  const [input, setInput] = useState('');

  const getResponse = (question) => {
    const value = question.toLowerCase();
    if (value.includes('portfolio') || value.includes('investor')) return 'For holdings, price history and recent activity, open Investor Centre after signing in.';
    if (value.includes('employee') || value.includes('empshare')) return 'For employee share plan information, select EmpShare to review plan details and available support.';
    if (value.includes('document')) return 'Documents can be downloaded instantly from the relevant account sections where available.';
    if (value.includes('support') || value.includes('help')) return 'You can browse categories, search Help Center content, review FAQs or watch video tutorials for additional guidance.';
    return 'Thanks for your question. Please review Getting Started, FAQs and Video Tutorials for the most relevant guidance.';
  };

  const submit = (event) => {
    event.preventDefault();
    const question = input.trim();
    if (!question) return;
    const userMessage = { id: Date.now(), role: 'user', text: question };
    setMessages((current) => [...current, userMessage]);
    setInput('');
    setTimeout(() => {
      setMessages((current) => [...current, { id: Date.now() + 1, role: 'bot', text: getResponse(question) }]);
    }, 700);
  };

  return (
    <div className="chat-shell">
      <div className="chat-messages" aria-live="polite">
        {messages.map((message) => (
          <div key={message.id} className={`chat-message ${message.role}`}>
            {message.text}
          </div>
        ))}
      </div>
      <form className="chat-input-row" onSubmit={submit}>
        <input
          className="chat-input"
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Enter your question"
          aria-label="Chat question"
        />
        <button className="chat-send-button" type="submit">Send</button>
      </form>
    </div>
  );
}

function HelpContent({ activeData, selectedVideoId, onSelectVideo }) {
  return (
    <div className="help-content-panel">
      <h3 className="help-panel-title">{activeData.title}</h3>
      <p className="help-panel-intro">{activeData.intro}</p>
      {activeData.type === 'rich' && activeData.sections.map((section) => (
        <section key={section.heading} className="help-rich-section">
          <h4>{section.heading}</h4>
          <p>{section.body}</p>
        </section>
      ))}
      {activeData.type === 'faq' && (
        <div className="faq-list">
          {activeData.items.map((item) => (
            <Accordion key={item.question} title={item.question} content={item.answer} />
          ))}
        </div>
      )}
      {activeData.type === 'videos' && (
        <VideoTutorials videos={activeData.videos} selectedVideoId={selectedVideoId} onSelectVideo={onSelectVideo} />
      )}
      {activeData.type === 'list' && (
        <ul className="help-list">
          {activeData.items.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      )}
      {activeData.type === 'cards' && (
        <div className="help-card-grid">
          {activeData.cards.map((card) => (
            <article key={card.title} className="help-card">
              <h4>{card.title}</h4>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      )}
      {activeData.type === 'chat' && <ChatSupport />}
    </div>
  );
}

export default function HelpCenter({ categories, activeCategory, activeData, onCategorySelect, onSearch, searchResults, selectedVideoId, onSelectVideo }) {
  useEffect(() => {
    const section = document.getElementById('help-center');
    if (section) section.setAttribute('data-active-category', activeCategory);
  }, [activeCategory]);

  return (
    <section id="help-center" className="help-center">
      <div className="section-inner">
        <div className="center-heading">
          <h2>Help Center</h2>
          <p>Support resources presented within the existing Equity Master experience.</p>
        </div>
        <HelpSearch onSearch={onSearch} />
        {searchResults.length > 0 ? (
          <SearchResults results={searchResults} onOpenCategory={onCategorySelect} />
        ) : (
          <div className="help-center-layout">
            <HelpSidebar categories={categories} activeCategory={activeCategory} onCategorySelect={onCategorySelect} />
            <HelpContent activeData={activeData} selectedVideoId={selectedVideoId} onSelectVideo={onSelectVideo} />
          </div>
        )}
      </div>
    </section>
  );
}