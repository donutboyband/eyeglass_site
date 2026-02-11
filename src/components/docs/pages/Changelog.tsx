export function Changelog() {
  return (
    <>
      <div className="docs-hero">
        <p className="section-label">Documentation</p>
        <h1>Changelog</h1>
      </div>

      <section className="docs-section">
        <h2>February 2026</h2>
        
        <h3>v0.2.1 - February 11, 2026</h3>
        <ul>
          <li><strong>Package Updates:</strong> Bumped versions for bridge, cli, inspector, and types packages</li>
          <li><strong>Inspector:</strong> Made UI elements smaller for better space efficiency</li>
          <li><strong>Mouse Handling:</strong> Simplified mouse move handler logic and improved multi-select mode to retain current element</li>
          <li><strong>Demo Changes:</strong> Various UI color adjustments (heading to blue)</li>
        </ul>

        <h3>v0.2.0 - February 10, 2026</h3>
        <ul>
          <li><strong>Production Optimization:</strong> Implemented dynamic import for inspector to enable tree-shaking in production builds</li>
          <li><strong>Documentation:</strong> Updated README files to clarify inspector behavior in production and enhanced CLI bundler configuration details</li>
          <li><strong>Inspector:</strong> Enhanced dynamic import capabilities for development environments</li>
          <li><strong>Hub Rendering:</strong> Refactored hub rendering and improved panel button event handling</li>
        </ul>

        <h3>v0.1.9 - February 10, 2026</h3>
        <ul>
          <li><strong>Package Versions:</strong> Bumped to 0.1.9 for cli and 0.2.0 for inspector packages</li>
          <li><strong>Inspector:</strong> Enhanced dynamic import functionality</li>
        </ul>

        <h3>v0.1.8 - February 9, 2026</h3>
        <ul>
          <li><strong>Next.js Support:</strong> Implemented support for Next.js App Router with new EyeglassProvider component</li>
          <li><strong>Multi-Select Mode:</strong> Prevented single highlight behavior in multi-select mode</li>
        </ul>

        <h3>v0.1.7 - February 9, 2026</h3>
        <ul>
          <li><strong>Keyboard Shortcuts:</strong> Enhanced keyboard shortcuts and inspector functionality</li>
          <li><strong>Internal Architecture:</strong> Added internal types, helper utilities, and network functions</li>
          <li><strong>Theme Support:</strong> Added theme preference functionality with light, dark, and auto modes</li>
          <li><strong>UI Improvements:</strong> Updated accent colors and enhanced input fields</li>
        </ul>

        <h3>v0.1.6 - February 9, 2026</h3>
        <ul>
          <li><strong>HTML Detection:</strong> Added HTML entry point detection in CLI</li>
          <li><strong>Package Updates:</strong> Updated versions for bridge, inspector, and cli packages</li>
        </ul>

        <h3>v0.1.5 - February 9, 2026</h3>
        <ul>
          <li><strong>AI Agent Setup:</strong> Enhanced interactive setup specifically for AI coding agents</li>
          <li><strong>Documentation:</strong> Major README updates with better instructions</li>
          <li><strong>Settings:</strong> Added auto-commit settings documentation</li>
          <li><strong>Package Info:</strong> Updated package table to include sizes</li>
        </ul>

        <h3>v0.1.4 - February 9, 2026</h3>
        <ul>
          <li><strong>Inspector Logo:</strong> Changed SVG logo in inspector hub</li>
          <li><strong>Demo Updates:</strong> Various test changes including button colors and styling</li>
        </ul>

        <h3>v0.1.3 - February 9, 2026</h3>
        <ul>
          <li><strong>Build System:</strong> Updated build script to use esbuild for bundling and minification</li>
          <li><strong>Package Configuration:</strong> Fixed bin path and repository URL format in package.json</li>
          <li><strong>Testing:</strong> Multiple demo tests showing button styling and counter functionality</li>
        </ul>

        <h3>v0.1.1 - February 7, 2026</h3>
        <ul>
          <li><strong>Documentation:</strong> Added README files for bridge, cli, inspector, and types packages</li>
          <li><strong>Scroll Handling:</strong> Added scroll handling and highlight transition management</li>
          <li><strong>Security:</strong> Small security fixes</li>
          <li><strong>Testing:</strong> Added Vitest and initial test suite</li>
          <li><strong>Package Setup:</strong> Updated tests and packaging configuration</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Initial Development</h2>
        
        <h3>February 7, 2026</h3>
        <ul>
          <li><strong>Inspector Polish:</strong> Condensed inspector UI and fixed bug where it highlights the whole page on hub hover</li>
          <li><strong>Settings Page:</strong> Added settings page and updated hub navigation</li>
          <li><strong>Hub Styles:</strong> Refined collapsed hub styles and added flex display for button groups</li>
          <li><strong>Component Testing:</strong> Multiple interactive tests with form inputs, buttons, and UI elements</li>
          <li><strong>Initial Release:</strong> First commit - project initialization</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Version Notes</h2>
        <p>Eyeglass follows semantic versioning. The project consists of multiple packages that are versioned together:</p>
        <ul>
          <li><code>@eyeglass/cli</code> - Command-line interface and setup tools</li>
          <li><code>@eyeglass/inspector</code> - Browser-based visual inspector web component</li>
          <li><code>@eyeglass/bridge</code> - MCP server for communication between inspector and agents</li>
          <li><code>@eyeglass/types</code> - Shared TypeScript type definitions</li>
        </ul>
        <p>Breaking changes are indicated by major version bumps. Minor versions add features in a backwards-compatible manner. Patch versions include bug fixes and performance improvements.</p>
      </section>
    </>
  );
}
