module.exports = {
  Business: {
    type: "object",
    description: "A business profile associated with a user.",
    required: ["id", "user_id", "name", "verification_status", "created_at", "updated_at"],
    properties: {
      id: {
        type: "string",
        format: "uuid",
        example: "61718ded-da6d-4418-ac45-5a09d0369acf",
      },

      user_id: {
        type: "string",
        format: "uuid",
        description: "ID of the user who owns the business",
        example: "47086655-4ca2-4f2e-a350-4d4b6dc2d312",
      },

      name: {
        type: "string",
        description: "Business name",
        example: "ETAC Service and Supply Inc",
      },

      description: {
        type: "string",
        nullable: true,
        example: "We sell large organizational transformers.",
      },

      address: {
        type: "string",
        nullable: true,
        example: "123 Industrial Park Road",
      },

      city: {
        type: "string",
        nullable: true,
        example: "Winnipeg",
      },

      state: {
        type: "string",
        nullable: true,
        example: "Manitoba",
      },

      country: {
        type: "string",
        nullable: true,
        example: "Canada",
      },

      postal_code: {
        type: "string",
        nullable: true,
        example: "R2J 4G7",
      },

      phone: {
        type: "string",
        nullable: true,
        example: "18197002211",
      },

      email: {
        type: "string",
        format: "email",
        nullable: true,
        example: "sales@etac-supply.com",
      },

      website: {
        type: "string",
        nullable: true,
        example: "https://etac-supply.com",
      },

      slug: {
        type: "string",
        nullable: true,
        example: "etac-service-and-supply-inc",
      },

      logo_url: {
        type: "string",
        nullable: true,
        example: "https://cdn.example.com/logos/etac.png",
      },

      verification_status: {
        type: "string",
        enum: ["pending", "requested", "verified", "rejected"],
        example: "pending",
      },

      verification_requested_at: {
        type: "string",
        format: "date-time",
        nullable: true,
        example: "2025-02-01T12:00:00.000Z",
      },

      verified_at: {
        type: "string",
        format: "date-time",
        nullable: true,
        example: "2025-03-01T09:30:00.000Z",
      },

      verification_rejected_at: {
        type: "string",
        format: "date-time",
        nullable: true,
        example: "2025-03-02T10:20:00.000Z",
      },

      verification_rejected_reason: {
        type: "string",
        nullable: true,
        example: "Business address could not be verified.",
      },

      created_at: {
        type: "string",
        format: "date-time",
        example: "2025-01-10T12:34:56.000Z",
      },

      updated_at: {
        type: "string",
        format: "date-time",
        example: "2025-01-15T15:00:00.000Z",
      },
    },
  },
};
