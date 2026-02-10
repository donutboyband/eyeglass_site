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

function emit(type: string, data: Record<string, unknown>) {
  const event = { type, data: JSON.stringify(data) }
  state.sseCallbacks.forEach(cb => cb(event))
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function simulateAgentResponse(interactionId: string, userNote: string) {
  const response = getRandomResponse()

  // Initial pending status
  emit('status', {
    interactionId,
    status: 'pending',
    message: 'Agent received request...',
    timestamp: Date.now(),
  })

  await sleep(800)

  // Fixing status
  emit('status', {
    interactionId,
    status: 'fixing',
    message: 'Working on it...',
    timestamp: Date.now(),
  })

  // Stream thoughts and actions
  for (let i = 0; i < response.thoughts.length; i++) {
    await sleep(600 + Math.random() * 400)

    emit('thought', {
      interactionId,
      content: response.thoughts[i],
      timestamp: Date.now(),
    })

    if (response.actions[i]) {
      await sleep(400 + Math.random() * 300)
      emit('action', {
        interactionId,
        action: response.actions[i].action,
        target: response.actions[i].target,
        complete: false,
        timestamp: Date.now(),
      })

      await sleep(800 + Math.random() * 500)
      emit('action', {
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
  emit('status', {
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
  const mockES = {
    readyState: 1 as number, // OPEN
    url,
    onopen: null as ((ev: Event) => void) | null,
    onmessage: null as ((ev: MessageEvent) => void) | null,
    onerror: null as ((ev: Event) => void) | null,
    close: () => {
      mockES.readyState = 2 // CLOSED
      state.sseCallbacks.delete(callback)
    },
    addEventListener: (type: string, listener: EventListener) => {
      if (type === 'message') {
        state.sseCallbacks.add(listener as unknown as SSECallback)
      }
    },
    removeEventListener: (type: string, listener: EventListener) => {
      if (type === 'message') {
        state.sseCallbacks.delete(listener as unknown as SSECallback)
      }
    },
    dispatchEvent: () => true,
    withCredentials: false,
    CONNECTING: 0,
    OPEN: 1,
    CLOSED: 2,
  } as EventSource

  const callback: SSECallback = (event) => {
    if (mockES.onmessage) {
      mockES.onmessage(new MessageEvent('message', { data: event.data }))
    }
  }

  state.sseCallbacks.add(callback)

  // Trigger onopen after a tick
  setTimeout(() => {
    if (mockES.onopen) {
      mockES.onopen(new Event('open'))
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
    if (url.includes('localhost:3939') || url.includes('127.0.0.1:3939')) {
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

      if (urlStr.includes('localhost:3939') || urlStr.includes('127.0.0.1:3939')) {
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
