  import { HttpClient } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { Observable } from 'rxjs';
  import { GenreUrlApi } from '../../../../shared/utils/api/admin-url-api/genre.api';
  import { convertArrayToString, convertObjectArrayToValueString } from '../../../../shared/utils/functions/array-utils';
  import { GenreCreate, GenreFilter, GenreUpdate } from '../../models/genre.model';

  @Injectable({
    providedIn: 'root',
  })
  export class GenreService {
    
    constructor(private http: HttpClient) {}

    getList(params: any): Observable<any> {
      const requestObj = this.createGenreFilter(params);
      return this.http.post<any>(GenreUrlApi.SEARCH, requestObj);
    }

    getAllGenre() {
      return this.http.post<any>(GenreUrlApi.SEARCH, {page: 1, limit: 1000});
    }

    private createGenreFilter(object: any): GenreFilter {
      const filter: GenreFilter = {
        id: object?.id ? convertObjectArrayToValueString(object.id) : null,
        search: object?.search ?? null,
        page: object?.pagination?.currentPage,
        limit: object?.pagination?.itemPerpage,
        sort: 'id,desc',
      };
      return filter;
    }

    getById(id: number): Observable<any> {
      return this.http.get<any>(GenreUrlApi.GET_BY_ID + "/" + id);
    }

    getGenreOnSelect(params: any): Observable<any> {
      return this.http.post<any>(GenreUrlApi.GET_ALL_ACTIVE, params);
    }

    saveDraft(data: GenreCreate): Observable<any> {
      return this.http.post<any>(GenreUrlApi.SAVE_DRAFT, data);
    }

    updateDraft(data: GenreUpdate): Observable<any> {
      return this.http.put<any>(GenreUrlApi.UPDATE_DRAFT + "/" + data.id, data);
    }

    delete(ids: number[]): Observable<any> {
      const requestBody = { ids: convertArrayToString(ids) };
      return this.http.post<any>(GenreUrlApi.DELETE, requestBody);
    }
  }
