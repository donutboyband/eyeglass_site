import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <p className="section-label">404</p>
        <h1>Page Not Found</h1>
        <p className="not-found-subtitle">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn primary">
            Go Home
          </Link>
          <Link to="/docs" className="btn ghost">
            View Docs
          </Link>
          <Link to="/sitemap" className="btn ghost">
            Sitemap
          </Link>
        </div>
      </div>
    </div>
  )
}
