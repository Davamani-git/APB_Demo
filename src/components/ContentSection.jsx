function ContentSection({ id, eyebrow, title, description, secondaryDescription, features, image, alt, reverse }) {
  return (
    <section id={id} className={`section ${reverse ? 'section--reverse' : ''}`}>
      <div className="section__content">
        <p className="section__eyebrow">{eyebrow}</p>
        <h2 className="section__title">{title}</h2>
        <p className="section__description">{description}</p>
        {secondaryDescription ? <p className="section__secondary-description">{secondaryDescription}</p> : null}
        {features?.length ? (
          <ul className="feature-list">
            {features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        ) : null}
      </div>
      <div className="section__visual">
        <img src={image} alt={alt} />
      </div>
    </section>
  );
}

export default ContentSection;
