const { Comp, escapeHtml } = require("./utils");
const wrapLayout = require("./wrapLayout");

require("dotenv");

const FRONTEND_URL = process.env.FRONTEND_URL;
const BRAND_NAME = process.env.BRAND_NAME;

// send business created successfully
const sendBussinessCreatedSuccessful = ({ email }) => {
  return {
    subject: "Business created successfully",
    html: wrapLayout({
      title: "Business created successfully",
      bodyHtml: [
        Comp.p(`Hello ${escapeHtml(email)},`),
        Comp.p(
          `Your business has been created successfully. You can now start using our platform to manage your business.`,
        ),
      ].join(""),
      brandName: BRAND_NAME,
    }),
  };
};


const sendBusinessVerificationFailed = ({
  email,
  reasons = [],
  // later you could pass businessName, businessId, etc.
}) => {
  const dashboardUrl = `${FRONTEND_URL}/dashboard`;

  let reasonsHtml = "";

  if (Array.isArray(reasons) && reasons.length > 0) {
    reasonsHtml =
      "<ul>" +
      reasons
        .map((reason) => `<li>${escapeHtml(String(reason))}</li>`)
        .join("") +
      "</ul>";
  } else {
    reasonsHtml = Comp.p(
      `Our system could not verify your business at this time. Please review your business details and try again.`
    );
  }

  return {
    subject: "Your business could not be verified yet",
    html: wrapLayout({
      title: "Business Verification Incomplete",
      bodyHtml: [
        Comp.p(`Hello ${escapeHtml(email)},`),
        Comp.p(
          `We reviewed your business information but couldn't verify your business yet. To keep our marketplace safe and trustworthy, we require a few details before we can complete verification.`
        ),
        Comp.p(`Here’s what we found:`),
        reasonsHtml,
        Comp.p(
          `Please update your business profile with the missing or incorrect information, then try verification again from your dashboard.`
        ),
        `<p style="margin:24px 0">${Comp.btn(
          dashboardUrl,
          "Go to your dashboard"
        )}</p>`,
        Comp.p(
          `If you believe this is a mistake or have any questions, feel free to reply to this email and our team will be happy to help.`
        ),
        Comp.p(`Best regards,`),
        Comp.p(`The ${BRAND_NAME} Team`),
      ].join(""),
      brandName: BRAND_NAME,
    }),
  };
};

/**
 * Business verified email
 *
 * Confirms that the business has been successfully verified.
 */
const sendBusinessVerified = ({ email }) => {
  const dashboardUrl = `${FRONTEND_URL}/dashboard`;

  return {
    subject: "Your business has been verified",
    html: wrapLayout({
      title: "Business Verified",
      bodyHtml: [
        Comp.p(`Hello ${escapeHtml(email)},`),
        Comp.p(
          `Good news! Your business has been successfully verified on ${escapeHtml(
            BRAND_NAME || "our platform"
          )}.`
        ),
        Comp.p(
          `You can now access all features that require a verified business profile. This may include increased visibility, higher trust with buyers and partners, and additional tools as we roll out more features.`
        ),
        `<p style="margin:24px 0">${Comp.btn(
          dashboardUrl,
          "View your business"
        )}</p>`,
        Comp.p(
          `If you didn’t request this or believe something is wrong, please reply to this email immediately so we can review your account.`
        ),
        Comp.p(`Best regards,`),
        Comp.p(`The ${BRAND_NAME} Team`),
      ].join(""),
      brandName: BRAND_NAME,
    }),
  };
};

const sendBusinessVerificationRequested = ({ email }) => {
  const dashboardUrl = `${FRONTEND_URL}/dashboard`;

  return {
    subject: "Your business verification request has been sent",
    html: wrapLayout({
      title: "Verification Request Submitted",
      bodyHtml: [
        Comp.p(`Hello ${escapeHtml(email)},`),

        Comp.p(
          `We've received your business verification request and our team is now reviewing your details.`
        ),

        Comp.p(
          `Verification usually takes <strong>1–3 business days</strong>. We’ll notify you by email once the review is complete.`
        ),

        `<p style="margin:24px 0">${Comp.btn(
          dashboardUrl,
          "Go to your dashboard"
        )}</p>`,

        Comp.p(
          `If you need to update your business details or upload missing information, you can return to your dashboard at any time.`
        ),

        Comp.p(`Best regards,`),
        Comp.p(`The ${BRAND_NAME} Team`),
      ].join(""),
      brandName: BRAND_NAME,
    }),
  };
};




module.exports = {
  businessCreated: sendBussinessCreatedSuccessful,
  businessVerified: sendBusinessVerified,
  businessVerificationFailed: sendBusinessVerificationFailed,
  businessVerificationRequested: sendBusinessVerificationRequested,

};
