import { CodeBlock } from '../../CodeBlock'

const schemaCode = `interface SemanticSnapshot {
  // Element identification
  role: string;           // ARIA role (button, link, textbox, etc.)
  name: string;           // Accessible name
  tagName: string;        // HTML tag
  id?: string;            // Element ID
  className?: string;     // CSS classes
  dataAttributes?: Record<string, string>;

  // Framework context
  framework: {
    name: 'react' | 'vue' | 'svelte' | 'vanilla';
    componentName?: string;   // e.g., "SubmitButton"
    filePath?: string;        // e.g., "src/components/SubmitButton.tsx"
    lineNumber?: number;
    props?: Record<string, unknown>;
    ancestry?: string[];      // Parent component chain
  };

  // Accessibility
  a11y: {
    label: string | null;
    description: string | null;
    disabled: boolean;
    expanded?: boolean;
    checked?: boolean | 'mixed';
    hidden: boolean;
  };

  // Layout
  geometry: {
    x: number;
    y: number;
    width: number;
    height: number;
    visible: boolean;
  };

  // Styles
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

  // Metadata
  timestamp: number;
  url: string;
}`

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
// Base URL: http://localhost:3300/api

// 1. Poll for requests:
//    GET /request - returns { element, userNote } or null
//
// 2. Send status updates:
//    POST /status { status: "idle" | "pending" | "fixing" | "success" | "failed", message?: string }
//
// 3. Log thoughts/actions:
//    POST /thought { content: string }
//    POST /action { action: "reading" | "writing" | "searching" | "thinking", target: string, complete?: boolean }
//
// 4. Ask user questions:
//    POST /question { question: string, options: string[] }
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
        <CodeBlock code={codexConfigCode} language="javascript" />

        <h3>Bridge Port</h3>
        <p>The bridge HTTP server runs on port 3300 by default. This is used by Codex CLI and for keepalive messages.</p>

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
          <li>Check that the bridge is running (look for port 3939 in use)</li>
        </ol>

        <h3>Component Names Not Showing</h3>
        <ul>
          <li><strong>React:</strong> Requires development builds with source maps. Check that you're running <code>npm run dev</code>.</li>
          <li><strong>Vue:</strong> Ensure components have <code>name</code> property or <code>__name</code> is set.</li>
          <li><strong>Svelte:</strong> Detection is limited—class names may be your best identifier.</li>
        </ul>

        <h3>File Paths Not Showing</h3>
        <ul>
          <li><strong>React:</strong> <code>_debugSource</code> requires dev mode and certain bundler configs (Vite includes it by default).</li>
          <li><strong>Vue:</strong> <code>__file</code> property should be present if your build tool includes it.</li>
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
