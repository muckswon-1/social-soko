module.exports = {
  CommentLike: {
    type: "object",
    description: "A like on a comment.",
    required: ["id", "comment_id", "user_id", "created_at", "updated_at"],
    properties: {
      id: {
        type: "string",
        format: "uuid",
        example: "f21d8c24-cf20-49b8-a2ac-92f30d2dc287",
      },

      comment_id: {
        type: "string",
        format: "uuid",
        description: "The comment that was liked.",
        example: "de8e9f53-0643-4ce4-a791-0aae18f1e6c7",
      },

      user_id: {
        type: "string",
        format: "uuid",
        description: "The user who liked the comment.",
        example: "47086655-4ca2-4f2e-a350-4d4b6dc2d312",
      },

      created_at: {
        type: "string",
        format: "date-time",
        example: "2025-01-16T10:00:00.000Z",
      },

      updated_at: {
        type: "string",
        format: "date-time",
        example: "2025-01-16T10:00:00.000Z",
      },
    },
  },
};
