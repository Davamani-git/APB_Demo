export default function Insights({ items }) {
  return (
    <section id="insights" className="insights-section">
      <div className="container">
        <h2 className="centered">Learn more about our technology platforms</h2>
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
