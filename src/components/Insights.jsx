export default function Insights() {
  const pillars = [
    {
      title: 'Experience',
      text: 'Focused on intuitive digital journeys that support confidence and clarity across every interaction.'
    },
    {
      title: 'Expertise',
      text: 'Built with practical knowledge of shareholder, employee plan and enterprise servicing needs.'
    },
    {
      title: 'Innovation',
      text: 'Modern platform thinking applied carefully to existing business workflows without unnecessary complexity.'
    },
    {
      title: 'Technology',
      text: 'Scalable delivery patterns, responsive experiences and maintainable solutions for evolving products.'
    }
  ];

  return (
    <section id="insights" className="page-section alt">
      <div className="section-inner">
        <div className="center-heading">
          <h2>Learn more about our technology platforms</h2>
          <p>Practical, enterprise-focused delivery shaped for secure digital financial-service journeys.</p>
        </div>
        <div className="pillar-grid">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="pillar">
              <div className="pillar-bar" aria-hidden="true" />
              <h3>{pillar.title}</h3>
              <p>{pillar.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}