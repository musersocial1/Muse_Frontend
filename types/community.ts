export interface CommunityData {
  name: string;
  coverImage: string;
  bio: string;
  categories: string[];
  price: string;
  isPrivate: boolean;
  isPaidCommunity: boolean;
  guidelines: string;
  links: string[];
  coverImageKey: string;
  coverImageUploadUrl: string;
}

export interface Post {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  communityName?: string;
  content: string;
  thumbnail?: number;
  images?: (string | number)[];
  aspectRatio?: "1:1" | "4:5" | "16:9"; // Optional aspect ratio for image posts
  vComments?: Array<{
    type: "image" | "video";
    url: string;
  }>;
  videos?: string[];
  timestamp: string;
  likes: number;
  comments: number;
  type: "text" | "image" | "longform" | "video";
}

export interface LongFormContent {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  price: number;
  isLocked: boolean;
  description?: string;
}
