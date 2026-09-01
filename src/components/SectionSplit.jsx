function SectionSplit({ id, kicker, title, text, image, alt, reverse = false }) {
  return (
    <section id={id} className="split-section">
      <div className="container">
        <div className={`split-grid ${reverse ? 'reverse' : ''}`}>
          <div className="split-copy" style={reverse ? { order: 2 } : undefined}>
            <p className="kicker">{kicker}</p>
            <h2>{title}</h2>
            <p>{text}</p>
          </div>
          <div className="split-visual" style={reverse ? { order: 1 } : undefined}>
            <img src={image} alt={alt} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default SectionSplit;
