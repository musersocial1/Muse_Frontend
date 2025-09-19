export interface VideoComment {
  id: string;
  thumbnail: string; // grid thumbnail
  videoUri: string; // fullscreen video or placeholder
  posterUri: string; // cover/poster image
  likes: number; // number of likes
  comments: number; // number of comments
  description: string; // caption / description
  user: {
    name: string;
    avatar: string;
  };
  replyingTo: {
    name: string;
    avatar: string;
  };
}
