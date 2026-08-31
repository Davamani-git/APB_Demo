function Accordion({ items, openIndex, setOpenIndex }) {
  return (
    <div>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div className="accordion-item" key={item.question}>
            <button
              type="button"
              className="accordion-trigger"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
            >
              <span className="accordion-trigger__label">{item.question}</span>
              <span className="accordion-trigger__icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen ? <div className="accordion-content">{item.answer}</div> : null}
          </div>
        );
      })}
    </div>
  );
}

export default Accordion;
