import { Link, useLocation } from 'react-router-dom'
import { GitHubIcon, SunIcon, MoonIcon } from './Icons'

type Props = {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

export function NavBar({ theme, toggleTheme }: Props) {
  const location = useLocation()
  const isDocsPage = location.pathname.startsWith('/docs')

  return (
    <nav className="nav">
      <div className="nav-content">
        <Link to="/" className="nav-logo font-header">
          <img src="/eyeglass.svg" alt="Eyeglass" />
          <span>eyeglass</span>
        </Link>
        <div className="nav-links">
          <Link to="/docs" className={`nav-link${isDocsPage ? ' active' : ''}`}>
            Docs
          </Link>
          <a
            href="https://github.com/donutboyband/eyeglass"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
          >
            <GitHubIcon />
            GitHub
          </a>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title="Toggle theme"
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
        <div className="nav-mobile">
          <Link to="/docs" className={`nav-link${isDocsPage ? ' active' : ''}`}>
            Docs
          </Link>
          <a
            href="https://github.com/donutboyband/eyeglass"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link icon-only"
            aria-label="GitHub"
          >
            <GitHubIcon />
          </a>
          <button
            className="theme-toggle icon-only"
            onClick={toggleTheme}
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>
    </nav>
  )
}
