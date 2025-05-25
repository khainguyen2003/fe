import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BannerUrlApi } from '../../../shared/utils/url-api/banner.api';
import { Observable } from 'rxjs';
import { Banner } from '../models/banner.model';

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  readonly #http = inject(HttpClient);
  
  constructor() { }

  getBanner(): Observable<Banner[]> {
    return this.#http.get<Banner[]>(BannerUrlApi.SEARCH);
  }
}
