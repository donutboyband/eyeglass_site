import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@eyeglass/inspector'
import './index.css'
import App from './App.tsx'

// Default to real Eyeglass; turn mock on only when explicitly requested.
const enableMock = import.meta.env.VITE_EYEGLASS_MOCK === 'true'

async function bootstrap() {
  if (enableMock) {
    // Only load the demo bridge interceptor when explicitly enabled
    await import('./eyeglass-mock')
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )
}

bootstrap()
