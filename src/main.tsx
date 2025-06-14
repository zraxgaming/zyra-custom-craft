
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/enhanced-animations.css";

// --- Runtime guard for duplicate React instances ---
if (typeof window !== "undefined") {
  if ((window as any).__REACT_SINGLETON__ && (window as any).__REACT_SINGLETON__ !== React) {
    // This means two copies of React are loaded!
    console.error(
      "[main.tsx] Multiple React instances detected! This causes fatal hook errors and blank screens. " +
      "Try deleting node_modules and package-lock.json (or bun.lockb/yarn.lock), then reinstall. " +
      "Check Vite aliases and npm ls react."
    );
  } else {
    (window as any).__REACT_SINGLETON__ = React;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

