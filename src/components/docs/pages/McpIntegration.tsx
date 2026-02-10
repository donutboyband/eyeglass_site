const mcpTools = [
  ['get_focused_element', 'Return current element context as markdown with full semantic snapshot'],
  ['update_status', 'Set status chips in the inspector panel (idle, pending, fixing, success, failed)'],
  ['send_thought', 'Stream reasoning back to the user in real-time'],
  ['report_action', 'Log reading/writing/searching/thinking actions with targets'],
  ['ask_question', 'Prompt the user for clarification with multiple choice options'],
  ['wait_for_request', 'Long-poll for new focus requests (blocking call until user submits)'],
  ['get_focus_history', 'Fetch previously focused elements from session history'],
]

export function McpIntegration() {
  return (
    <>
      <section className="docs-section" id="mcp-tools">
        <h2>MCP Tools</h2>
        <p>the agent interacts with Eyeglass through MCP (Model Context Protocol) tools exposed by the bridge. These tools enable bidirectional communication between the agent and your browser.</p>
        <div className="docs-table">
          {mcpTools.map(([tool, desc]) => (
            <div key={tool} className="docs-row">
              <span className="mono">{tool}</span>
              <span>{desc}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="docs-section" id="get-focused-element">
        <h2>get_focused_element</h2>
        <p>Returns the current element context as markdown with the full semantic snapshot.</p>

        <h3>Usage</h3>
        <pre><code>&gt; get_focused_element</code></pre>

        <h3>Returns</h3>
        <p>Markdown-formatted text with:</p>
        <ul>
          <li>Interaction ID and user's request note</li>
          <li>Component name, file path, and line number</li>
          <li>Element identifiers (tag, role, name, id, classes, data attributes)</li>
          <li>Accessibility tree (label, description, states)</li>
          <li>Geometry (bounding box, visibility)</li>
          <li>Computed styles (display, position, flex/grid, colors, fonts)</li>
          <li>Framework info (detected framework, component ancestry, props)</li>
          <li>DOM neighborhood (parent layout context, children)</li>
          <li>Page context (URL, timestamp)</li>
        </ul>

        <h3>Example Output</h3>
        <pre><code>{`## User Focus Request
**Interaction ID:** eyeglass-1770657937961-abc123
**User Note:** "Change button color to blue"
**Component:** \`<PricingCard />\` (src/components/PricingCard.tsx:42)

### Element Info
- Tag: \`<button>\`
- Role: button
- Name: "Buy now"
- ID: \`#cta\`
- Classes: \`primary\`

### Accessibility Tree
- Label: Buy now
- Description: none
- Disabled: false
- Hidden: false

### Geometry
- Box: 180x52 at (422, 688)
- Visible: true

### Computed Styles
- Display: flex
- Position: static
- Padding: 12px 24px
- Margin: 0px
- Color: rgb(255, 255, 255)
- Background: rgb(14, 165, 233)
- Font: Inter, sans-serif
- Z-Index: auto

### Framework
- Detected: react
- Component Tree: PricingCard > HomePage > App

### DOM Neighborhood
**Parents (layout context):**
1. \`<div>\` .card-body — flex, column, gap: 1rem

**Children:**
(none)

### Page Context
- URL: http://localhost:5173/pricing
- Timestamp: 2026-02-10T05:15:37.961Z`}</code></pre>
      </section>

      <section className="docs-section" id="update-status">
        <h2>update_status</h2>
        <p>Updates the browser UI with the agent's current progress. This creates status chips in the inspector panel that the user can see in real-time.</p>

        <h3>Usage</h3>
        <pre><code>{`update_status({
  status: "fixing",
  message: "Updating PricingCard.tsx..."
})`}</code></pre>

        <h3>Status Values</h3>
        <ul>
          <li><code>idle</code> - No active request</li>
          <li><code>pending</code> - Request received, analyzing</li>
          <li><code>fixing</code> - Making changes</li>
          <li><code>success</code> - Changes complete (triggers auto-commit if enabled)</li>
          <li><code>failed</code> - Something went wrong</li>
        </ul>

        <h3>Visual Feedback</h3>
        <p>Status updates appear as colored chips in the inspector hub:</p>
        <ul>
          <li>Pending - Blue</li>
          <li>Fixing - Yellow</li>
          <li>Success - Green</li>
          <li>Failed - Red</li>
        </ul>
      </section>

      <section className="docs-section" id="send-thought">
        <h2>send_thought</h2>
        <p>Streams the agent's reasoning back to the user in real-time. This helps users understand what the agent is thinking and builds trust in the process.</p>

        <h3>Usage</h3>
        <pre><code>{`send_thought({
  content: "Found PricingCard component. Updating backgroundColor prop..."
})`}</code></pre>

        <h3>Best Practices</h3>
        <ul>
          <li>Send thoughts at key decision points</li>
          <li>Keep messages concise and clear</li>
          <li>Explain what you're about to do, not just what you did</li>
          <li>Use thoughts to ask for patience on long operations</li>
        </ul>

        <h3>Example Flow</h3>
        <pre><code>{`1. send_thought("Analyzing button component...")
2. send_thought("Found PricingCard in src/components/")
3. send_thought("Updating backgroundColor to #3b82f6")
4. update_status("success", "Button color updated!")`}</code></pre>
      </section>

      <section className="docs-section" id="report-action">
        <h2>report_action</h2>
        <p>Logs actions the agent is taking, showing progress in the inspector's activity feed. This helps users understand what files are being read or modified.</p>

        <h3>Usage</h3>
        <pre><code>{`report_action({
  action: "reading",
  target: "src/components/PricingCard.tsx"
})

report_action({
  action: "writing",
  target: "src/components/PricingCard.tsx",
  complete: true
})`}</code></pre>

        <h3>Action Types</h3>
        <ul>
          <li><code>reading</code> - Reading a file</li>
          <li><code>writing</code> - Writing/editing a file</li>
          <li><code>searching</code> - Searching for files or content</li>
          <li><code>thinking</code> - Processing or analyzing</li>
        </ul>

        <h3>Parameters</h3>
        <ul>
          <li><code>action</code> - One of: reading, writing, searching, thinking</li>
          <li><code>target</code> - What you're acting on (file path, search query, etc.)</li>
          <li><code>complete</code> - Optional boolean to mark action as finished</li>
        </ul>
      </section>

      <section className="docs-section" id="ask-question">
        <h2>ask_question</h2>
        <p>Prompts the user with a multiple choice question and blocks until they respond. Use this when you need clarification or want to offer the user options.</p>

        <h3>Usage</h3>
        <pre><code>{`ask_question({
  question: "Which shade of blue?",
  options: [
    "Sky Blue (#0ea5e9)",
    "Indigo (#6366f1)",
    "Royal Blue (#2563eb)"
  ]
})`}</code></pre>

        <h3>Returns</h3>
        <pre><code>{`{
  "answer": "Indigo (#6366f1)"
}`}</code></pre>

        <h3>Best Practices</h3>
        <ul>
          <li>Keep options to 2-4 choices</li>
          <li>Make option labels clear and descriptive</li>
          <li>Use when the decision meaningfully affects the outcome</li>
          <li>Don't over-ask - make reasonable defaults when possible</li>
        </ul>
      </section>

      <section className="docs-section" id="wait-for-request">
        <h2>wait_for_request</h2>
        <p>Long-polls for new focus requests from the browser. This is a blocking call that waits until the user submits a request.</p>

        <h3>Usage</h3>
        <pre><code>&gt; wait_for_request</code></pre>

        <h3>How It Works</h3>
        <ol>
          <li>the agent calls <code>wait_for_request</code></li>
          <li>The bridge holds the connection open (long-polling)</li>
          <li>User selects an element and submits a request in the browser</li>
          <li>Bridge immediately returns the request to the agent</li>
          <li>the agent processes and makes changes</li>
          <li>Cycle repeats with another <code>wait_for_request</code></li>
        </ol>

        <h3>Typical Workflow</h3>
        <pre><code>{`# In the agent terminal
> wait_for_request

# (User clicks element and types "make this blue")

# the agent receives:
{
  "interactionId": "abc123",
  "snapshot": { /* element data */ },
  "userNote": "make this blue",
  "autoCommit": true
}

# the agent makes changes...
# Then calls wait_for_request again to listen for next request`}</code></pre>
      </section>

      <section className="docs-section" id="get-focus-history">
        <h2>get_focus_history</h2>
        <p>Returns the history of previously focused elements from the current session. Useful for referencing earlier selections or understanding context.</p>

        <h3>Usage</h3>
        <pre><code>&gt; get_focus_history</code></pre>

        <h3>Returns</h3>
        <p>An array of up to 5 recent focus payloads, newest first:</p>
        <pre><code>{`[
  {
    "interactionId": "eyeglass-456",
    "snapshot": { /* element data */ },
    "userNote": "previous request..."
  },
  {
    "interactionId": "eyeglass-123",
    "snapshot": { /* element data */ },
    "userNote": "older request..."
  }
]`}</code></pre>

        <h3>Use Cases</h3>
        <ul>
          <li>Reference a previously selected element</li>
          <li>Compare current and past selections</li>
          <li>Understand the sequence of user requests</li>
          <li>Debug or trace interaction history</li>
        </ul>
      </section>

      <section className="docs-section" id="http-endpoints">
        <h2>HTTP Endpoints</h2>
        <p>The bridge always runs an HTTP server on port 3300 alongside the MCP server. This enables browser communication and provides a REST API for agents that don't support MCP (like Codex).</p>

        <h3>Available Endpoints</h3>
        <div className="docs-table">
          <div className="docs-row">
            <span className="mono">GET /health</span>
            <span>Health check endpoint</span>
          </div>
          <div className="docs-row">
            <span className="mono">GET /api/wait</span>
            <span>Wait for new focus request (long-polling, blocks until user submits)</span>
          </div>
          <div className="docs-row">
            <span className="mono">GET /api/focus</span>
            <span>Get current focus context</span>
          </div>
          <div className="docs-row">
            <span className="mono">GET /api/history</span>
            <span>Get focus history (up to 5 recent)</span>
          </div>
          <div className="docs-row">
            <span className="mono">POST /api/status</span>
            <span>Update browser status (idle, pending, fixing, success, failed)</span>
          </div>
          <div className="docs-row">
            <span className="mono">POST /api/thought</span>
            <span>Send agent reasoning to the browser</span>
          </div>
          <div className="docs-row">
            <span className="mono">POST /api/action</span>
            <span>Report an action (reading, writing, searching, thinking)</span>
          </div>
          <div className="docs-row">
            <span className="mono">POST /focus</span>
            <span>Browser posts element selection payload</span>
          </div>
          <div className="docs-row">
            <span className="mono">POST /answer</span>
            <span>Browser posts answer to agent question</span>
          </div>
          <div className="docs-row">
            <span className="mono">POST /undo</span>
            <span>Trigger undo of last commit</span>
          </div>
          <div className="docs-row">
            <span className="mono">POST /commit</span>
            <span>Trigger a commit</span>
          </div>
          <div className="docs-row">
            <span className="mono">GET /events</span>
            <span>Server-sent events stream for real-time updates</span>
          </div>
        </div>

        <h3>Example: Wait for Request</h3>
        <pre><code>{`curl -s http://localhost:3300/api/wait

# Returns markdown when user selects an element:
## User Focus Request
**Interaction ID:** eyeglass-123
**User Note:** "make this button blue"
...`}</code></pre>

        <h3>Example: Update Status</h3>
        <pre><code>{`curl -X POST http://localhost:3300/api/status \\
  -H "Content-Type: application/json" \\
  -d '{"status":"fixing","message":"Working on it..."}'`}</code></pre>
      </section>
    </>
  )
}
