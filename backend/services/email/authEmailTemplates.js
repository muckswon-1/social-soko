const { Comp, escapeHtml } = require("./utils");
const wrapLayout = require("./wrapLayout");

require("dotenv").config();

const FRONTEND_URL = process.env.FRONTEND_URL;
const BRAND_NAME = process.env.BRAND_NAME || "Social Soko";

/**
 * Password reset link
 */
const sendPasswordResetLinkEmail = ({
  email,
  token,
  expiresInMinutes = 60,
}) => {
  const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`;

  return {
    subject: "Password Reset Request",
    html: wrapLayout({
      title: "Reset Your Password",
      bodyHtml: [
        Comp.p(`Hello ${escapeHtml(email)},`),
        Comp.p(
          `We received a request to reset your password. Click the link below to reset it. This link will expire in <strong>${expiresInMinutes} minutes</strong>.`,
        ),
        `<p class="email-mb-lg">${Comp.btn(resetUrl, "Reset Password")}</p>`,
        Comp.p(
          `If the button doesn't work, copy and paste this URL into your browser:`,
        ),
        Comp.p(Comp.link(resetUrl, resetUrl)),
      ].join(""),
      brandName: BRAND_NAME,
    }),
  };
};

/**
 * Password reset successful
 */
const sendPasswordResetSuccessEmail = ({
  email,
  loginUrl = `${FRONTEND_URL}/login`,
}) => {
  return {
    subject: `Password Reset Successful`,
    html: wrapLayout({
      title: "Password Reset Successful",
      bodyHtml: [
        Comp.p(`Hello ${escapeHtml(email)},`),
        Comp.p(
          `Your password has been successfully reset. You can now log in with your new password.`,
        ),
        `<p class="email-mb-lg">${Comp.btn(loginUrl, "Log in")}</p>`,
      ].join(""),
      brandName: BRAND_NAME,
    }),
  };
};

/**
 * Six-digit verification code
 */
const sendSixDigitCodeEmail = ({ email, code, expiresInMinutes }) => {
  return {
    subject: `Verification Code`,
    html: wrapLayout({
      title: "Verification Code",
      bodyHtml: [
        Comp.p(`Hello ${escapeHtml(email)},`),
        Comp.p(
          `Your verification digit code is: <strong>${escapeHtml(
            String(code),
          )}</strong>. The code will expire in <strong>${expiresInMinutes} minutes</strong>.`,
        ),
      ].join(""),
      brandName: BRAND_NAME,
    }),
  };
};

/**
 * Verify email link
 */
const sendVerifyEmail = ({ email, token, expiresInMinutes = 60 }) => {
  const verifyUrl = `${FRONTEND_URL}/verify-email?token=${token}`;

  return {
    subject: `Verify Your Email Address`,
    html: wrapLayout({
      title: "Verify Your Email Address",
      bodyHtml: [
        Comp.p(`Hello ${escapeHtml(email)},`),
        Comp.p(
          `Please click the button below to verify your email address. This link will expire in <strong>${expiresInMinutes} minutes</strong>.`,
        ),
        `<p class="email-mb-lg">${Comp.btn(verifyUrl, "Verify email")}</p>`,
        Comp.p(
          `If the button doesn't work, copy and paste this URL into your browser:`,
        ),
        Comp.p(Comp.link(verifyUrl, verifyUrl)),
        `<p class="email-text-muted">If you didn't request this, you can safely ignore this email.</p>`,
      ].join(""),
      brandName: BRAND_NAME,
    }),
  };
};

/**
 * Email successfully verified
 */
const sendEmailVerificationSuccessful = ({ email }) => {
  const loginUrl = `${FRONTEND_URL}/login`;

  return {
    subject: `Email Verification Successful`,
    html: wrapLayout({
      title: "Email Verification Successful",
      bodyHtml: [
        Comp.p(`Hello ${escapeHtml(email)},`),
        Comp.p(`Your email address has been successfully verified.`),
        Comp.p(`You can now log in to your account.`),
        `<p class="email-mb-lg">${Comp.btn(loginUrl, "Log in")}</p>`,
        Comp.p(`If you have any questions, feel free to reply to this email.`),
        Comp.p(`Best regards,`),
        Comp.p(`The ${escapeHtml(BRAND_NAME)} Team`),
      ].join(""),
      brandName: BRAND_NAME,
    }),
  };
};

/**
 * Email updated notification
 */
const sendEmailUpdated = ({ email }) => {
  return {
    subject: `Your Email Address Has Been Updated`,
    html: wrapLayout({
      title: "Email Address Updated",
      bodyHtml: [
        Comp.p(`Hello ${escapeHtml(email)},`),
        Comp.p(`Your email address has been successfully updated.`),
        Comp.p(
          `If you did not make this change, please contact us immediately.`,
        ),
        Comp.p(`If you have any questions, feel free to reply to this email.`),
        Comp.p(`Best regards,`),
        Comp.p(`The ${escapeHtml(BRAND_NAME)} Team`),
        `<p class="email-mb-sm">${Comp.link(
          `${FRONTEND_URL}/dashboard`,
          "Go to your dashboard",
        )}</p>`,
      ].join(""),
      brandName: BRAND_NAME,
    }),
  };
};

/**
 * Welcome email (generic)
 */
const sendWelcomeEmail = ({ email }) => {
  const dashboardUrl = `${FRONTEND_URL}/dashboard`;

  return {
    subject: `Welcome to ${BRAND_NAME}`,
    html: wrapLayout({
      title: "Welcome!",
      bodyHtml: [
        Comp.p(`Hi ${escapeHtml(email)},`),
        Comp.p(`We're excited to have you on board.`),
        `<p class="email-mb-lg">${Comp.btn(dashboardUrl, "Go to your dashboard")}</p>`,
      ].join(""),
      brandName: BRAND_NAME,
    }),
  };
};

/**
 * Registration successful (explicit auth.registerSuccessful)
 * Separate from generic "welcome" if you want different copy later.
 */
const sendRegisterSuccessfulEmail = ({ email }) => {
  const dashboardUrl = `${FRONTEND_URL}/dashboard`;

  return {
    subject: `Your ${BRAND_NAME} account is ready`,
    html: wrapLayout({
      title: "Registration Successful",
      bodyHtml: [
        Comp.p(`Hi ${escapeHtml(email)},`),
        Comp.p(
          `Your account has been created successfully. You can now sign in and start using ${escapeHtml(
            BRAND_NAME,
          )}.`,
        ),
        `<p class="email-mb-lg">${Comp.btn(dashboardUrl, "Go to your dashboard")}</p>`,
        Comp.p(
          `If you did not create this account, please contact our support team.`,
        ),
      ].join(""),
      brandName: BRAND_NAME,
    }),
  };
};

/**
 * Export template map
 *
 * We keep both:
 *  - short keys for backward compatibility (e.g. "passwordReset")
 *  - namespaced keys for clarity (e.g. "auth.passwordReset")
 */
const authEmailTemplates = {
  // Legacy short keys
  passwordReset: sendPasswordResetLinkEmail,
  passwordResetSuccess: sendPasswordResetSuccessEmail,
  sixDigitCode: sendSixDigitCodeEmail,
  verifyEmail: sendVerifyEmail,
  emailVerificationSuccess: sendEmailVerificationSuccessful,
  emailUpdated: sendEmailUpdated,
  welcome: sendWelcomeEmail,
  registerSuccessful: sendRegisterSuccessfulEmail,

  // Namespaced keys
  "auth.passwordReset": sendPasswordResetLinkEmail,
  "auth.passwordResetSuccess": sendPasswordResetSuccessEmail,
  "auth.sixDigitCode": sendSixDigitCodeEmail,
  "auth.verifyEmail": sendVerifyEmail,
  "auth.emailVerificationSuccess": sendEmailVerificationSuccessful,
  "auth.emailUpdated": sendEmailUpdated,
  "auth.welcome": sendWelcomeEmail,
  "auth.registerSuccessful": sendRegisterSuccessfulEmail,
};

module.exports = authEmailTemplates;
