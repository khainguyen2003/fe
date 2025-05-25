import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Movie {
  id?: string | number;
  title: string;
  description: string;
  releaseYear: number;
  director?: string;
  posterUrl?: string;
  genre?: string;
}

export interface AdminBaseResponse {
  code: number;
  message: string;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private baseUrl = '/api/admin/movies'; // URL API đúng với backend

  constructor(private http: HttpClient) { }

  addMovie(movie: Movie): Observable<AdminBaseResponse> {
    // Sử dụng endpoint save-draft để lưu phim dưới dạng bản nháp
    return this.http.post<AdminBaseResponse>(`${this.baseUrl}/save-draft`, movie);
  }
  
  // Thêm các phương thức khác nếu cần
  saveAndApprove(movie: Movie): Observable<AdminBaseResponse> {
    return this.http.post<AdminBaseResponse>(`${this.baseUrl}/save-approve`, movie);
  }
  
  saveAndSendApprove(movie: Movie): Observable<AdminBaseResponse> {
    return this.http.post<AdminBaseResponse>(`${this.baseUrl}/save-send-approve`, movie);
  }
}
