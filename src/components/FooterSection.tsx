export function FooterSection() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <a href="https://github.com/donutboyband/eyeglass" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
          <a href="https://github.com/donutboyband/eyeglass#readme" target="_blank" rel="noopener noreferrer" className="footer-link">Docs</a>
          <a href="https://github.com/donutboyband/eyeglass/issues" target="_blank" rel="noopener noreferrer" className="footer-link">Issues</a>
        </div>
        <div className="footer-meta">
          <div className="footer-made-with">
            <span>Made with</span>
            <img src="/eyeglass.svg" alt="Eyeglass" className="footer-logo" />
          </div>
          <p className="footer-copy">MIT License</p>
        </div>
      </div>
    </footer>
  )
}
