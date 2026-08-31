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
    answer: 'Sign in using your registered account details to access shareholder holdings, employee plan information and recent account activity from the relevant platform area.'
  },
  {
    question: 'Where can I download my documents?',
    answer: 'Documents are available inside your account experience where statements, notices and supporting records can be viewed or downloaded instantly.'
  },
  {
    question: 'Can I get help without leaving the website?',
    answer: 'Yes. The Help Center centralises searchable guidance, FAQs, materials, tutorials and chat support so assistance is available within the website experience.'
  },
  {
    question: 'Is the Help Center available on mobile?',
    answer: 'Yes. The Help Center follows the same responsive behaviour as the rest of the application so content remains accessible across desktop and mobile devices.'
  }
];

const tutorialLinks = [
  { title: 'Video Tutorial 1', url: 'https://youtu.be/Mt0Y5X6885I' },
  { title: 'Video Tutorial 2', url: 'https://www.youtube.com/watch?v=6dSVaAaKWSQ' },
  { title: 'Video Tutorial 3', url: 'https://www.youtube.com/watch?v=8qaLG730bDw&t=20s&pp=ygUWbWFzaGFibGUgbW9ybmluZyB3aSBLS9IHCQkaDAGHKiGM7w%3D%3D' }
];

export default function HelpCenter() {
  const [activeCategory, setActiveCategory] = useState('FAQs');
  const [searchValue, setSearchValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  const filteredFaqs = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return faqItems;
    return faqItems.filter(
      (item) =>
        item.question.toLowerCase().includes(term) ||
        item.answer.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchTerm(searchValue);
    setActiveCategory('FAQs');
  };

  const renderContent = () => {
    if (activeCategory === 'FAQs') {
      return (
        <div>
          <h3 className="help-panel-title">Frequently Asked Questions</h3>
          <p className="help-panel-copy">Browse common questions about the platform, access, documents and support options.</p>
          <hr className="help-panel-divider" />
          <div>
            {filteredFaqs.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div className="accordion-item" key={item.question}>
                  <button
                    type="button"
                    className="accordion-trigger"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <span className="accordion-question">{item.question}</span>
                    <span className="accordion-icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && <div className="accordion-content">{item.answer}</div>}
                </div>
              );
            })}
            {!filteredFaqs.length && (
              <div className="help-generic-content">
                <p>No matching Help Center content was found for your search.</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (activeCategory === 'Video Tutorials') {
      return (
        <div>
          <h3 className="help-panel-title">Video Tutorials</h3>
          <p className="help-panel-copy">Watch guided walkthroughs covering common actions and support topics.</p>
          <hr className="help-panel-divider" />
          <div className="video-list">
            {tutorialLinks.map((video) => (
              <div className="video-card" key={video.url}>
                <p className="help-panel-copy">{video.title}</p>
                <a href={video.url} target="_blank" rel="noreferrer">Open video</a>
              </div>
            ))}
          </div>
        </div>
      );
    }

    const contentMap = {
      'Getting Started': 'Start by selecting the relevant platform area and signing in with your registered details to access account information and available actions.',
      'How-To Guides': 'Step-by-step guidance is available for navigating the platform, finding account information and completing common servicing tasks.',
      'Help Materials': 'Reference materials provide supporting information for access, documents, servicing processes and platform usage.',
      Troubleshooting: 'If something is not working as expected, review browser, login and connectivity checks before contacting support.',
      'Chat Support': 'Immediate chat assistance can be used when you need help during your current website session.'
    };

    return (
      <div>
        <h3 className="help-panel-title">{activeCategory}</h3>
        <p className="help-panel-copy">{contentMap[activeCategory]}</p>
        <hr className="help-panel-divider" />
        <div className="help-generic-content">
          <p>{contentMap[activeCategory]}</p>
        </div>
      </div>
    );
  };

  return (
    <section className="help-center" id="help-center">
      <div className="help-center-intro">
        <p className="help-center-label">Support</p>
        <h2 className="help-center-title">Help Center</h2>
        <p className="help-center-description">Find practical guidance, searchable support content, video tutorials and immediate chat assistance.</p>
      </div>

      <form className="help-center-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search Help Center content"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          aria-label="Search Help Center content"
        />
        <button type="submit">Search</button>
      </form>

      <div className="help-center-layout">
        <nav className="help-sidebar-nav" aria-label="Help Center categories">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`help-sidebar-item ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </nav>

        <div>{renderContent()}</div>
      </div>
    </section>
  );
}
