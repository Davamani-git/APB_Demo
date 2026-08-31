function Accordion({ items, openIndex, onToggle }) {
  return (
    <div className="help-content-card">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div className="accordion-item" key={item.title}>
            <button
              type="button"
              className="accordion-button"
              onClick={() => onToggle(isOpen ? -1 : index)}
              aria-expanded={isOpen}
            >
              <span>{item.title}</span>
              <span className="accordion-icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen ? (
              <div className="accordion-content">
                {item.body.map((paragraph) => (
                  <p className="help-content-body" key={paragraph}>{paragraph}</p>
                ))}
                {item.list ? (
                  <ul className="help-content-list">
                    {item.list.map((entry) => (
                      <li key={entry}>{entry}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default Accordion;
