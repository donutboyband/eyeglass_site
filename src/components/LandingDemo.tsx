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
      setCardStyle({ bg: '#f8fafc', border: '#e2e8f0' })
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
      setCardStyle({ bg: '#1e293b', border: '#334155' })
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

  const getSelectionState = (card: 1 | 2) => {
    if (phase === 'selecting' && card === 1) return 1
    if (phase === 'multi-select') return card
    if (['typing', 'pending', 'thinking', 'reading', 'writing'].includes(phase)) return card
    return 0
  }

  const showPanel = !['idle', 'selecting'].includes(phase)
  const isInputMode = ['multi-select', 'typing'].includes(phase)
  const isActivityMode = ['pending', 'thinking', 'reading', 'writing', 'done'].includes(phase)

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
              className={`landing-demo-card ${getSelectionState(1) ? 'selected' : ''}`}
              data-selection={getSelectionState(1) || undefined}
              style={{
                backgroundColor: cardStyle.bg,
                borderColor: cardStyle.border,
                color: cardStyle.bg === '#1e293b' ? '#f1f5f9' : '#334155'
              }}
            >
              {getSelectionState(1) > 0 && <span className="selection-badge">{getSelectionState(1)}</span>}
              <div className="card-title">Analytics</div>
              <div className="card-value" style={{ color: cardStyle.bg === '#1e293b' ? '#fff' : '#0f172a' }}>2,847</div>
              <div className="card-label">Page views today</div>
            </div>
            <div
              className={`landing-demo-card ${getSelectionState(2) ? 'selected' : ''}`}
              data-selection={getSelectionState(2) || undefined}
              style={{
                backgroundColor: cardStyle.bg,
                borderColor: cardStyle.border,
                color: cardStyle.bg === '#1e293b' ? '#f1f5f9' : '#334155'
              }}
            >
              {getSelectionState(2) > 0 && <span className="selection-badge">{getSelectionState(2)}</span>}
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
          {/* Header */}
          <div className="inspector-header">
            <span className="inspector-tag">&lt;Card /&gt;</span>
            <button className="inspector-multi-btn active">+</button>
            <button className="inspector-close-btn">×</button>
          </div>

          {/* Multi-select mode UI */}
          {isInputMode && (
            <>
              <div className="inspector-hint">Click elements to add/remove from selection (max 5)</div>
              <div className="inspector-selected">
                <div className="selected-label">2 elements selected</div>
                <div className="selected-chips">
                  <span className="selected-chip"><span className="chip-badge">1</span> Card ×</span>
                  <span className="selected-chip"><span className="chip-badge">2</span> Card ×</span>
                </div>
              </div>
              <div className="inspector-input-area">
                <input
                  type="text"
                  className="inspector-input"
                  placeholder="Describe what to change for these elements.."
                  value={typedText}
                  readOnly
                />
                <div className="inspector-buttons">
                  <button className="inspector-btn secondary">Cancel</button>
                  <button className="inspector-btn primary">Send</button>
                </div>
              </div>
            </>
          )}

          {/* Activity mode UI */}
          {isActivityMode && (
            <>
              <div className="inspector-request">
                <div className="request-label">Your request</div>
                <div className="request-text">{fullRequest}</div>
              </div>
              <div className="inspector-activity-feed">
                {activities.map((item, idx) => (
                  <div key={idx} className="inspector-activity-item">
                    <span className={`inspector-activity-icon ${item.type}`}>
                      {item.type === 'thought' && '💭'}
                      {item.type === 'action' && '📄'}
                      {item.type === 'success' && '✓'}
                    </span>
                    <div className="inspector-activity-content">
                      <span className={`inspector-activity-text ${item.type === 'thought' ? 'muted' : ''}`}>
                        {item.text}
                      </span>
                      {item.target && (
                        <span className="inspector-activity-target">{item.target}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className={`inspector-footer ${phase === 'done' ? 'done' : ''}`}>
                <span className={`inspector-status-dot ${phase}`} />
                <span className="inspector-status-text">
                  {phase === 'pending' && 'Sending...'}
                  {phase === 'thinking' && WORKING_PHRASES[0]}
                  {phase === 'reading' && 'Reading...'}
                  {phase === 'writing' && 'Editing...'}
                  {phase === 'done' && 'Done'}
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
