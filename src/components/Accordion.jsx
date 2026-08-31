import { useState } from 'react';

export default function Accordion({ title, content }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="faq-item">
      <button
        type="button"
        className="faq-trigger"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span className="faq-question">{title}</span>
        <span className="faq-icon" aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="faq-answer">{content}</div>}
    </div>
  );
}