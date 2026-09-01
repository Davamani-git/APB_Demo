const items = [
  {
    title: 'Experience',
    body: 'Clear journeys and lightweight interfaces support efficient access to equity information without disrupting the existing visual language.'
  },
  {
    title: 'Expertise',
    body: 'Our delivery approach combines governance, servicing knowledge and implementation discipline for dependable digital outcomes.'
  },
  {
    title: 'Innovation',
    body: 'Targeted enhancements are introduced only where needed, helping teams extend the application while preserving continuity.'
  },
  {
    title: 'Technology',
    body: 'Responsive, reliable platform components support user tasks across desktop and mobile devices with consistent behavior.'
  }
];

function Insights() {
  return (
    <section className="insights-section">
      <div className="container">
        <div className="insights-grid">
          {items.map((item) => (
            <article className="insight-item" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Insights;
