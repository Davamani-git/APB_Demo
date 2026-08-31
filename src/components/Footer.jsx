function Footer({ brand, demo, email }) {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <h2>{brand}</h2>
          <p>{demo}</p>
        </div>
        <div className="site-footer__right">
          <p>Contact</p>
          <p>
            <a href={`mailto:${email}`}>{email}</a>
          </p>
          <p>
            <a href="#top" onClick={(event) => {
              event.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}>Back to top</a>
          </p>
          <p>© {brand}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
