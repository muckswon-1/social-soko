module.exports = {
  PostLike: {
    type: "object",
    description: "A like on a post by a user.",
    required: ["id", "post_id", "user_id", "created_at", "updated_at"],
    properties: {
      id: {
        type: "string",
        format: "uuid",
        example: "b3c7af58-91c4-4c3b-97d4-98f79c013925",
      },

      post_id: {
        type: "string",
        format: "uuid",
        description: "The post that was liked.",
        example: "a1c8d454-937d-4f87-ab1b-8c03241d72df",
      },

      user_id: {
        type: "string",
        format: "uuid",
        description: "The user who liked the post.",
        example: "47086655-4ca2-4f2e-a350-4d4b6dc2d312",
      },

      created_at: {
        type: "string",
        format: "date-time",
        example: "2025-01-14T11:00:00.000Z",
      },

      updated_at: {
        type: "string",
        format: "date-time",
        example: "2025-01-14T11:00:00.000Z",
      },
    },
  },
};
