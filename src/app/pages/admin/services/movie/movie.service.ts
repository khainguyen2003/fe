import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { injectMutation, injectQuery, mutationOptions, QueryClient, queryOptions } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { MovieUrlApi } from '../../../../shared/utils/api/admin-url-api/movie.api';
import { EpisodeData, MovieCreate, MovieFilter } from '../../models/movie.model';
import { convertObjectArrayToValueString } from '../../utils/functions/array-utils';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  key = 'movies';

  readonly #client = inject(QueryClient);
  readonly #httpClient = inject(HttpClient);

  getListOption(params: any) {
    return queryOptions({
      queryKey: [this.key, params] as const,
      staleTime: 1 * 1000,
      retry: (failureCount, error) => {
        // Chỉ thử lại nếu lỗi không phải là 404
        console.log(error);
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      queryFn: ({ queryKey }) => {
        const [_, params] = queryKey;
        const requestObj = this.createMovieFilter(params);
        return lastValueFrom(
          this.#httpClient.post<any>(MovieUrlApi.SEARCH, requestObj)
        )
      }
    });
  }

  list(params?: any) {
    return injectQuery(() => this.getListOption(params));
  }

  saveDraftMutation() {
    return mutationOptions({
      onSuccess: () => {
        return this.#client.invalidateQueries({
          queryKey: [this.key],
        });
      },
      mutationFn: (formData: FormData) => {
        return lastValueFrom(
          this.#httpClient.post<any>(MovieUrlApi.SAVE_DRAFT, formData, {reportProgress: false})
        )
      },
    })
  }

  saveDraftEpisodeMutation() {
    return mutationOptions({
      onSuccess: () => {
        return this.#client.invalidateQueries({
          queryKey: [this.key],
        });
      },
      mutationFn: (data: EpisodeData) => {
        return lastValueFrom(
          this.#httpClient.post<any>(MovieUrlApi.SAVE_DRAFT_EPISODE, data)
        )
      },
    })
  }

  uploadVideo() {
    
  }

  private createMovieFilter(object: any): MovieFilter {
    const movieFilter: MovieFilter = {
      name: object?.name ?? null,
      genre: object?.genre
      ? convertObjectArrayToValueString(object?.genre)
      : null,
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
    return movieFilter;
  }
}
