import { useEffect, useRef } from "react";

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;
const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let scriptPromise = null;
function loadScript() {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return scriptPromise;
}

// Cloudflare Turnstile widget. When no site key is configured (local dev),
// renders nothing and the form submits without a token — the Pages Function
// is responsible for enforcing verification in production.
export default function Turnstile({ onToken }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!SITE_KEY) return;
    let widgetId;
    let cancelled = false;
    loadScript().then(() => {
      if (cancelled || !window.turnstile || !ref.current) return;
      widgetId = window.turnstile.render(ref.current, {
        sitekey: SITE_KEY,
        callback: (token) => onToken(token),
        "expired-callback": () => onToken(""),
        "error-callback": () => onToken(""),
        theme: "light",
      });
    });
    return () => {
      cancelled = true;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [onToken]);

  if (!SITE_KEY) return null;
  return <div ref={ref} className="flex justify-center" />;
}

export const turnstileEnabled = Boolean(SITE_KEY);
