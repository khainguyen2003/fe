import { Movie, MovieFilter } from './../../models/movie.model';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  readonly #http = inject(HttpClient);
  constructor() { }

  getMoviesByGenre(filter: MovieFilter): Observable<any> {
    return this.#http.get<any>(`https://phim.nguonc.com/api/films/the-loai/${filter.genre}?page=${filter.page + 1}`);
  }

  getNewPhim(filter: MovieFilter) {
    return this.#http.get<any>(`https://phim.nguonc.com/api/films/phim-moi-cap-nhat?page=${filter.page + 1}`);
  }

  getMovieBySlug(slug: string): Observable<any> {
    return this.#http.get<any>(`https://phim.nguonc.com/api/film/${slug}`);
  }
}
