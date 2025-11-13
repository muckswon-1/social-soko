const db = require("../models");
const crypto = require("crypto");

const { User, VerificationToken } = db;

module.exports = async (providedToken, tokenType, opts = {}) => {
  const { inputFormat = "plain" } = opts;

  if (!providedToken || !tokenType) {
    return { valid: false, reason: "Token and token type are required" };
  }

  let hashedToken;

  if (inputFormat === "sha256") {
    hashedToken = crypto
      .createHash("sha256")
      .update(providedToken)
      .digest("hex");
  }else {
    hashedToken = providedToken;
  }

  // Find token record
  const tokenRecord = await VerificationToken.findOne({
    where: { token: hashedToken, token_type: tokenType },
    include: [{ 
      model: User.scope("withPassword"), 
      
      as: "user"
     }],
  });


  if (!tokenRecord) {
    return { valid: false, reason: "Invalid or expired token." };
  }

  const now = new Date();

  if (tokenRecord.expires_at === now || tokenRecord.expires_at <= now) {
    try {
      await tokenRecord.destroy();
    } catch {}

    return { valid: false, reason: "Token has expired" };
  }

  // // //Timing safe compare
  // const isValid = crypto.timingSafeEqual(Buffer.from(token), Buffer.from(tokenRecord.token));

  // if(!isValid) {
  //   throw new Error('Invalid token')
  // }

  const a = Buffer.from(String(hashedToken));
  const b = Buffer.from(String(tokenRecord.token));

  const sameLength = a.length === b.length;
  const constantTimeMatch = sameLength && crypto.timingSafeEqual(a, b);

  if (!constantTimeMatch) {
    return { valid: false, reason: "Invalid Token" };
  }
  const user = tokenRecord.user;

  const returnTokenRecord = tokenRecord;
  // Delete token after use
  try {
    await tokenRecord.destroy();
  } catch {}

  return {
    valid: true,
    token: returnTokenRecord,
    user,
  };
};
