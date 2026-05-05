// ---------- helpers ----------
export function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Very light “component” helpers for consistent UI
export const Comp = {
  btn: (href, label) => `
    <a href="${href}" style="background:#111;color:#fff;padding:12px 18px;text-decoration:none;border-radius:6px;display:inline-block">
      ${escapeHtml(label)}
    </a>
  `,
  p: (text) => `<p>${text}</p>`,
  link: (href, label) =>
    `<a href="${href}" target="_blank">${escapeHtml(label)}</a>`,
};
