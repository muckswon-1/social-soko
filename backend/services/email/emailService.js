

const UTILS = require("../../utils/utils");
const authEmailTemplates = require("./authEmailTemplates");
const businessEmailTemplates = require("./businessEmailTemplates");
const postEmailTemplates = require("./postEmailTemplates");
const testEmailTemplates = require('./testEmailTemplate');
const wrapLayout = require("./wrapLayout");

require("dotenv").config();

// ---------- Template registry ----------
// Each template returns { subject, html } given props
// Keys include both short and namespaced forms, e.g.:
// - "passwordReset", "auth.passwordReset"
// - "businessCreated", "business.created"
// - "testBasic", "test.basic"
const templates = {
  ...authEmailTemplates,
  ...businessEmailTemplates,
  ...testEmailTemplates,
  ...postEmailTemplates,
};





// -------------------------- Service API ------------------

/**
 * Send an email using a named template.
 *
 * @param {Object} opts
 * @param {string} opts.to                    - Recipient email address
 * @param {string} opts.template              - Template key in the registry
 * @param {Object} [opts.props]               - Props passed to the template function
 * @param {string} [opts.overrideSubject]     - Optional subject override
 *
 * @returns {Promise<{success: boolean}>}
 */
async function sendTemplatedEmail({
  to,
  template,
  props = {},
  overrideSubject,
}) {
  if (!to) {
    throw new Error("sendTemplatedEmail: missing 'to' address");
  }

  const templateFn = templates[template];

  if (!templateFn) {
    console.log("Available templates:", Object.keys(templates));
    throw new Error(`sendTemplatedEmail: unknown template "${template}"`);
  }

  const { subject, html } = templateFn(props);

  if (!subject || !html) {
    throw new Error(
      `sendTemplatedEmail: template "${template}" did not return subject/html`,
    );
  }

  const finalSubject = overrideSubject || subject;

  await UTILS.sendEmail(to, finalSubject, html);

  return { success: true };
}

/**
 * Send a raw email (when you already built HTML yourself).
 * If wrap = true, the HTML will be wrapped in the shared layout.
 *
 * @param {Object} opts
 * @param {string} opts.to         - Recipient email address
 * @param {string} opts.subject    - Subject line
 * @param {string} opts.html       - Raw HTML body (inner content)
 * @param {boolean} [opts.wrap]    - Whether to wrap in the standard layout
 * @param {string} [opts.title]    - Optional title for the layout when wrap = true
 *
 * @returns {Promise<{success: boolean}>}
 */
async function sendEmailRaw({ to, subject, html, wrap = false, title }) {
  if (!to || !subject || !html) {
    throw new Error("sendEmailRaw: missing to/subject/html");
  }

  const finalHtml = wrap
    ? wrapLayout({
        title: title || subject,
        bodyHtml: html,
      })
    : html;

  await UTILS.sendEmail(to, subject, finalHtml);

  return { success: true };
}

module.exports = {
  sendTemplatedEmail,
  sendEmailRaw,
  templates,
};
