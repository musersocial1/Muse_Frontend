import { ImageSourcePropType } from "react-native";

export interface Category {
  id: number;
  name: string;
  color: string;
  img: ImageSourcePropType;
}

export interface Story {
  id: number;
  title: string;
  category: string;
  categoryLabel: string;
  creator: string;
  creatorType: string;
  muses: string;
  image: ImageSourcePropType;
}

export interface Podcast {
  id: number;
  title: string;
  creator: string;
  creatorType: string;
  image: any;
  backgroundColor: string;
  shadowColor: string;
}

export interface PodcastItem {
  id: number;
  title: string;
  creator: string;
  image: any;
}
