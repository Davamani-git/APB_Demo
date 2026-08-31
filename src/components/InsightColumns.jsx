function InsightColumns({ id, items }) {
  return (
    <section id={id} className="insight-columns">
      <div className="insight-columns__grid">
        {items.map((item) => (
          <article key={item.title} className="insight-card">
            <div className="insight-card__accent" aria-hidden="true" />
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default InsightColumns;
