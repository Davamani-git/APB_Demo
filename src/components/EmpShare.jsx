export default function EmpShare({ hidden }) {
  return (
    <section className="platform-section" hidden={hidden} aria-hidden={hidden}>
      <div>
        <p className="eyebrow">For employee share plan holders</p>
        <h2 className="section-title">EmpShare</h2>
        <div className="section-copy">
          <p>EmpShare provides a clear and accessible experience for plan holders, helping them stay informed and act with confidence.</p>
        </div>
        <ul className="feature-list">
          <li>Intuitive and user-friendly</li>
          <li>Real-time data</li>
          <li>Simplify tax calculations</li>
          <li>Mobile app</li>
        </ul>
      </div>
      <div className="visual-wrap">
        <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80" alt="Employee collaboration session" />
      </div>
    </section>
  );
}
