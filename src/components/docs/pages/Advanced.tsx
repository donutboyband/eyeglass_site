import { CodeBlock } from '../../CodeBlock'

const schemaCode = `interface SemanticSnapshot {
  // Identity
  role: string;
  name: string;
  tagName: string;
  id?: string;
  className?: string;
  dataAttributes?: Record<string, string>;
  interactionState?: {
    variant?: string;
    label?: string;
    domPaused?: boolean;
    capturedAt: number;
  };

  // React runtime state (v2.0)
  framework: {
    type?: 'react';
    displayName?: string;
    key?: string | null;
    filePath?: string;
    lineNumber?: number;
    ancestry?: string[];
    state?: {
      props: Record<string, unknown>;
      hooks: Array<{ name: string; value?: unknown; label?: string }>;
      context: Array<{ name: string; value: unknown }>;
    };
  };

  // Accessibility (legacy-compatible)
  a11y?: {
    label: string | null;
    description: string | null;
    disabled: boolean;
    expanded?: boolean;
    checked?: boolean | 'mixed';
    hidden: boolean;
  };

  // Visual
  geometry: { x: number; y: number; width: number; height: number; visible: boolean };
  styles: {
    display: string;
    position: string;
    flexDirection?: string;
    gridTemplate?: string;
    padding: string;
    margin: string;
    color: string;
    backgroundColor: string;
    fontFamily: string;
    zIndex: string;
  };

  // Causal (event + layout mechanics)
  causality?: {
    events: {
      listeners: Array<{ type: string; capture: boolean; source?: string }>;
      blockingHandlers: Array<{ element: string; event: string; reason: string }>;
    };
    stackingContext: { isStackingContext: boolean; parentContext: string | null; reason?: string; effectiveZIndex: number };
    layoutConstraints: string[];
  };

  // Perceptual
  perception?: {
    affordance: { looksInteractable: boolean; isInteractable: boolean; dissonanceScore: number };
    visibility: { isOccluded: boolean; occludedBy?: string; effectiveOpacity: number };
    legibility: { contrastRatio: number; wcagStatus: 'pass' | 'fail'; effectiveBgColor: string };
    usability: { touchTargetSize: string; isTouchTargetValid: boolean };
  };

  // Metal
  metal?: {
    pipeline: { layerPromoted: boolean; layoutThrashingRisk: 'none' | 'low' | 'high' };
    performance: { renderCount: number; lastRenderReason?: string };
    memory: { listenerCount: number; detachedNodesRetained?: number };
  };

  // Systemic
  systemic?: {
    impact: { importCount?: number; riskLevel: 'Local' | 'Moderate' | 'Critical' };
    designSystem: {
      tokenMatches: Array<{ property: string; token: string }>;
      deviations: Array<{ property: string; value: string; suggestion: string }>;
    };
  };

  // Neighborhood
  neighborhood?: {
    parents: Array<{
      tagName: string;
      className?: string;
      styles: {
        display: string;
        position: string;
        flexDirection?: string;
        alignItems?: string;
        justifyContent?: string;
        gap?: string;
        gridTemplate?: string;
      };
    }>;
    children: Array<{ tagName: string; className?: string; count?: number }>;
  };

  timestamp: number;
  url: string;
}

interface FocusPayload {
  interactionId: string;
  snapshot?: SemanticSnapshot;      // single-select
  snapshots?: SemanticSnapshot[];   // multi-select
  userNote: string;
  autoCommit?: boolean;             // default true
}

type ActivityEvent =
  | { type: 'status'; interactionId: string; status: 'idle' | 'pending' | 'fixing' | 'success' | 'failed'; message?: string; timestamp: number }
  | { type: 'thought'; interactionId: string; content: string; timestamp: number }
  | { type: 'question'; interactionId: string; questionId: string; question: string; options: Array<{ id: string; label: string }>; timestamp: number }
  | { type: 'action'; interactionId: string; action: 'reading' | 'writing' | 'searching' | 'thinking'; target: string; complete?: boolean; timestamp: number };
`

const mcpConfigCode = `// Claude Code (.claude/settings.json)
{
  "mcpServers": {
    "eyeglass": {
      "command": "npx",
      "args": ["eyeglass-bridge"]
    }
  }
}`

const copilotConfigCode = `// GitHub Copilot CLI (.copilot/mcp-config.json)
{
  "mcpServers": {
    "eyeglass": {
      "type": "local",
      "command": "npx",
      "args": ["eyeglass-bridge"],
      "tools": ["*"]
    }
  }
}`

const codexConfigCode = `// Codex CLI uses HTTP endpoints
// Base URL: http://localhost:3300

// 1. Wait for requests (long-polling):
//    GET /api/wait - blocks until user submits, returns markdown context
//
// 2. Send status updates:
//    POST /api/status { status: "idle" | "pending" | "fixing" | "success" | "failed", message?: string }
//
// 3. Log thoughts/actions:
//    POST /api/thought { content: string }
//    POST /api/action { action: "reading" | "writing" | "searching" | "thinking", target: string, complete?: boolean }
//
// 4. Get focus context:
//    GET /api/focus - returns current focus as markdown
//    GET /api/history - returns up to 5 recent focus payloads
//
// See .codex/eyeglass.md for implementation details`

export function Advanced() {
  return (
    <>
      <section className="docs-section" id="schema">
        <h2>Full Schema</h2>
        <p>Complete TypeScript interface for the semantic snapshot:</p>
        <CodeBlock code={schemaCode} language="typescript" />
      </section>

      <section className="docs-section" id="configuration">
        <h2>Configuration</h2>
        <p>Eyeglass supports multiple AI coding agents. The CLI automatically configures the appropriate settings for your chosen agent(s).</p>

        <h3>Claude Code</h3>
        <p>Uses stdio MCP protocol. Configuration is stored in <code>.claude/settings.json</code>:</p>
        <CodeBlock code={mcpConfigCode} language="json" />
        <p>The CLI also creates a <code>.claude/skills/eyeglass.md</code> skill file for hands-free listening mode.</p>

        <h3>GitHub Copilot CLI</h3>
        <p>Uses local MCP protocol with tool access. Configuration is stored in <code>.copilot/mcp-config.json</code>:</p>
        <CodeBlock code={copilotConfigCode} language="json" />

        <h3>OpenAI Codex CLI</h3>
        <p>Uses HTTP API for agent communication. The CLI creates <code>.codex/eyeglass.md</code> with API documentation:</p>
        <CodeBlock code={codexConfigCode} language="typescript" />

        <h3>Bridge Port</h3>
        <p>The bridge always runs on port 3300: MCP + REST + SSE in one process.</p>

        <h3>HTTP + SSE Endpoints</h3>
        <p>Endpoints mirror the MCP tools and add browser controls:</p>
        <ul>
          <li><code>GET /health</code> - Health check</li>
          <li><code>GET /api/wait</code> - Long-poll until a user submits focus</li>
          <li><code>GET /api/focus</code> / <code>GET /api/history</code> - Current focus or last 5 (markdown)</li>
          <li><code>POST /api/status</code> / <code>/api/thought</code> / <code>/api/action</code> - Status, reasoning, and activity feed</li>
          <li><code>POST /answer</code> - Browser posts responses to questions</li>
          <li><code>POST /undo</code> / <code>/commit</code> / <code>/clear</code> - Undo, manual commit, or clear badges</li>
          <li><code>GET /events</code> - Server-sent events stream</li>
        </ul>

        <h3>Inspector Settings</h3>
        <p>User preferences are stored in localStorage:</p>
        <ul>
          <li><strong>Auto-commit:</strong> Enable/disable automatic commits on success</li>
          <li><strong>Theme:</strong> Light, dark, or auto (follows system preference)</li>
        </ul>

        <h3>Environment Variables</h3>
        <p>The inspector respects <code>NODE_ENV</code>:</p>
        <ul>
          <li><code>NODE_ENV=development</code> - Inspector active</li>
          <li><code>NODE_ENV=production</code> - Inspector disabled</li>
        </ul>
      </section>

      <section className="docs-section" id="troubleshooting">
        <h2>Troubleshooting</h2>

        <h3>Inspector Not Appearing</h3>
        <ol>
          <li>Ensure you're in development mode (<code>NODE_ENV !== 'production'</code>)</li>
          <li>Check that <code>@eyeglass/inspector</code> is imported before your app renders</li>
          <li>Look for console errors related to the inspector</li>
          <li>Try clearing localStorage and refreshing</li>
        </ol>

        <h3>the agent Not Receiving Requests</h3>
        <ol>
          <li>Verify <code>.claude/settings.json</code> exists with correct MCP config</li>
          <li>Restart the agent to pick up config changes</li>
          <li>Run <code>wait_for_request</code> in the agent to start listening</li>
          <li>Check that the bridge is running (look for port 3300 in use)</li>
        </ol>

        <h3>Component Names Not Showing</h3>
        <ul>
          <li><strong>React:</strong> Requires development builds with source maps. Check that you're running <code>npm run dev</code>.</li>
        </ul>

        <h3>File Paths Not Showing</h3>
        <ul>
          <li><strong>React:</strong> <code>_debugSource</code> requires dev mode and certain bundler configs (Vite includes it by default).</li>
          <li>Check your bundler's source map settings.</li>
        </ul>

        <h3>Auto-Commit Not Working</h3>
        <ol>
          <li>Ensure your project is a Git repository (<code>git status</code> should work)</li>
          <li>Check that auto-commit is enabled in inspector settings (gear icon)</li>
          <li>Verify there are actual changes to commit (<code>git diff</code>)</li>
          <li>Look for Git errors in the the agent terminal</li>
        </ol>

        <h3>Undo Button Not Working</h3>
        <ol>
          <li>Verify the change was auto-committed (check <code>git log</code> for <code>[eyeglass:...]</code> messages)</li>
          <li>Ensure working directory is clean (uncommitted changes may conflict)</li>
          <li>Try manually reverting: <code>git revert &lt;commit-sha&gt;</code></li>
        </ol>
      </section>
    </>
  )
}
