module.exports = {
  Comment: {
    type: "object",
    description: "A comment left on a post.",
    required: [
      "id",
      "post_id",
      "user_id",
      "created_at",
      "updated_at"
    ],
    properties: {
      id: {
        type: "string",
        format: "uuid",
        example: "de8e9f53-0643-4ce4-a791-0aae18f1e6c7",
      },

      post_id: {
        type: "string",
        format: "uuid",
        description: "The post being commented on.",
        example: "a1c8d454-937d-4f87-ab1b-8c03241d72df",
      },

      user_id: {
        type: "string",
        format: "uuid",
        description: "The user who wrote the comment.",
        example: "47086655-4ca2-4f2e-a350-4d4b6dc2d312",
      },

         parent_id: {
        type: "string",
        format: "uuid",
        nullable: true,
        description: "The parent comment  (if this is a reply).",
        example: "47086655-4ca2-4f2e-a350-4d4b6dc2d312",
      },

      content: {
        type: "string",
        nullable: true,
        example: "This is amazing! Congrats!",
      },

      image_urls: {
        type: "array",
        items: { type: "string" },
        nullable: true,
        example: ["https://cdn.example.com/comments/image1.png"],
      },

      video_urls: {
        type: "array",
        items: { type: "string" },
        nullable: true,
        example: [],
      },

      created_at: {
        type: "string",
        format: "date-time",
        example: "2025-01-15T08:30:00.000Z",
      },

      updated_at: {
        type: "string",
        format: "date-time",
        example: "2025-01-15T08:45:00.000Z",
      },
    },
  },
};
