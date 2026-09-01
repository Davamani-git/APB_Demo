function Insights() {
  const items = [
    {
      title: 'Experience',
      text: 'Solutions shaped by practical delivery experience across shareholder and employee equity services.'
    },
    {
      title: 'Expertise',
      text: 'Deep domain knowledge supporting secure information access, communication and support journeys.'
    },
    {
      title: 'Innovation',
      text: 'Thoughtful enhancements that improve usability without disrupting trusted working patterns.'
    },
    {
      title: 'Technology',
      text: 'Reliable digital platforms designed for responsive access, maintainability and consistent service.'
    }
  ];

  return (
    <section className="content-section alt platforms-section" id="insights">
      <div className="container">
        <h2 className="platforms-heading">Learn more about our technology platforms</h2>
        <div className="platform-grid">
          {items.map((item) => (
            <article key={item.title} className="platform-item">
              <div className="platform-accent" aria-hidden="true" />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Insights;
