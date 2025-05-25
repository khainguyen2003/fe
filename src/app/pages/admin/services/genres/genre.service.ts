import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateQueryResult, injectQuery, Mutation, QueryClient, QueryObserverResult, queryOptions } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { GenreUrlApi } from '../../../../shared/utils/api/admin-url-api/genre.api';
import { GenreFilter } from '../../models/genre.model';
import { convertObjectArrayToValueString } from '../../utils/functions/array-utils';

@Injectable({
  providedIn: 'root'
})
export class GenreService {
  key = 'genre';

  readonly #client = inject(QueryClient);
  readonly #mutation = inject(Mutation);
  readonly #httpClient = inject(HttpClient);

  getListOption(params: any) {
    return queryOptions({
      queryKey: [this.key, params] as const,
      staleTime: 1 * 1000,
      queryFn: ({ queryKey }) => {
        const [_, params] = queryKey;
        const requestObj = this.createGenreFilter(params);
        return lastValueFrom(
          this.#httpClient.post<any>(GenreUrlApi.SEARCH, requestObj)
        )
      }
    });
  }

  list(params?: any): CreateQueryResult<QueryObserverResult<any, Error>> {
    return injectQuery(() => this.getListOption(params));
  }

  private createGenreFilter(object: any): GenreFilter {
    const paymentFilter: GenreFilter = {
      id: object?.id ? convertObjectArrayToValueString(object.id) : null,
      isActive: object?.isActive
        ? convertObjectArrayToValueString(object?.isActive)
        : null,
      status: object?.status
        ? convertObjectArrayToValueString(object?.status)
        : null,
      page: object?.pagination?.currentPage,
      limit: object?.pagination?.itemPerpage,
      sort: 'id,desc',
    };
    return paymentFilter;
  }
}
