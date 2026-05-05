module.exports = {
  Post: {
    type: "object",
    description: "A social post created by a business user.",
    required: [
      "id",
      "business_id",
      "user_id",
      "visibility",
      "created_at",
      "updated_at"
    ],
    properties: {
      id: {
        type: "string",
        format: "uuid",
        example: "a1c8d454-937d-4f87-ab1b-8c03241d72df",
      },

      business_id: {
        type: "string",
        format: "uuid",
        description: "The business posting this content.",
        example: "61718ded-da6d-4418-ac45-5a09d0369acf",
      },

      user_id: {
        type: "string",
        format: "uuid",
        description: "The user who created the post.",
        example: "47086655-4ca2-4f2e-a350-4d4b6dc2d312",
      },

      group_id: {
        type: "string",
        format: "uuid",
        nullable: true,
        description: "Group where the post was published (if any).",
        example: null,
      },

      content: {
        type: "string",
        nullable: true,
        example: "We just launched a new product line!",
      },

      image_urls: {
        type: "array",
        items: { type: "string" },
        description: "List of attached image URLs.",
        example: [
          "https://cdn.example.com/posts/img1.png",
          "https://cdn.example.com/posts/img2.jpg",
        ],
      },

      video_urls: {
        type: "array",
        items: { type: "string" },
        description: "List of attached video URLs.",
        example: [],
      },

      visibility: {
        type: "string",
        enum: ["public", "private", "friends", "groups", "custom"],
        example: "public",
      },

      created_at: {
        type: "string",
        format: "date-time",
        example: "2025-01-10T12:34:56.000Z",
      },

      updated_at: {
        type: "string",
        format: "date-time",
        example: "2025-01-12T09:15:00.000Z",
      },
    },
  },
};
