// app/lib/csrf.server.js
export function getCookieFromHeader(name, cookieHeader = "") {
  if (!cookieHeader) return null;

  const escaped = name.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
  const match = cookieHeader.match(
    new RegExp("(^|; )" + escaped + "=([^;]*)")
  );

  return match ? decodeURIComponent(match[2]) : null;
}
