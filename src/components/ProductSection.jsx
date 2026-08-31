function ProductSection({ id, eyebrow, title, description, items, image, imageAlt, reverse = false }) {
  return (
    <section id={id} className="content-section">
      <div className="container">
        <div className={`section-grid ${reverse ? 'reverse' : ''}`}>
          <div className="section-copy">
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="section-title">{title}</h2>
            <p className="section-description">{description}</p>
            <ul className="feature-list">
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="section-media">
            <img src={image} alt={imageAlt} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductSection;
