export const clientGetCookie = (name) => {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));

  const csrf = match ? decodeURIComponent(match[2]): null;

  return csrf;
};
