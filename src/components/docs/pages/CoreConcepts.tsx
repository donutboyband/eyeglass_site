import { CodeBlock } from '../../CodeBlock'

const sampleSnapshot = `{
  "role": "button",
  "name": "Buy now",
  "tagName": "button",
  "id": "cta",
  "className": "primary",
  "framework": {
    "name": "react",
    "componentName": "PricingCard",
    "filePath": "src/components/PricingCard.tsx",
    "props": { "intent": "primary", "size": "lg" },
    "ancestry": ["App", "HomePage"]
  },
  "a11y": {
    "label": "Buy now",
    "disabled": false,
    "hidden": false
  },
  "geometry": {
    "x": 422,
    "y": 688,
    "width": 180,
    "height": 52,
    "visible": true
  },
  "styles": {
    "display": "block",
    "backgroundColor": "#0ea5e9",
    "color": "#ffffff",
    "padding": "12px 24px",
    "borderRadius": "8px"
  },
  "timestamp": 1770657937961,
  "url": "http://localhost:5173/#demo"
}`

const mcpConfigCode = `{
  "mcpServers": {
    "eyeglass": {
      "command": "npx",
      "args": ["eyeglass-bridge"]
    }
  }
}`

const multiSelectPayload = `{
  "interactionId": "abc123",
  "snapshots": [
    { /* first element */ },
    { /* second element */ },
    { /* third element */ }
  ],
  "userNote": "Make these buttons the same size",
  "autoCommit": true
}`

export function CoreConcepts() {
  return (
    <>
      <section className="docs-section" id="inspector">
        <h2>Inspector</h2>
        <p>The Inspector is a browser-side web component that provides the visual interface for selecting elements and submitting requests to the agent. It auto-initializes when imported and runs only in development mode.</p>

        <h3>Installation</h3>
        <p>Import in your app's entry file:</p>
        <CodeBlock code={`// src/main.tsx (Vite) or app/layout.tsx (Next.js)\nimport '@eyeglass/inspector';`} language="typescript" />

        <h3>Features</h3>
        <ul>
          <li><strong>Hover Highlighting:</strong> See element boundaries and component names as you hover</li>
          <li><strong>Click to Select:</strong> Single-click to select an element and open the request panel</li>
          <li><strong>Multi-Select:</strong> Hold Cmd/Ctrl and click to select up to 5 elements</li>
          <li><strong>Framework Detection:</strong> Automatically detects React, Vue, and Svelte component names and file paths</li>
          <li><strong>Request Panel:</strong> Type your request and submit to the agent</li>
          <li><strong>Activity Feed:</strong> Real-time updates on the agent's progress via Server-Sent Events</li>
          <li><strong>Settings:</strong> Toggle auto-commit, change bridge URL, and other preferences</li>
          <li><strong>One-Click Undo:</strong> Revert changes directly from the inspector</li>
        </ul>

        <h3>Activation</h3>
        <p>The inspector appears as a small eyeglass icon in the bottom-left corner of your browser. Click it to activate selection mode. Once activated, your cursor changes to indicate inspector mode is active.</p>

        <h3>Development Only</h3>
        <p>The inspector only initializes when <code>NODE_ENV !== 'production'</code> or <code>process.env.NODE_ENV !== 'production'</code>, keeping your production bundle clean and secure.</p>
      </section>

      <section className="docs-section" id="bridge">
        <h2>Bridge (MCP or HTTP Server)</h2>
        <p>The Bridge connects your browser to AI coding agents. It can run as an MCP (Model Context Protocol) server for agents like Claude Code, or as an HTTP server for agents like Codex.</p>

        <h3>What It Does</h3>
        <ul>
          <li>Exposes tools via MCP or HTTP endpoints</li>
          <li>Stores element context from the inspector</li>
          <li>Manages request/response cycles via long-polling</li>
          <li>Handles Git operations (auto-commit, revert)</li>
          <li>Streams real-time updates via Server-Sent Events</li>
        </ul>

        <h3>MCP Mode (Default)</h3>
        <p>For agents that support MCP, the bridge starts automatically when the agent initializes, as configured in <code>.claude/settings.json</code>:</p>
        <CodeBlock code={mcpConfigCode} language="json" />
        
        <h3>HTTP Mode</h3>
        <p>For agents like Codex or Copilot, run the bridge as an HTTP server on port 3300:</p>
        <CodeBlock code="npx eyeglass-bridge --http" language="bash" />
        <p>The HTTP server provides the same functionality via REST endpoints:</p>
        <ul>
          <li><code>GET /api/wait</code> - Wait for new focus request (long-polling)</li>
          <li><code>POST /api/status</code> - Update browser status (fixing, success, etc.)</li>
          <li><code>POST /focus</code> - Browser posts element selections</li>
          <li><code>GET /sse</code> - Server-sent events stream for real-time updates</li>
        </ul>

        <h3>Bridge Architecture</h3>
        <p>The bridge runs on two ports:</p>
        <ul>
          <li><strong>MCP mode:</strong> stdio-based communication with the agent</li>
          <li><strong>HTTP mode (3300):</strong> REST API + SSE for both agent and browser communication</li>
          <li><strong>Browser port (3939):</strong> REST API + SSE for browser communication (both modes)</li>
        </ul>
      </section>

      <section className="docs-section" id="semantic-snapshot">
        <h2>Semantic Snapshot</h2>
        <p>When you select an element, Eyeglass captures a comprehensive semantic snapshot.</p>

        <h3>Example Snapshot</h3>
        <CodeBlock code={sampleSnapshot} language="json" />

        <h3>What's Included</h3>
        <ul>
          <li><strong>Element Identification:</strong> role, name, tagName, id, className</li>
          <li><strong>Framework Context:</strong> React/Vue/Svelte component name, file path, props, ancestry</li>
          <li><strong>Accessibility:</strong> ARIA label, description, states (disabled, expanded, checked, hidden)</li>
          <li><strong>Geometry:</strong> Position (x, y), dimensions (width, height), visibility</li>
          <li><strong>Styles:</strong> Computed CSS for display, position, layout, colors, spacing</li>
          <li><strong>Metadata:</strong> Timestamp and current URL</li>
        </ul>

        <h3>Why This Matters</h3>
        <p>With this context, the agent can:</p>
        <ul>
          <li>Find the exact file and component to edit</li>
          <li>Understand the element's purpose and current state</li>
          <li>Make precise changes without breaking accessibility</li>
          <li>Preserve layout and visual hierarchy</li>
        </ul>
      </section>

      <section className="docs-section" id="multi-select">
        <h2>Multi-Select</h2>
        <p>Eyeglass supports selecting up to 5 elements at once. This is useful for batch operations or when you need to describe relationships between elements.</p>

        <h3>How to Multi-Select</h3>
        <ol>
          <li>Click each element you want to select</li>
          <li>Type your request referencing multiple elements</li>
        </ol>

        <h3>Example Use Cases</h3>
        <ul>
          <li>"Make these three buttons the same size"</li>
          <li>"Align these elements vertically"</li>
          <li>"Change the color scheme for these components"</li>
          <li>"Add consistent spacing between these items"</li>
        </ul>

        <h3>Payload Structure</h3>
        <p>When multiple elements are selected, the payload includes a <code>snapshots</code> array instead of a single <code>snapshot</code>:</p>
        <CodeBlock code={multiSelectPayload} language="json" />
      </section>
    </>
  )
}
