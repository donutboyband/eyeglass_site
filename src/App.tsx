import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { NavBar } from "./components/NavBar";
import { HeroSection } from "./components/HeroSection";
import { QuickstartSection } from "./components/QuickstartSection";
import { DemoSection } from "./components/DemoSection";

import { PackagesSection } from "./components/PackagesSection";

import { FooterSection } from "./components/FooterSection";
import { DocsLayout } from "./components/docs/DocsLayout";
import { GettingStarted } from "./components/docs/pages/GettingStarted";
import { Installation } from "./components/docs/pages/Installation";
import { CoreConcepts } from "./components/docs/pages/CoreConcepts";
import { McpIntegration } from "./components/docs/pages/McpIntegration";
import { Features } from "./components/docs/pages/Features";
import { Advanced } from "./components/docs/pages/Advanced";
import { Packages } from "./components/docs/pages/Packages";
import { Community } from "./components/docs/pages/Community";

const INSTALL_COMMAND = "npx @eyeglass/cli init";

const QUICKSTART = [
  {
    title: "Install + scaffold",
    code: INSTALL_COMMAND,
    note: "Auto-detects and sets up the provider. Works best with Vite.",
  },
  {
    title: "Watch & edit",
    code: "eyeglass wait_for_request",
    note: "HMR + auto-commit on every AI change.",
  },
];

const PACKAGES = [
  {
    name: "@eyeglass/inspector",
    tag: "~57kb",
    desc: "Web Component that captures selections + metadata.",
  },
  {
    name: "@eyeglass/bridge",
    tag: "MCP",
    desc: "MCP or HTTP server that receives snapshots + patches files.",
  },
  {
    name: "@eyeglass/cli",
    tag: "Setup",
    desc: "Single command bootstrap with framework detection.",
  },
  {
    name: "@eyeglass/types",
    tag: "TS",
    desc: "Shared interfaces for inspectors, bridge, and clients.",
  },
];



function LandingPage({
  installCommand,
  copied,
  onCopy,
}: {
  installCommand: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <>
      <HeroSection
        installCommand={installCommand}
        copied={copied}
        onCopy={onCopy}
      />
      <DemoSection />
      <QuickstartSection items={QUICKSTART} />
      <PackagesSection packages={PACKAGES} />
      <FooterSection />
    </>
  );
}

function App() {
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(
    () =>
      (localStorage.getItem("eyeglass_theme") as "dark" | "light") || "dark",
  );

  const copyCommand = () => {
    navigator.clipboard.writeText(INSTALL_COMMAND);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("eyeglass_theme", next);
      return next;
    });
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="app">
      <NavBar theme={theme} toggleTheme={toggleTheme} />
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              installCommand={INSTALL_COMMAND}
              copied={copied}
              onCopy={copyCommand}
            />
          }
        />
        <Route path="/docs" element={<DocsLayout />}>
          <Route index element={<GettingStarted />} />
          <Route path="installation" element={<Installation />} />
          <Route path="concepts" element={<CoreConcepts />} />
          <Route path="mcp" element={<McpIntegration />} />
          <Route path="features" element={<Features />} />
          <Route path="advanced" element={<Advanced />} />
          <Route path="packages" element={<Packages />} />
          <Route path="community" element={<Community />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
