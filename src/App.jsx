import { useMemo, useState } from 'react';
import Header from './components/Header';
import ContentSection from './components/ContentSection';
import InsightColumns from './components/InsightColumns';
import HelpCenter from './components/HelpCenter';
import Footer from './components/Footer';

const content = {
  nav: [
    { label: 'Investor Centre', href: '#investor-centre' },
    { label: 'EmpShare', href: '#empshare' },
    { label: 'About us', href: '#about-us' },
    { label: 'Insights', href: '#insights' },
    { label: 'Help Center', href: '#help-center' }
  ],
  sections: [
    {
      id: 'investor-centre',
      eyebrow: 'For shareholders',
      title: 'Investor Centre',
      description: 'Introducing the new Investor Centre experience. A modern, intuitive and seamless way to manage your investments online.',
      features: [
        'Portfolio holdings and price history',
        'Monitor recent activity',
        'Download documents instantly',
        'Virtual assistance'
      ],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      alt: 'Investor technology platform interface'
    },
    {
      id: 'empshare',
      eyebrow: 'For employee share plan holders',
      title: 'EmpShare',
      description: 'EmpShare provides a clear and accessible experience for plan holders, helping them stay informed and act with confidence.',
      features: [
        'Intuitive and user-friendly',
        'Real-time data',
        'Simplify tax calculations',
        'Mobile app'
      ],
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
      alt: 'Employee collaboration and digital experience'
    },
    {
      id: 'about-us',
      eyebrow: 'About us',
      title: 'Purpose-built digital experiences for financial services',
      description: 'Equity Master delivers practical, enterprise-focused platforms that support investors, employees and organisations with secure, approachable digital journeys.',
      secondaryDescription: 'We combine domain understanding, scalable technology and user-centred delivery to create experiences that feel simple while handling complex business needs.',
      image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80',
      alt: 'Business professionals in discussion'
    }
  ],
  insights: [
    {
      title: 'Experience',
      text: 'Focused on intuitive digital journeys that support confidence and clarity across every interaction.'
    },
    {
      title: 'Expertise',
      text: 'Built with practical knowledge of shareholder, employee plan and enterprise servicing needs.'
    },
    {
      title: 'Innovation',
      text: 'Modern platform thinking applied carefully to existing business workflows without unnecessary complexity.'
    },
    {
      title: 'Technology',
      text: 'Scalable delivery patterns, responsive experiences and maintainable solutions for evolving products.'
    }
  ],
  helpCenter: {
    title: 'Learn more about our technology platforms',
    tabs: [
      {
        id: 'getting-started',
        label: 'Getting Started',
        intro: 'Find practical support resources for Investor Centre, EmpShare and Equity Master services in one place.',
        items: [
          {
            question: 'How do I access the Help Center from the home page?',
            answer: 'Use the Help Center entry point in the purple header navigation or the Help Center section at the end of the page to open support content immediately.'
          },
          {
            question: 'Can I use the Help Center on my mobile device?',
            answer: 'Yes. The Help Center is fully responsive so navigation, reading, downloads, video playback and chat remain usable on mobile, tablet and desktop screens.'
          },
          {
            question: 'What support content is available?',
            answer: 'You can browse FAQs, user guides, downloadable materials, video tutorials and an automated chat assistant for immediate support.'
          }
        ]
      },
      {
        id: 'faq',
        label: 'FAQ',
        intro: 'Review common questions across account access, documents, navigation and support resources.',
        items: [
          {
            question: 'Where can I find my documents?',
            answer: 'Documents are available through the relevant platform experience, and supporting guides can be downloaded from the Help Materials area below.'
          },
          {
            question: 'How quickly does the Help Center load?',
            answer: 'The Help Center content is rendered directly within the page for quick access from the home page entry point.'
          },
          {
            question: 'Can I get immediate answers to questions?',
            answer: 'Yes. Use the chat assistant in the Help Center to receive an automated response without waiting for support staff.'
          }
        ]
      },
      {
        id: 'guides',
        label: 'How-to Guides',
        intro: 'Step-by-step guidance for common user journeys across the Equity Master platform family.',
        items: [
          {
            question: 'Investor Centre account overview',
            answer: 'Learn how to review holdings, check recent activity, access historical information and download important records.'
          },
          {
            question: 'EmpShare activity guidance',
            answer: 'Understand how to review plan information, keep track of updates and navigate the employee experience with confidence.'
          },
          {
            question: 'Support journey overview',
            answer: 'Use search, browse by topic, view tutorials, download guides or start a chat session based on the support type you need.'
          }
        ]
      }
    ],
    videos: [
      {
        title: 'Video Tutorial 1',
        url: 'https://youtu.be/Mt0Y5X6885I',
        embed: 'https://www.youtube.com/embed/Mt0Y5X6885I'
      },
      {
        title: 'Video Tutorial 2',
        url: 'https://www.youtube.com/watch?v=6dSVaAaKWSQ',
        embed: 'https://www.youtube.com/embed/6dSVaAaKWSQ'
      },
      {
        title: 'Video Tutorial 3',
        url: 'https://www.youtube.com/watch?v=8qaLG730bDw&t=20s&pp=ygUWbWFzaGFibGUgbW9ybmluZyB3aSBLS9IHCQkaDAGHKiGM7w%3D%3D',
        embed: 'https://www.youtube.com/embed/8qaLG730bDw'
      }
    ],
    materials: [
      {
        title: 'Investor Centre User Guide',
        filename: 'investor-centre-user-guide.txt',
        content: 'Investor Centre User Guide\n\nThis downloadable guide introduces the Investor Centre experience, portfolio visibility, recent activity review, document access and virtual assistance support.'
      },
      {
        title: 'EmpShare Help Materials',
        filename: 'empshare-help-materials.txt',
        content: 'EmpShare Help Materials\n\nThis guide covers plan holder navigation, real-time data visibility, tax calculation support and mobile access guidance.'
      },
      {
        title: 'Help Center Quick Start',
        filename: 'help-center-quick-start.txt',
        content: 'Help Center Quick Start\n\nUse tabs, accordions, search, video tutorials, downloadable resources and the chat assistant to find support quickly.'
      }
    ],
    analytics: [
      { label: 'Most accessed topics', value: 'Investor Centre login support' },
      { label: 'Downloads', value: '1,284 this month' },
      { label: 'Top search query', value: 'download documents' },
      { label: 'User interactions', value: '4,932 tracked actions' }
    ]
  },
  footer: {
    brand: 'Equity Master',
    demo: 'Equity Master demonstration experience.',
    email: 'support@equitymaster.demo'
  }
};

function App() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const helpEntryTarget = useMemo(() => '#help-center', []);

  return (
    <div className="app-shell">
      <Header
        navItems={content.nav}
        mobileNavOpen={mobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
        helpEntryTarget={helpEntryTarget}
      />
      <main>
        <div className="page-shell">
          {content.sections.map((section, index) => (
            <ContentSection key={section.id} {...section} reverse={index % 2 === 1} />
          ))}
          <InsightColumns id="insights" items={content.insights} />
          <HelpCenter data={content.helpCenter} />
        </div>
      </main>
      <Footer {...content.footer} />
    </div>
  );
}

export default App;
