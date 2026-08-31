export default function Accordion({ items, openItem, onToggle }) {
  return (
    <div className="accordion">
      {items.map((item) => {
        const isOpen = openItem === item.id;
        return (
          <div className="accordion-item" key={item.id}>
            <button
              className="accordion-trigger"
              onClick={() => onToggle(item.id)}
              aria-expanded={isOpen}
              aria-controls={`accordion-panel-${item.id}`}
              id={`accordion-trigger-${item.id}`}
            >
              <span className="accordion-label">{item.title}</span>
              <span className="accordion-icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
              <div
                className="accordion-panel help-rich-text"
                id={`accordion-panel-${item.id}`}
                role="region"
                aria-labelledby={`accordion-trigger-${item.id}`}
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
