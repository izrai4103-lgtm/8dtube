export interface Video {
  id: string;
  title: string;
  channelId: string;
  channelTitle: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: string;
  likeCount: string;
  duration: string;
  description: string;
  score: number;
}

export interface Category {
  id: string;
  title: string;
}

export interface Channel {
  id: string;
  title: string;
  avatar: string;
  subscriberCount: string;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  likeCount: string;
  publishedAt: string;
}

export interface WatchData {
  video: Video | null;
  channel: Channel | null;
  related: Video[];
  comments: Comment[];
}

export interface CinemaProfile {
  mode: string;
  saturate: number;
  contrast: number;
  brightness: number;
  hueRotate: number;
  depth: number;
  glow: string;
  note: string;
}
