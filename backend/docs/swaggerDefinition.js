// src/swagger/swaggerDefinition.js

const { Business } = require("./schemas/BusinessSchema");
const { User } = require("./schemas/UserSchema");

module.exports = {
  openapi: "3.0.0",

  info: {
    version: "1.0.0",
    title: "Social Soko API",
    description:
      "Backend API for Social Soko — a professional social networking platform for B2B commerce, business identity, and verification.",
  },

  servers: [
    {
      url: "http://localhost:2070",
      description: "Local Development Server",
    },
  ],

  components: {
    securitySchemes: {
      AccessToken: {
        type: "apiKey",
        in: "cookie",
        name: "access_token",
        description: "JWT access token stored inside HttpOnly cookie",
      },
    },

    schemas: {
      /* ---------------------- Core Models ---------------------- */
      User: { ...User },
      Business: { ...Business },

      /* --------------------- Auth Responses -------------------- */
      AuthSuccessResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Login successful" },
          data: {
            type: "object",
            properties: {
              user: { $ref: "#/components/schemas/User" },
            },
          },
        },
      },

      AuthErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          error: {
            type: "string",
            example: "Invalid username or password",
          },
          code: { type: "string", example: "SERVER_ERROR" },
          stack: { type: "string", example: "Error details in development" },
        },
      },

      /* -------------------- Register DTO -------------------- */
      RegisterRequest: {
        type: "object",
        description: "Payload used to register a new user.",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "newuser@example.com",
          },
          password: {
            type: "string",
            format: "password",
            example: "averystrongpassword",
          },
        },
      },

      /* ----------------- NEW: Logo Upload Response ----------------- */
      BusinessLogoUploadResponse: {
        type: "object",
        description: "Response returned after uploading a new business logo.",
        properties: {
          status: { type: "string", example: "success" },
          message: { type: "string", example: "Logo uploaded successfully" },
          logo_url: {
            type: "string",
            example:
              "https://yourdomain.com/uploads/logos/biz-123456.webp",
          },
          business: {
            type: "object",
            properties: {
              id: {
                type: "string",
                example: "61718ded-da6d-4418-ac45-5a09d0369acf",
              },
              name: {
                type: "string",
                example: "ETAC Service and Supply Inc",
              },
              logo_url: {
                type: "string",
                example:
                  "https://yourdomain.com/uploads/logos/biz-123456.webp",
              },
            },
          },
        },
      },
    },
  },
};
