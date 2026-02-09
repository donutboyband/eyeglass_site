import { useState, useEffect } from 'react'

type DemoPhase = 'idle' | 'selecting' | 'requesting' | 'fixing' | 'done'

export function EyeglassDemo() {
  const [phase, setPhase] = useState<DemoPhase>('idle')
  const [buttonColor, setButtonColor] = useState('#6366f1')

  useEffect(() => {
    const runDemo = () => {
      // Reset
      setPhase('idle')
      setButtonColor('#6366f1')

      // Select element
      setTimeout(() => setPhase('selecting'), 1000)

      // Show request
      setTimeout(() => setPhase('requesting'), 2000)

      // Fixing
      setTimeout(() => setPhase('fixing'), 3500)

      // Done - change the button
      setTimeout(() => {
        setPhase('done')
        setButtonColor('#22c55e')
      }, 5000)

      // Loop after pause
      setTimeout(runDemo, 7500)
    }

    runDemo()
  }, [])

  return (
    <div className="eyeglass-demo">
      <div className="demo-browser">
        <div className="demo-toolbar">
          <span className="demo-dot red" />
          <span className="demo-dot yellow" />
          <span className="demo-dot green" />
          <span className="demo-url">localhost:5173</span>
        </div>
        <div className="demo-content">
          <button
            className={`demo-button ${phase === 'selecting' || phase === 'requesting' ? 'selected' : ''}`}
            style={{ backgroundColor: buttonColor }}
          >
            Submit
          </button>
        </div>
      </div>

      <div className="demo-overlay">
        {phase === 'requesting' && (
          <div className="demo-request">
            <span className="demo-typing">make this green</span>
          </div>
        )}
        {phase === 'fixing' && (
          <div className="demo-status fixing">
            <span className="demo-spinner" />
            Fixing...
          </div>
        )}
        {phase === 'done' && (
          <div className="demo-status success">
            ✓ Done
          </div>
        )}
      </div>
    </div>
  )
}
