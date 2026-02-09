import { useEffect, useRef, useState } from 'react'
import { highlightJson } from '../utils/highlightJson'

export function DemoSection() {
  const [mockRequests, setMockRequests] = useState<Array<{ note: string; component: string; id: string; payload: any }>>([])
  const [latestPayload, setLatestPayload] = useState<string>('')
  const [terminalLines, setTerminalLines] = useState<string[]>([])
  const [terminalPlaying, setTerminalPlaying] = useState(false)
  const terminalTimers = useRef<number[]>([])

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<any>).detail || {}
      const snapshot = detail.snapshot || detail.snapshots?.[0] || {}
      const labelParts: string[] = []
      const componentName = snapshot.framework?.componentName
      const tagName = snapshot.tagName
      if (componentName) labelParts.push(componentName)
      if (tagName) labelParts.push(tagName.toLowerCase())
      const id = snapshot.id
      const className = snapshot.className
      if (id) labelParts.push(`#${id}`)
      else if (className) labelParts.push(`.${className.split(' ').join('.')}`)
      const component = labelParts.join(' ') || 'Unknown element'
      setLatestPayload(JSON.stringify(detail, null, 2))
      setMockRequests((prev) => {
        const next = [
          {
            note: detail.userNote || '(no prompt)',
            component,
            id: detail.interactionId || Date.now().toString(),
            payload: detail,
          },
          ...prev,
        ]
        return next.slice(0, 6)
      })
      replayTranscript(detail)
    }
    window.addEventListener('eyeglass-mock-request', handler)
    return () => window.removeEventListener('eyeglass-mock-request', handler)
  }, [])

  const replayTranscript = (detail: any) => {
    terminalTimers.current.forEach(clearTimeout)
    terminalTimers.current = []
    setTerminalLines([])
    setTerminalPlaying(true)
    const lines = buildTranscript(detail).trim().split('\n')
    let acc = 0
    lines.forEach((line, idx) => {
      const delay = line.startsWith('⏺') || line.startsWith('⎿') ? 250 : 80
      acc += delay
      terminalTimers.current.push(
        window.setTimeout(() => {
          setTerminalLines((prev) => [...prev, line])
          if (idx === lines.length - 1) {
            setTerminalPlaying(false)
          }
        }, acc)
      )
    })
  }

  useEffect(() => {
    return () => {
      terminalTimers.current.forEach(clearTimeout)
    }
  }, [])

  function buildTranscript(detail: any): string {
    const snapshot = detail.snapshot || detail.snapshots?.[0] || {}
    const comp = snapshot.framework?.componentName || 'Unknown'
    const file = snapshot.framework?.filePath || 'unknown file'
    const id = detail.interactionId || 'eyeglass-demo'
    const note = detail.userNote || '(no prompt)'
    return `
[listening] waiting for selection…
⎿ focus_request
   id=${id}
   note: "${note}"
   component: ${comp}
   file: ${file}

● eyeglass update_status(status: "fixing", message: "applying your change…")
● eyeglass report_action(action: "reading", target: "${file}")
● eyeglass report_action(action: "writing", target: "${file}")
● eyeglass update_status(status: "success", message: "change applied")
⎿ done. ready for next request.
`.trim()
  }

  return (
    <section className="section demo" id="demo">
      <div className="section-header">
        <p className="section-label">Demo</p>
        <h2>Try the Eyeglass hub in the bottom-left</h2>
        <p className="section-sub">
          The live inspector is running on this page with a mock bridge to try
          out Eyeglass.
        </p>
      </div>
      <div className="demo-stack">
        <div className="demo-panel">
          <div className="demo-panel-header">
            <div>
              <p className="eyebrow">What happens</p>
              <h3>Live payload to the mock bridge</h3>
            </div>
            <span className="eyebrow">
              {terminalPlaying
                ? "Replaying transcript…"
                : "Plays automatically after submit"}
            </span>
          </div>
          <div className="demo-log standalone">
            <div className="demo-log-header">
              <span className="dot green" />
              Intercepted requests (live)
            </div>
            <div className="log-body">
              {mockRequests.length === 0 ? (
                <p className="muted">
                  Select an element and submit a prompt to see it here.
                </p>
              ) : (
                mockRequests.map((req) => (
                  <p key={req.id} className="log-line">
                    <span className="mono">[{req.component}]</span> {req.note}
                  </p>
                ))
              )}
            </div>
          </div>
          <div className="demo-flex fullwidth">
            <div className="payload-live">
              <p className="muted tiny">
                Latest request Eyeglass sends (captured from the inspector on
                this page).
              </p>
              <pre className="payload-code live">
                <code
                  dangerouslySetInnerHTML={{
                    __html: highlightJson(
                      latestPayload ||
                        "// select an element and submit a prompt to see the payload",
                    ),
                  }}
                />
              </pre>
            </div>
            <div className="terminal">
              <div className="terminal-header">
                Claude × Eyeglass (mock replay)
              </div>
              <div className="terminal-body">
                {terminalLines.length === 0 ? (
                  <p className="muted">
                    Submit a request to see the transcript.
                  </p>
                ) : (
                  terminalLines.map((line, idx) => (
                    <pre key={idx} className="terminal-line">
                      {line}
                    </pre>
                  ))
                )}
              </div>
            </div>
          </div>
          <p className="muted tiny">
            All network calls to http://localhost:3300 are intercepted
            in-browser. Feel free to click around.
          </p>
        </div>
      </div>
    </section>
  )
}
