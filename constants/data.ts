import { LongFormContent, Post } from "@/types/community";

export const dummyAllPosts: Post[] = [
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
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    timestamp: "2h",
    likes: 2678,
    comments: 893,
    type: "image",
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
