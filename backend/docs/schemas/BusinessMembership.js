// backend/swagger/schemas/businessMembership.schemas.js
"use strict";

module.exports = {
  BusinessMembership: {
    type: "object",
    description:
      "Approved membership linking a user to a business with a role (member/admin/owner).",
    required: [
      "id",
      "business_id",
      "user_id",
      "role",
      "status",
      "created_at",
      "updated_at",
    ],
    properties: {
      id: {
        type: "string",
        format: "uuid",
        example: "9e4a7c6b-43a0-4d28-9bd6-3cb1bba5c04b",
      },

      business_id: {
        type: "string",
        format: "uuid",
        description: "ID of the business",
        example: "61718ded-da6d-4418-ac45-5a09d0369acf",
      },

      user_id: {
        type: "string",
        format: "uuid",
        description: "ID of the user who is a member",
        example: "47086655-4ca2-4f2e-a350-4d4b6dc2d312",
      },

      role: {
        type: "string",
        description: "Role of the user within the business",
        enum: ["member", "admin", "owner"],
        example: "member",
      },

      status: {
        type: "string",
        description: "Membership status",
        enum: ["active", "banned"],
        example: "active",
      },

      created_at: {
        type: "string",
        format: "date-time",
        example: "2026-01-05T08:15:12.000Z",
      },

      updated_at: {
        type: "string",
        format: "date-time",
        example: "2026-01-05T08:15:12.000Z",
      },
    },
  },

  BusinessMembershipRequest: {
    type: "object",
    description:
      "A request by a user to join a business. Must be reviewed by a business admin/owner.",
    required: [
      "id",
      "business_id",
      "user_id",
      "status",
      "created_at",
      "updated_at",
    ],
    properties: {
      id: {
        type: "string",
        format: "uuid",
        example: "a5b8b9f0-0a3a-4e47-a0e2-2cc2c1f1b3cd",
      },

      business_id: {
        type: "string",
        format: "uuid",
        description: "ID of the business being requested",
        example: "61718ded-da6d-4418-ac45-5a09d0369acf",
      },

      user_id: {
        type: "string",
        format: "uuid",
        description: "ID of the user requesting to join",
        example: "47086655-4ca2-4f2e-a350-4d4b6dc2d312",
      },

      status: {
        type: "string",
        description: "Workflow status for the request",
        enum: ["pending", "approved", "rejected", "cancelled"],
        example: "pending",
      },

      message: {
        type: "string",
        nullable: true,
        description: "Optional message included by the requester",
        example: "Hi, I’m a trusted buyer and would like to post inquiries.",
      },

      reviewed_by_user_id: {
        type: "string",
        format: "uuid",
        nullable: true,
        description:
          "User ID of the admin/owner who reviewed the request (if reviewed)",
        example: "9f2c4f2d-5c1e-4a5a-9d5c-0a5f7a2f4d11",
      },

      reviewed_at: {
        type: "string",
        format: "date-time",
        nullable: true,
        description: "Timestamp when the request was reviewed",
        example: "2026-01-05T09:01:33.000Z",
      },

      created_at: {
        type: "string",
        format: "date-time",
        example: "2026-01-05T08:15:12.000Z",
      },

      updated_at: {
        type: "string",
        format: "date-time",
        example: "2026-01-05T08:15:12.000Z",
      },
    },
  },
};
