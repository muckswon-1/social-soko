module.exports =   { User: {
        type: "object",
        description: "A user account in the system",
        properties: {
          id: {
            type: "string",
            format: "uuid",
            example: "47086655-4ca2-4f2e-a350-4d4b6dc2d312",
          },
          email: {
            type: "string",
            format: "email",
            example: "john.doe@example.com",
          },
          first_name: {
            type: "string",
            example: "Mucks",
          },
          last_name: {
            type: "string",
            example: "Won",
          },
          role: {
            type: "string", 
            example: "user",
          },
          phone: {
            type: "string",
            example: "07123455676",
          },
          phone_verified: {
            type: "boolean",
            example: false,
          },
          email_verified: {
            type: "boolean",
            example: false,
          },
          account_verified: {
            type: "boolean",
            example: false,
          },
          created_at: {
            type: "string",
            format: "date-time",
            example: "2025-01-01T12:34:56.000Z",
          },
          updated_at: {
            type: "string",
            format: "date-time",
            example: "2025-01-01T12:34:56.000Z",
          },
        },
      },
    }
