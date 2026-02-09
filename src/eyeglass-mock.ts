/**
 * Eyeglass demo bridge mock.
 * Intercepts inspector network calls so the on-page inspector works without Claude or a real backend.
 */

const BRIDGE_URL = 'http://localhost:3300';

const originalFetch = window.fetch;
const originalEventSource = window.EventSource;

type Status = 'pending' | 'fixing' | 'success' | 'failed';

interface ActivityPayload {
  type: 'status';
  interactionId: string;
  status: Status;
  message?: string;
}

const eventSources = new Set<MockEventSource>();

class MockEventSource extends EventTarget {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSED = 2;

  readonly CONNECTING = MockEventSource.CONNECTING;
  readonly OPEN = MockEventSource.OPEN;
  readonly CLOSED = MockEventSource.CLOSED;

  readonly url: string;
  readonly withCredentials = false;
  readyState = MockEventSource.OPEN;
  onopen: ((ev: Event) => any) | null = null;
  onmessage: ((ev: MessageEvent) => any) | null = null;
  onerror: ((ev: Event) => any) | null = null;

  constructor(url: string) {
    super();
    this.url = url;
    eventSources.add(this);
    // Immediately signal open
    queueMicrotask(() => this.onopen?.(new Event('open')));
  }

  close(): void {
    this.readyState = MockEventSource.CLOSED;
    eventSources.delete(this);
  }
}

function emitActivity(activity: ActivityPayload) {
  const envelope = { type: 'activity', payload: activity };
  eventSources.forEach((es) => {
    if (es.readyState !== MockEventSource.OPEN) return;
    const ev = new MessageEvent('message', { data: JSON.stringify(envelope) });
    es.onmessage?.(ev);
    es.dispatchEvent(ev);
  });
}

function scheduleDemoFlow(interactionId: string, userNote: string) {
  const steps: Array<ActivityPayload & { delay: number }> = [
    { type: 'status', status: 'pending', message: 'Received request', delay: 120, interactionId },
    { type: 'status', status: 'fixing', message: `Applying change: ${userNote}`, delay: 900, interactionId },
    { type: 'status', status: 'success', message: 'Done. Preview updated. Auto-commit ready.', delay: 1600, interactionId },
  ];

  steps.reduce((acc, step) => {
    const t = acc + step.delay;
    window.setTimeout(() => emitActivity({ ...step, interactionId }), t);
    return t;
  }, 0);
}

// Patch fetch to intercept bridge calls
window.fetch = async (input, init) => {
  const url =
    typeof input === 'string'
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url;

  if (url.startsWith(BRIDGE_URL)) {
    const path = url.slice(BRIDGE_URL.length);

    if (path.startsWith('/focus')) {
      const bodyText = init?.body ? init.body.toString() : '{}';
      try {
        const payload = JSON.parse(bodyText);
        scheduleDemoFlow(payload.interactionId, payload.userNote ?? 'demo request');
      } catch {
        // ignore parse issues
      }
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (path.startsWith('/commit') || path.startsWith('/undo') || path.startsWith('/answer')) {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Anything else: no-op success
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return originalFetch(input as any, init);
};

// Patch EventSource for SSE
window.EventSource = function (url: string) {
  if (url.startsWith(BRIDGE_URL)) {
    return new MockEventSource(url) as unknown as EventSource;
  }
  // Fallback to real EventSource for other URLs
  return new originalEventSource(url);
} as unknown as typeof EventSource;

// Expose originals for potential debugging
// @ts-ignore
window.__eyeglassMock = { originalFetch, originalEventSource };
