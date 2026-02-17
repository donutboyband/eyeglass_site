import { CodeBlock } from '../../CodeBlock'

const cliOptionsCode = `npx @eyeglass/cli init --dry-run      # Preview without making changes
npx @eyeglass/cli init --skip-install # Skip npm install step
npx @eyeglass/cli help                # Show help`

const viteCode = `// src/main.tsx
import '@eyeglass/inspector'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)`

const nextjsCode = `// app/layout.tsx
import '@eyeglass/inspector'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`

const craCode = `// src/index.tsx
import '@eyeglass/inspector'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(<App />)`

const remixCode = `// app/root.tsx
import '@eyeglass/inspector'
import { Links, LiveReload, Meta, Outlet } from '@remix-run/react'

export default function App() {
  return (
    <html>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <LiveReload />
      </body>
    </html>
  )
}`

const mcpConfigCode = `{
  "mcpServers": {
    "eyeglass": {
      "command": "npx",
      "args": ["eyeglass-bridge"]
    }
  }
}`

export function Installation() {
  return (
    <>
      <section className="docs-section" id="install">
        <h2>Installation</h2>
        <p>The fastest way to get started is with the CLI:</p>
        <CodeBlock code="npx @eyeglass/cli init" language="bash" />
        <h3>What It Does</h3>
        <p>The init command automatically:</p>
        <ul>
          <li>Detects your framework (Vite, Next.js, CRA, Remix)</li>
          <li>Installs <code>@eyeglass/inspector</code> as a dev dependency</li>
          <li>Adds the import to your entry file</li>
          <li>Creates <code>.claude/settings.json</code> with MCP server config</li>
          <li>Sets up local MCP (<code>.copilot/mcp-config.json</code>) or Codex HTTP docs (<code>.codex/eyeglass.md</code>) when selected</li>
        </ul>
        <h3>CLI Options</h3>
        <CodeBlock code={cliOptionsCode} language="bash" />
      </section>

      <section className="docs-section" id="vite">
        <h2>Vite Setup</h2>
        <p>For Vite projects, the CLI adds the import to <code>src/main.tsx</code> (or <code>main.ts</code>):</p>
        <CodeBlock code={viteCode} language="typescript" />
        <p>The inspector auto-initializes and only runs when <code>NODE_ENV !== 'production'</code>.</p>
      </section>

      <section className="docs-section" id="nextjs">
        <h2>Next.js Setup</h2>
        <p>For Next.js (App Router), add the import to <code>app/layout.tsx</code>:</p>
        <CodeBlock code={nextjsCode} language="typescript" />
        <p><strong>For Pages Router:</strong> Import in <code>pages/_app.tsx</code></p>
        <h3>SSR Consideration</h3>
        <p>The inspector is client-only and safe for SSR. It uses conditional checks to prevent server-side initialization.</p>
      </section>

      <section className="docs-section" id="other-frameworks">
        <h2>Other Frameworks</h2>
        <h3>Create React App</h3>
        <CodeBlock code={craCode} language="typescript" />

        <h3>Remix</h3>
        <CodeBlock code={remixCode} language="typescript" />
      </section>

      <section className="docs-section" id="manual-setup">
        <h2>Manual Setup</h2>
        <p>If the CLI doesn't work for your setup, you can configure Eyeglass manually.</p>

        <h3>1. Install the Inspector</h3>
        <CodeBlock code="npm install -D @eyeglass/inspector" language="bash" />

        <h3>2. Import in Your Entry File</h3>
        <CodeBlock code="import '@eyeglass/inspector'" language="typescript" />

        <h3>3. Configure MCP Server</h3>
        <p>Create <code>.claude/settings.json</code> in your project root:</p>
        <CodeBlock code={mcpConfigCode} language="json" />

        <h3>4. Restart the agent</h3>
        <p>the agent needs to be restarted to pick up the new MCP server configuration.</p>
      </section>
    </>
  )
}
