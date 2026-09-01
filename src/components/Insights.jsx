const items = [
  {
    title: 'Experience',
    text: 'Purpose-built platform experiences designed for clarity, confidence and smooth task completion.'
  },
  {
    title: 'Expertise',
    text: 'Deep knowledge of shareholder services, employee plans and enterprise support requirements.'
  },
  {
    title: 'Innovation',
    text: 'Focused digital improvements that strengthen support access without disrupting familiar workflows.'
  },
  {
    title: 'Technology',
    text: 'Reliable technology platforms aligned to secure access, responsive design and practical usability.'
  }
];

export default function Insights() {
  return (
    <section className="section section-alt" id="insights">
      <div className="container">
        <div className="insights-header">
          <h2 className="section-title">Learn more about our technology platforms</h2>
        </div>
        <div className="insights-grid">
          {items.map((item) => (
            <article key={item.title} className="insight-card">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
