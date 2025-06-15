
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const CUSTOMER_SCRIPT_ID = "cxgenie-customer";
const ADMIN_SCRIPT_ID = "cxgenie-admin";
const CUSTOMER_AID = "20e09bff-5f67-4e13-9a7d-cf5a52562cd4";
const ADMIN_AID = "e1b77217-241a-418e-a51f-d6fa7d02d5e6";

function isAdminRoute(pathname: string) {
  // Covers /admin and all nested admin routes
  return pathname.startsWith("/admin");
}

/**
 * Injects the appropriate cxgenie chat widget script.
 * Only includes one at a time and cleans up when switching.
 */
export default function CxgenieChatWidget() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Cleanup both widgets before injecting
    const existingCustomer = document.getElementById(CUSTOMER_SCRIPT_ID);
    if (existingCustomer) existingCustomer.remove();
    const existingAdmin = document.getElementById(ADMIN_SCRIPT_ID);
    if (existingAdmin) existingAdmin.remove();

    // Add correct widget
    const script = document.createElement("script");
    script.async = true;
    script.type = "text/javascript";

    if (isAdminRoute(pathname)) {
      script.src = "https://widget.cxgenie.ai/widget.js";
      script.setAttribute("data-aid", ADMIN_AID);
      script.setAttribute("data-lang", "en");
      script.id = ADMIN_SCRIPT_ID;
    } else {
      script.src = "https://widget.cxgenie.ai/widget.js";
      script.setAttribute("data-aid", CUSTOMER_AID);
      script.setAttribute("data-lang", "en");
      script.id = CUSTOMER_SCRIPT_ID;
    }

    document.body.appendChild(script);

    // Remove on unmount or path change, to avoid duplicates
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [pathname]);

  return null;
}
