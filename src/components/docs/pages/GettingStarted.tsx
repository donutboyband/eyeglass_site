import { EyeglassDemo } from '../EyeglassDemo'
import { CopyIcon, CheckIcon } from '../../Icons'
import { CopyableCode } from '../CopyableCode'
import { useState } from 'react'

const installCommand = 'npx @eyeglass/cli init'

export function GettingStarted() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(installCommand)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <div className="docs-hero">
        <p className="section-label">Documentation</p>
        <h1>
          <img src="/eyeglass.svg" alt="Eyeglass" className="docs-logo" />
          Eyeglass Documentation
        </h1>
        <p className="hero-subtitle">Visual debugging for AI coding agents. Point at UI elements, describe what you want, and let the agent edit with full context. This site was built with eyeglass.</p>
        <div className="hero-actions minimal" style={{ justifyContent: 'flex-start' }}>
          <a className="link-arrow" href="#quickstart">Get Started →</a>
          <div className="install minimal">
            <code>{installCommand}</code>
            <button className="copy-btn" onClick={handleCopy} title="Copy to clipboard">
              {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>
        </div>
      </div>

      <EyeglassDemo />

      <section className="docs-section" id="overview">
        <h2>Overview</h2>
        <p>Eyeglass bridges the gap between what you see in your browser and what your AI coding assistant can understand. It's a visual debugging tool that lets you point at any UI element and tell the agent what to change—without leaving your browser.</p>
        <p><strong>The Problem:</strong> Describing UI bugs to AI is tedious. "The blue button in the sidebar" could mean anything.</p>
        <p><strong>The Solution:</strong> Click any element. Eyeglass captures its component name, file path, styles, accessibility tree, and geometry. the agent receives this rich context and makes precise changes.</p>
        <h3>Key Benefits</h3>
        <ul>
          <li><strong>Visual Selection:</strong> Click elements instead of describing them in text</li>
          <li><strong>Framework-Aware:</strong> Extracts React/Vue/Svelte component names and file paths</li>
          <li><strong>Semantic Context:</strong> Full accessibility, style, and layout information</li>
          <li><strong>Git Integration:</strong> Auto-commit changes with one-click undo</li>
          <li><strong>Real-Time Feedback:</strong> See the agent's progress directly in your browser</li>
        </ul>
      </section>

      <section className="docs-section" id="quickstart">
        <h2>Quick Start</h2>
        <h3>1. Install Eyeglass</h3>
        <CopyableCode code="npx @eyeglass/cli init" />
        <p>This single command:</p>
        <ul>
          <li>Installs <code>@eyeglass/inspector</code> as a dev dependency</li>
          <li>Creates <code>.claude/settings.json</code> with MCP configuration</li>
          <li>Configures your bundler (Vite, Next.js, CRA, or Remix)</li>
          <li>Creates a <code>/eyeglass</code> skill for hands-free listening</li>
        </ul>

        <h3>2. Start Your Dev Server</h3>
        <CopyableCode code="npm run dev" />

        <h3>3. Start the Agent</h3>
        <CopyableCode code="claude" />
        <p>Tell the agent to listen for requests:</p>
        <CopyableCode code="> wait_for_request" />

        <h3>4. Use Eyeglass</h3>
        <p>In your browser:</p>
        <ol>
          <li>Click any element to select it</li>
          <li>Type your request in the Eyeglass panel</li>
          <li>For multiple elements: click the + button, then click elements to add them</li>
          <li>Submit—the agent automatically receives it and starts working</li>
          <li>Watch changes appear via hot reload</li>
          <li>Keep chatting with the agent to refine or add follow-up instructions</li>
        </ol>
      </section>

      <section className="docs-section" id="how-it-works">
        <h2>How It Works</h2>
        <ol>
          <li><strong>You select an element</strong> in your browser and type a request (e.g., "make this blue")</li>
          <li><strong>The Inspector</strong> captures semantic information: component name, file path, accessibility tree, styles</li>
          <li><strong>The Bridge</strong> stores this context and notifies the agent via MCP</li>
          <li><strong>the agent</strong> receives the full context and makes the code changes</li>
          <li><strong>Hot reload</strong> updates your browser automatically</li>
        </ol>
      </section>
    </>
  )
}
