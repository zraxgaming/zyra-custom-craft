import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/enhanced-animations.css";

// Add this right after imports for diagnostics:
if (typeof window !== "undefined") {
  // Log React singleton diagnostic
  if ((window as any).__REACT_SINGLETON_MARK == null) {
    (window as any).__REACT_SINGLETON_MARK = Math.random();
    console.log("[main.tsx] React singleton mark set.");
  } else {
    console.warn("[main.tsx] Multiple React instances detected!");
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
