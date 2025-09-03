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
  content: string;
  images?: string[];
  timestamp: string;
  likes: number;
  comments: number;
  type: "text" | "image" | "longform";
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
