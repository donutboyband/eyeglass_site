import { CopyIcon, CheckIcon } from './Icons'

type Props = {
  installCommand: string
  copied: boolean
  onCopy: () => void
}

export function HeroSection({ installCommand, copied, onCopy }: Props) {
  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-kicker">
          For Claude Code.
        </p>
        <h1>
          <span className="highlight">
            {' '}
            Turn clicks into commits.
          </span>
        </h1>
        <p className="hero-subtitle">
          Point at UI. Eyeglass captures component, file path, a11y tree, and computed styles,
          then allows you to talk with Claude from the browser to implement the changes.
        </p>
        <div className="hero-actions">
          <div className="install">
            <span className="prompt">$</span>
            <code>{installCommand}</code>
            <button className="copy-btn" onClick={onCopy} title="Copy to clipboard">
              {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>
        </div>
        <p className="hero-note">
          Works with Vite, Next.js, CRA, Remix. No Claude calls on this demo page.
        </p>
      </div>
      <div className="hero-proof">
        <span className="chip">Auto-commit + undo</span>
        <span className="chip">A11y + style capture</span>
        <span className="chip">Framework aware</span>
      </div>
    </section>
  )
}
