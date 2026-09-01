import { useMemo, useState } from 'react';
import Header from './components/Header';
import FeatureSection from './components/FeatureSection';
import Insights from './components/Insights';
import HelpCenter from './components/HelpCenter';
import Footer from './components/Footer';

const tabs = [
  { id: 'investor-centre', label: 'Investor Centre' },
  { id: 'empshare', label: 'EmpShare' },
  { id: 'about-us', label: 'About us' },
  { id: 'insights', label: 'Insights' }
];

const featureSections = [
  {
    id: 'investor-centre',
    kicker: 'For shareholders',
    title: 'Investor Centre',
    description: 'Introducing the new Investor Centre experience. A modern, intuitive and seamless way to manage your investments online.',
    bullets: [
      'Portfolio holdings and price history',
      'Monitor recent activity',
      'Download documents instantly',
      'Virtual assistance'
    ],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Investor technology dashboard'
  },
  {
    id: 'empshare',
    kicker: 'For employee share plan holders',
    title: 'EmpShare',
    description: 'EmpShare provides a clear and accessible experience for plan holders, helping them stay informed and act with confidence.',
    bullets: [
      'Intuitive and user-friendly',
      'Real-time data',
      'Simplify tax calculations',
      'Mobile app'
    ],
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Employee collaboration and share plan experience',
    reverse: true,
    alternate: true
  },
  {
    id: 'about-us',
    kicker: 'About us',
    title: 'Purpose-built digital experiences for financial services',
    description: 'Equity Master delivers practical, enterprise-focused platforms that support investors, employees and organisations with secure, approachable digital journeys.',
    extraParagraph: 'We combine domain understanding, scalable technology and user-centred delivery to create experiences that feel simple while handling complex business needs.',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Business professionals collaborating'
  }
];

const insightItems = [
  {
    title: 'Experience',
    body: 'Focused on intuitive digital journeys that support confidence and clarity across every interaction.'
  },
  {
    title: 'Expertise',
    body: 'Built with practical knowledge of shareholder, employee plan and enterprise servicing needs.'
  },
  {
    title: 'Innovation',
    body: 'Modern platform thinking applied carefully to existing business workflows without unnecessary complexity.'
  },
  {
    title: 'Technology',
    body: 'Scalable delivery patterns, responsive experiences and maintainable solutions for evolving products.'
  }
];

const helpCategories = [
  {
    id: 'getting-started',
    label: 'Getting started',
    keywords: ['getting started', 'start', 'register', 'login', 'access', 'account'],
    content: {
      type: 'faq',
      title: 'Getting started',
      description: 'Find answers to common first-step questions for Investor Centre and EmpShare.',
      items: [
        {
          question: 'How do I access Investor Centre?',
          answer: 'Use your registered details to sign in and review holdings, recent activity, documents and support options in one place.'
        },
        {
          question: 'What can I do in EmpShare?',
          answer: 'EmpShare helps plan holders review information clearly, access real-time data, simplify tax-related calculations and stay connected on mobile.'
        },
        {
          question: 'Where can I find documents?',
          answer: 'Documents can be downloaded instantly from the relevant account experience once you are signed in.'
        }
      ]
    }
  },
  {
    id: 'faq',
    label: 'FAQ',
    keywords: ['faq', 'questions', 'answers', 'support', 'help'],
    content: {
      type: 'faq',
      title: 'Frequently asked questions',
      description: 'Quick answers about the Equity Master demonstration experience and its platform capabilities.',
      items: [
        {
          question: 'What is Equity Master?',
          answer: 'Equity Master is a demonstration experience showcasing digital journeys for shareholders, employee share plan holders and organisations.'
        },
        {
          question: 'Does the experience support responsive use?',
          answer: 'Yes. The interface is designed to remain usable across desktop and smaller screen sizes while preserving the same visual structure.'
        },
        {
          question: 'How do I contact support?',
          answer: 'Use the support email shown in the footer: support@equitymaster.demo.'
        }
      ]
    }
  },
  {
    id: 'how-to-guides',
    label: 'How-to guides',
    keywords: ['guide', 'how-to', 'how to', 'process', 'steps'],
    content: {
      type: 'list',
      title: 'How-to guides',
      description: 'Simple guidance aligned to the current experience.',
      items: [
        'Review portfolio holdings and price history from the Investor Centre experience.',
        'Monitor recent activity to stay informed about account changes.',
        'Download documents instantly when they are needed.',
        'Use support options to find help content and next steps quickly.'
      ]
    }
  },
  {
    id: 'video-tutorials',
    label: 'Video tutorials',
    keywords: ['video', 'tutorial', 'tutorials', 'watch'],
    content: {
      type: 'videos',
      title: 'Video tutorials',
      description: 'Short support videos embedded within the Help Center layout.',
      items: [
        {
          title: 'Platform overview',
          embed: 'https://www.youtube.com/embed/Mt0Y5X6885I',
          fallback: 'Video currently unavailable.'
        },
        {
          title: 'Navigation walkthrough',
          embed: 'https://www.youtube.com/embed/6dSVaAaKWSQ',
          fallback: 'Video currently unavailable.'
        },
        {
          title: 'Support experience',
          embed: 'https://www.youtube.com/embed/8qaLG730bDw',
          fallback: 'Video currently unavailable.'
        }
      ]
    }
  },
  {
    id: 'help-materials',
    label: 'Help materials',
    keywords: ['pdf', 'file', 'document', 'materials', 'manual'],
    content: {
      type: 'materials',
      title: 'Help materials',
      description: 'Reference files available through the Help Center.',
      items: [
        { label: 'Help PDF 1', href: 'https://drive.google.com/file/d/1HqLeSEbVZz3JWwxSX5TgsJd7Q0x3xdVk/view?usp=drive_link' },
        { label: 'Help PDF 2', href: 'https://drive.google.com/file/d/1Uc5E21E6CIummBqCDs5zYk2mLbZ_ur5y/view?usp=drive_link' },
        { label: 'Help PDF 3', href: 'https://drive.google.com/file/d/1ErTOSOIThyzHUCLz8QilIwZ3u5A6ENk9/view?usp=drive_link' },
        { label: 'Help PDF 4', href: 'https://drive.google.com/file/d/1punlgjU4E2kxuZBq3LwPKpivtSCrUhms/view?usp=drive_link' },
        { label: 'Help PDF 5', href: 'https://drive.google.com/file/d/1qEIXB74Sv2row9t8OQdLcPN7BQB0e01d/view?usp=drive_link' },
        { label: 'Help PDF 6', href: 'https://drive.google.com/file/d/1cpOfBS-R96wW4jzsxZ8ldFWwG166T9ob/view?usp=drive_link' }
      ]
    }
  },
  {
    id: 'chat-support',
    label: 'Chat support',
    keywords: ['chat', 'assistant', 'virtual assistance', 'virtual', 'message'],
    content: {
      type: 'chat',
      title: 'Chat support',
      description: 'A simple support interaction consistent with the existing design language.'
    }
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('investor-centre');

  const resolvedTab = useMemo(() => {
    return tabs.find((tab) => tab.id === activeTab)?.id || 'investor-centre';
  }, [activeTab]);

  return (
    <div>
      <Header tabs={tabs} activeTab={resolvedTab} onTabSelect={setActiveTab} />

      <main>
        <section className="tabs-wrap">
          <div className="container">
            <p className="section-kicker centered">Equity Master</p>
            <h1 className="centered">Learn more about our technology platforms</h1>
            <div className="tabs" role="tablist" aria-label="Platform sections">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`tab ${resolvedTab === tab.id ? 'active' : ''}`}
                  type="button"
                  role="tab"
                  aria-selected={resolvedTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {featureSections.map((section) => (
          <FeatureSection key={section.id} {...section} />
        ))}

        <Insights items={insightItems} />
        <HelpCenter categories={helpCategories} />
      </main>

      <Footer />
    </div>
  );
}
