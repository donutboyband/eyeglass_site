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
          <li>Component name and file path (if available)</li>
          <li>Element identifiers (role, tagName, id, className)</li>
          <li>Accessibility information</li>
          <li>Geometry and layout</li>
          <li>Computed styles</li>
          <li>User's request text</li>
        </ul>

        <h3>Example Output</h3>
        <pre><code>{`# Focused Element

**Component:** PricingCard
**File:** src/components/PricingCard.tsx
**Role:** button
**Text:** Buy now

## Request
"Change button color to blue"

## Accessibility
- Label: "Buy now"
- Disabled: false

## Layout
- Position: 422, 688
- Size: 180 × 52

## Styles
- Background: #0ea5e9
- Color: #ffffff
- Padding: 12px 24px`}</code></pre>
      </section>

      <section className="docs-section" id="update-status">
        <h2>update_status</h2>
        <p>Updates the browser UI with the agent's current progress. This creates status chips in the inspector panel that the user can see in real-time.</p>

        <h3>Usage</h3>
        <pre><code>{`update_status({
  interactionId: "abc123",
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
  interactionId: "abc123",
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

      <section className="docs-section" id="http-endpoints">
        <h2>HTTP Endpoints</h2>
        <p>For agents that don't support MCP (like Codex or Copilot), the bridge can run as an HTTP server. Start with <code>npx eyeglass-bridge --http</code> on port 3300.</p>

        <h3>Available Endpoints</h3>
        <div className="docs-table">
          <div className="docs-row">
            <span className="mono">GET /api/wait</span>
            <span>Wait for new focus request (long-polling, blocks until user submits)</span>
          </div>
          <div className="docs-row">
            <span className="mono">POST /api/status</span>
            <span>Update browser status (idle, pending, fixing, success, failed)</span>
          </div>
          <div className="docs-row">
            <span className="mono">POST /focus</span>
            <span>Browser posts element selection payload</span>
          </div>
          <div className="docs-row">
            <span className="mono">GET /sse</span>
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
