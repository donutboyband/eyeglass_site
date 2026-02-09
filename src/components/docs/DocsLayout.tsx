import { Outlet } from 'react-router-dom'
import { DocsNav } from './DocsNav'

export function DocsLayout() {
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
