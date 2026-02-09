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
        <p>Claude Code interacts with Eyeglass through MCP (Model Context Protocol) tools exposed by the bridge. These tools enable bidirectional communication between Claude and your browser.</p>
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
        <p>Updates the browser UI with Claude's current progress. This creates status chips in the inspector panel that the user can see in real-time.</p>

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
        <p>Streams Claude's reasoning back to the user in real-time. This helps users understand what Claude is thinking and builds trust in the process.</p>

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
          <li>Claude calls <code>wait_for_request</code></li>
          <li>The bridge holds the connection open (long-polling)</li>
          <li>User selects an element and submits a request in the browser</li>
          <li>Bridge immediately returns the request to Claude</li>
          <li>Claude processes and makes changes</li>
          <li>Cycle repeats with another <code>wait_for_request</code></li>
        </ol>

        <h3>Typical Workflow</h3>
        <pre><code>{`# In Claude Code terminal
> wait_for_request

# (User clicks element and types "make this blue")

# Claude receives:
{
  "interactionId": "abc123",
  "snapshot": { /* element data */ },
  "userNote": "make this blue",
  "autoCommit": true
}

# Claude makes changes...
# Then calls wait_for_request again to listen for next request`}</code></pre>
      </section>
    </>
  )
}
