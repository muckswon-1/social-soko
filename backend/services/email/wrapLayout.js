// email/wrapLayout.js
const { escapeHtml } = require("./utils");

/**
 * Shared email layout wrapper
 *
 * @param {Object} opts
 * @param {string} [opts.title]
 * @param {string} opts.bodyHtml - inner HTML for the main content
 * @param {string} [opts.brandName]
 * @returns {string} full HTML email document
 */
function wrapLayout({ title, bodyHtml, brandName }) {
  const safeBrand = escapeHtml(brandName || "Social Soko");
  const safeTitle = escapeHtml(title || brandName || "Notification");

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${safeTitle}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      /* ==========================
         Base & Theme
         ========================== */

      html, body {
        margin: 0;
        padding: 0;
      }

      body {
        background-color: #f6f7fb;
        color: #000000;
        font-family: "Nunito", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        -webkit-font-smoothing: antialiased;
        line-height: 1.5;
      }

      img {
        border: 0;
        outline: none;
        text-decoration: none;
        max-width: 100%;
        display: block;
      }

      a {
        color: #007bff;
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }

      /* ==========================
         Layout Shell
         ========================== */

      .email-root {
        width: 100%;
        background-color: #f6f7fb;
        padding: 24px 12px;
      }

      .email-container {
        width: 100%;
        max-width: 640px;
        margin: 0 auto;
      }

      .email-card {
        background-color: #ffffff;
        border-radius: 14px;
        padding: 24px 24px 28px;
        box-shadow: 0 8px 26px rgba(0, 0, 0, 0.06);
      }

      /* ==========================
         Header / Footer
         ========================== */

      .email-header {
        text-align: center;
        padding-bottom: 16px;
        border-bottom: 1px solid #eeeeee;
        margin-bottom: 16px;
      }

      .email-header__brand {
        font-family: "Saira", system-ui, sans-serif;
        font-size: 20px;
        font-weight: 700;
        margin: 0;
      }

      .email-header__subtitle {
        font-size: 13px;
        color: rgba(0, 0, 0, 0.65);
        margin: 4px 0 0 0;
      }

      .email-title {
        font-family: "Saira", system-ui, sans-serif;
        font-size: 20px;
        margin: 0 0 12px 0;
      }

      .email-footer {
        text-align: center;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.65);
        padding-top: 16px;
        border-top: 1px solid #eeeeee;
        margin-top: 24px;
      }

      /* ==========================
         Typography & Utilities
         ========================== */

      .email-text-muted {
        color: rgba(0, 0, 0, 0.65);
        font-size: 13px;
      }

      .email-body p {
        margin: 0 0 16px 0;
        font-size: 14px;
      }

      .email-mb-xs { margin-bottom: 4px; }
      .email-mb-sm { margin-bottom: 8px; }
      .email-mb-md { margin-bottom: 16px; }
      .email-mb-lg { margin-bottom: 24px; }

      /* ==========================
         Buttons & Links
         ========================== */

      .email-btn-primary {
        display: inline-block;
        padding: 10px 18px;
        border-radius: 6px;
        background-color: #ffcc00; /* action yellow */
        color: #000000 !important;
        font-weight: 600;
        font-size: 14px;
        text-decoration: none;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
      }

      .email-btn-primary:hover {
        text-decoration: none;
      }

      .email-link-cta {
        color: #007bff;
        font-weight: 600;
        font-size: 14px;
      }

      /* ==========================
         Grid / Columns (table-based)
         ========================== */

      .email-row {
        width: 100%;
        margin-bottom: 16px;
      }

      .email-col {
        vertical-align: top;
      }

      /* Two-column 50/50 */
      @media screen and (min-width: 601px) {
        .email-col-6 {
          width: 50% !important;
        }
      }

      @media screen and (max-width: 600px) {
        .email-col-6 {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
        }
      }

      /* Optional flex helper (progressive enhancement only) */
      .email-flex {
        display: flex;
        gap: 16px;
      }

      @media screen and (max-width: 600px) {
        .email-flex {
          flex-direction: column;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-root">
      <div class="email-container">
        <div class="email-card">
          <div class="email-header">
            <p class="email-header__brand">${safeBrand}</p>
            <p class="email-header__subtitle email-text-muted">
              ${safeTitle}
            </p>
          </div>

          <div class="email-body">
            ${bodyHtml}
          </div>

          <div class="email-footer">
            <p class="email-text-muted" style="margin: 0;">
              ${safeBrand} &bull; This is an automated message. Please do not reply.
            </p>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>`;
}

module.exports = wrapLayout;
