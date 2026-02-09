export function Features() {
  return (
    <>
      <section className="docs-section" id="framework-detection">
        <h2>Framework Detection</h2>
        <p>Eyeglass automatically detects which framework you're using and extracts framework-specific metadata.</p>

        <h3>Supported Frameworks</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Framework</th>
              <th style={{ textAlign: 'center', padding: '0.5rem' }}>Component Names</th>
              <th style={{ textAlign: 'center', padding: '0.5rem' }}>File Paths</th>
              <th style={{ textAlign: 'center', padding: '0.5rem' }}>Props</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <td style={{ padding: '0.5rem' }}><strong>React</strong></td>
              <td style={{ textAlign: 'center', padding: '0.5rem' }}>Yes</td>
              <td style={{ textAlign: 'center', padding: '0.5rem' }}>Yes (dev mode)</td>
              <td style={{ textAlign: 'center', padding: '0.5rem' }}>Yes</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <td style={{ padding: '0.5rem' }}><strong>Vue 2/3</strong></td>
              <td style={{ textAlign: 'center', padding: '0.5rem' }}>Yes</td>
              <td style={{ textAlign: 'center', padding: '0.5rem' }}>Yes</td>
              <td style={{ textAlign: 'center', padding: '0.5rem' }}>Yes</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <td style={{ padding: '0.5rem' }}><strong>Svelte</strong></td>
              <td style={{ textAlign: 'center', padding: '0.5rem' }}>Yes</td>
              <td style={{ textAlign: 'center', padding: '0.5rem' }}>No</td>
              <td style={{ textAlign: 'center', padding: '0.5rem' }}>No</td>
            </tr>
            <tr>
              <td style={{ padding: '0.5rem' }}><strong>Vanilla</strong></td>
              <td style={{ textAlign: 'center', padding: '0.5rem' }}>No</td>
              <td style={{ textAlign: 'center', padding: '0.5rem' }}>No</td>
              <td style={{ textAlign: 'center', padding: '0.5rem' }}>No</td>
            </tr>
          </tbody>
        </table>

        <h3>How Detection Works</h3>
        <p><strong>React:</strong> Walks the Fiber tree to find component names, file paths (from <code>_debugSource</code>), and props.</p>
        <p><strong>Vue:</strong> Inspects <code>__vue__</code> property to extract component options, file paths (from <code>__file</code>), and reactive data.</p>
        <p><strong>Svelte:</strong> Limited detection via class names and component structure.</p>
        <p><strong>Vanilla:</strong> Falls back to element identifiers (id, className, data attributes).</p>

        <h3>File Path Requirements</h3>
        <ul>
          <li><strong>React:</strong> Requires dev builds with source maps. The <code>_debugSource</code> property is only available in development mode.</li>
          <li><strong>Vue:</strong> The <code>__file</code> property is typically available in both dev and production builds.</li>
        </ul>
      </section>

      <section className="docs-section" id="git-integration">
        <h2>Git Integration</h2>
        <p>Eyeglass automatically tracks changes using Git, making it easy to review and undo AI-generated modifications.</p>

        <h3>How It Works</h3>
        <ol>
          <li>User submits a request via the inspector</li>
          <li>Claude processes and makes code changes</li>
          <li>Claude calls <code>update_status("success")</code></li>
          <li>If auto-commit is enabled, Eyeglass automatically commits</li>
          <li>Commit message is tagged with the interaction ID</li>
        </ol>

        <h3>Requirements</h3>
        <ul>
          <li>Your project must be a Git repository (<code>git init</code>)</li>
          <li>Git must be available in your PATH</li>
          <li>There must be uncommitted changes when Claude completes a task</li>
        </ul>

        <h3>Example Git History</h3>
        <pre><code>{`* a1b2c3d (HEAD) Revert "[eyeglass:abc123] Made button blue"
* f4e5d6c [eyeglass:abc123] Made button blue
* 9g8h7i6 [eyeglass:xyz789] Fixed header padding
* previous commits...`}</code></pre>
      </section>

      <section className="docs-section" id="auto-commit">
        <h2>Auto-Commit</h2>
        <p>When enabled, Eyeglass automatically commits changes after Claude successfully completes a request.</p>

        <h3>How Auto-Commit Works</h3>
        <ol>
          <li>Claude calls <code>update_status("success", "Changes complete")</code></li>
          <li>Bridge checks if auto-commit is enabled</li>
          <li>If enabled and there are changes: <code>git add -A</code></li>
          <li>Creates commit: <code>git commit -m "[eyeglass:&lt;id&gt;] &lt;message&gt;"</code></li>
          <li>Inspector shows success with undo button</li>
        </ol>

        <h3>Commit Message Format</h3>
        <p>All auto-commits use a tagged format:</p>
        <pre><code>[eyeglass:&lt;interaction-id&gt;] &lt;description&gt;</code></pre>
        <p>Example:</p>
        <pre><code>[eyeglass:abc123] Made button blue</code></pre>

        <h3>Enabling/Disabling</h3>
        <p>Click the gear icon in the inspector hub to access settings. Toggle "Auto-commit" on/off. The setting persists in localStorage.</p>

        <h3>When Auto-Commit is Disabled</h3>
        <ul>
          <li>Changes are still made, but not committed</li>
          <li>You can manually review with <code>git diff</code></li>
          <li>Commit manually when satisfied</li>
        </ul>
      </section>

      <section className="docs-section" id="one-click-undo">
        <h2>One-Click Undo</h2>
        <p>Every completed request in the inspector hub shows an undo button. Click it to cleanly revert the changes.</p>

        <h3>How Undo Works</h3>
        <ol>
          <li>User clicks undo button in the hub</li>
          <li>Inspector sends undo request to bridge</li>
          <li>Bridge finds commit by interaction ID tag</li>
          <li>Runs <code>git revert --no-edit &lt;commit-sha&gt;</code></li>
          <li>Creates a new revert commit (preserves history)</li>
          <li>HMR updates the browser</li>
        </ol>

        <h3>Requirements</h3>
        <ul>
          <li>The original change must have been auto-committed</li>
          <li>The commit must exist in Git history</li>
          <li>Working directory should be clean (uncommitted changes may cause conflicts)</li>
        </ul>

        <h3>Conflict Resolution</h3>
        <p>If there are conflicts during revert:</p>
        <ul>
          <li>The revert operation aborts</li>
          <li>User sees an error message</li>
          <li>Manually resolve with <code>git revert &lt;sha&gt;</code> and fix conflicts</li>
        </ul>

        <h3>History Preservation</h3>
        <p>Undo uses <code>git revert</code>, not <code>git reset</code>, which means:</p>
        <ul>
          <li>Original commit stays in history</li>
          <li>New revert commit is added</li>
          <li>Safe for shared/pushed branches</li>
          <li>Full audit trail of all changes</li>
        </ul>
      </section>
    </>
  )
}
