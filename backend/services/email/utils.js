// ---------- helpers ----------
 function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
// Very light “component” helpers for consistent UI
const Comp = {
  btn: (href, label) => `
    <a href="${href}" class="email-btn-primary">
      ${escapeHtml(label)}
    </a>
  `,

  p: (text) => `
    <p class="email-mb-md">
      ${text}
    </p>
  `,

  link: (href, label) =>
    `<a href="${href}" target="_blank" class="email-link-cta">${escapeHtml(label)}</a>`,
};

module.exports = {
  Comp,
  escapeHtml,
  escapeHtml
};
