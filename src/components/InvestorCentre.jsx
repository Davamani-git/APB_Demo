export default function InvestorCentre() {
  return (
    <section className="section" id="investor-centre">
      <div className="container two-column">
        <div>
          <div className="eyebrow">Platform</div>
          <h1 className="section-title">Investor Centre</h1>
          <p className="section-copy">
            Investor Centre provides shareholders with secure access to holdings, communication preferences,
            statements and important account information through a clear and dependable digital experience.
          </p>
          <p className="section-copy">
            The platform is built to support ongoing engagement, transparent record access and efficient self-service
            for users who expect trusted financial-services functionality.
          </p>
          <a className="section-link" href="#help-center">
            Learn more
          </a>
        </div>
        <div className="visual-panel">
          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
            alt="Investor technology dashboard"
          />
        </div>
      </div>
    </section>
  );
}
