import { Link } from "react-router-dom";

export function FooterSection() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <a
            href="https://github.com/donutboyband/eyeglass"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            GitHub
          </a>
          <Link to="/docs" className="footer-link">
            Docs
          </Link>
          <Link to="/sitemap" className="footer-link">
            Sitemap
          </Link>
          <a
            href="https://github.com/donutboyband/eyeglass/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Issues
          </a>
        </div>
        <div className="footer-meta">
          <div className="footer-made-with">
            <span>
              Made by{" "}
              <a href="https://chasedurrett.dev" target="_blank">
                donutboyband
              </a>{" "}
              with
            </span>
            <img src="/eyeglass.svg" alt="Eyeglass" className="footer-logo" />
          </div>
          <p className="footer-copy">MIT License</p>
        </div>
      </div>
    </footer>
  );
}
