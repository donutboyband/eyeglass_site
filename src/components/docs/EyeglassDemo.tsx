import { useState, useEffect } from 'react'

type DemoPhase = 'idle' | 'selecting' | 'typing' | 'pending' | 'fixing' | 'done'

const WORKING_PHRASES = [
  'Ruminating...',
  'Grokking...',
  'Synthesizing...',
  'Forging...',
]

export function EyeglassDemo() {
  const [phase, setPhase] = useState<DemoPhase>('idle')
  const [buttonColor, setButtonColor] = useState('#6366f1')
  const [typedText, setTypedText] = useState('')
  const [workingPhrase, setWorkingPhrase] = useState(WORKING_PHRASES[0])
  const fullRequest = 'make this green'

  useEffect(() => {
    let cancelled = false

    const typeText = async () => {
      for (let i = 0; i <= fullRequest.length; i++) {
        if (cancelled) return
        setTypedText(fullRequest.slice(0, i))
        await new Promise(r => setTimeout(r, 60))
      }
    }

    const runDemo = async () => {
      // Reset
      setPhase('idle')
      setButtonColor('#6366f1')
      setTypedText('')

      await new Promise(r => setTimeout(r, 800))
      if (cancelled) return

      // Select element
      setPhase('selecting')
      await new Promise(r => setTimeout(r, 600))
      if (cancelled) return

      // Type request
      setPhase('typing')
      await typeText()
      await new Promise(r => setTimeout(r, 400))
      if (cancelled) return

      // Pending (sending)
      setPhase('pending')
      await new Promise(r => setTimeout(r, 800))
      if (cancelled) return

      // Fixing with rotating phrases
      setPhase('fixing')
      setWorkingPhrase(WORKING_PHRASES[Math.floor(Math.random() * WORKING_PHRASES.length)])
      await new Promise(r => setTimeout(r, 1200))
      if (cancelled) return

      // Done
      setPhase('done')
      setButtonColor('#10b981')
      await new Promise(r => setTimeout(r, 2500))
      if (cancelled) return

      // Loop
      runDemo()
    }

    runDemo()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="eyeglass-demo">
      {/* Mock Browser */}
      <div className="demo-browser">
        <div className="demo-toolbar">
          <span className="demo-dot red" />
          <span className="demo-dot yellow" />
          <span className="demo-dot green" />
          <span className="demo-url">localhost:5173</span>
        </div>
        <div className="demo-content">
          <div className="demo-element-wrapper">
            <button
              className="demo-target-btn"
              style={{ backgroundColor: buttonColor }}
            >
              Submit
            </button>
            {/* Highlight overlay */}
            {(phase === 'selecting' || phase === 'typing' || phase === 'pending' || phase === 'fixing') && (
              <div className="demo-highlight" />
            )}
          </div>
        </div>
      </div>

      {/* Glass Panel (appears after selection) */}
      {phase !== 'idle' && phase !== 'selecting' && (
        <div className="demo-glass-panel">
          <div className="panel-header">
            <span className="component-tag">&lt;Button /&gt;</span>
            <span className="file-path">src/App.tsx</span>
          </div>

          {/* Input or Request Display */}
          {phase === 'typing' && (
            <div className="input-area">
              <div className="input-field">
                {typedText}<span className="demo-cursor">|</span>
              </div>
            </div>
          )}

          {phase !== 'typing' && (
            <div className="user-request">
              <div className="user-request-label">Request</div>
              <div className="user-request-text">{fullRequest}</div>
            </div>
          )}

          {/* Activity Feed */}
          {(phase === 'fixing' || phase === 'done') && (
            <div className="activity-feed">
              <div className="activity-item">
                <span className="activity-icon action">📄</span>
                <div className="activity-content">
                  <span className="activity-text">Reading file</span>
                  <span className="activity-target">src/App.tsx</span>
                </div>
              </div>
              {phase === 'done' && (
                <div className="activity-item">
                  <span className="activity-icon success">✓</span>
                  <div className="activity-content">
                    <span className="activity-text">Changed button color to green</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Status Footer */}
          <div className={`panel-footer ${phase === 'done' ? 'done' : ''}`}>
            <span className={`status-dot ${phase}`} />
            <span className="status-text">
              {phase === 'pending' && 'Sending...'}
              {phase === 'fixing' && workingPhrase}
              {phase === 'done' && 'Done'}
              {phase === 'typing' && 'Ready'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
