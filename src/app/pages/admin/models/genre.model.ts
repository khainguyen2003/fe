import { CommonField, CommonFilterField } from "./common.model";

export interface Genre extends CommonField{
  name: string;
  title: string;
  slug: string;
  displayOrder: number;

}


export interface GenreFilter extends CommonFilterField {
  id?: string | null;
  name?: string | null;
}

export interface GenreCreate {
  name: string;
  title: string;
  slug?: string | null;
  displayOrder?: number | null;
}

export interface GenreUpdate {
  id: number;
  name: string;
  title: string;
  slug?: string | null;
  displayOrder?: number | null;
}