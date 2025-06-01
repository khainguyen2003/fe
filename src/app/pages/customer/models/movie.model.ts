import { CommonFilterField } from "./common.model";

export interface Movie {
  name: string;
  slug: string;
  original_name: string;
  thumb_url: string;
  poster_url: string;
  created: string; // hoặc Date nếu bạn parse thành Date
  modified: string; // hoặc Date nếu bạn parse thành Date
  description: string;
  total_episodes: number;
  current_episode: string;
  time: string;
  quality: string;
  language: string;
  director: string;
  casts: string;
  genre: string;
  
}

export interface MovieFilter extends CommonFilterField {
  genre?: string | null;
  search?: string | null;
  episode_number?: number | null;
  type?: number[] | null;
  status?: number[] | null;
}