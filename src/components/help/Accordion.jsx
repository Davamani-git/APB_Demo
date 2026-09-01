export default function Accordion({ title, isOpen, onToggle, children }) {
  return (
    <div className="accordion-item">
      <button type="button" className="accordion-trigger" onClick={onToggle} aria-expanded={isOpen}>
        <span>{title}</span>
        <span className="accordion-icon" aria-hidden="true">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      {isOpen && <div className="accordion-answer">{children}</div>}
    </div>
  );
}
