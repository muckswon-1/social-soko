

// email/testEmailTemplates.js
const { Comp, escapeHtml } = require("./utils");
const wrapLayout = require("./wrapLayout");

require("dotenv").config();

const BRAND_NAME = process.env.BRAND_NAME || "Social Soko";
const FRONTEND_URL = process.env.FRONTEND_URL || "https://example.com";

// Simple test email
const sendTestEmail = ({ email, message = "This is a test email." }) => {
  const dashboardUrl = `${FRONTEND_URL}/dashboard`;

  // Optional 2-column example:
  const twoColDemo = `
    <table class="email-row" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td class="email-col email-col-6" style="padding-right: 8px;">
          <p><strong>Left Column</strong></p>
          <p class="email-text-muted">This is an example of a left cell.</p>
        </td>
        <td class="email-col email-col-6" style="padding-left: 8px;">
          <p><strong>Right Column</strong></p>
          <p class="email-text-muted">And this is the right cell.</p>
        </td>
      </tr>
    </table>
  `;

  return {
    subject: "🧪 Test Email — Social Soko System Check",
    html: wrapLayout({
      title: "Test Email",
      brandName: BRAND_NAME,
      bodyHtml: [
        Comp.p(`Hello ${escapeHtml(email)},`),
        Comp.p(
          `Your email service is working correctly. Below is your test message:`
        ),
        Comp.p(`<strong>${escapeHtml(message)}</strong>`),

        // Button example
        `<p class="email-mb-lg">${Comp.btn(
          dashboardUrl,
          "Open Dashboard"
        )}</p>`,

        // Link example
        Comp.p(
          `Here is a test link: ${Comp.link(
            "https://socialsoko.com",
            "Visit Social Soko"
          )}`
        ),

        // Two-column example
        `<h3 style="margin-top:24px;margin-bottom:12px;font-family:'Saira',sans-serif;">Two-Column Layout Demo</h3>`,
        twoColDemo,

        Comp.p(
          `If this email looks correct, your template system, layout system, and SMTP configuration are working properly.`
        ),
        Comp.p(`Best regards,`),
        Comp.p(`The ${escapeHtml(BRAND_NAME)} Team`),
      ].join(""),
    }),
  };
};

// Export short + namespaced keys
module.exports = {
  testBasic: sendTestEmail,
  "test.basic": sendTestEmail,
};
