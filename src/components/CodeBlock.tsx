import { useEffect, useRef, useState } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-bash'
import { CopyIcon, CheckIcon } from './Icons'

interface CodeBlockProps {
  code: string
  language?: 'typescript' | 'json' | 'bash' | 'text'
}

export function CodeBlock({ code, language = 'typescript' }: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current)
    }
  }, [code])

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="copyable-code-wrapper">
      <pre className={`code-block language-${language}`}>
        <code ref={codeRef} className={`language-${language}`}>
          {code.trim()}
        </code>
      </pre>
      <button className="copy-code-btn" onClick={handleCopy} title="Copy to clipboard">
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
    </div>
  )
}
