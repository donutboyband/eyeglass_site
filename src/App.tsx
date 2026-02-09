import { useEffect, useMemo, useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { NavBar } from "./components/NavBar";
import { HeroSection } from "./components/HeroSection";
import { QuickstartSection } from "./components/QuickstartSection";
import { DemoSection } from "./components/DemoSection";
import { PayloadSection } from "./components/PayloadSection";
import { PackagesSection } from "./components/PackagesSection";
import { FrameworksSection } from "./components/FrameworksSection";
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
    note: "Auto-detects Vite, Next.js, CRA, Remix.",
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
    desc: "Claude Code server that receives snapshots + patches files.",
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

const FRAMEWORKS = [
  { name: "React", note: "Vite, Next.js, CRA" },
  { name: "Vue 3", note: "Vite + CLI" },
  { name: "Vue 2", note: "Bridge back-compat" },
  { name: "Svelte / SvelteKit", note: "Component + style capture" },
  { name: "Vanilla JS", note: "Dom + style snapshot" },
];

function LandingPage({
  installCommand,
  copied,
  onCopy,
  payload,
}: {
  installCommand: string;
  copied: boolean;
  onCopy: () => void;
  payload: string;
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
      <PayloadSection payload={payload} />
      <PackagesSection packages={PACKAGES} />
      <FrameworksSection frameworks={FRAMEWORKS} />
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

  const payload = useMemo(
    () =>
      JSON.stringify(
        {
          component: "PricingCard/Button",
          filePath: "src/components/PricingCard.tsx",
          props: { intent: "primary", size: "lg", children: "Buy now" },
          a11y: { role: "button", name: "Buy now", label: "Primary CTA" },
          geometry: { x: 422, y: 688, width: 180, height: 52 },
          styles: {
            background: "#0ea5e9",
            color: "#0b1222",
            borderRadius: "9999px",
            boxShadow: "0 8px 30px rgba(14, 165, 233, 0.35)",
          },
          frameworks: {
            name: "react",
            componentName: "Button",
            ancestry: ["PricingCard", "Layout"],
          },
          url: "https://eyeglass.dev/demo",
        },
        null,
        2,
      ),
    [],
  );

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
              payload={payload}
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
