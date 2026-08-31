export default function AboutUs({ hidden }) {
  return (
    <section className="platform-section" hidden={hidden} aria-hidden={hidden}>
      <div>
        <p className="eyebrow">About us</p>
        <h2 className="section-title">Purpose-built digital experiences for financial services</h2>
        <div className="section-copy">
          <p>Equity Master delivers practical, enterprise-focused platforms that support investors, employees and organisations with secure, approachable digital journeys.</p>
          <p>We combine domain understanding, scalable technology and user-centred delivery to create experiences that feel simple while handling complex business needs.</p>
        </div>
      </div>
      <div className="visual-wrap">
        <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80" alt="Business professionals collaborating" />
      </div>
    </section>
  );
}
