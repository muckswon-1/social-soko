const UTILS = require('../utils/utils');

require('dotenv').config();


    const BRAND_NAME = process.env.BRAND_NAME;
    const FRONTEND_URL = process.env.FRONTEND_URL;

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
    <a href="${href}" style="background:#111;color:#fff;padding:12px 18px;text-decoration:none;border-radius:6px;display:inline-block">
      ${escapeHtml(label)}
    </a>
  `,
  p: (text) => `<p>${text}</p>`,
  link: (href, label) => `<a href="${href}" target="_blank">${escapeHtml(label)}</a>`,
};


// A simple layout wrapper you can reuse across all emails
function wrapLayout({ title, bodyHtml }) {
  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;line-height:1.55;color:#111;background:#fafafa;padding:24px">
    <div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #eee;border-radius:10px;overflow:hidden">
      <div style="padding:16px 20px;border-bottom:1px solid #eee">
        <h2 style="margin:0;font-size:18px">${escapeHtml(title || BRAND_NAME)}</h2>
      </div>
      <div style="padding:20px">
        ${bodyHtml}
      </div>
      <div style="padding:14px 20px;border-top:1px solid #eee;color:#666;font-size:12px">
        <p style="margin:0">${escapeHtml(BRAND_NAME)} • This is an automated message.</p>
      </div>
    </div>
  </div>
  `;
}


// ---------- template registry ----------
// Each template returns { subject, html } given props

const templates = {
    //Password reset
    sendPasswordResetEmail: ({email, token, expiresInMinutes=60}) => {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

        return {
            subject: 'Password Reset Request',
            html: wrapLayout({
                title: 'Reset Your Password',
                bodyHtml: [
                    Comp.p(`Hello ${escapeHtml(email)},`),
                    Comp.p(`We received a request to reset your password. Click the link below to reset it. This link will expire in <strong>${expiresInMinutes} minutes</strong>.`),
                    Comp.p(Comp.link(resetUrl, "Reset Password")),
                ].join("")
            })
        }

    },

    // Password reset Successful
    sendPasswordResetSuccessEmail: ({email, loginUrl=`${process.env.FRONTEND_URL}/login`}) => ({

        subject: `Password Reset Successful`,
        html: wrapLayout({
            title: 'Password Reset Successful',
            bodyHtml:[
                Comp.p(`Hello ${escapeHtml(email)},`),
                Comp.p(`Your password has been successfully reset. You can now log in with your new password. `),
                Comp.p(Comp.link(loginUrl,"Click here to login"))
            ].join("")
        }),
    }),


    // Send 6 digit code email
    sendSixDigitCodeEmail:({email,code, expiresInMinutes}) => {
      return {
        subject: `Verification Code`,
        html: wrapLayout({
          title: 'Verification Code',
          bodyHtml: [
             Comp.p(`Hello ${escapeHtml(email)},`),

                    Comp.p(`Your verification digit code is: <strong>${code}</strong> The code will expire in <strong>${expiresInMinutes} minutes</strong>.`),
          ].join("")
        })
      }
    },

    //Verify Email
    sendVerifyEmail: ({email, selector, token, expiresInMinutes=60}) => {
        const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

        return {

            subject: `Verify Your Email Address`,

            html: wrapLayout({
                title: 'Verify Your Email Address',
                bodyHtml: [

                    Comp.p(`Hello ${escapeHtml(email)},`),

                    Comp.p(`Please click the button below to verify your email address. This link will expire in <strong>${expiresInMinutes} minutes</strong>.`),

                    `<p style="margin:24px 0">${Comp.btn(verifyUrl, "Verify email")}</p>`,
                    Comp.p(`If the button doesn't work, copy and paste this URL into your browser:`),
          Comp.p(Comp.link(verifyUrl, verifyUrl)),
          `<p style="color:#666">If you didn't request this, you can safely ignore this email.</p>`,
                ].join("")
            
        })
    }
    },

    // email successfully verifed
    sendEmailVerificationSuccessful:({email}) => {
       return {

            subject: `Email Verification Successful`,

            html: wrapLayout({

                title: 'Email Verification Successful',

                bodyHtml: [

                    Comp.p(`Hello ${escapeHtml(email)},`),

                    Comp.p(`Your email address has been successfully verified.`),

                    Comp.p(`You can now log in to your account.`),

                    Comp.p(`If you have any questions, feel free to reply to this email.`),
                    Comp.p(`Best regards,`),
                    Comp.p(`The ${BRAND_NAME} Team`),
                    Comp.p(Comp.link(`${FRONTEND_URL}/login`, "Log in")),
                ].join("")
              })
            }
    },

    //send email updated
    sendEmailUpdated: ({email}) => {

        return {
           subject: `Your Email Address Has Been Updated`,

            html: wrapLayout({

                title: 'Email Address Updated',

                bodyHtml: [

                    Comp.p(`Hello ${escapeHtml(email)},`),

                    Comp.p(`Your email address has been successfully updated.`),

                    Comp.p(`If you did not make this change, please contact us immediately.`),

                    Comp.p(`If you have any questions, feel free to reply to this email.`),
                    Comp.p(`Best regards,`),
                    Comp.p(`The ${BRAND_NAME} Team`),
                    Comp.p(Comp.link(`${FRONTEND_URL}/dashboard`, "Go to your dashboard")),
                    Comp.p(Comp.link(`${FRONTEND_URL}/contact`, "Contact Us")),
                    Comp.p(Comp.link(`${FRONTEND_URL}/support`, "Support")),
                    Comp.p(Comp.link(`${FRONTEND_URL}/privacy`, "Privacy Policy")),
                    Comp.p(Comp.link(`${FRONTEND_URL}/terms`, "Terms of Service")),
                    Comp.p(Comp.link(`${FRONTEND_URL}/unsubscribe`, "Unsubscribe")),
                ].join("")
              })
            }
          },

                   

    //Welcome
    sendWelcomeEmail: ({email}) => {
        return {
              subject: `Welcome to ${BRAND_NAME}`,
        html: wrapLayout({
            title: "Welcome!",
            bodyHtml:[
                Comp.p(`Hi ${escapeHtml(email)}`),
                Comp.p(`We're excited to have you on board.`),
                Comp.p(Comp.link(`${FRONTEND_URL}/dashboard`, "Go to your dashboard")),
            ].join("")
        })
        }
    }
}



// -------------------------- Service API ------------------


/**
 * @params {Object} opts
 * @params {string} opts.to
 * @params {string} opts.template
 * @params {Object} opts.props - Key in the template map
 * @params {strinf} [opts.overrideSubject] - optional subject override
 */

async function  sendTemplatedEmail({to, template, props = {}, ovverideSubject}) {
    if(!to) throw new Error("Missing 'to");
    if(!templates[template]) throw new Error(`Unknown template:${template}`);

    const {subject, html} = templates[template](props);
    const finalSubject = ovverideSubject || subject

    await UTILS.sendEmail(to, finalSubject, html);

    return {success: true}
}


/**
 * Send a raw email (when you already built HTML yourself).
 * Applies the layout if you pass { wrap: true }.
 */
async function sendEmailRaw({ to, subject, html, wrap = false, title }) {
  if (!to || !subject || !html) throw new Error("Missing to/subject/html");
  const finalHtml = wrap ? wrapLayout({ title: title || subject, bodyHtml: html }) : html;
  await UTILS.sendEmail(to, subject, finalHtml);
  return { success: true };
}



module.exports = {
    sendTemplatedEmail,
    sendEmailRaw,
    templates
}

