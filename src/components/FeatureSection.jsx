export default function FeatureSection({ id, kicker, title, description, extraParagraph, bullets, image, imageAlt, reverse = false, alternate = false }) {
  return (
    <section id={id} className={`feature-section ${alternate ? 'alt-bg' : ''}`}>
      <div className="container feature-grid-wrapper">
        <div className={`feature-grid ${reverse ? 'reverse' : ''}`}>
          <div className="feature-copy">
            <p className="section-kicker">{kicker}</p>
            <h2>{title}</h2>
            <p>{description}</p>
            {extraParagraph ? <p>{extraParagraph}</p> : null}
            {bullets?.length ? (
              <ul className="feature-list">
                {bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className="feature-visual">
            <img src={image} alt={imageAlt} />
          </div>
        </div>
      </div>
    </section>
  );
}
