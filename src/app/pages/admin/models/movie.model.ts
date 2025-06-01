import { Genre } from "./genre.model";

export interface Movie {
  id: number;
  name: string;
  slug: string;
  description: string;
  content: string;
  thumbnailUrl: string;
  posterUrl: string;
  trailerUrl: string;
  language: string;
  country: string;
  year: number;

  // Danh sách thể loại (genre)
  genres: Genre[];

  // Enum: Loại phim (lẻ, bộ, TV Show)
  type: number;

  // Trạng thái hiển thị (DRAFT / PUBLISHED / REJECTED)
  status: number;

  // Cờ hoạt động
  isActive: boolean;

  // SEO
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;

  // Tạo / cập nhật
  createdAt: string;     // ISO date string
  updatedAt: string;

  // Người tạo / cập nhật
  createdBy: string;
  updatedBy: string;

  // Tổng số tập (nếu là phim bộ)
  totalEpisodes?: number;

  // Số lượt xem
  viewCount: number;
}


