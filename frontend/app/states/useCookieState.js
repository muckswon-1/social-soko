// app/states/useCookieState.js
import { useEffect, useRef, useState } from "react";

// Safe cookie readers/writers (no-ops on server)
function readCookie(name) {
  if (typeof document === "undefined") return null;
  const pattern = new RegExp(
    "(?:^|; )" + name.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&") + "=([^;]*)"
  );
  const match = document.cookie.match(pattern);
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name, value, { days = 30, path = "/" } = {}) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=${path}; SameSite=Lax`;
}

export function useCookieState(key, initialValue) {
  // 1) SSR-safe: start from initialValue on the server
  const [state, setState] = useState(initialValue);
  const mounted = useRef(false);

  // 2) Hydrate from cookie only on the client
  useEffect(() => {
    const raw = readCookie(key);
    if (raw != null) {
      try {
        setState(JSON.parse(raw));
      } catch {
        // handle plain string values
        if (raw === "true") setState(true);
        else if (raw === "false") setState(false);
        else setState(raw);
      }
    }
    mounted.current = true;
  }, [key]);

  // 3) Write cookie on changes (after mount only)
  useEffect(() => {
    if (!mounted.current) return;
    writeCookie(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}
