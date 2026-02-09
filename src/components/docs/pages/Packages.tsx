export function Packages() {
  return (
    <>
      <section className="docs-section" id="cli">
        <h2>@eyeglass/cli</h2>
        <p>Command-line tool for initializing Eyeglass in your project.</p>

        <h3>Installation</h3>
        <p>No installation needed—use with <code>npx</code>:</p>
        <pre><code>npx @eyeglass/cli init</code></pre>

        <h3>Commands</h3>
        <ul>
          <li><code>init</code> - Initialize Eyeglass in your project</li>
          <li><code>help</code> - Show help information</li>
        </ul>

        <h3>Options</h3>
        <ul>
          <li><code>--dry-run</code> - Preview changes without making them</li>
          <li><code>--skip-install</code> - Skip installing <code>@eyeglass/inspector</code></li>
        </ul>

        <h3>What Init Does</h3>
        <ol>
          <li>Detects your framework (Vite, Next.js, CRA, Remix)</li>
          <li>Installs <code>@eyeglass/inspector</code> as a dev dependency</li>
          <li>Adds import to your entry file</li>
          <li>Creates <code>.claude/settings.json</code> with MCP config</li>
        </ol>
      </section>

      <section className="docs-section" id="inspector">
        <h2>@eyeglass/inspector</h2>
        <p>Browser-side web component for visual element selection and request submission.</p>

        <h3>Installation</h3>
        <pre><code>npm install -D @eyeglass/inspector</code></pre>

        <h3>Usage</h3>
        <pre><code>import '@eyeglass/inspector'</code></pre>

        <h3>Features</h3>
        <ul>
          <li>Auto-initializes when imported</li>
          <li>Only runs in development (<code>NODE_ENV !== 'production'</code>)</li>
          <li>Zero configuration required</li>
          <li>~57kb minified</li>
        </ul>

        <h3>API</h3>
        <p>The inspector is a web component with no public API. It self-manages UI and state.</p>
      </section>

      <section className="docs-section" id="bridge">
        <h2>@eyeglass/bridge</h2>
        <p>MCP server that connects browser to Claude Code.</p>

        <h3>Installation</h3>
        <p>Automatically configured by the CLI, but can be installed manually:</p>
        <pre><code>npm install @eyeglass/bridge</code></pre>

        <h3>Usage</h3>
        <p>The bridge runs as an MCP server via <code>.claude/settings.json</code>:</p>
        <pre><code>{`{
  "mcpServers": {
    "eyeglass": {
      "command": "npx",
      "args": ["eyeglass-bridge"]
    }
  }
}`}</code></pre>

        <h3>Architecture</h3>
        <ul>
          <li><strong>MCP Server:</strong> stdio-based communication with Claude</li>
          <li><strong>HTTP Server:</strong> REST API + Server-Sent Events (port 3939)</li>
          <li><strong>State Management:</strong> In-memory store for requests and interactions</li>
        </ul>
      </section>

      <section className="docs-section" id="types">
        <h2>@eyeglass/types</h2>
        <p>Shared TypeScript definitions for Eyeglass packages.</p>

        <h3>Installation</h3>
        <pre><code>npm install -D @eyeglass/types</code></pre>

        <h3>Exports</h3>
        <ul>
          <li><code>SemanticSnapshot</code> - Element context interface</li>
          <li><code>FocusPayload</code> - Request payload interface</li>
          <li><code>InteractionStatus</code> - Status type (idle, pending, fixing, success, failed)</li>
          <li><code>ActivityEvent</code> - Union of activity event types</li>
          <li><code>StatusEvent</code>, <code>ThoughtEvent</code>, <code>QuestionEvent</code>, <code>ActionEvent</code></li>
        </ul>

        <h3>Usage</h3>
        <pre><code>{`import type { SemanticSnapshot, FocusPayload } from '@eyeglass/types'

function processSnapshot(snapshot: SemanticSnapshot) {
  console.log(\`Component: \${snapshot.framework.componentName}\`)
  console.log(\`File: \${snapshot.framework.filePath}\`)
}`}</code></pre>
      </section>
    </>
  )
}
