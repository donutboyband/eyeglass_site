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
        <p>The Inspector is a browser-side web component that provides the visual interface for selecting elements and submitting requests to Claude.</p>

        <h3>Features</h3>
        <ul>
          <li><strong>Hover Highlighting:</strong> See element boundaries and component names as you hover</li>
          <li><strong>Click to Select:</strong> Single-click to select an element</li>
          <li><strong>Multi-Select:</strong> Hold Cmd/Ctrl and click to select up to 5 elements</li>
          <li><strong>Request Panel:</strong> Type your request and submit to Claude</li>
          <li><strong>Activity Feed:</strong> Real-time updates on Claude's progress</li>
          <li><strong>Settings:</strong> Toggle auto-commit and other preferences</li>
        </ul>

        <h3>Activation</h3>
        <p>The inspector appears as a small icon in the bottom-right corner of your browser. Click it to activate selection mode.</p>

        <h3>Development Only</h3>
        <p>The inspector only initializes when <code>NODE_ENV !== 'production'</code>, keeping your production bundle clean and secure.</p>
      </section>

      <section className="docs-section" id="bridge">
        <h2>Bridge (MCP Server)</h2>
        <p>The Bridge is an MCP (Model Context Protocol) server that connects your browser to Claude Code. It runs as a background process and handles communication between the inspector and Claude.</p>

        <h3>What It Does</h3>
        <ul>
          <li>Exposes MCP tools that Claude can call</li>
          <li>Stores element context from the inspector</li>
          <li>Manages request/response cycles via long-polling</li>
          <li>Handles Git operations (auto-commit, revert)</li>
          <li>Streams real-time updates via Server-Sent Events</li>
        </ul>

        <h3>Starting the Bridge</h3>
        <p>The bridge starts automatically when Claude Code initializes, as configured in <code>.claude/settings.json</code>:</p>
        <CodeBlock code={mcpConfigCode} language="json" />

        <h3>Bridge Architecture</h3>
        <p>The bridge runs on two ports:</p>
        <ul>
          <li><strong>MCP port:</strong> stdio-based communication with Claude</li>
          <li><strong>HTTP port (3939):</strong> REST API + SSE for browser communication</li>
        </ul>
      </section>

      <section className="docs-section" id="semantic-snapshot">
        <h2>Semantic Snapshot</h2>
        <p>When you select an element, Eyeglass captures a comprehensive semantic snapshot. This is what separates Eyeglass from simple "inspect element" tools—it understands your framework, component structure, and runtime state.</p>

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
        <p>With this context, Claude can:</p>
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
          <li>Hold <strong>Cmd</strong> (Mac) or <strong>Ctrl</strong> (Windows/Linux)</li>
          <li>Click each element you want to select</li>
          <li>Release the modifier key when done</li>
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
