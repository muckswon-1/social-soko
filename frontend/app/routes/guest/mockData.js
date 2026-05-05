import sampleVideo from '../../assets/sample_video/12009144_1920_1080_24fps.mp4';

export const mockBusinesses = [
  {
    id: "biz-1",
    name: "Ottawa Phone Wholesalers",
    slug: "ottawa-phone-wholesalers",
    logoUrl: "",
    verificationStatus: "verified",
    membersCount: 18420,
  },
  {
    id: "biz-2",
    name: "Verified Electrical Equipment",
    slug: "verified-electrical-equipment",
    logoUrl: "",
    verificationStatus: "verified",
    membersCount: 9320,
  },
  {
    id: "biz-3",
    name: "Diabetic Supplies Export",
    slug: "diabetic-supplies-export",
    logoUrl: "",
    verificationStatus: "unverified",
    membersCount: 4210,
  },
];

// src/menu/posts/mocks/mockPosts.js

/**
 * Matches what PostCard expects:
 * - business: { name, logoUrl?, isBusinessVerified? }
 * - author: { firstName, lastName, avatarUrl?, accountVerified? }
 * - stats: { likesCount, commentsCount, viewsCount, bookmarksCount }
 * - imageUrls/videoUrls: relative backend paths (PostCard prefixes BACKEND_URL)
 */

// src/menu/posts/mocks/mockPosts.js



/**
 * Matches what PostCard expects:
 * - business: { name, logoUrl?, isBusinessVerified? }
 * - author: { id?, firstName, lastName, avatarUrl?, accountVerified? }
 * - stats: { likesCount, commentsCount, viewsCount, bookmarksCount }
 * - imageUrls/videoUrls: either backend-relative OR absolute (http) OR local import (sampleVideo)
 */

export const mockPosts = [
  {
    id: "post_001",
    title: "Looking for bulk iPhone 13 Pro Max - Canada spec, clean IMEI",
    content:
      "Need 20-50 units, any color. Prefer A/B grade. Budget depends on grading and unlock status. Please DM with stock list + warehouse location.",
    postType: "request",
    category: "Phones",
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    updatedAt: null,
    imageUrls: [],
    videoUrls: [],
    business: { name: "Device Supply", logoUrl: null, isBusinessVerified: true },
    author: {
      id: "user_001",
      firstName: "Alex",
      lastName: "A.",
      avatarUrl: null,
      accountVerified: true,
    },
    stats: { likesCount: 42, commentsCount: 13, viewsCount: 884, bookmarksCount: 7 },
    currentUserLiked: false,
    currentUserDisliked: false,
    currentUserBookmarked: false,
  },

  {
    id: "post_002",
    title: "Warehouse tour: how we grade devices (quick walkthrough)",
    content:
      "Sharing our grading process so buyers know what they're getting. This is the same flow we use for B2B wholesale lots.",
    postType: "update",
    category: "Operations",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    updatedAt: null,
    videoUrls: [sampleVideo],
    imageUrls: [],
    business: { name: "SellPhonesCanada", logoUrl: null, isBusinessVerified: true },
    author: { id: "user_002", firstName: "Morgan", lastName: "", avatarUrl: null, accountVerified: true },
    stats: { likesCount: 118, commentsCount: 29, viewsCount: 3200, bookmarksCount: 41 },
    currentUserLiked: true,
    currentUserDisliked: false,
    currentUserBookmarked: true,
  },

  {
    id: "post_003",
    title: "New supplier: iPads + MacBooks available weekly",
    content: "",
    postType: "offer",
    category: "Computers",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: null,
    imageUrls: [
      "https://images.pexels.com/photos/262353/pexels-photo-262353.jpeg?_gl=1*1w1lexd*_ga*MTgyNzc3OTA2NC4xNzUwMDYzMTcz*_ga_8JE65Q40S6*czE3NjU5OTg1NzIkbzI1JGcxJHQxNzY1OTk4NTc3JGo1NSRsMCRoMA..",
    ],
    videoUrls: [],
    business: { name: "Jagassar Group", logoUrl: null, isBusinessVerified: false },
    author: { id: "user_003", firstName: "Nick", lastName: "", avatarUrl: null, accountVerified: false },
    stats: { likesCount: 9, commentsCount: 2, viewsCount: 233, bookmarksCount: 1 },
    currentUserLiked: false,
    currentUserDisliked: false,
    currentUserBookmarked: false,
  },

  // ------------------------------
  // NEW MOCK POSTS
  // ------------------------------

  {
    id: "post_004",
    title: "WTS: 500x iPhone 12 (USA spec) clean IMEI - mixed colors",
    content:
      "Lot is mostly B grade, some A. Mix of unlocked and carrier locked (AT&T/TMO). Can split by 50s. Payment: wire/crypto. Pickup Ottawa or ship.",
    postType: "offer",
    category: "Phones",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    updatedAt: null,
    imageUrls: [
      "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg",
      "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg",
    ],
    videoUrls: [],
    business: { name: "Ottawa Phone Wholesalers", logoUrl: null, isBusinessVerified: true },
    author: { id: "user_004", firstName: "Matt", lastName: "", avatarUrl: null, accountVerified: true },
    stats: { likesCount: 17, commentsCount: 6, viewsCount: 611, bookmarksCount: 4 },
    currentUserLiked: false,
    currentUserDisliked: false,
    currentUserBookmarked: false,
  },

  {
    id: "post_005",
    title: "Need Dexcom G7 + Libre 3 Plus (US labels ok) - Export buyer",
    content:
      "Looking for long expiry only. Send qty, expiry ranges, and location. We can do recurring weekly buys if consistent.",
    postType: "request",
    category: "Medical",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    updatedAt: null,
    imageUrls: [],
    videoUrls: [],
    business: { name: "Diabetic Supplies Export", logoUrl: null, isBusinessVerified: false },
    author: { id: "user_001", firstName: "Alex", lastName: "A.", avatarUrl: null, accountVerified: true },
    stats: { likesCount: 33, commentsCount: 12, viewsCount: 1402, bookmarksCount: 9 },
    currentUserLiked: true,
    currentUserDisliked: false,
    currentUserBookmarked: false,
  },

  {
    id: "post_006",
    title: "CSA/UL switchgear - looking for 600A, 480V, quick turnaround",
    content:
      "Need pricing for lead time under 6 weeks if possible. Prefer Schneider / Siemens equivalents. Shipping to Ontario.",
    postType: "request",
    category: "Electrical",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    updatedAt: null,
    imageUrls: [],
    videoUrls: [],
    business: { name: "Verified Electrical Equipment", logoUrl: null, isBusinessVerified: true },
    author: { id: "user_006", firstName: "Brandon", lastName: "", avatarUrl: null, accountVerified: true },
    stats: { likesCount: 8, commentsCount: 4, viewsCount: 390, bookmarksCount: 2 },
    currentUserLiked: false,
    currentUserDisliked: false,
    currentUserBookmarked: true,
  },

  {
    id: "post_007",
    title: "Process: what 'A/B tested' means in our grading sheet",
    content:
      "Quick breakdown:\n\nA tested = fully functional + cosmetically clean.\nB tested = functional, light wear.\nC tested = functional, heavier wear.\nDNA/AS-IS = no guarantees.\n\nIf you want our full PDF rubric, comment 'rubric' and I'll send it.",
    postType: "update",
    category: "Operations",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    updatedAt: null,
    imageUrls: ["https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg"],
    videoUrls: [],
    business: { name: "SellPhonesCanada", logoUrl: null, isBusinessVerified: true },
    author: { id: "user_002", firstName: "Morgan", lastName: "", avatarUrl: null, accountVerified: true },
    stats: { likesCount: 64, commentsCount: 18, viewsCount: 2170, bookmarksCount: 22 },
    currentUserLiked: false,
    currentUserDisliked: false,
    currentUserBookmarked: false,
  },
];

// ----------------------------------------
// COMMENTS: parent comments + preview replies
// Comment component expects:
// - stats: { likesCount, repliesCount, viewsCount, bookmarksCount? }
// - currentUserLiked/currentUserDisliked/currentUserBookmarked
// - replies: [] (optional preview)
// ----------------------------------------

export const mockCommentsByPostId = {
  post_001: [
    {
      id: "c_001_001",
      postId: "post_001",
      parentId: null,
      content: "What grades do you take? Any carrier locked?",
      createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      author: { id: "user_004", firstName: "Matt", lastName: "", avatarUrl: "" },
      stats: { likesCount: 0, repliesCount: 2, viewsCount: 18, bookmarksCount: 0 },
      currentUserLiked: false,
      currentUserDisliked: false,
      currentUserBookmarked: false,
      replies: [
        {
          id: "r_001_001_001",
          postId: "post_001",
          parentId: "c_001_001",
          content: "Mostly A/B tested. We can take some C if pricing makes sense.",
          createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
          author: { id: "user_001", firstName: "Alex", lastName: "A.", avatarUrl: "" },
          stats: { likesCount: 2, repliesCount: 0, viewsCount: 9, bookmarksCount: 0 },
          currentUserLiked: true,
          currentUserDisliked: false,
          currentUserBookmarked: false,
        },
        {
          id: "r_001_001_002",
          postId: "post_001",
          parentId: "c_001_001",
          content: "Carrier locked ok if clean IMEI and we know carrier list.",
          createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
          author: { id: "user_001", firstName: "Alex", lastName: "A.", avatarUrl: "" },
          stats: { likesCount: 1, repliesCount: 0, viewsCount: 7, bookmarksCount: 0 },
          currentUserLiked: false,
          currentUserDisliked: false,
          currentUserBookmarked: false,
        },
      ],
    },

    {
      id: "c_001_002",
      postId: "post_001",
      parentId: null,
      content: "Can you do escrow for first deal?",
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      author: { id: "user_007", firstName: "Sami", lastName: "", avatarUrl: "" },
      stats: { likesCount: 3, repliesCount: 1, viewsCount: 22, bookmarksCount: 0 },
      currentUserLiked: false,
      currentUserDisliked: false,
      currentUserBookmarked: false,
      replies: [
        {
          id: "r_001_002_001",
          postId: "post_001",
          parentId: "c_001_002",
          content: "Yeah, for first transaction we can do escrow or small test order first.",
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          author: { id: "user_001", firstName: "Alex", lastName: "A.", avatarUrl: "" },
          stats: { likesCount: 4, repliesCount: 0, viewsCount: 12, bookmarksCount: 0 },
          currentUserLiked: false,
          currentUserDisliked: false,
          currentUserBookmarked: true,
        },
      ],
    },
  ],

  post_002: [
    {
      id: "c_002_001",
      postId: "post_002",
      parentId: null,
      content: "This is clean. Do you have a written rubric you share with buyers?",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      author: { id: "user_009", firstName: "Yas", lastName: "", avatarUrl: "" },
      stats: { likesCount: 11, repliesCount: 1, viewsCount: 140, bookmarksCount: 1 },
      currentUserLiked: false,
      currentUserDisliked: false,
      currentUserBookmarked: false,
      replies: [
        {
          id: "r_002_001_001",
          postId: "post_002",
          parentId: "c_002_001",
          content: "Yep. If you comment 'rubric' on the post we can DM it.",
          createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          author: { id: "user_002", firstName: "Morgan", lastName: "", avatarUrl: "" },
          stats: { likesCount: 7, repliesCount: 0, viewsCount: 80, bookmarksCount: 0 },
          currentUserLiked: true,
          currentUserDisliked: false,
          currentUserBookmarked: false,
        },
      ],
    },
  ],

  post_004: [
    {
      id: "c_004_001",
      postId: "post_004",
      parentId: null,
      content: "Can you split unlocked only? Need 100+ if pricing is right.",
      createdAt: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
      author: { id: "user_010", firstName: "Will", lastName: "", avatarUrl: "" },
      stats: { likesCount: 2, repliesCount: 2, viewsCount: 31, bookmarksCount: 0 },
      currentUserLiked: false,
      currentUserDisliked: false,
      currentUserBookmarked: false,
      replies: [
        {
          id: "r_004_001_001",
          postId: "post_004",
          parentId: "c_004_001",
          content: "Yes, but unlocked is limited. I can do 60 unlocked now, more next week.",
          createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          author: { id: "user_004", firstName: "Matt", lastName: "", avatarUrl: "" },
          stats: { likesCount: 1, repliesCount: 0, viewsCount: 12, bookmarksCount: 0 },
          currentUserLiked: false,
          currentUserDisliked: false,
          currentUserBookmarked: false,
        },
        {
          id: "r_004_001_002",
          postId: "post_004",
          parentId: "c_004_001",
          content: "DM me your target price and I’ll see what I can do on the lot.",
          createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
          author: { id: "user_004", firstName: "Matt", lastName: "", avatarUrl: "" },
          stats: { likesCount: 0, repliesCount: 0, viewsCount: 8, bookmarksCount: 0 },
          currentUserLiked: false,
          currentUserDisliked: false,
          currentUserBookmarked: false,
        },
      ],
    },

    {
      id: "c_004_002",
      postId: "post_004",
      parentId: null,
      content: "Any iCloud/MDM lock guarantees?",
      createdAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
      author: { id: "user_011", firstName: "Jules", lastName: "", avatarUrl: "" },
      stats: { likesCount: 5, repliesCount: 1, viewsCount: 28, bookmarksCount: 0 },
      currentUserLiked: true,
      currentUserDisliked: false,
      currentUserBookmarked: false,
      replies: [
        {
          id: "r_004_002_001",
          postId: "post_004",
          parentId: "c_004_002",
          content: "Yes, clean IMEI + no iCloud. MDM is mixed; we can separate if requested.",
          createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
          author: { id: "user_004", firstName: "Matt", lastName: "", avatarUrl: "" },
          stats: { likesCount: 3, repliesCount: 0, viewsCount: 15, bookmarksCount: 0 },
          currentUserLiked: false,
          currentUserDisliked: false,
          currentUserBookmarked: true,
        },
      ],
    },
  ],

  post_005: [
    {
      id: "c_005_001",
      postId: "post_005",
      parentId: null,
      content: "Do you take partial cases? I have 20 sensors but mixed expiries.",
      createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
      author: { id: "user_012", firstName: "Chris", lastName: "", avatarUrl: "" },
      stats: { likesCount: 1, repliesCount: 1, viewsCount: 19, bookmarksCount: 0 },
      currentUserLiked: false,
      currentUserDisliked: false,
      currentUserBookmarked: false,
      replies: [
        {
          id: "r_005_001_001",
          postId: "post_005",
          parentId: "c_005_001",
          content: "Yes, send expiry list + photos of seals. Longer expiries get priority pricing.",
          createdAt: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
          author: { id: "user_001", firstName: "Alex", lastName: "A.", avatarUrl: "" },
          stats: { likesCount: 2, repliesCount: 0, viewsCount: 10, bookmarksCount: 0 },
          currentUserLiked: false,
          currentUserDisliked: false,
          currentUserBookmarked: false,
        },
      ],
    },

    {
      id: "c_005_002",
      postId: "post_005",
      parentId: null,
      content: "Any restrictions on US labeled for EU export?",
      createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      author: { id: "user_013", firstName: "Raph", lastName: "", avatarUrl: "" },
      stats: { likesCount: 0, repliesCount: 2, viewsCount: 14, bookmarksCount: 0 },
      currentUserLiked: false,
      currentUserDisliked: false,
      currentUserBookmarked: false,
      replies: [
        {
          id: "r_005_002_001",
          postId: "post_005",
          parentId: "c_005_002",
          content: "Depends on destination. For some markets we route via compliant distributors.",
          createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
          author: { id: "user_001", firstName: "Alex", lastName: "A.", avatarUrl: "" },
          stats: { likesCount: 1, repliesCount: 0, viewsCount: 9, bookmarksCount: 0 },
          currentUserLiked: true,
          currentUserDisliked: false,
          currentUserBookmarked: false,
        },
        {
          id: "r_005_002_002",
          postId: "post_005",
          parentId: "c_005_002",
          content: "If you tell me the country, I’ll tell you what spec buyers want.",
          createdAt: new Date(Date.now() - 1000 * 60 * 16).toISOString(),
          author: { id: "user_001", firstName: "Alex", lastName: "A.", avatarUrl: "" },
          stats: { likesCount: 0, repliesCount: 0, viewsCount: 7, bookmarksCount: 0 },
          currentUserLiked: false,
          currentUserDisliked: false,
          currentUserBookmarked: false,
        },
      ],
    },
  ],

  post_006: [
    {
      id: "c_006_001",
      postId: "post_006",
      parentId: null,
      content: "Do you need NEMA 1 or 3R enclosure? Indoor vs outdoor matters for lead time.",
      createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
      author: { id: "user_014", firstName: "Sam", lastName: "", avatarUrl: "" },
      stats: { likesCount: 4, repliesCount: 1, viewsCount: 26, bookmarksCount: 0 },
      currentUserLiked: false,
      currentUserDisliked: false,
      currentUserBookmarked: false,
      replies: [
        {
          id: "r_006_001_001",
          postId: "post_006",
          parentId: "c_006_001",
          content: "Indoor NEMA 1 preferred. If outdoor, we’ll accept 3R with pricing breakdown.",
          createdAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
          author: { id: "user_006", firstName: "Brandon", lastName: "", avatarUrl: "" },
          stats: { likesCount: 2, repliesCount: 0, viewsCount: 13, bookmarksCount: 0 },
          currentUserLiked: false,
          currentUserDisliked: false,
          currentUserBookmarked: true,
        },
      ],
    },
  ],

  post_007: [
    {
      id: "c_007_001",
      postId: "post_007",
      parentId: null,
      content: "rubric",
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      author: { id: "user_015", firstName: "Aya", lastName: "", avatarUrl: "" },
      stats: { likesCount: 6, repliesCount: 1, viewsCount: 20, bookmarksCount: 0 },
      currentUserLiked: true,
      currentUserDisliked: false,
      currentUserBookmarked: false,
      replies: [
        {
          id: "r_007_001_001",
          postId: "post_007",
          parentId: "c_007_001",
          content: "Sending it now. If you want, I can also share our 'MDM/IC lock' checklist.",
          createdAt: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
          author: { id: "user_002", firstName: "Morgan", lastName: "", avatarUrl: "" },
          stats: { likesCount: 3, repliesCount: 0, viewsCount: 11, bookmarksCount: 0 },
          currentUserLiked: false,
          currentUserDisliked: false,
          currentUserBookmarked: false,
        },
      ],
    },
  ],
};




// export const mockCommentsByPostId = {
//   "post-101": [
//     {
//       id: "c-1",
//       postId: "post-101",
//       parentId: null,
//       content: "What grades do you take? Any carrier locked?",
//       createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
//       metrics: { score: 12 },
//       author: { id: "u-9", firstName: "Matt", lastName: "", avatarUrl: "" },
//     },
//   ],
//   "post-102": [
//     {
//       id: "c-2",
//       postId: "post-102",
//       parentId: null,
//       content: "Do you need UL/CSA? Any preference on manufacturer?",
//       createdAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
//       metrics: { score: 7 },
//       author: { id: "u-10", firstName: "Nick", lastName: "", avatarUrl: "" },
//     },
//   ],
// };
