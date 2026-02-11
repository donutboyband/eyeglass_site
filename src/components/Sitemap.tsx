import { Link } from 'react-router-dom'

const sitemapData = [
  {
    title: 'Main',
    links: [
      { to: '/', label: 'Home' },
      { to: '/docs', label: 'Documentation' },
    ],
  },
  {
    title: 'Getting Started',
    links: [
      { to: '/docs', label: 'Overview' },
      { to: '/docs#quickstart', label: 'Quick Start' },
      { to: '/docs#how-it-works', label: 'How It Works' },
    ],
  },
  {
    title: 'Installation',
    links: [
      { to: '/docs/installation', label: 'Install' },
      { to: '/docs/installation#vite', label: 'Vite Setup' },
      { to: '/docs/installation#nextjs', label: 'Next.js Setup' },
      { to: '/docs/installation#other-frameworks', label: 'Other Frameworks' },
      { to: '/docs/installation#manual-setup', label: 'Manual Setup' },
    ],
  },
  {
    title: 'Core Concepts',
    links: [
      { to: '/docs/concepts', label: 'Inspector' },
      { to: '/docs/concepts#bridge', label: 'Bridge' },
      { to: '/docs/concepts#semantic-snapshot', label: 'Semantic Snapshot' },
      { to: '/docs/concepts#multi-select', label: 'Multi-Select' },
    ],
  },
  {
    title: 'MCP Integration',
    links: [
      { to: '/docs/mcp', label: 'MCP Tools' },
      { to: '/docs/mcp#get-focused-element', label: 'get_focused_element' },
      { to: '/docs/mcp#update-status', label: 'update_status' },
      { to: '/docs/mcp#send-thought', label: 'send_thought' },
      { to: '/docs/mcp#report-action', label: 'report_action' },
      { to: '/docs/mcp#ask-question', label: 'ask_question' },
      { to: '/docs/mcp#wait-for-request', label: 'wait_for_request' },
      { to: '/docs/mcp#get-focus-history', label: 'get_focus_history' },
      { to: '/docs/mcp#http-endpoints', label: 'HTTP Endpoints' },
    ],
  },
  {
    title: 'Features',
    links: [
      { to: '/docs/features', label: 'Framework Detection' },
      { to: '/docs/features#git-integration', label: 'Git Integration' },
      { to: '/docs/features#auto-commit', label: 'Auto-Commit' },
      { to: '/docs/features#one-click-undo', label: 'One-Click Undo' },
    ],
  },
  {
    title: 'Advanced',
    links: [
      { to: '/docs/advanced', label: 'Full Schema' },
      { to: '/docs/advanced#configuration', label: 'Configuration' },
      { to: '/docs/advanced#troubleshooting', label: 'Troubleshooting' },
    ],
  },
  {
    title: 'Packages',
    links: [
      { to: '/docs/packages', label: '@eyeglass/cli' },
      { to: '/docs/packages#inspector', label: '@eyeglass/inspector' },
      { to: '/docs/packages#bridge', label: '@eyeglass/bridge' },
      { to: '/docs/packages#types', label: '@eyeglass/types' },
    ],
  },
  {
    title: 'Community',
    links: [
      { to: '/docs/community', label: 'FAQ' },
      { to: '/docs/community#changelog', label: 'Changelog' },
      { to: '/docs/community#contributing', label: 'Contributing' },
    ],
  },
]

export function Sitemap() {
  return (
    <div className="sitemap">
      <div className="sitemap-content">
        <p className="section-label">Navigation</p>
        <h1>Sitemap</h1>
        <p className="sitemap-subtitle">
          All pages and sections available on the Eyeglass documentation site.
        </p>

        <div className="sitemap-grid">
          {sitemapData.map(({ title, links }) => (
            <div key={title} className="sitemap-section">
              <h2>{title}</h2>
              <ul>
                {links.map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
