const { escapeHtml } = require("./utils");


// A simple layout wrapper you can reuse across all emails
  module.exports = ({ title, bodyHtml, brandName }) => {

  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;line-height:1.55;color:#111;background:#fafafa;padding:24px">
    <div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #eee;border-radius:10px;overflow:hidden">
      <div style="padding:16px 20px;border-bottom:1px solid #eee">
        <h2 style="margin:0;font-size:18px">${escapeHtml(title || brandName)}</h2>
      </div>
      <div style="padding:20px">
        ${bodyHtml}
      </div>
      <div style="padding:14px 20px;border-top:1px solid #eee;color:#666;font-size:12px">
        <p style="margin:0">${escapeHtml(brandName)} • This is an automated message.</p>
      </div>
    </div>
  </div>
  `;
}