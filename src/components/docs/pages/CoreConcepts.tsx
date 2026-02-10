import { CodeBlock } from '../../CodeBlock'

const sampleSnapshot = `{
  "role": "button",
  "name": "Buy now",
  "tagName": "button",
  "id": "cta",
  "className": "primary",
  "dataAttributes": { "testid": "buy-btn" },
  "framework": {
    "name": "react",
    "componentName": "PricingCard",
    "filePath": "src/components/PricingCard.tsx",
    "lineNumber": 42,
    "props": { "intent": "primary", "size": "lg" },
    "ancestry": ["App", "HomePage", "PricingSection"]
  },
  "a11y": {
    "label": "Buy now",
    "description": null,
    "disabled": false,
    "expanded": undefined,
    "checked": undefined,
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
    "display": "flex",
    "position": "static",
    "flexDirection": undefined,
    "gridTemplate": undefined,
    "padding": "12px 24px",
    "margin": "0px",
    "color": "rgb(255, 255, 255)",
    "backgroundColor": "rgb(14, 165, 233)",
    "fontFamily": "Inter, sans-serif",
    "zIndex": "auto"
  },
  "neighborhood": {
    "parents": [
      {
        "tagName": "div",
        "className": "card-body",
        "styles": {
          "display": "flex",
          "position": "relative",
          "flexDirection": "column",
          "alignItems": "center",
          "justifyContent": "center",
          "gap": "1rem"
        }
      }
    ],
    "children": []
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
          <li><strong>Settings:</strong> Toggle auto-commit and theme preferences</li>
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
          <li>Streams real-time updates via Server-Sent Events</li>
        </ul>

        <h3>MCP Mode (Default)</h3>
        <p>For agents that support MCP, the bridge starts automatically when the agent initializes, as configured in <code>.claude/settings.json</code>:</p>
        <CodeBlock code={mcpConfigCode} language="json" />
        
        <h3>HTTP API</h3>
        <p>The bridge always runs an HTTP server on port 3300 alongside the MCP server. This provides REST endpoints for agents that don't support MCP (like Codex) and enables browser communication:</p>
        <ul>
          <li><code>GET /api/wait</code> - Wait for new focus request (long-polling)</li>
          <li><code>POST /api/status</code> - Update browser status (fixing, success, etc.)</li>
          <li><code>POST /api/thought</code> - Send reasoning to the browser</li>
          <li><code>POST /api/action</code> - Report actions (reading, writing, etc.)</li>
          <li><code>GET /events</code> - Server-sent events stream for real-time updates</li>
        </ul>

        <h3>Bridge Architecture</h3>
        <p>The bridge runs both servers simultaneously:</p>
        <ul>
          <li><strong>MCP Server (stdio):</strong> Communication with agents like Claude Code via Model Context Protocol</li>
          <li><strong>HTTP Server (port 3300):</strong> REST API + SSE for browser communication and non-MCP agents</li>
        </ul>
      </section>

      <section className="docs-section" id="semantic-snapshot">
        <h2>Semantic Snapshot</h2>
        <p>When you select an element, Eyeglass captures a comprehensive semantic snapshot.</p>

        <h3>Example Snapshot</h3>
        <CodeBlock code={sampleSnapshot} language="json" />

        <h3>What's Included</h3>
        <ul>
          <li><strong>Element Identification:</strong> role, name, tagName, id, className, dataAttributes</li>
          <li><strong>Framework Context:</strong> Detected framework (react/vue/svelte/vanilla), component name, file path with line number, props, and component ancestry chain</li>
          <li><strong>Accessibility:</strong> ARIA label, description, and states (disabled, expanded, checked, hidden)</li>
          <li><strong>Geometry:</strong> Bounding box position (x, y), dimensions (width, height), and visibility status</li>
          <li><strong>Computed Styles:</strong> display, position, flexDirection, gridTemplate, padding, margin, color, backgroundColor, fontFamily, zIndex</li>
          <li><strong>DOM Neighborhood:</strong> Parent elements with their layout styles (display, flex, grid), and child element summary with counts</li>
          <li><strong>Page Context:</strong> Current URL and timestamp</li>
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
