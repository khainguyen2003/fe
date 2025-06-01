import { CommonFilterField } from "./common.model";

export interface Genre {
  id: number;
  name: string;
  slug: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  selected?: boolean;
}

export interface GenreFilter extends CommonFilterField {
  id?: string | null;
  search?: string | null;
}

export interface GenreCreate {
  name: string;
  slug?: string | null;
  displayOrder?: number | null;
}

export interface GenreUpdate {
  id: number;
  name: string;
  slug?: string | null;
  displayOrder?: number | null;
}