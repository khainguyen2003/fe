import { BaseModel, CommonFilterField } from "./common.model";
import { Genre } from "./genre.model";

export interface Movie extends BaseModel {
  name: string;
  slug: string;
  originalName: string;
  thumbUrl: string;
  posterUrl: string;
  created: string; // hoặc Date nếu bạn parse thành Date
  modified: string; // hoặc Date nếu bạn parse thành Date
  description: string;
  totalEpisodes: number;
  currentEpisode: string;
  genres: Genre[];
  totalViews: number;
  time: string;
  quality: string;
  language: string;
  director: string;
  casts: string;
  status: number;
  type: number;
}

export interface MovieFilter extends CommonFilterField {
  genreIds?: number[] | null;
  search?: string | null;
  episode_number?: number | null;
  type?: number[] | null;
  status?: number[] | null;
}


export interface MovieRequest {
  name: string;
  originalName?: string;
  slug?: string;
  description?: string;
  thumbnailUrl?: string;
  thumbFile?: File;
  trailerUrl?: string;
  status: number; // enum cần định nghĩa
  type: number;
  releaseYear?: number;
  duration?: number;
  quality?: number;
  language?: string;
  genreIds?: number[];
  tagIds?: number[];
  countryIds?: number[];
  directorIds?: number[];
}
