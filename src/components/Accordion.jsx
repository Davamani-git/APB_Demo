function Accordion({ items, openIndex, onToggle }) {
  return (
    <div className="accordion-list">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div className="accordion-item" key={item.question}>
            <button
              type="button"
              className="accordion-trigger"
              onClick={() => onToggle(index)}
              aria-expanded={isOpen}
            >
              <span className="accordion-question">{item.question}</span>
              <span className="accordion-icon" aria-hidden="true">
                {isOpen ? '−' : '+'}
              </span>
            </button>
            <div className={`accordion-content ${isOpen ? 'is-open' : ''}`}>
              <p>{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Accordion;
