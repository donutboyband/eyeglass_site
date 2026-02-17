import { CodeBlock } from '../../CodeBlock'

const sampleSnapshot = `{
  "role": "button",
  "name": "Buy now",
  "tagName": "button",
  "dataAttributes": { "data-testid": "buy-btn" },
  "framework": {
    "type": "react",
    "displayName": "PricingCard",
    "filePath": "src/components/PricingCard.tsx",
    "lineNumber": 42,
    "state": {
      "props": { "intent": "primary", "size": "lg" },
      "hooks": [
        { "name": "useState", "label": "isLoading", "value": false },
        { "name": "useEffect", "label": "fetchPricing" }
      ],
      "context": [
        { "name": "ThemeProvider", "value": "light" }
      ]
    },
    "ancestry": ["App", "HomePage", "PricingSection"]
  },
  "a11y": { "label": "Buy now", "description": null, "disabled": false, "hidden": false },
  "geometry": { "x": 422, "y": 688, "width": 180, "height": 52, "visible": true },
  "styles": {
    "display": "flex",
    "position": "static",
    "padding": "12px 24px",
    "margin": "0px",
    "color": "rgb(255, 255, 255)",
    "backgroundColor": "rgb(14, 165, 233)",
    "fontFamily": "Inter, sans-serif",
    "zIndex": "auto"
  },
  "causality": {
    "events": {
      "listeners": [{ "type": "click", "capture": false }],
      "blockingHandlers": []
    },
    "stackingContext": { "isStackingContext": false, "parentContext": null, "effectiveZIndex": 0 },
    "layoutConstraints": ["Width constrained by flex container"]
  },
  "perception": {
    "affordance": { "looksInteractable": true, "isInteractable": true, "dissonanceScore": 0 },
    "visibility": { "isOccluded": false, "effectiveOpacity": 1 },
    "legibility": { "contrastRatio": 4.2, "wcagStatus": "pass", "effectiveBgColor": "rgb(14,165,233)" },
    "usability": { "touchTargetSize": "180x52", "isTouchTargetValid": true }
  },
  "metal": {
    "pipeline": { "layerPromoted": false, "layoutThrashingRisk": "none" },
    "performance": { "renderCount": 3, "lastRenderReason": "Prop 'style' changed identity" },
    "memory": { "listenerCount": 1 }
  },
  "systemic": {
    "impact": { "importCount": 4, "riskLevel": "Moderate" },
    "designSystem": { "tokenMatches": [{ "property": "color", "token": "blue-500" }], "deviations": [] }
  },
  "interactionState": { "variant": "hover", "capturedAt": 1739814000000 },
  "neighborhood": {
    "parents": [
      {
        "tagName": "div",
        "className": "card-body",
        "styles": { "display": "flex", "position": "relative", "flexDirection": "column", "gap": "1rem" }
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
          <li><strong>React runtime lens:</strong> Captures component name, file path, props, hooks, context, and render count directly from the Fiber tree</li>
          <li><strong>Hover + click select:</strong> Highlight on hover, click to capture a snapshot and open the request panel</li>
          <li><strong>Multi-select:</strong> Add several elements (payload uses <code>snapshots[]</code>) when a change spans multiple components</li>
          <li><strong>Health signals:</strong> Surfaces contrast, occlusion, event blocking, and layout-thrashing hints only when issues exist</li>
          <li><strong>Activity feed:</strong> Real-time status, thoughts, actions, and questions streamed over Server-Sent Events</li>
          <li><strong>Settings:</strong> Toggle auto-commit and theme; manual commit/undo controls live in the hub</li>
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

        <h3>What's Included (7 layers)</h3>
        <ul>
          <li><strong>Identity:</strong> role, name, tag, ids/classes, data attributes, interaction state</li>
          <li><strong>State (React):</strong> component display name, file/line, props, hooks, context, key, ancestry</li>
          <li><strong>Visual:</strong> geometry and computed styles</li>
          <li><strong>Causal:</strong> event listeners, blocking handlers, stacking context, layout constraints</li>
          <li><strong>Perceptual:</strong> contrast, affordance dissonance, occlusion, touch target sizing</li>
          <li><strong>Metal:</strong> render counts, last render reason, GPU layer and layout-thrashing risk</li>
          <li><strong>Systemic:</strong> import count + risk level, design token matches/deviations</li>
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
        <p>Eyeglass supports selecting many elements at once. This is useful for batch operations or when you need to describe relationships between elements.</p>

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
