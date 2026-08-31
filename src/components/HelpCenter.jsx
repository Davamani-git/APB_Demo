import { useMemo, useState } from 'react';
import Accordion from './Accordion';

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
    title: 'How do I access Investor Centre?',
    body: ['Use your existing account details to sign in and manage your investments online with a modern, intuitive experience.']
  },
  {
    title: 'What can I do in EmpShare?',
    body: ['EmpShare helps plan holders stay informed and act with confidence using clear account information and real-time updates.']
  },
  {
    title: 'Where can I find support documents?',
    body: ['Support documents can be downloaded instantly where available, and additional materials are listed in the Help Materials section.']
  }
];

const gettingStartedItems = [
  {
    title: 'Create your account',
    body: ['Start by registering with the details provided by your organisation or shareholding records. Follow the prompts to verify your identity and set a secure password.']
  },
  {
    title: 'Set your preferences',
    body: ['After sign-in, review your profile details, communication settings and document delivery preferences.']
  },
  {
    title: 'Navigate your dashboard',
    body: ['Use the main navigation to move between Investor Centre, EmpShare, About us and platform support areas.']
  }
];

const howToGuideItems = [
  {
    title: 'Download documents instantly',
    body: ['Open your account area, select the relevant holding or plan, and choose the available document for download.']
  },
  {
    title: 'Monitor recent activity',
    body: ['Review recent activity from your account summary area to see the latest updates and interactions.']
  },
  {
    title: 'Simplify tax calculations',
    body: ['Use the available plan-holder tools to review transaction details and supporting information for tax-related activity.']
  }
];

const troubleshootingItems = [
  {
    title: 'Trouble signing in',
    description: 'Confirm your username and password, then use the password reset option if you still cannot access your account.'
  },
  {
    title: 'Missing documents',
    description: 'Some documents may depend on account eligibility or release timing. If a file is not visible, contact support for assistance.'
  },
  {
    title: 'Page not loading correctly',
    description: 'Refresh the page, try another supported browser, or clear cached content before signing in again.'
  }
];

const materials = [
  {
    title: 'Account access overview',
    description: 'A concise reference covering sign-in, verification and profile setup.',
    href: '#help-center'
  },
  {
    title: 'Document and activity reference',
    description: 'A practical guide to recent activity, downloads and account records.',
    href: '#help-center'
  },
  {
    title: 'Plan holder support summary',
    description: 'A quick-reference help sheet for employee share plan holders.',
    href: '#help-center'
  }
];

const videos = [
  {
    title: 'Video tutorial 1',
    description: 'An overview of the platform support experience.',
    embed: 'https://www.youtube.com/embed/Mt0Y5X6885I'
  },
  {
    title: 'Video tutorial 2',
    description: 'A walkthrough of common help centre tasks.',
    embed: 'https://www.youtube.com/embed/6dSVaAaKWSQ'
  },
  {
    title: 'Video tutorial 3',
    description: 'Additional support guidance and usage examples.',
    embed: 'https://www.youtube.com/embed/8qaLG730bDw'
  }
];

function HelpCenter() {
  const [activeCategory, setActiveCategory] = useState('FAQs');
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState(0);

  const searchableMap = useMemo(
    () => ({
      'Getting Started': gettingStartedItems,
      FAQs: faqItems,
      'How-To Guides': howToGuideItems
    }),
    []
  );

  const filteredAccordionItems = useMemo(() => {
    const source = searchableMap[activeCategory] || [];
    if (!searchTerm.trim()) return source;
    const query = searchTerm.toLowerCase();
    return source.filter((item) => {
      const text = [item.title, ...(item.body || []), ...((item.list || []))].join(' ').toLowerCase();
      return text.includes(query);
    });
  }, [activeCategory, searchTerm, searchableMap]);

  const renderContent = () => {
    if (activeCategory === 'Getting Started') {
      return (
        <>
          <h3 className="help-panel-title">Getting Started</h3>
          <Accordion items={filteredAccordionItems} openIndex={openIndex} onToggle={setOpenIndex} />
        </>
      );
    }

    if (activeCategory === 'FAQs') {
      return (
        <>
          <h3 className="help-panel-title">Frequently Asked Questions</h3>
          <Accordion items={filteredAccordionItems} openIndex={openIndex} onToggle={setOpenIndex} />
        </>
      );
    }

    if (activeCategory === 'How-To Guides') {
      return (
        <>
          <h3 className="help-panel-title">How-To Guides</h3>
          <Accordion items={filteredAccordionItems} openIndex={openIndex} onToggle={setOpenIndex} />
        </>
      );
    }

    if (activeCategory === 'Video Tutorials') {
      return (
        <>
          <h3 className="help-panel-title">Video Tutorials</h3>
          <div className="video-grid">
            {videos.map((video) => (
              <article className="video-card" key={video.title}>
                <iframe
                  className="video-frame"
                  src={video.embed}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
                <div className="video-card-content">
                  <h3>{video.title}</h3>
                  <p>{video.description}</p>
                </div>
              </article>
            ))}
          </div>
        </>
      );
    }

    if (activeCategory === 'Help Materials') {
      return (
        <>
          <h3 className="help-panel-title">Help Materials</h3>
          <div className="material-grid">
            {materials.map((material) => (
              <article className="material-card" key={material.title}>
                <div className="material-card-content">
                  <h3>{material.title}</h3>
                  <p>{material.description}</p>
                  <a className="material-link" href={material.href}>Open material</a>
                </div>
              </article>
            ))}
          </div>
        </>
      );
    }

    if (activeCategory === 'Troubleshooting') {
      return (
        <>
          <h3 className="help-panel-title">Troubleshooting</h3>
          <div className="troubleshooting-list help-content-card">
            {troubleshootingItems.map((item) => (
              <article className="troubleshooting-item accordion-item" key={item.title}>
                <div className="accordion-content" style={{ paddingTop: '18px' }}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </>
      );
    }

    return (
      <>
        <h3 className="help-panel-title">Chat Support</h3>
        <div className="chat-support-grid">
          <div className="chat-support-copy">
            <h3>Need additional assistance?</h3>
            <p>
              Use chat support for direct help with access, documents, navigation or plan-holder queries. Support is designed to feel simple and approachable while handling practical servicing needs.
            </p>
            <p>
              You can also contact support@equitymaster.demo for follow-up assistance.
            </p>
            <button type="button" className="chat-button">Start chat</button>
          </div>
          <div className="chat-support-image">
            <img
              src="https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=1200&q=80"
              alt="Help center support team"
            />
          </div>
        </div>
      </>
    );
  };

  return (
    <section id="help-center" className="content-section alt-section">
      <div className="container">
        <div className="help-center-header">
          <h2 className="section-title">Help Center</h2>
          <p className="help-center-intro">
            Find practical support, step-by-step guidance and common answers across Equity Master platform experiences.
          </p>
          <div className="help-search">
            <input
              type="search"
              placeholder="Search help topics"
              aria-label="Search help topics"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setOpenIndex(0);
              }}
            />
          </div>
        </div>
        <div className="help-layout">
          <aside className="help-sidebar" aria-label="Help Center categories">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={activeCategory === category ? 'active' : ''}
                onClick={() => {
                  setActiveCategory(category);
                  setOpenIndex(0);
                }}
              >
                {category}
              </button>
            ))}
          </aside>
          <div className="help-main-content">{renderContent()}</div>
        </div>
      </div>
    </section>
  );
}

export default HelpCenter;
