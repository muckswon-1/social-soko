const sequelize = require("../config/database");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const digitsCodegenerator = require("node-code-generator");

require("dotenv").config();

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
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "10m" },
    );
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
      { expiresIn: "7d" },
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
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        html: htmlData,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${email}`);
    } catch (error) {
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
  }

};

module.exports = UTILS;
