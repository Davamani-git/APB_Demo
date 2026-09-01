import { useMemo, useState } from 'react';

function FAQBlock({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="faq-list">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div className="faq-item" key={item.question}>
            <button
              className="faq-question"
              type="button"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? -1 : index)}
            >
              <span>{item.question}</span>
              <span className="faq-icon" aria-hidden="true">{open ? '−' : '+'}</span>
            </button>
            {open ? (
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function ListBlock({ items }) {
  return (
    <ul className="help-simple-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function VideosBlock({ items }) {
  return (
    <div className="video-grid">
      {items.map((item) => (
        <div className="help-video" key={item.title}>
          <h4>{item.title}</h4>
          <div className="video-frame-wrap">
            {item.embed ? (
              <iframe
                src={item.embed}
                title={item.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : (
              <p>{item.fallback}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function MaterialsBlock({ items }) {
  return (
    <ul className="help-simple-list">
      {items.map((item) => (
        <li key={item.href}>
          <a href={item.href} target="_blank" rel="noreferrer">{item.label}</a>
        </li>
      ))}
    </ul>
  );
}

function ChatBlock() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello. How can I help you today?' }
  ]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const value = input.trim();
    if (!value) return;
    setMessages((current) => [
      ...current,
      { role: 'user', text: value },
      {
        role: 'assistant',
        text: 'Thanks for your message. Please review the Help Center categories or contact support@equitymaster.demo for further assistance.'
      }
    ]);
    setInput('');
  };

  return (
    <div className="chat-box">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div className={`chat-message ${message.role}`} key={`${message.role}-${index}`}>
            <span>{message.text}</span>
          </div>
        ))}
      </div>
      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask a question"
          aria-label="Ask a support question"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default function HelpCenter({ categories }) {
  const [search, setSearch] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0]?.id || '');
  const [submittedSearch, setSubmittedSearch] = useState('');

  const activeCategory = useMemo(() => {
    const term = submittedSearch.trim().toLowerCase();
    if (term) {
      const matched = categories.find((category) => {
        const pool = [category.label, category.content.title, category.content.description, ...(category.keywords || [])]
          .join(' ')
          .toLowerCase();
        return pool.includes(term);
      });
      if (matched) return matched;
    }
    return categories.find((category) => category.id === activeCategoryId) || categories[0];
  }, [activeCategoryId, categories, submittedSearch]);

  const renderContent = () => {
    const content = activeCategory?.content;
    if (!content) {
      return <p className="help-empty">No help content available.</p>;
    }

    switch (content.type) {
      case 'faq':
        return <FAQBlock items={content.items} />;
      case 'list':
        return <ListBlock items={content.items} />;
      case 'videos':
        return <VideosBlock items={content.items} />;
      case 'materials':
        return <MaterialsBlock items={content.items} />;
      case 'chat':
        return <ChatBlock />;
      default:
        return <p className="help-empty">No help content available.</p>;
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setSubmittedSearch(search);
  };

  return (
    <section id="help-center" className="help-center">
      <div className="container">
        <p className="section-kicker">Support</p>
        <h2>Help Center</h2>
        <div className="help-center-intro">
          <p>Search support information, browse help navigation and review content using the existing page patterns.</p>
        </div>
        <form className="help-center-search" onSubmit={handleSearch}>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search help topics"
            aria-label="Search help topics"
          />
          <button type="submit">Search</button>
        </form>
        <div className="help-center-layout">
          <div className="help-sidebar" role="navigation" aria-label="Help categories">
            {categories.map((category) => {
              const isActive = activeCategory?.id === category.id;
              return (
                <button
                  key={category.id}
                  className={`help-category ${isActive ? 'active' : ''}`}
                  type="button"
                  onClick={() => {
                    setActiveCategoryId(category.id);
                    setSubmittedSearch('');
                  }}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
          <div className="help-panel">
            <h3>{activeCategory?.content.title}</h3>
            <p>{activeCategory?.content.description}</p>
            <div className="help-divider" />
            {renderContent()}
          </div>
        </div>
      </div>
    </section>
  );
}
