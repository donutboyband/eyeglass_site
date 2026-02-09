import { useState } from 'react'
import { CopyIcon, CheckIcon } from '../Icons'

type Props = {
  code: string
}

export function CopyableCode({ code }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="copyable-code-wrapper">
      <pre><code>{code}</code></pre>
      <button className="copy-code-btn" onClick={handleCopy} title="Copy to clipboard">
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
    </div>
  )
}
