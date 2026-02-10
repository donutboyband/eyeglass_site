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
      <div className={`landing-demo-panel ${!showPanel ? 'panel-hidden' : ''}`}>
          {/* Header */}
          <div className="panel-header">
            <span className="component-tag">&lt;Card /&gt;</span>
            <button className={`multi-select-icon ${isInputMode ? 'active' : ''}`}>+</button>
            <button className="close-btn">×</button>
          </div>

          {/* Multi-select mode UI */}
          {isInputMode && (
            <>
              <div className="multi-mode-hint">Click elements to add/remove from selection (max 5)</div>
              <div className="selected-list">
                <div className="selected-list-header">
                  <div className="selected-count">2 elements selected</div>
                </div>
                <div className="selected-chips">
                  <span className="selected-chip">
                    <span className="selected-chip-number">1</span> Card
                    <button className="selected-chip-remove">×</button>
                  </span>
                  <span className="selected-chip">
                    <span className="selected-chip-number">2</span> Card
                    <button className="selected-chip-remove">×</button>
                  </span>
                </div>
              </div>
              <div className="input-area">
                <input
                  type="text"
                  className="input-field"
                  placeholder="Describe what to change for these elements..."
                  value={typedText}
                  readOnly
                />
                <div className="btn-row">
                  <button className="btn btn-secondary">Cancel</button>
                  <button className="btn btn-primary">Send</button>
                </div>
              </div>
            </>
          )}

          {/* Activity mode UI */}
          {isActivityMode && (
            <>
              <div className="user-request">
                <div className="user-request-label">Your request</div>
                <div className="user-request-text">{fullRequest}</div>
              </div>
              <div className="activity-feed">
                {activities.map((item, idx) => (
                  <div key={idx} className="activity-item">
                    <span className={`activity-icon ${item.type}`}>
                      {item.type === 'thought' && '💭'}
                      {item.type === 'action' && '📄'}
                      {item.type === 'success' && '✓'}
                    </span>
                    <div className="activity-content">
                      <span className={`activity-text ${item.type === 'thought' ? 'muted' : ''}`}>
                        {item.text}
                      </span>
                      {item.target && (
                        <span className="activity-target">{item.target}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className={`panel-footer ${phase === 'done' ? 'done' : ''}`}>
                <span className={`status-dot ${phase}`} />
                <span className="status-text">
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
    </div>
  )
}
