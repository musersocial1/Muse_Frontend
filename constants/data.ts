import { LongFormContent, Post } from "@/types/community";
import { VideoComment } from "@/types/post";
import { images } from "./images";

export const dummyAllPosts: Post[] = [
  {
    id: "4",
    author: {
      name: "beyonce",
      username: "@beyonceknow",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      verified: true,
    },
    content:
      'New season, new day! 💫 Whether it\'s street style, high fashion, or effortless chic, your outfit should always tell a story ✨ Today I\'m serving "bold neutrals with a pop of color" or "classic elegance with a modern twist"], because confidence is the best accessory! 💛',
    vComments: [
      images.feed4,
      images.feed5,
      images.feed6,
      images.feed1,
      images.feed2,
      images.feed3,
    ],

    timestamp: "2h",
    likes: 2678,
    comments: 893,
    type: "text",
  },
  {
    id: "1",
    author: {
      name: "beyonce",
      username: "@beyonceknow",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      verified: true,
    },
    content:
      'New season, new day! 💫 Whether it\'s street style, high fashion, or effortless chic, your outfit should always tell a story ✨ Today I\'m serving "bold neutrals with a pop of color" or "classic elegance with a modern twist"], because confidence is the best accessory! 💛',
    timestamp: "2h",
    likes: 2678,
    comments: 893,
    type: "text",
  },
  {
    id: "2",
    author: {
      name: "beyonce",
      username: "@beyonceknow",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      verified: true,
    },
    content:
      'New season, new day! 💫 Whether it\'s street style, high fashion, or effortless chic, your outfit should always tell a story ✨ Today I\'m serving "bold neutrals with a pop of color" or "classic elegance with a modern twist"], because confidence is the best accessory! 💛',
    videos: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=400&h=300&fit=crop",
    ],
    timestamp: "2h",
    likes: 2678,
    thumbnail: images.latest2,
    comments: 893,
    type: "video",
  },
  {
    id: "3",
    author: {
      name: "beyonce",
      username: "@beyonceknow",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      verified: true,
    },
    content:
      'New season, new day! 💫 Whether it\'s street style, high fashion, or effortless chic, your outfit should always tell a story ✨ Today I\'m serving "bold neutrals with a pop of color" or "classic elegance with a modern twist"], because confidence is the best accessory! 💛',
    images: [
      images.feed4,
      images.feed5,
      images.feed6,
      images.feed1,
      images.feed2,
      images.feed3,
    ],

    timestamp: "2h",
    likes: 2678,
    comments: 893,
    type: "image",
  },

  {
    id: "6",
    author: {
      name: "beyonce",
      username: "@beyonceknow",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      verified: true,
    },
    content:
      'New season, new day! 💫 Whether it\'s street style, high fashion, or effortless chic, your outfit should always tell a story ✨ Today I\'m serving "bold neutrals with a pop of color" or "classic elegance with a modern twist"], because confidence is the best accessory! 💛',
    timestamp: "2h",
    likes: 2678,
    comments: 893,
    type: "text",
  },
];

export const dummyLongFormContent: LongFormContent[] = [
  {
    id: "1",
    title: "The travails of being a dancer in the modern age",
    thumbnail:
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=250&fit=crop",
    duration: "45:54",
    price: 32,
    isLocked: true,
    description:
      "An in-depth exploration of the challenges and rewards of pursuing dance professionally in today's world.",
  },
  {
    id: "2",
    title: "Mastering Contemporary Dance Techniques",
    thumbnail:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=250&fit=crop",
    duration: "38:22",
    price: 25,
    isLocked: true,
    description:
      "Advanced techniques and methods for contemporary dance, from basic movements to complex choreography.",
  },
  {
    id: "3",
    title: "Building Your Dance Career from Scratch",
    thumbnail:
      "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=250&fit=crop",
    duration: "52:18",
    price: 45,
    isLocked: true,
    description:
      "Essential strategies for building a successful dance career, including networking, auditions, and business skills.",
  },
  {
    id: "4",
    title: "Mental Health for Professional Dancers",
    thumbnail:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
    duration: "29:45",
    price: 20,
    isLocked: true,
    description:
      "Understanding and maintaining mental wellness as a professional dancer in a competitive industry.",
  },
  {
    id: "5",
    title: "Dance Studio Business Management",
    thumbnail:
      "https://images.unsplash.com/photo-1594736797933-d0301ba2fe65?w=400&h=250&fit=crop",
    duration: "41:33",
    price: 35,
    isLocked: true,
    description:
      "Complete guide to running a successful dance studio, from operations to marketing and finance.",
  },
  {
    id: "6",
    title: "International Dance Competitions Guide",
    thumbnail:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
    duration: "36:12",
    price: 28,
    isLocked: true,
    description:
      "Navigate the world of international dance competitions with expert tips and insider knowledge.",
  },
];

export const moderators = [
  {
    id: "1",
    name: "Grund jhay",
    email: "officialgrund@gmail.com",
    status: "pending",
    initials: "GJ",
  },
];

export const user = {
  name: "beyonce",
  username: "@beyonceknowle",
  profileImage:
    "https://images.unsplash.com/photo-1494790108755-2616c2e8e0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
  verified: true,
  communities: [
    {
      id: "1",
      name: "K.Dots community",
      memberCount: 456,
      profileImage:
        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
      memberImages: [
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
      ],
    },
    {
      id: "2",
      name: "Creative Minds",
      memberCount: 512,
      profileImage:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
      memberImages: [
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
        "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
      ],
    },
    {
      id: "3",
      name: "Innovators Hub",
      memberCount: 389,
      profileImage:
        "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
      memberImages: [
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
        "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
        "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
      ],
    },
  ],
};

export const videoComments: VideoComment[] = [
  {
    id: "1",
    thumbnail:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop&q=80",
    posterUri:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1200&fit=crop&q=80",
    videoUri:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1080&h=1920&fit=crop&q=80",
    likes: 3400,
    comments: 156,
    description: "New season, new slay! 🔥 Whether it's street style...",
    user: {
      name: "sarah_smith",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    replyingTo: {
      name: "john_doe",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
  },
  {
    id: "2",
    thumbnail:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop&q=80",
    posterUri:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1200&fit=crop&q=80",
    videoUri:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1080&h=1920&fit=crop&q=80",
    likes: 3100,
    comments: 89,
    description: "Couple goals ✨ spreading joy together.",
    user: {
      name: "mike_johnson",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    replyingTo: {
      name: "sarah_smith",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
  },
  {
    id: "3",
    thumbnail:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=600&fit=crop&q=80",
    posterUri:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=1200&fit=crop&q=80",
    videoUri:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1080&h=1920&fit=crop&q=80",
    likes: 2800,
    comments: 120,
    description: "Nature vibes 🌿 living the moment.",
    user: {
      name: "lisa_brown",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    replyingTo: {
      name: "mike_johnson",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    },
  },
  {
    id: "4",
    thumbnail:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=600&fit=crop&q=80",
    posterUri:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&h=1200&fit=crop&q=80",
    videoUri:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=1080&h=1920&fit=crop&q=80",
    likes: 4500,
    comments: 210,
    description: "Squad energy 💯 nothing beats friendship.",
    user: {
      name: "groupie_gang",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    },
    replyingTo: {
      name: "lisa_brown",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    },
  },
  {
    id: "5",
    thumbnail:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=600&fit=crop&q=80",
    posterUri:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=1200&fit=crop&q=80",
    videoUri:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1080&h=1920&fit=crop&q=80",
    likes: 1900,
    comments: 74,
    description: "Food is love ❤️ comfort on a plate.",
    user: {
      name: "foodie_queen",
      avatar: "https://randomuser.me/api/portraits/women/14.jpg",
    },
    replyingTo: {
      name: "groupie_gang",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    },
  },
  {
    id: "6",
    thumbnail:
      "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=400&h=600&fit=crop&q=80",
    posterUri:
      "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=800&h=1200&fit=crop&q=80",
    videoUri:
      "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=1080&h=1920&fit=crop&q=80",
    likes: 3600,
    comments: 98,
    description: "Eyes tell a thousand stories 👀.",
    user: {
      name: "james_clark",
      avatar: "https://randomuser.me/api/portraits/men/36.jpg",
    },
    replyingTo: {
      name: "foodie_queen",
      avatar: "https://randomuser.me/api/portraits/women/14.jpg",
    },
  },
  {
    id: "7",
    thumbnail:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop&q=80",
    posterUri:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1200&fit=crop&q=80",
    videoUri:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1080&h=1920&fit=crop&q=80",
    likes: 2200,
    comments: 64,
    description: "Laughter is contagious 😂✨.",
    user: {
      name: "laughing_lucy",
      avatar: "https://randomuser.me/api/portraits/women/21.jpg",
    },
    replyingTo: {
      name: "james_clark",
      avatar: "https://randomuser.me/api/portraits/men/36.jpg",
    },
  },
  {
    id: "8",
    thumbnail:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop&q=80",
    posterUri:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1200&fit=crop&q=80",
    videoUri:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1080&h=1920&fit=crop&q=80",
    likes: 5100,
    comments: 342,
    description: "Streetwear season 🖤 keep it bold.",
    user: {
      name: "style_master",
      avatar: "https://randomuser.me/api/portraits/men/51.jpg",
    },
    replyingTo: {
      name: "laughing_lucy",
      avatar: "https://randomuser.me/api/portraits/women/21.jpg",
    },
  },
  {
    id: "9",
    thumbnail:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop&q=80",
    posterUri:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1200&fit=crop&q=80",
    videoUri:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1080&h=1920&fit=crop&q=80",
    likes: 3900,
    comments: 201,
    description: "Daily hustle, daily shine 💪.",
    user: {
      name: "grace_hopper",
      avatar: "https://randomuser.me/api/portraits/women/19.jpg",
    },
    replyingTo: {
      name: "style_master",
      avatar: "https://randomuser.me/api/portraits/men/51.jpg",
    },
  },
  {
    id: "10",
    thumbnail:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=600&fit=crop&q=80",
    posterUri:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&h=1200&fit=crop&q=80",
    videoUri:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=1080&h=1920&fit=crop&q=80",
    likes: 4000,
    comments: 110,
    description: "Confidence is the best outfit 👗.",
    user: {
      name: "sophia_turner",
      avatar: "https://randomuser.me/api/portraits/women/67.jpg",
    },
    replyingTo: {
      name: "grace_hopper",
      avatar: "https://randomuser.me/api/portraits/women/19.jpg",
    },
  },
  {
    id: "11",
    thumbnail:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop&q=80",
    posterUri:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1200&fit=crop&q=80",
    videoUri:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1080&h=1920&fit=crop&q=80",
    likes: 6200,
    comments: 540,
    description: "Joy shared is joy multiplied 🎉.",
    user: {
      name: "party_people",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    },
    replyingTo: {
      name: "sophia_turner",
      avatar: "https://randomuser.me/api/portraits/women/67.jpg",
    },
  },
  {
    id: "12",
    thumbnail:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&q=80",
    posterUri:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1200&fit=crop&q=80",
    videoUri:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1080&h=1920&fit=crop&q=80",
    likes: 2700,
    comments: 97,
    description: "Choose happiness every day ☀️.",
    user: {
      name: "emma_watson",
      avatar: "https://randomuser.me/api/portraits/women/24.jpg",
    },
    replyingTo: {
      name: "party_people",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    },
  },
];

export const textComments = [
  {
    id: "1",
    author: {
      name: "Jhayjameson",
      username: "@Jhayjameson",
      profileImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
    },
    content:
      'New season, new slay! 🔥 Whether it\'s street style, high fashion, or effortless chic, your outfit should always tell a story. 💅✨ Today, I\'m serving "bold neutrals with a pop of color" or "classic elegance with a modern twist"], because confidence is the best accessory! 👑',
    timestamp: "2h",
    likes: 2678,
    replies: 653,
  },
  {
    id: "2",
    author: {
      name: "Jhayjameson",
      username: "@Jhayjameson",
      profileImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
    },
    content:
      'New season, new slay! 🔥 Whether it\'s street style, high fashion, or effortless chic, your outfit should always tell a story. 💅✨ Today, I\'m serving "bold neutrals with a pop of color" or "classic elegance with a modern twist"], because confidence is the best accessory! 👑',
    timestamp: "2h",
    likes: 2678,
    replies: 653,
  },
];

export const MOCK_USER = {
  name: "Marysnyder_",
  avatar: "https://randomuser.me/api/portraits/women/1.jpg",
};
export const MOCK_REPLY_TO = {
  name: "Stella martins",
  avatar: "https://randomuser.me/api/portraits/women/2.jpg",
};
export const MOCK_POSTER =
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=687&q=80";
