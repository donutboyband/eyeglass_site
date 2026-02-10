/**
 * Mock Demo Service for Eyeglass Inspector
 *
 * This service simulates agent responses when running in production/demo mode
 * without a real MCP bridge. It intercepts inspector requests and generates
 * realistic mock responses.
 */

type SSECallback = (event: { type: string; data: string }) => void

interface MockState {
  sseCallbacks: Set<SSECallback>
  isActive: boolean
}

const state: MockState = {
  sseCallbacks: new Set(),
  isActive: false,
}

// Mock responses for different element types
const mockResponses = [
  {
    thoughts: [
      "Analyzing the selected element...",
      "Found React component in the codebase",
      "Identifying the file path and styles",
    ],
    actions: [
      { action: 'searching', target: 'component definition' },
      { action: 'reading', target: 'src/components/Button.tsx' },
      { action: 'writing', target: 'src/components/Button.tsx' },
    ],
    finalMessage: "Changes applied successfully!",
  },
  {
    thoughts: [
      "Looking at this component...",
      "Checking the computed styles",
      "Making the requested changes",
    ],
    actions: [
      { action: 'thinking', target: 'analyzing styles' },
      { action: 'reading', target: 'src/App.css' },
      { action: 'writing', target: 'src/App.css' },
    ],
    finalMessage: "Styles updated!",
  },
  {
    thoughts: [
      "Processing your request...",
      "Found the relevant component",
      "Applying modifications",
    ],
    actions: [
      { action: 'searching', target: 'related files' },
      { action: 'reading', target: 'src/components/Card.tsx' },
      { action: 'writing', target: 'src/components/Card.tsx' },
    ],
    finalMessage: "Done! Changes committed.",
  },
]

function getRandomResponse() {
  return mockResponses[Math.floor(Math.random() * mockResponses.length)]
}

function emit(activityEvent: Record<string, unknown>) {
  // Inspector expects: { type: "activity", payload: ActivityEvent }
  const sseData = JSON.stringify({ type: 'activity', payload: activityEvent })
  state.sseCallbacks.forEach(cb => cb({ type: 'message', data: sseData }))
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function simulateAgentResponse(interactionId: string, _userNote: string) {
  const response = getRandomResponse()

  // Initial pending status
  emit({
    type: 'status',
    interactionId,
    status: 'pending',
    message: 'Agent received request...',
    timestamp: Date.now(),
  })

  await sleep(800)

  // Fixing status
  emit({
    type: 'status',
    interactionId,
    status: 'fixing',
    message: 'Working on it...',
    timestamp: Date.now(),
  })

  // Stream thoughts and actions
  for (let i = 0; i < response.thoughts.length; i++) {
    await sleep(600 + Math.random() * 400)

    emit({
      type: 'thought',
      interactionId,
      content: response.thoughts[i],
      timestamp: Date.now(),
    })

    if (response.actions[i]) {
      await sleep(400 + Math.random() * 300)
      emit({
        type: 'action',
        interactionId,
        action: response.actions[i].action,
        target: response.actions[i].target,
        complete: false,
        timestamp: Date.now(),
      })

      await sleep(800 + Math.random() * 500)
      emit({
        type: 'action',
        interactionId,
        action: response.actions[i].action,
        target: response.actions[i].target,
        complete: true,
        timestamp: Date.now(),
      })
    }
  }

  await sleep(500)

  // Success status
  emit({
    type: 'status',
    interactionId,
    status: 'success',
    message: response.finalMessage,
    timestamp: Date.now(),
  })
}

// Mock fetch handler for /focus endpoint
async function handleFocusRequest(body: string): Promise<Response> {
  const payload = JSON.parse(body)
  const { interactionId, userNote } = payload

  // Start simulating response in background
  simulateAgentResponse(interactionId, userNote)

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

// Create a mock EventSource-like object
function createMockEventSource(url: string): EventSource {
  let _readyState = 1 // OPEN
  let _onopen: ((ev: Event) => void) | null = null
  let _onmessage: ((ev: MessageEvent) => void) | null = null
  let _onerror: ((ev: Event) => void) | null = null

  const callback: SSECallback = (event) => {
    if (_onmessage) {
      _onmessage(new MessageEvent('message', { data: event.data }))
    }
  }

  state.sseCallbacks.add(callback)

  const mockES = {
    get readyState() { return _readyState },
    url,
    get onopen() { return _onopen },
    set onopen(fn: ((ev: Event) => void) | null) { _onopen = fn },
    get onmessage() { return _onmessage },
    set onmessage(fn: ((ev: MessageEvent) => void) | null) { _onmessage = fn },
    get onerror() { return _onerror },
    set onerror(fn: ((ev: Event) => void) | null) { _onerror = fn },
    close: () => {
      _readyState = 2 // CLOSED
      state.sseCallbacks.delete(callback)
    },
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
    withCredentials: false,
    CONNECTING: 0,
    OPEN: 1,
    CLOSED: 2,
  } as unknown as EventSource

  // Trigger onopen after a tick
  setTimeout(() => {
    if (_onopen) {
      _onopen(new Event('open'))
    }
  }, 10)

  return mockES
}

/**
 * Initialize the mock demo service
 * This patches fetch and EventSource to intercept inspector requests
 */
export function initMockDemoService() {
  if (state.isActive) return
  state.isActive = true

  const originalFetch = window.fetch
  const OriginalEventSource = window.EventSource

  // Patch fetch to intercept /focus requests
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url

    // Intercept requests to the bridge
    if (url.includes('localhost:3300') || url.includes('127.0.0.1:3300')) {
      if (url.includes('/focus') && init?.method === 'POST') {
        return handleFocusRequest(init.body as string)
      }
      // Return OK for other bridge requests
      return new Response(JSON.stringify({ ok: true }), { status: 200 })
    }

    return originalFetch(input, init)
  }

  // Patch EventSource to intercept SSE connections
  window.EventSource = class MockEventSource extends OriginalEventSource {
    constructor(url: string | URL, eventSourceInitDict?: EventSourceInit) {
      const urlStr = typeof url === 'string' ? url : url.href

      if (urlStr.includes('localhost:3300') || urlStr.includes('127.0.0.1:3300')) {
        // Return mock EventSource without calling super with invalid URL
        return createMockEventSource(urlStr) as unknown as EventSource
      }

      super(url, eventSourceInitDict)
    }
  } as typeof EventSource

  console.log('[Eyeglass Demo] Mock service initialized - inspector will show simulated responses')
}

/**
 * Check if we should run in demo mode
 */
export function shouldUseDemoMode(): boolean {
  // Use demo mode in production or when explicitly enabled
  return import.meta.env.PROD || import.meta.env.VITE_DEMO_MODE === 'true'
}
