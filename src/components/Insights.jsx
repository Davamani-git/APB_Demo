function Insights({ id }) {
  const items = [
    {
      title: 'Experience',
      description: 'Focused on intuitive digital journeys that support confidence and clarity across every interaction.'
    },
    {
      title: 'Expertise',
      description: 'Built with practical knowledge of shareholder, employee plan and enterprise servicing needs.'
    },
    {
      title: 'Innovation',
      description: 'Modern platform thinking applied carefully to existing business workflows without unnecessary complexity.'
    },
    {
      title: 'Technology',
      description: 'Scalable delivery patterns, responsive experiences and maintainable solutions for evolving products.'
    }
  ];

  return (
    <section id={id} className="content-section insights-section alternate-bg">
      <div className="container">
        <h2 className="section-heading centered">Learn more about our technology platforms</h2>
        <div className="insights-grid">
          {items.map((item) => (
            <article key={item.title} className="insight-item">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Insights;
