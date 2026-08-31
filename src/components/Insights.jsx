export default function Insights({ hidden }) {
  const items = [
    {
      title: 'Experience',
      copy: 'Focused on intuitive digital journeys that support confidence and clarity across every interaction.'
    },
    {
      title: 'Expertise',
      copy: 'Built with practical knowledge of shareholder, employee plan and enterprise servicing needs.'
    },
    {
      title: 'Innovation',
      copy: 'Modern platform thinking applied carefully to existing business workflows without unnecessary complexity.'
    },
    {
      title: 'Technology',
      copy: 'Scalable delivery patterns, responsive experiences and maintainable solutions for evolving products.'
    }
  ];

  return (
    <section hidden={hidden} aria-hidden={hidden}>
      <div className="insights-grid">
        {items.map((item) => (
          <article className="insight-item" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
