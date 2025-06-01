import { Component, inject, OnInit } from '@angular/core';
import { Banner } from '../../models/banner.model';
import { BannerService } from '../../services/banner-service.service';
import { GenreMovieListComponent } from "../../components/genre-movie-list/genre-movie-list.component";
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movies/movie.service';

@Component({
  selector: 'app-home',
  imports: [GenreMovieListComponent],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  readonly #bannerService = inject(BannerService);
  readonly #movieService = inject(MovieService);

  bannerMovies: Banner[] | null = null;
  bannerMovie: Banner | null = null;

  phimBo: Movie[] = [];
  phimMoiCapNhat: Movie[] = [];
  phimLe: Movie[] = [];
  
  ngOnInit() {
    this.searchBanner();
    this.searchNewMovies();
    this.searchPhimLe();
    this.searchPhimBo();
  }

  searchBanner() {
    this.#bannerService.getBanner().subscribe((res) => {
      this.bannerMovies = res;
      this.initBanner(this.bannerMovies);
    })
  }

  searchNewMovies() {
    this.#movieService.getNewPhim({
      page: 0,
      limit: 10
    }).subscribe((res) => {
      this.phimMoiCapNhat = res?.items
    })
  }

  searchPhimLe() {
    this.#movieService.getMoviesByGenre({
      genre: 'phim-le',
      page: 0,
      limit: 10
    }).subscribe((res) => {
      this.phimLe = res?.items
    })
  }

  searchPhimBo() {
    this.#movieService.getMoviesByGenre({
      genre: 'phim-bo',
      page: 0,
      limit: 10
    }).subscribe((res) => {
      this.phimBo = res?.items
    })
  }

  initBanner(data: Banner[]) {
    if(data?.length > 0) {
      this.bannerMovie = data[Math.floor(Math.random() * data.length)];
    }
    
    return null;
  }
}
