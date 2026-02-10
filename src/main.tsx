import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";

// Initialize mock demo service BEFORE inspector (must use dynamic import)
async function init() {
  const { initMockDemoService, shouldUseDemoMode } = await import('./services/mockDemoService');
  if (shouldUseDemoMode()) {
    initMockDemoService();
  }

  // Now load inspector after mock service is ready
  await import('@eyeglass/inspector');

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  );
}

init();
