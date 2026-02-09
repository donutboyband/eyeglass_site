import { useState, useEffect } from 'react'

type DemoPhase =
  | 'idle'
  | 'selecting'
  | 'multi-select'
  | 'typing'
  | 'pending'
  | 'thinking'
  | 'reading'
  | 'writing'
  | 'done'

const WORKING_PHRASES = [
  'Analyzing component structure...',
  'Identifying style properties...',
  'Planning changes...',
]

interface ActivityItem {
  type: 'thought' | 'action' | 'success'
  text: string
  target?: string
}

export function LandingDemo() {
  const [phase, setPhase] = useState<DemoPhase>('idle')
  const [cardStyle, setCardStyle] = useState({
    bg: '#f8fafc',
    border: '#e2e8f0',
    btnBg: '#6366f1',
  })
  const [typedText, setTypedText] = useState('')
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const fullRequest = 'make these cards have a dark theme'

  useEffect(() => {
    let cancelled = false

    const typeText = async () => {
      for (let i = 0; i <= fullRequest.length; i++) {
        if (cancelled) return
        setTypedText(fullRequest.slice(0, i))
        await new Promise(r => setTimeout(r, 45))
      }
    }

    const addActivity = (item: ActivityItem) => {
      if (cancelled) return
      setActivities(prev => [...prev, item])
    }

    const runDemo = async () => {
      // Reset
      setPhase('idle')
      setCardStyle({ bg: '#f8fafc', border: '#e2e8f0', btnBg: '#6366f1' })
      setTypedText('')
      setActivities([])

      await new Promise(r => setTimeout(r, 1000))
      if (cancelled) return

      // Select first element
      setPhase('selecting')
      await new Promise(r => setTimeout(r, 700))
      if (cancelled) return

      // Select second element (multi-select)
      setPhase('multi-select')
      await new Promise(r => setTimeout(r, 600))
      if (cancelled) return

      // Type request
      setPhase('typing')
      await typeText()
      await new Promise(r => setTimeout(r, 500))
      if (cancelled) return

      // Pending (sending)
      setPhase('pending')
      await new Promise(r => setTimeout(r, 600))
      if (cancelled) return

      // Thinking phase with activity
      setPhase('thinking')
      addActivity({ type: 'thought', text: 'Need to update background, border, and text colors for dark theme' })
      await new Promise(r => setTimeout(r, 1000))
      if (cancelled) return

      // Reading phase
      setPhase('reading')
      addActivity({ type: 'action', text: 'Reading file', target: 'src/components/Card.tsx' })
      await new Promise(r => setTimeout(r, 800))
      if (cancelled) return

      // Writing phase
      setPhase('writing')
      addActivity({ type: 'action', text: 'Editing styles', target: 'Card.tsx:24-38' })
      await new Promise(r => setTimeout(r, 600))

      // Animate the style change
      setCardStyle({ bg: '#1e293b', border: '#334155', btnBg: '#22c55e' })
      await new Promise(r => setTimeout(r, 600))
      if (cancelled) return

      // Done
      setPhase('done')
      addActivity({ type: 'success', text: 'Applied dark theme to 2 components' })
      await new Promise(r => setTimeout(r, 3000))
      if (cancelled) return

      // Loop
      runDemo()
    }

    runDemo()
    return () => { cancelled = true }
  }, [])

  const isSelected = (card: 1 | 2) => {
    if (phase === 'selecting' && card === 1) return true
    if (phase === 'multi-select' && (card === 1 || card === 2)) return true
    if (['typing', 'pending', 'thinking', 'reading', 'writing'].includes(phase)) return true
    return false
  }

  const showPanel = !['idle', 'selecting', 'multi-select'].includes(phase)

  return (
    <div className="landing-demo">
      {/* Mock Browser */}
      <div className="landing-demo-browser">
        <div className="landing-demo-toolbar">
          <span className="demo-dot red" />
          <span className="demo-dot yellow" />
          <span className="demo-dot green" />
          <span className="demo-url">localhost:5173/dashboard</span>
        </div>
        <div className="landing-demo-content">
          {/* Mock card UI */}
          <div className="landing-demo-cards">
            <div
              className={`landing-demo-card ${isSelected(1) ? 'selected' : ''}`}
              style={{
                backgroundColor: cardStyle.bg,
                borderColor: cardStyle.border,
                color: cardStyle.bg === '#1e293b' ? '#f1f5f9' : '#334155'
              }}
            >
              <div className="card-title">Analytics</div>
              <div className="card-value" style={{ color: cardStyle.bg === '#1e293b' ? '#fff' : '#0f172a' }}>2,847</div>
              <div className="card-label">Page views today</div>
            </div>
            <div
              className={`landing-demo-card ${isSelected(2) ? 'selected' : ''}`}
              style={{
                backgroundColor: cardStyle.bg,
                borderColor: cardStyle.border,
                color: cardStyle.bg === '#1e293b' ? '#f1f5f9' : '#334155'
              }}
            >
              <div className="card-title">Revenue</div>
              <div className="card-value" style={{ color: cardStyle.bg === '#1e293b' ? '#fff' : '#0f172a' }}>$12,430</div>
              <div className="card-label">This month</div>
            </div>
          </div>
        </div>
      </div>

      {/* Glass Panel */}
      {showPanel && (
        <div className="landing-demo-panel">
          <div className="demo-panel-header">
            <span className="demo-component-tag">&lt;Card /&gt;</span>
            <span className="demo-badge">×2</span>
          </div>

          {/* Input or Request Display */}
          {phase === 'typing' && (
            <div className="demo-input-area">
              <div className="demo-input-field">
                {typedText}<span className="demo-cursor">|</span>
              </div>
            </div>
          )}

          {phase !== 'typing' && (
            <div className="demo-user-request">
              <div className="demo-request-label">Request</div>
              <div className="demo-request-text">{fullRequest}</div>
            </div>
          )}

          {/* Activity Feed */}
          {activities.length > 0 && (
            <div className="demo-activity-feed">
              {activities.map((item, idx) => (
                <div key={idx} className="demo-activity-item">
                  <span className={`demo-activity-icon ${item.type}`}>
                    {item.type === 'thought' && '💭'}
                    {item.type === 'action' && '📄'}
                    {item.type === 'success' && '✓'}
                  </span>
                  <div className="demo-activity-content">
                    <span className={`demo-activity-text ${item.type === 'thought' ? 'muted' : ''}`}>
                      {item.text}
                    </span>
                    {item.target && (
                      <span className="demo-activity-target">{item.target}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Status Footer */}
          <div className={`demo-panel-footer ${phase === 'done' ? 'done' : ''}`}>
            <span className={`demo-status-dot ${phase}`} />
            <span className="demo-status-text">
              {phase === 'pending' && 'Sending...'}
              {phase === 'thinking' && WORKING_PHRASES[0]}
              {phase === 'reading' && 'Reading...'}
              {phase === 'writing' && 'Editing...'}
              {phase === 'done' && 'Done'}
              {phase === 'typing' && 'Ready'}
            </span>
          </div>
        </div>
      )}

      {/* Selection indicator */}
      {(phase === 'multi-select') && (
        <div className="landing-demo-hint">Multi-select: 2 elements</div>
      )}
    </div>
  )
}
