import { LongFormContent, Post } from "@/types/community";
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
      "https://firebasestorage.googleapis.com/v0/b/davis-d2094.appspot.com/o/muse%2F11057646-hd_1080_1920_30fps.mp4?alt=media&token=9dfac30d-42aa-4814-929a-31c7687f5358",
      "https://firebasestorage.googleapis.com/v0/b/davis-d2094.appspot.com/o/muse%2F4098943-uhd_4096_2160_25fps.mp4?alt=media&token=4f25bdf9-67bf-4d9c-b5d3-06c05477a708",
      "https://firebasestorage.googleapis.com/v0/b/davis-d2094.appspot.com/o/muse%2F4098950-uhd_4096_2160_25fps.mp4?alt=media&token=d5953e8e-ba25-4304-867e-b92e309f0d40",
      "https://firebasestorage.googleapis.com/v0/b/davis-d2094.appspot.com/o/muse%2F4100353-uhd_4096_2160_25fps.mp4?alt=media&token=1689dcb6-5908-4d37-b655-683390b7f1ea",
      "https://firebasestorage.googleapis.com/v0/b/davis-d2094.appspot.com/o/muse%2F4110294-uhd_3840_2160_30fps.mp4?alt=media&token=873ec58f-8854-49d0-b46e-e4a0db23f817",
      "https://firebasestorage.googleapis.com/v0/b/davis-d2094.appspot.com/o/muse%2F4435751-uhd_3840_2160_25fps.mp4?alt=media&token=1f6a023f-08ac-4862-a4b5-970244533185",
      "https://firebasestorage.googleapis.com/v0/b/davis-d2094.appspot.com/o/muse%2F5528018-uhd_2160_3840_25fps.mp4?alt=media&token=4ff3d444-ff1d-4400-b3a1-ea45b7d7e4d2",
      "https://firebasestorage.googleapis.com/v0/b/davis-d2094.appspot.com/o/muse%2F7426713-hd_1080_1920_25fps.mp4?alt=media&token=43904d7d-c8b4-4544-9beb-ab3c19955ce3",
      "https://firebasestorage.googleapis.com/v0/b/davis-d2094.appspot.com/o/muse%2F7660481-uhd_3840_2160_25fps.mp4?alt=media&token=ac9948b2-36b0-4137-8e3d-cc6cc35a96ce",
      "https://firebasestorage.googleapis.com/v0/b/davis-d2094.appspot.com/o/muse%2F8632780-uhd_3840_2160_25fps.mp4?alt=media&token=af3e14df-ebe5-4356-bdff-64cdddc53772",
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

export const videoComments = [
  {
    id: "1",
    thumbnail: "https://picsum.photos/id/1011/400/600", // smiling woman
    likes: "3.4k",
    title: "New season, new slay! 🔥 Whether it's street style...",
  },
  {
    id: "2",
    thumbnail: "https://picsum.photos/id/1012/400/600", // couple laughing
    likes: "3.4k",
    title: "New season, new slay! 🔥 Whether it's street style...",
  },
  {
    id: "3",
    thumbnail: "https://picsum.photos/id/1015/400/600", // outdoor portrait
    likes: "3.4k",
    title: "New season, new slay! 🔥 Whether it's street style...",
  },
  {
    id: "4",
    thumbnail: "https://picsum.photos/id/1016/400/600", // group shot
    likes: "3.4k",
    title: "New season, new slay! 🔥 Whether it's street style...",
  },
  {
    id: "5",
    thumbnail: "https://picsum.photos/id/1021/400/600", // food shot
    likes: "3.4k",
    title: "New season, new slay! 🔥 Whether it's street style...",
  },
  {
    id: "6",
    thumbnail: "https://picsum.photos/id/1027/400/600", // portrait close-up
    likes: "3.4k",
    title: "New season, new slay! 🔥 Whether it's street style...",
  },
  {
    id: "7",
    thumbnail: "https://picsum.photos/id/1035/400/600", // candid laughing
    likes: "3.4k",
    title: "New season, new slay! 🔥 Whether it's street style...",
  },
  {
    id: "8",
    thumbnail: "https://picsum.photos/id/1040/400/600", // stylish outdoor
    likes: "3.4k",
    title: "New season, new slay! 🔥 Whether it's street style...",
  },
  {
    id: "9",
    thumbnail: "https://picsum.photos/id/1052/400/600", // lifestyle scene
    likes: "3.4k",
    title: "New season, new slay! 🔥 Whether it's street style...",
  },
  {
    id: "10",
    thumbnail: "https://picsum.photos/id/1062/400/600", // portrait close-up
    likes: "3.4k",
    title: "New season, new slay! 🔥 Whether it's street style...",
  },
  {
    id: "11",
    thumbnail: "https://picsum.photos/id/1074/400/600", // joyful group
    likes: "3.4k",
    title: "New season, new slay! 🔥 Whether it's street style...",
  },
  {
    id: "12",
    thumbnail: "https://picsum.photos/id/1084/400/600", // cheerful vibe
    likes: "3.4k",
    title: "New season, new slay! 🔥 Whether it's street style...",
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
