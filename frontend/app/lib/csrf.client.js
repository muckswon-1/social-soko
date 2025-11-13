export const clientGetCookie = (name) => {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));

  const csrf = match ? decodeURIComponent(match[2]): null;

  return csrf;
};


export function clientSetCookie(name, value, options = {}) {
  if (typeof document === "undefined") return;
  const optionsWithDefaults = {
    path: "/",
    ...options,
    sameSite: "lax",
    secure: false,

  };

  const expires = new Date(Date.now() + optionsWithDefaults.expires * 864e5).toUTCString();

  const cookieValue = encodeURIComponent(value) + (expires ? `; expires=${expires}` : "") + (optionsWithDefaults.path ? `; path=${optionsWithDefaults.path}` : "") + (optionsWithDefaults.domain ? `; domain=${optionsWithDefaults.domain}` : "") + (optionsWithDefaults.sameSite ? `; SameSite=${optionsWithDefaults.sameSite}` : "Lax") + (optionsWithDefaults.secure ? `; Secure` : "");

  document.cookie = name + "=" + cookieValue;
}
