import Accordion from './Accordion';

function HelpCenter({
  id,
  categories,
  activeCategory,
  onCategorySelect,
  categoryData,
  searchTerm,
  onSearchTermChange,
  onSearch,
  searchResults,
  activeVideoId,
  onVideoSelect,
  openFaqIndex,
  onFaqToggle,
  chatMessages,
  chatInput,
  onChatInputChange,
  onChatSubmit
}) {
  const activeData = categoryData[activeCategory];
  const activeVideo = categoryData['Video Tutorials'].videos.find((video) => video.id === activeVideoId) || categoryData['Video Tutorials'].videos[0];

  return (
    <section id={id} className="content-section help-center-section">
      <div className="container">
        <div className="help-center-header">
          <p className="eyebrow">Support</p>
          <h2>Help Center</h2>
          <p>Find practical guidance, searchable support content, video tutorials and immediate chat assistance.</p>
        </div>
        <div className="help-search-bar">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
            placeholder="Search Help Center content"
            aria-label="Search Help Center content"
          />
          <button type="button" onClick={onSearch}>Search</button>
        </div>
        <div className="help-center-layout">
          <aside className="help-sidebar" aria-label="Help Center categories">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`help-tab ${activeCategory === category && searchResults.length === 0 ? 'is-active' : ''}`}
                onClick={() => onCategorySelect(category)}
              >
                {category}
              </button>
            ))}
          </aside>
          <div className="help-content-panel">
            {searchResults.length > 0 ? (
              <div className="help-results">
                <h3>Search Results</h3>
                <p className="help-intro">Matching Help Center resources are displayed below.</p>
                <div className="resource-list">
                  {searchResults.map((result) => (
                    <article key={`${result.category}-${result.title}`} className="resource-item">
                      <span className="resource-category">{result.category}</span>
                      <h4>{result.title}</h4>
                      <p>{result.text}</p>
                    </article>
                  ))}
                </div>
              </div>
            ) : (
              <div className="help-category-view">
                <h3>{activeData.title}</h3>
                <p className="help-intro">{activeData.intro}</p>

                {activeCategory === 'Getting Started' ? (
                  <div className="resource-list">
                    {activeData.items.map((item) => (
                      <article key={item} className="resource-item">
                        <h4>{item}</h4>
                      </article>
                    ))}
                  </div>
                ) : null}

                {activeCategory === 'FAQs' ? (
                  <Accordion items={activeData.faqs} openIndex={openFaqIndex} onToggle={onFaqToggle} />
                ) : null}

                {activeCategory === 'How-To Guides' ? (
                  <div className="resource-list">
                    {activeData.guides.map((guide) => (
                      <article key={guide} className="resource-item">
                        <h4>{guide}</h4>
                      </article>
                    ))}
                  </div>
                ) : null}

                {activeCategory === 'Video Tutorials' ? (
                  <div className="video-tutorials">
                    <div className="video-selector-list">
                      {activeData.videos.map((video) => (
                        <button
                          type="button"
                          key={video.id}
                          className={`video-link ${activeVideoId === video.id ? 'is-active' : ''}`}
                          onClick={() => onVideoSelect(video.id)}
                        >
                          {video.title}
                        </button>
                      ))}
                    </div>
                    <div className="video-frame-wrap">
                      <iframe
                        src={`https://www.youtube.com/embed/${activeVideo.id}`}
                        title={activeVideo.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>
                  </div>
                ) : null}

                {activeCategory === 'Help Materials' ? (
                  <div className="resource-list">
                    {activeData.materials.map((material) => (
                      <article key={material} className="resource-item">
                        <h4>{material}</h4>
                      </article>
                    ))}
                  </div>
                ) : null}

                {activeCategory === 'Troubleshooting' ? (
                  <div className="resource-list">
                    {activeData.tips.map((tip) => (
                      <article key={tip} className="resource-item">
                        <h4>{tip}</h4>
                      </article>
                    ))}
                  </div>
                ) : null}

                {activeCategory === 'Chat Support' ? (
                  <div className="chat-support">
                    <div className="chat-thread" aria-live="polite">
                      {chatMessages.map((message, index) => (
                        <div key={`${message.sender}-${index}`} className={`chat-message ${message.sender}`}>
                          <span>{message.text}</span>
                        </div>
                      ))}
                    </div>
                    <form className="chat-form" onSubmit={onChatSubmit}>
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(event) => onChatInputChange(event.target.value)}
                        placeholder="Type your question"
                        aria-label="Type your question"
                      />
                      <button type="submit">Send</button>
                    </form>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HelpCenter;
