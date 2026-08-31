export default function InvestorCentre({ hidden }) {
  return (
    <section className="platform-section" hidden={hidden} aria-hidden={hidden}>
      <div>
        <p className="eyebrow">For shareholders</p>
        <h2 className="section-title">Investor Centre</h2>
        <div className="section-copy">
          <p>Introducing the new Investor Centre experience. A modern, intuitive and seamless way to manage your investments online.</p>
        </div>
        <ul className="feature-list">
          <li>Portfolio holdings and price history</li>
          <li>Monitor recent activity</li>
          <li>Download documents instantly</li>
          <li>Virtual assistance</li>
        </ul>
      </div>
      <div className="visual-wrap">
        <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80" alt="Investor technology workspace" />
      </div>
    </section>
  );
}
