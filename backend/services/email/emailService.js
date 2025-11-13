const UTILS = require("../../utils/utils");
const authEmailTemplates = require("./authEmailTemplates");
const businessEmailTemplates = require("./businessEmailTemplates");
const wrapLayout = require("./wrapLayout");
wrapLayout;

require("dotenv").config();

// ---------- template registry ----------
// Each template returns { subject, html } given props

const templates = {
  ...authEmailTemplates,
  ...businessEmailTemplates,
};

// -------------------------- Service API ------------------

/**
 * @params {Object} opts
 * @params {string} opts.to
 * @params {string} opts.template
 * @params {Object} opts.props - Key in the template map
 * @params {strinf} [opts.overrideSubject] - optional subject override
 */

async function sendTemplatedEmail({
  to,
  template,
  props = {},
  ovverideSubject,
}) {
  if (!to) throw new Error("Missing 'to");
  if (!templates[template]) throw new Error(`Unknown template:${template}`);

  const { subject, html } = templates[template](props);
  const finalSubject = ovverideSubject || subject;

  await UTILS.sendEmail(to, finalSubject, html);

  return { success: true };
}

/**
 * Send a raw email (when you already built HTML yourself).
 * Applies the layout if you pass { wrap: true }.
 */
async function sendEmailRaw({ to, subject, html, wrap = false, title }) {
  if (!to || !subject || !html) throw new Error("Missing to/subject/html");
  const finalHtml = wrap
    ? wrapLayout({ title: title || subject, bodyHtml: html })
    : html;
  await UTILS.sendEmail(to, subject, finalHtml);
  return { success: true };
}

module.exports = {
  sendTemplatedEmail,
  sendEmailRaw,
  templates,
};
