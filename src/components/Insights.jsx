const items = [
  {
    title: 'Experience',
    text: 'Simple, dependable digital journeys shaped to support users across key equity tasks.'
  },
  {
    title: 'Expertise',
    text: 'Practical domain knowledge aligned with financial-services expectations and operational discipline.'
  },
  {
    title: 'Innovation',
    text: 'Thoughtful enhancements that strengthen access, support and confidence without unnecessary complexity.'
  },
  {
    title: 'Technology',
    text: 'Reliable platform foundations focused on security, accessibility and consistent performance.'
  }
];

function Insights() {
  return (
    <section id="insights" className="insights-section">
      <div className="container">
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

export default Insights;
