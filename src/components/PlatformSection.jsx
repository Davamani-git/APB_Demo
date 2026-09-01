function PlatformSection({ id, title, body, image, imageAlt, reverse = false }) {
  return (
    <section className="platform-section" id={id}>
      <div className="container">
        <div className={`platform-grid${reverse ? ' reverse' : ''}`}>
          <div className="platform-copy">
            <h2>{title}</h2>
            <p>{body}</p>
          </div>
          <div className="platform-visual">
            <img src={image} alt={imageAlt} loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default PlatformSection;
