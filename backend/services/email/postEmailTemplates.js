// email/postEmailTemplates.js
const { Comp, escapeHtml } = require("./utils");
const wrapLayout = require("./wrapLayout");

require("dotenv").config();

const FRONTEND_URL = process.env.FRONTEND_URL;
const BRAND_NAME = process.env.BRAND_NAME || "Social Soko";

/**
 * Truncate helper to keep post excerpts tidy in emails
 * @param {string} value
 * @param {number} maxLength
 * @returns {string}
 */
function truncate(value, maxLength) {
  if (!value) return "";
  if (value.length <= maxLength) return value;
  return value.slice(0, maxLength - 1).trimEnd() + "…";
}

/**
 * Post liked notification
 *
 * @param {Object} params
 * @param {string} params.email - Recipient email
 * @param {string} [params.recipientName] - Recipient display name
 * @param {string} params.actorName - Name of the user who liked the post
 * @param {string} [params.actorAvatarUrl] - Optional avatar URL of the user who liked the post
 * @param {string} [params.postExcerpt] - Short text excerpt of the post
 * @param {string} [params.postUrl] - Absolute URL to the post. If omitted, falls back to FRONTEND_URL.
 * @param {number} [params.totalLikes] - Optional total like count
 * @param {string} [params.manageNotificationsUrl] - Optional URL to manage notification settings
 */
const sendPostLiked = ({
  email,
  recipientName,
  actorName,
  actorAvatarUrl,
  postExcerpt,
  postUrl,
  totalLikes,
  manageNotificationsUrl,
}) => {
  const safeRecipientName = escapeHtml(recipientName || email || "there");
  const safeActorName = escapeHtml(actorName || "Someone");
  const safePostExcerpt = escapeHtml(truncate(postExcerpt || "", 200));

  const safePostUrl = postUrl || FRONTEND_URL || "#";
  const safeManageUrl = manageNotificationsUrl || "";

  let likeSummaryText = "";
  if (typeof totalLikes === "number" && totalLikes > 1) {
    const noun = totalLikes === 2 ? "people" : "others";
    likeSummaryText = `${totalLikes} ${noun} have liked this post`;
  }

  const avatarFallbackInitial = escapeHtml(
    (actorName || "S").trim().charAt(0).toUpperCase(),
  );

  const subject = `${actorName || "Someone"} liked your post`;

  const headerIntro =
    Comp.p(`Hi ${safeRecipientName},`) +
    Comp.p(
      `<strong>${safeActorName}</strong> liked your post on ${escapeHtml(
        BRAND_NAME,
      )}.`,
    );

  const actorBlock = `
    <table class="email-row" role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
      <tr>
        <td class="email-col" style="padding: 0;">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="vertical-align: top; padding-right: 12px;">
                ${
                  actorAvatarUrl
                    ? `
                  <img
                    src="${actorAvatarUrl}"
                    alt="${safeActorName}'s avatar"
                    width="40"
                    height="40"
                    style="border-radius: 999px; object-fit: cover;"
                  />
                `
                    : `
                  <div
                    style="
                      width: 40px;
                      height: 40px;
                      border-radius: 999px;
                      background: #f6f7fb;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      font-weight: 700;
                      font-size: 16px;
                    "
                  >
                    ${avatarFallbackInitial}
                  </div>
                `
                }
              </td>
              <td style="vertical-align: top;">
                <p style="font-size: 14px; margin: 0 0 4px 0;">
                  <strong>${safeActorName}</strong> liked your post.
                </p>
                ${
                  likeSummaryText
                    ? `<p class="email-text-muted" style="font-size: 12px; margin: 0;">
                        ${escapeHtml(likeSummaryText)}
                      </p>`
                    : ""
                }
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  const postPreviewBlock = `
    <div
      class="email-mb-lg"
      style="
        border-radius: 10px;
        border: 1px solid #eeeeee;
        padding: 12px 14px 14px;
        background-color: #fafafa;
        margin-bottom: 20px;
      "
    >
      <p
        class="email-text-muted email-mb-xs"
        style="
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin: 0 0 6px 0;
        "
      >
        Your post
      </p>
      <p style="font-size: 14px; margin: 0 0 12px 0;">
        ${
          safePostExcerpt && safePostExcerpt.trim().length > 0
            ? safePostExcerpt
            : "<em>No text content available.</em>"
        }
      </p>
      ${Comp.btn(safePostUrl, "View post")}
    </div>
  `;

  const footerText =
    Comp.p(
      `Keep your network engaged by replying, sharing an update, or posting a new opportunity.`,
    ) +
    (safeManageUrl
      ? `<p class="email-text-muted" style="font-size: 11px; margin: 12px 0 0 0;">
           You are receiving this because of your activity on ${escapeHtml(
             BRAND_NAME,
           )}.
           <a href="${safeManageUrl}" class="email-link-cta">Manage notification settings</a>.
         </p>`
      : "");

  const html = wrapLayout({
    title: subject,
    bodyHtml: [headerIntro, actorBlock, postPreviewBlock, footerText].join(""),
    brandName: BRAND_NAME,
  });

  return {
    subject,
    html,
  };
};

/**
 * Post commented notification
 *
 * @param {Object} params
 * @param {string} params.email - Recipient email
 * @param {string} [params.recipientName] - Recipient display name
 * @param {string} params.actorName - Name of the user who commented
 * @param {string} [params.actorAvatarUrl] - Optional avatar URL of the commenter
 * @param {string} [params.postExcerpt] - Short text excerpt of the post
 * @param {string} [params.commentExcerpt] - Short text excerpt of the comment
 * @param {string} [params.postUrl] - Absolute URL to the post. If omitted, falls back to FRONTEND_URL.
 * @param {number} [params.totalComments] - Optional total comment count
 * @param {string} [params.manageNotificationsUrl] - Optional URL to manage notification settings
 */
const sendPostCommented = ({
  email,
  recipientName,
  actorName,
  actorAvatarUrl,
  postExcerpt,
  commentExcerpt,
  postUrl,
  totalComments,
  manageNotificationsUrl,
}) => {
  const safeRecipientName = escapeHtml(recipientName || email || "there");
  const safeActorName = escapeHtml(actorName || "Someone");
  const safePostExcerpt = escapeHtml(truncate(postExcerpt || "", 200));
  const safeCommentExcerpt = escapeHtml(truncate(commentExcerpt || "", 240));

  const safePostUrl = postUrl || FRONTEND_URL || "#";
  const safeManageUrl = manageNotificationsUrl || "";

  let commentsSummaryText = "";
  if (typeof totalComments === "number" && totalComments > 1) {
    const noun = totalComments === 2 ? "comment" : "comments";
    commentsSummaryText = `This post now has ${totalComments} ${noun}.`;
  }

  const avatarFallbackInitial = escapeHtml(
    (actorName || "S").trim().charAt(0).toUpperCase(),
  );

  const subject = `${actorName || "Someone"} commented on your post`;

  const headerIntro =
    Comp.p(`Hi ${safeRecipientName},`) +
    Comp.p(
      `<strong>${safeActorName}</strong> left a new comment on your post on ${escapeHtml(
        BRAND_NAME,
      )}.`,
    );

  const actorBlock = `
    <table class="email-row" role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
      <tr>
        <td class="email-col" style="padding: 0;">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="vertical-align: top; padding-right: 12px;">
                ${
                  actorAvatarUrl
                    ? `
                  <img
                    src="${actorAvatarUrl}"
                    alt="${safeActorName}'s avatar"
                    width="40"
                    height="40"
                    style="border-radius: 999px; object-fit: cover;"
                  />
                `
                    : `
                  <div
                    style="
                      width: 40px;
                      height: 40px;
                      border-radius: 999px;
                      background: #f6f7fb;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      font-weight: 700;
                      font-size: 16px;
                    "
                  >
                    ${avatarFallbackInitial}
                  </div>
                `
                }
              </td>
              <td style="vertical-align: top;">
                <p style="font-size: 14px; margin: 0 0 4px 0;">
                  <strong>${safeActorName}</strong> commented on your post.
                </p>
                ${
                  commentsSummaryText
                    ? `<p class="email-text-muted" style="font-size: 12px; margin: 0;">
                        ${escapeHtml(commentsSummaryText)}
                      </p>`
                    : ""
                }
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  const postAndCommentBlock = `
    <div
      class="email-mb-lg"
      style="
        border-radius: 10px;
        border: 1px solid #eeeeee;
        padding: 12px 14px 14px;
        background-color: #fafafa;
        margin-bottom: 20px;
      "
    >
      <p
        class="email-text-muted email-mb-xs"
        style="
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin: 0 0 4px 0;
        "
      >
        Your post
      </p>
      <p style="font-size: 14px; margin: 0 0 10px 0;">
        ${
          safePostExcerpt && safePostExcerpt.trim().length > 0
            ? safePostExcerpt
            : "<em>No text content available.</em>"
        }
      </p>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 10px 0;" />

      <p
        class="email-text-muted email-mb-xs"
        style="
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin: 0 0 4px 0;
        "
      >
        New comment from ${safeActorName}
      </p>
      <p style="font-size: 14px; margin: 0 0 12px 0;">
        ${
          safeCommentExcerpt && safeCommentExcerpt.trim().length > 0
            ? safeCommentExcerpt
            : "<em>No comment text available.</em>"
        }
      </p>

      ${Comp.btn(safePostUrl, "View comment")}
    </div>
  `;

  const footerText =
    Comp.p(`Reply to keep the conversation going or share a follow-up update.`) +
    (safeManageUrl
      ? `<p class="email-text-muted" style="font-size: 11px; margin: 12px 0 0 0;">
           You are receiving this because of your activity on ${escapeHtml(
             BRAND_NAME,
           )}.
           <a href="${safeManageUrl}" class="email-link-cta">Manage notification settings</a>.
         </p>`
      : "");

  const html = wrapLayout({
    title: subject,
    bodyHtml: [headerIntro, actorBlock, postAndCommentBlock, footerText].join(
      "",
    ),
    brandName: BRAND_NAME,
  });

  return {
    subject,
    html,
  };
};

/**
 * Export map: short keys + namespaced keys
 */
const postEmailTemplates = {
  // Short keys
  postLiked: sendPostLiked,
  postCommented: sendPostCommented,

  // Namespaced keys
  "post.liked": sendPostLiked,
  "post.commented": sendPostCommented,
};

module.exports = postEmailTemplates;
