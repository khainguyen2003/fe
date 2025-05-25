import { CommonField, CommonFilterField } from "./common.model";

export interface Movie  extends CommonField {
  name: string;
  originalName: string;
  slug: string;
  director: string;
  description: string;
  releaseDate: Date;
  episodeNumber: number;
  time: number;
  quality: string;
  ratingAvg: string;
  thumbUrl: string;
  posterUrl: string;
  trailerUrl: string;
  views: number;
  souces: string;
  movieType: number;
  casts: string;
  createdAt: string;
}

export interface MovieFilter extends CommonFilterField {
  genre?: string | null;
  name?: string | null;
  desc?: string | null;
}

export interface MovieCreate {
  name: string;
  director: string;
  description?: string | null;
  releaseDate: Date;
  episodes: number;
  durationMinutes: number;
  poster: File;
  thumb: string;
  trailerUrl: string;
  souces: string;
  totalEpisodes?: number | null;
}

export interface EpisodeData {
  episodeNumber?: number | null;
  title: string;
  description: string;
  sourceUrl: string;
  index?: number | null; // For editing
}