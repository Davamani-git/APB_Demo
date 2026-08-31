function AboutUs() {
  return (
    <section id="about-us" className="content-section alt-section">
      <div className="container">
        <div className="about-grid">
          <div className="about-copy">
            <p className="eyebrow">About us</p>
            <h2 className="section-title">Purpose-built digital experiences for financial services</h2>
            <p>
              Equity Master delivers practical, enterprise-focused platforms that support investors, employees and organisations with secure, approachable digital journeys.
            </p>
            <p>
              We combine domain understanding, scalable technology and user-centred delivery to create experiences that feel simple while handling complex business needs.
            </p>
          </div>
          <div className="about-image">
            <img
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80"
              alt="Business professionals collaborating"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
