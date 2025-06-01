import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DirectorUrlApi } from '../../../shared/utils/api/admin-url-api/director.api';
import { ApiResponse, PaginatedResponse } from '../models/common.model';
import { Director, DirectorFilter, DirectorPayload } from '../models/director.model';

@Injectable({
  providedIn: 'root'
})
export class DirectorService {

  constructor(private http: HttpClient) { }

  getList(params: any): Observable<any> {
    const requestObj = this.createDirectorFilter(params);
    return this.http.post<ApiResponse<PaginatedResponse<Director>>>(DirectorUrlApi.SEARCH, requestObj)
      .pipe(
        map(response => response.data)
      );
  }

  private createDirectorFilter(object: any): DirectorFilter {
    const filter: DirectorFilter = {
      search: object?.search ?? null,
      page: object?.pagination?.currentPage,
      limit: object?.pagination?.itemPerpage,
      sort: 'id,desc',
    };
    return filter;
  }

  /**
   * Lấy chi tiết đạo diễn theo ID
   */
  getDirectorById(id: number): Observable<Director> {
    return this.http.get<ApiResponse<Director>>(`${DirectorUrlApi.GET_BY_ID}/${id}`)
      .pipe(
        map(response => response.data)
      );
  }

  /**
   * Tạo đạo diễn mới
   */
  createDirector(payload: DirectorPayload): Observable<Director> {
    // Sử dụng FormData nếu có file upload
    const formData = new FormData();
    Object.keys(payload).forEach(key => {
      if (key === 'avatar' && payload.avatar instanceof File) {
        formData.append('avatar', payload.avatar, payload.avatar.name);
      } else if (payload[key as keyof DirectorPayload] !== undefined && payload[key as keyof DirectorPayload] !== null) {
        formData.append(key, String(payload[key as keyof DirectorPayload]));
      }
    });

    return this.http.post<ApiResponse<Director>>(DirectorUrlApi.SAVE_DRAFT, formData)
      .pipe(
        map(response => response.data)
      );
  }

  /**
   * Cập nhật đạo diễn
   */
  updateDirector(id: number, payload: DirectorPayload): Observable<Director> {
    // Sử dụng FormData nếu có file upload
    const formData = new FormData();
    Object.keys(payload).forEach(key => {
      if (key === 'avatar' && payload.avatar instanceof File) {
        formData.append('avatar', payload.avatar, payload.avatar.name);
      } else if (payload[key as keyof DirectorPayload] !== undefined && payload[key as keyof DirectorPayload] !== null) {
        formData.append(key, String(payload[key as keyof DirectorPayload]));
      }
    });

    return this.http.put<ApiResponse<Director>>(`${DirectorUrlApi.UPDATE_DRAFT}/${id}`, formData)
      .pipe(
        map(response => response.data)
      );
  }

  /**
   * Xóa đạo diễn
   */
  deleteDirector(id: number): Observable<boolean> {
    return this.http.delete<ApiResponse<boolean>>(`${DirectorUrlApi.DELETE}/${id}`)
      .pipe(
        map(response => response.data)
      );
  }
}
