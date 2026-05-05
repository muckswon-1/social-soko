const sequelize = require("../config/database");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const digitsCodegenerator = require("node-code-generator");
//const {format: formatSQLQuery} = require('sql-formatter');

/**
 * Utility methods for Social Soko API
 *
 */

const UTILS = {
  /**
   * Connects to the database.
   * @returns {Promise<void>} A promise that resolves when the connection is established.
   * @throws {Error} If the connection fails.
   * @example
   * await connectToDatabase();
   *
   */

  connectToDatabase: async () => {
    try {
      await sequelize.authenticate();
      console.log(" ✅ Database connection has been established successfully.");
      console.log("\n");
    } catch (err) {
      console.error("Unable to connect to the database:", err);
      console.log("\n");
      process.exit(1);
    }
  },

  /**
   *
   * @param {Object} user
   * @returns {string} - Generated Access Token
   */
  generateAccessToken: (user) => {
    const expiresIn = process.env.JWT_TOKEN_EXPIRES_IN;
    const accessToken =  jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn },
    );

    return {accessToken, expiresIn}
  },

  /**
   *
   * @param {Object} user
   * @returns {string} - Generated Refresh Token
   */
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "30d" },
    );
  },

  /**
   *  Generate CSRF Token for a user
   * @param {Object} user
   * @returns {string} - The generated CSRF Token
   */
  generateCSRFToken: (user = null) => {
    // Create a unique token using crypto.randomBytes for better security
    const token = crypto.randomBytes(32).toString("hex");

    //TODO Consider storing the token in a database or session
    return token;
  },

  /**
   * Validate CSRF Token
   * @param {string} token - The CSRF token from request
   * @param {string} cookieToken  - The CSRF token from cookie
   * @returns {boolean} - Whether the tokens match
   */
  validateCSRFToken: (token, cookieToken) => {
    //TODO Use timing safe comparison (prevent timing attacks)
    return token === cookieToken;
  },

  /**
   *  A reusable utility function to send an email to a customer. The function will be reused when sending codes, link to reset password ,notifications and many other uses. We will use nodemailer for now. The HTML string with the message should be passed as an argument to the function.
   * @param {*} email
   * @param {*} subject
   * @param {*} htmlData
   *
   */
  sendEmail: async (email, subject, htmlData) => {
   
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_HOST_PORT),
        secure: process.env.NODE_ENV === "production",
        auth: {
          user: process.env.EMAIL_HOST_USERNAME,
          pass: process.env.EMAIL_HOST_PASSWORD
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_HOST_FROM_NO_REPLY_HEADER,
        to: email,
        subject: subject,
        html: htmlData,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${email}`);
    } catch (error) {
      console.log(process.env.EMAIL_USER);
      console.error("Error sending email:", error);
      throw error;
    }
  },

  /**
   *
   * @returns {string} - A generated token. Could be UUID or any other implementation
   *
   */

  //TODO Revist generateVerifyToken (make it safe)
  generateVerifyToken: () => {
    return uuidv4();
  },

  generateDigitsCode: (n) => {
    const generator = new digitsCodegenerator();
    const pattern = "######";
    const codes = generator.generateCodes(pattern, n);
    return codes[0];
  },

  /**
   *
   * @param {Object} user
   * @returns {Object} - Returns a normalized user
   */
  normalizedUserAuthData: (user) => {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      emailVerified: user.email_verified,
    };
  },

  normalizedUserProfileData: (user) => {
    return {
      firstName: user.first_name,
      lastName: user.last_name,
      phoneNumber: user.phone,
      phoneNumberVerified: user.phone_verified,
    };
  },

  timingSafeCompare: (a, b) => {
    if (!a || !b) return false;

    const ab = Buffer.from(a);
    const bb = Buffer.from(b);

    if (ab.length !== bb.length) return false;

    return crypto.timingSafeEqual(ab, bb);
  },

  catchAsync: (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  },

  // Helper to throw HTTP-ish errors without adding deps
  httpError: (status, message) => {
    const err = new Error(message);
    err.status = status;
    return err;
  },

  pagination: (rawPage, rawLimit) => {

    const page = Math.max(parseInt(rawPage,10) || 1,1);
    const limit = Math.max(Math.min(parseInt(rawLimit,10) || 50, 200), 1);

    const offset = (page - 1) * limit;

    return {
      page, limit, offset
    }
  },

  checkBusinessVerificationEligibility: (business, ownerUser) => {
    const reasons = [];

    if(!business.phone || !business.phone.toString().trim()) {
      reasons.push("Business phone number is missing")
    }

    if(!business.address || !business.address.toString().trim()) {
      reasons.push("Business address is missing")
    }

    if(!ownerUser) {
      reasons.push("Business owner user not found")
    }else if (!ownerUser.email_verified) {
      reasons.push("Business owner email is not verified")

    }

    return {
      eligible: reasons.length === 0,
      reasons
      
    }

  },


  // Get server uptime in hours eg 22.5
  getServerUptime: () => {
    const uptimeInSeconds = process.uptime();
    const uptimeInHours = uptimeInSeconds / 3600;

    return uptimeInHours;
  },


  // get current timestamp
  getCurrentTimestamp: () => {
    return Math.floor(Date.now() / 1000);

  },

  // prettySQL: (sql) => {
  //   const prettyQuery = formatSQLQuery(sql,{
  //     language: 'postgresql',
  //     indent: '  ',
  //     keywordCase: 'upper'
  //   });

  //   console.log(prettyQuery);
  // }


}

module.exports = UTILS;
