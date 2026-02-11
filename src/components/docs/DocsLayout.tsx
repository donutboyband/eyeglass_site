import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { DocsNav } from './DocsNav'

export function DocsLayout() {
  const location = useLocation()

  // Handle anchor scrolling on page load and navigation
  useEffect(() => {
    if (location.hash) {
      // Small delay to ensure the DOM has rendered
      const timeoutId = setTimeout(() => {
        const element = document.getElementById(location.hash.slice(1))
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
      return () => clearTimeout(timeoutId)
    } else {
      // Scroll to top when navigating to a page without hash
      window.scrollTo(0, 0)
    }
  }, [location.pathname, location.hash])

  return (
    <div className="docs-layout">
      <aside className="docs-rail" aria-label="Docs navigation">
        <DocsNav />
      </aside>
      <main className="docs-content">
        <Outlet />
      </main>
    </div>
  )
}
