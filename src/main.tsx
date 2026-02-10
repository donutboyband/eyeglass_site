// Initialize mock demo service BEFORE inspector (patches fetch/EventSource)
import { initMockDemoService, shouldUseDemoMode } from './services/mockDemoService';
if (shouldUseDemoMode()) {
  initMockDemoService();
}

import '@eyeglass/inspector';
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
