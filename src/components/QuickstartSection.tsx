import { useState } from 'react'
import { CopyIcon, CheckIcon } from './Icons'

type QuickItem = { title: string; code: string; note: string }

type Props = { items: QuickItem[] }

export function QuickstartSection({ items }: Props) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleCopy = (code: string, index: number) => {
    navigator.clipboard.writeText(code)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <section className="section" id="quickstart">
      <div className="section-header">
        <p className="section-label">Quickstart</p>
        <h2>Two commands to run Eyeglass</h2>
      </div>
      <div className="quickstart">
        {items.map((item, index) => (
          <div key={item.title} className="quick-card">
            <div className="quick-header">
              <span className="step-number">{index + 1}</span>
              <h3>{item.title}</h3>
            </div>
            <div className="code-wrapper">
              <pre>{item.code}</pre>
              <button 
                className="copy-btn" 
                onClick={() => handleCopy(item.code, index)} 
                title="Copy to clipboard"
              >
                {copiedIndex === index ? <CheckIcon /> : <CopyIcon />}
              </button>
            </div>
            <p>{item.note}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
