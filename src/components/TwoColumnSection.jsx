function TwoColumnSection({
  id,
  eyebrow,
  title,
  description,
  secondaryDescription,
  bullets,
  imageUrl,
  imageAlt,
  reverse = false,
  alternate = false
}) {
  return (
    <section id={id} className={`content-section ${alternate ? 'alternate-bg' : ''}`}>
      <div className={`container split-layout ${reverse ? 'reverse' : ''}`}>
        <div className="text-panel">
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <p>{description}</p>
          {secondaryDescription ? <p>{secondaryDescription}</p> : null}
          {bullets ? (
            <ul className="feature-list">
              {bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="image-panel">
          <img src={imageUrl} alt={imageAlt} />
        </div>
      </div>
    </section>
  );
}

export default TwoColumnSection;
