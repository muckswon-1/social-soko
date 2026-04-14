// app/lib/csrf.server.js

/**
 * Extract a cookie value from a raw `Cookie` header string.
 *
 * - Used only in server-side actions/loaders.
 * - Supports cookie names that contain regex special characters.
 *
 * @param {string} name - The cookie name (e.g., "XSRF-TOKEN")
 * @param {string} [cookieHeader=""] - The raw Cookie header from the request
 * @returns {string | null} The decoded cookie value or null if not present
 */
export  function serverGetCookieFromHeader(name, cookieHeader = "") {
  if(typeof name !== "string" || !name.length) return null;

  if(!cookieHeader || typeof cookieHeader !== "string") return null;

   // Escape regex special characters in the cookie name
  const escapedName = name.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");

   // Regex to match "<name>=<value>" in a Cookie header
  const regex = new RegExp(`(?:^|;\\s*)${escapedName}=([^;]*)`);

  const match = cookieHeader.match(regex);

  if(!match || match.length < 2) return null;

  try {
    return decodeURIComponent(match[1])
  } catch (error) {
    console.warn("[serverGetCookieFromHeader] Decode error:", e);
    return match[1]; // return raw value as fallback
  }

}


/**
 * Extracts `Set-Cookie` headers from an Axios response and returns a
 * `Headers` object suitable for Remix/React-Router server `Response`.
 *
 * @param {import("axios").AxiosResponse<any>} response - Axios response from server API
 * @returns {Headers | null} - Headers containing forwarded cookies, or null if none
 */
export function serverSetCookieToHeader(response) {
  if (!response || !response.headers) return null;

  /** @type {string[] | string | undefined} */
  const setCookie = response.headers["set-cookie"];
  if (!setCookie) return null;

  const headers = new Headers();

  // Axios returns set-cookie as either an array or a string depending on environment
  if (Array.isArray(setCookie)) {
    for (const cookie of setCookie) {
      if (cookie && typeof cookie === "string") {
        headers.append("Set-Cookie", cookie);
      }
    }
  } else if (typeof setCookie === "string") {
    headers.append("Set-Cookie", setCookie);
  }

  return headers;
}

