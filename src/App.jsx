import Header from './components/Header';
import TechnologyPlatforms from './components/TechnologyPlatforms';
import AboutUs from './components/AboutUs';
import Insights from './components/Insights';
import HelpCenter from './components/HelpCenter';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="site-shell">
      <Header />
      <main>
        <TechnologyPlatforms />
        <AboutUs />
        <Insights />
        <HelpCenter />
      </main>
      <Footer />
    </div>
  );
}
