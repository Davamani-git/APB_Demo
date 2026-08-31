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

export default function Insights() {
  return (
    <section className="section" id="insights">
      <div className="container">
        <div className="insights-grid">
          {items.map((item) => (
            <article className="insight-item" key={item.title}>
              <h3 className="insight-title">{item.title}</h3>
              <p className="insight-copy">{item.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
