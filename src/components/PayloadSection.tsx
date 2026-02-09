import { useEffect, useRef } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-json'

type Props = { payload: string }

export function PayloadSection({ payload }: Props) {
  const codeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current)
    }
  }, [payload])

  return (
    <section className="section payload" id="payload">
      <div className="section-header">
        <p className="section-label">Rich Context</p>
        <h2>What Claude Code receives</h2>
      </div>
      <div className="payload-grid">
        <div className="payload-text">
          <p>
            Inspector captures component + props + styles + a11y in one
            semantic snapshot. This is the JSON Claude gets.
          </p>
          <div className="chips">
            <span className="chip">Component + file path</span>
            <span className="chip">Props + ancestry</span>
            <span className="chip">A11y tree</span>
            <span className="chip">Computed styles</span>
          </div>
        </div>
        <pre className="payload-code language-json">
          <code ref={codeRef} className="language-json">
            {payload}
          </code>
        </pre>
      </div>
    </section>
  )
}
