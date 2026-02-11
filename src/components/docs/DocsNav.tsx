import { NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

const navGroups = [
  {
    title: 'Getting Started',
    links: [
      ['/docs', 'Overview'],
      ['/docs#quickstart', 'Quick Start'],
      ['/docs#how-it-works', 'How It Works'],
    ],
  },
  {
    title: 'Installation',
    links: [
      ['/docs/installation', 'Install'],
      ['/docs/installation#vite', 'Vite Setup'],
      ['/docs/installation#nextjs', 'Next.js Setup'],
      ['/docs/installation#other-frameworks', 'Other Frameworks'],
      ['/docs/installation#manual-setup', 'Manual Setup'],
    ],
  },
  {
    title: 'Core Concepts',
    links: [
      ['/docs/concepts', 'Inspector'],
      ['/docs/concepts#bridge', 'Bridge'],
      ['/docs/concepts#semantic-snapshot', 'Semantic Snapshot'],
      ['/docs/concepts#multi-select', 'Multi-Select'],
    ],
  },
  {
    title: 'MCP Integration',
    links: [
      ['/docs/mcp', 'MCP Tools'],
      ['/docs/mcp#get-focused-element', 'get_focused_element'],
      ['/docs/mcp#update-status', 'update_status'],
      ['/docs/mcp#send-thought', 'send_thought'],
      ['/docs/mcp#report-action', 'report_action'],
      ['/docs/mcp#ask-question', 'ask_question'],
      ['/docs/mcp#wait-for-request', 'wait_for_request'],
      ['/docs/mcp#get-focus-history', 'get_focus_history'],
      ['/docs/mcp#http-endpoints', 'HTTP Endpoints'],
    ],
  },
  {
    title: 'Features',
    links: [
      ['/docs/features', 'Framework Detection'],
      ['/docs/features#git-integration', 'Git Integration'],
      ['/docs/features#auto-commit', 'Auto-Commit'],
      ['/docs/features#one-click-undo', 'One-Click Undo'],
    ],
  },
  {
    title: 'Advanced',
    links: [
      ['/docs/advanced', 'Full Schema'],
      ['/docs/advanced#configuration', 'Configuration'],
      ['/docs/advanced#troubleshooting', 'Troubleshooting'],
    ],
  },
  {
    title: 'Packages',
    links: [
      ['/docs/packages', '@eyeglass/cli'],
      ['/docs/packages#inspector', '@eyeglass/inspector'],
      ['/docs/packages#bridge', '@eyeglass/bridge'],
      ['/docs/packages#types', '@eyeglass/types'],
    ],
  },
  {
    title: 'Changelog',
    links: [
      ['/docs/changelog', 'Version History'],
    ],
  },
  {
    title: 'Community',
    links: [
      ['/docs/community', 'FAQ'],
      ['/docs/community#contributing', 'Contributing'],
    ],
  },
]

export function DocsNav() {
  const location = useLocation()
  const [hash, setHash] = useState(location.hash)

  useEffect(() => {
    setHash(location.hash)

    const handleHashChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [location])

  const isActive = (to: string) => {
    const [path, linkHash] = to.split('#')
    const currentPath = location.pathname

    if (linkHash) {
      return currentPath === path && hash === `#${linkHash}`
    }
    return currentPath === path && !hash
  }

  return (
    <nav className="docs-nav" aria-label="Docs navigation">
      <div className="docs-nav-title">Eyeglass Docs</div>
      {navGroups.map(({ title, links }) => (
        <details key={title} open>
          <summary>{title}</summary>
          {links.map(([to, label]) => {
            const hasHash = to.includes('#')
            const basePath = hasHash ? to.split('#')[0] : to

            if (hasHash) {
              return (
                <a
                  key={to}
                  href={to}
                  className={isActive(to) ? 'active' : ''}
                  onClick={() => setHash(`#${to.split('#')[1]}`)}
                >
                  {label}
                </a>
              )
            }

            return (
              <NavLink
                key={to}
                to={basePath}
                end={basePath === '/docs'}
                className={({ isActive: routeActive }) =>
                  routeActive && !hash ? 'active' : ''
                }
                onClick={() => setHash('')}
              >
                {label}
              </NavLink>
            )
          })}
        </details>
      ))}
    </nav>
  )
}
