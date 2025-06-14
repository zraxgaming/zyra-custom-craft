
// Use the exact same React import everywhere
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/enhanced-animations.css";

// --- Runtime guard for duplicate React instances with more diagnostic logging ---
if (typeof window !== "undefined") {
  if ((window as any).__REACT_SINGLETON__ && (window as any).__REACT_SINGLETON__ !== React) {
    // Log relevant info about both instances
    console.error(
      "[main.tsx] Multiple React instances detected! This causes fatal hook errors and blank screens. " +
      "Try deleting node_modules and lock files, then reinstall. " +
      "Check Vite aliases and npm ls react."
    );
    console.error("[main.tsx] window.__REACT_SINGLETON__:", (window as any).__REACT_SINGLETON__);
    console.error("[main.tsx] This React instance:", React);
    // Extra: Try to dump relevant React version info if available
    try {
      console.info("window.__REACT_SINGLETON__.version:", (window as any).__REACT_SINGLETON__.version);
      console.info("This React instance version:", (React as any).version);
    } catch (e) { /* ignore */ }
  } else {
    (window as any).__REACT_SINGLETON__ = React;
    if ((React as any).version) {
      console.info(`[main.tsx] Using React version: ${(React as any).version}`);
    }
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
