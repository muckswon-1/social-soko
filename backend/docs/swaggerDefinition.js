const { Business } = require("./schemas/BusinessSchema");
const { User } = require("./schemas/UserSchema");

// src/swagger/swaggerDefinition.js
module.exports = {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Social Soko",
    description:
      "A professional social networking platform for businesses. API for Social Soko admin and platform operation (auth, users, businesses etc).",
  },
  servers: [
    {
      url: "http://localhost:2070",
      description: "Local development server",
    },
  ],
  components: {
    schemas: {
      User: {...User},
      Business: {...Business},
      AuthSuccessResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          message: {
            type: "string",
            example: "Login successful",
          },
          data: {
            type: "object",
            properties: {
              user: {
                $ref: "#/components/schemas/User",
              },
            },
          },
        },
      },

      AuthErrorResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: false,
          },
          error: {
            type: "string",
            example: "Invalid username or password",
          },
          code: {
            type: "string",
            example: "SERVER_ERROR",
          },
          stack: {
            type: "string",
          },
        },
      },

      RegisterRequest: {
        type: "object",
        description: "Payload used to create a new user account.",
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
    },
  },
};
