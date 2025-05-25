import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Movie, MovieFilter } from '../../models/movie.model';
import { MovieService } from '../../services/movies/movie.service';
import {TuiPagination} from '@taiga-ui/kit';
import { TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'app-movie-list',
  imports: [
    CommonModule,
    RouterLink,
    TuiPagination,
    // TuiIcon
  ],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss'
})
export class MovieListComponent implements OnInit {
  @Input()
  public initData!: any;

  pagination = {
    page: 0,
    limit: 20,
    totalPage: 0
  }

  dataSearch: MovieFilter = {
    ...this.pagination
  }

  readonly #movieService = inject(MovieService);

  public movies: Movie[] = [];

  category!: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.category = params.get('category') || '';
      this.dataSearch = {
        genre: this.category,
        ...this.pagination
      }
      this.handleSearch(this.dataSearch);
    });
  }

  protected goToPage(index: number): void {
    debugger
    this.pagination.page = index;
    this.dataSearch = {
      genre: this.category,
      ...this.pagination
    }
    this.handleSearch(this.dataSearch);
  }

  handleSearch(filter: MovieFilter) {
    if(filter.genre === 'phim-moi') {
      this.#movieService.getNewPhim(filter).subscribe((res) => {
        this.movies = res?.items;
        this.pagination = {
          page: res.paginate?.current_page - 1,
          limit: 100,
          totalPage: res.paginate?.total_page,
        }
      });
    } else {
      this.#movieService.getMoviesByGenre(filter).subscribe((res) => {
        this.movies = res?.items;
        this.pagination = {
          page: res.paginate?.current_page - 1,
          limit: 100,
          totalPage: res.paginate?.total_page,
        }
      });
    }
  }
}
