import Header from './components/Header';
import ProductSection from './components/ProductSection';
import AboutUs from './components/AboutUs';
import Insights from './components/Insights';
import HelpCenter from './components/HelpCenter';
import Footer from './components/Footer';

const investorItems = [
  'Portfolio holdings and price history',
  'Monitor recent activity',
  'Download documents instantly',
  'Virtual assistance'
];

const empShareItems = [
  'Intuitive and user-friendly',
  'Real-time data',
  'Simplify tax calculations',
  'Mobile app'
];

function App() {
  return (
    <div className="app-shell">
      <Header />
      <main>
        <ProductSection
          id="investor-centre"
          eyebrow="For shareholders"
          title="Investor Centre"
          description="Introducing the new Investor Centre experience. A modern, intuitive and seamless way to manage your investments online."
          items={investorItems}
          image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
          imageAlt="Investor technology platform"
        />
        <ProductSection
          id="empshare"
          eyebrow="For employee share plan holders"
          title="EmpShare"
          description="EmpShare provides a clear and accessible experience for plan holders, helping them stay informed and act with confidence."
          items={empShareItems}
          image="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
          imageAlt="Employee share plan collaboration"
          reverse
        />
        <AboutUs />
        <Insights />
        <HelpCenter />
      </main>
      <Footer />
    </div>
  );
}

export default App;
