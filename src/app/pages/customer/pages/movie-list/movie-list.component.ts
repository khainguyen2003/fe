import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Movie, MovieFilter } from '../../models/movie.model';
import { MovieService } from '../../services/movies/movie.service';
import { MOVIE_STATUS, MOVIE_TYPES } from '../../../../shared/constants/constants';
import { Option } from '../../../admin/models/common.model';

@Component({
  selector: 'app-movie-list',
  imports: [
    CommonModule,
    RouterLink,
  ],
  standalone: true,
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

  // Thuộc tính phân trang
  page: number = 1;
  totalPages: number = 5;
  totalItems: number = 0;
  itemsPerPage: number = 10;

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

  onPageChange(newPage: number): void {
    if (newPage > 0 && newPage <= this.totalPages) {
      this.page = newPage;
      // Trong thực tế sẽ gọi API với tham số page mới
      console.log('Đã chuyển đến trang:', newPage);
    }
  }

  getPageArray(): number[] {
    const pages: number[] = [];
    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.totalPages = totalPages;
    
    // Hiển thị tối đa 5 trang
    const maxPagesToShow = 5;
    let startPage: number;
    let endPage: number;
    
    if (totalPages <= maxPagesToShow) {
      // Nếu tổng số trang ít hơn hoặc bằng max, hiển thị tất cả
      startPage = 1;
      endPage = totalPages;
    } else {
      // Nếu nhiều trang, tính toán phạm vi hiển thị xung quanh trang hiện tại
      const maxPagesBeforeCurrentPage = Math.floor(maxPagesToShow / 2);
      const maxPagesAfterCurrentPage = Math.ceil(maxPagesToShow / 2) - 1;
      
      if (this.page <= maxPagesBeforeCurrentPage) {
        // Nếu đang ở gần trang đầu
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (this.page + maxPagesAfterCurrentPage >= totalPages) {
        // Nếu đang ở gần trang cuối
        startPage = totalPages - maxPagesToShow + 1;
        endPage = totalPages;
      } else {
        // Ở giữa
        startPage = this.page - maxPagesBeforeCurrentPage;
        endPage = this.page + maxPagesAfterCurrentPage;
      }
    }
    
    // Tạo mảng các số trang
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
}
