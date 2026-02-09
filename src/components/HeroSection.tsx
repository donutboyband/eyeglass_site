import { CopyIcon, CheckIcon } from './Icons'
import { useState, useEffect } from 'react'

type Props = {
  installCommand: string
  copied: boolean
  onCopy: () => void
}

const AGENTS = ['Claude Code', 'Codex', 'Copilot']

export function HeroSection({ installCommand, copied, onCopy }: Props) {
  const [agentIndex, setAgentIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    const currentAgent = AGENTS[agentIndex]
    let charIndex = isTyping ? displayText.length : displayText.length - 1
    
    const timeout = setTimeout(() => {
      if (isTyping) {
        if (charIndex < currentAgent.length) {
          setDisplayText(currentAgent.slice(0, charIndex + 1))
        } else {
          // Finished typing, wait then start untyping
          setTimeout(() => setIsTyping(false), 1000)
        }
      } else {
        if (charIndex > 0) {
          setDisplayText(currentAgent.slice(0, charIndex))
        } else {
          // Finished untyping, move to next agent
          setAgentIndex((prev) => (prev + 1) % AGENTS.length)
          setIsTyping(true)
          setDisplayText('')
        }
      }
    }, isTyping ? 100 : 50)

    return () => clearTimeout(timeout)
  }, [agentIndex, displayText, isTyping])

  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-kicker">
          For <span className="agent-typewriter">{displayText}<span className="cursor">|</span></span>.
        </p>
        <h1 className="hero-headline">
          <span className="highlight">
            clicks
            <svg className="hand-arrow" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4 20C20 22 40 18 60 20C80 22 95 18 110 20"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M95 12C100 16 105 18 110 20C105 22 100 24 95 28"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            commits
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
