import { Movie, MovieFilter } from './../../models/movie.model';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MovieUrlApi } from '../../../../shared/utils/api/admin-url-api/movie.api';
import { convertArrayToString, toLongArray } from '../../../../shared/utils/functions/array-utils';
import { MovieRequest } from '../../../admin/models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private readonly http = inject(HttpClient);
  constructor() { }

  getList(params: any): Observable<any> {
    const requestObj = this.createMovieFilter(params);
    return this.http.post<any>(MovieUrlApi.SEARCH, requestObj);
  }

  private createMovieFilter(object: any): MovieFilter {
    const filter: MovieFilter = {
      search: object?.search ?? null,
      type: object?.type ? toLongArray(object?.type) : null,
      status: object?.status ? toLongArray(object?.status) : null,
      page: object?.pagination?.currentPage,
      limit: object?.pagination?.itemPerpage,
      sort: 'id,desc',
    };
    return filter;
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(MovieUrlApi.GET_BY_ID + "/" + id);
  }

  getGenreOnSelect(params: any): Observable<any> {
    return this.http.post<any>(MovieUrlApi.GET_ALL_ACTIVE, params);
  }

  saveDraft(data: FormData): Observable<any> {
    return this.http.post<any>(MovieUrlApi.SAVE_DRAFT, data);
  }

  updateDraft(id: number, data: FormData): Observable<any> {
    return this.http.post<any>(MovieUrlApi.UPDATE_DRAFT + "/" + id, data);
  }

  delete(ids: number[]): Observable<any> {
    const requestBody = { ids: convertArrayToString(ids) };
    return this.http.post<any>(MovieUrlApi.DELETE, requestBody);
  }

  getMoviesByGenre(filter: MovieFilter): Observable<any> {
    return this.http.get<any>(`https://phim.nguonc.com/api/films/the-loai/${filter.genre}?page=${filter.page + 1}`);
  }

  getNewPhim(filter: MovieFilter) {
    return this.http.get<any>(`https://phim.nguonc.com/api/films/phim-moi-cap-nhat?page=${filter.page + 1}`);
  }

  getMovieBySlug(slug: string): Observable<any> {
    return this.http.get<any>(`https://phim.nguonc.com/api/film/${slug}`);
  }
}
