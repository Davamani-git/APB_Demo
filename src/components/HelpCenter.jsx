import { useEffect, useMemo, useState } from 'react';
import Accordion from './Accordion';

const defaultReply = 'Thank you for your question. Please review the related Help Center guidance, downloadable materials, or video tutorials for the most relevant next step.';

function createDownload(filename, content) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function HelpCenter({ data }) {
  const [activeTab, setActiveTab] = useState(data.tabs[0].id);
  const [openIndex, setOpenIndex] = useState(0);
  const [search, setSearch] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello. I can help with Help Center navigation, downloads, video tutorials and general platform support.'
    }
  ]);

  const activeTabData = useMemo(() => data.tabs.find((tab) => tab.id === activeTab) || data.tabs[0], [activeTab, data.tabs]);

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return activeTabData.items;
    return activeTabData.items.filter(
      (item) => item.question.toLowerCase().includes(term) || item.answer.toLowerCase().includes(term)
    );
  }, [activeTabData, search]);

  useEffect(() => {
    setOpenIndex(filteredItems.length ? 0 : -1);
  }, [activeTab, search]);

  const handleChatSubmit = (event) => {
    event.preventDefault();
    const value = chatInput.trim();
    if (!value) return;
    const lower = value.toLowerCase();
    let reply = defaultReply;
    if (lower.includes('download')) reply = 'You can download Help Materials using the download buttons in the Help Materials section below.';
    else if (lower.includes('video')) reply = 'Video tutorials are embedded directly in the Help Center and can be played without leaving the page.';
    else if (lower.includes('mobile')) reply = 'The Help Center is responsive and designed to remain usable across mobile, tablet and desktop devices.';
    else if (lower.includes('search')) reply = 'Use the Help Center search field to filter guidance within the selected tab.';
    else if (lower.includes('chat')) reply = 'This chat assistant provides immediate automated responses for common support questions.';

    setMessages((current) => [...current, { role: 'user', text: value }]);
    setChatInput('');
    window.setTimeout(() => {
      setMessages((current) => [...current, { role: 'assistant', text: reply }]);
    }, 600);
  };

  return (
    <section id="help-center" className="help-center">
      <h2 className="help-center__heading">{data.title}</h2>
      <div className="help-center__tabs" role="tablist" aria-label="Help Center tabs">
        {data.tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`help-center__tab ${activeTab === tab.id ? 'help-center__tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="help-center__top">
        <div className="help-center__panel">
          <p className="help-center__intro">{activeTabData.intro}</p>
          <input
            className="help-center__search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search support topics"
            aria-label="Search support topics"
          />
          <Accordion items={filteredItems} openIndex={openIndex} setOpenIndex={setOpenIndex} />
        </div>

        <aside className="help-center__sidebar">
          <h3>Support overview</h3>
          <p>Browse categories, filter content, watch tutorials, download materials and use chat support in one place.</p>
          <p>The Help Center is available from the home page and remains the last section of this page for quick access.</p>
          <p>All support content follows the same white and purple visual language used throughout the application.</p>
        </aside>
      </div>

      <div className="help-center__sections">
        <section className="help-center__videos">
          <h3>Video Tutorials</h3>
          <div className="video-grid">
            {data.videos.map((video) => (
              <article key={video.title} className="video-card">
                <h4 className="video-card__title">{video.title}</h4>
                <iframe
                  src={video.embed}
                  title={video.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <a className="video-card__link" href={video.url} target="_blank" rel="noreferrer">
                  Open on YouTube
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="help-center__materials">
          <h3>Help Materials</h3>
          <div className="material-grid">
            {data.materials.map((material) => (
              <article key={material.filename} className="material-card">
                <h4 className="material-card__title">{material.title}</h4>
                <p className="material-card__meta">Downloadable file: {material.filename}</p>
                <button
                  type="button"
                  className="material-card__action"
                  onClick={() => createDownload(material.filename, material.content)}
                >
                  Download
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="help-center__analytics">
          <h3>Help Center Analytics</h3>
          <div className="analytics-grid">
            {data.analytics.map((item) => (
              <article key={item.label} className="analytics-card">
                <p className="analytics-card__label">{item.label}</p>
                <p className="analytics-card__value">{item.value}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="help-center__chat">
          <h3>Chat Support</h3>
          <div className="chat-window" aria-live="polite">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`chat-message chat-message--${message.role}`}>
                {message.text}
              </div>
            ))}
          </div>
          <form className="chat-input" onSubmit={handleChatSubmit}>
            <input
              type="text"
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              placeholder="Ask a question"
              aria-label="Ask a support question"
            />
            <button type="submit">Send</button>
          </form>
        </section>
      </div>
    </section>
  );
}

export default HelpCenter;
