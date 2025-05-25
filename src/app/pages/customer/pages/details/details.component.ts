import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { Movie, MovieFilter } from '../../models/movie.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MovieService } from '../../services/movies/movie.service';

@Component({
  selector: 'app-details',
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
  readonly #movieService = inject(MovieService);

  movie: any;
  moviePractice: any = null;
  movieEmbed: any = null;
  movieNation: any = null;

  slug: string = '';
  phimLe: Movie[] = [];
  phimBo: Movie[] = [];

  constructor(private route: ActivatedRoute) {
    debugger
    this.route.paramMap.subscribe(params => {
      this.slug = params.get('slug') || '';
      
    });
  }

  ngOnInit(): void {
    debugger
    if(this.slug) {
      this.#movieService.getMovieBySlug(this.slug).subscribe((res) => {
        this.movie = res?.movie;
        this.movieNation = this.movie.category;
        this.moviePractice = this.movie?.episodes[0].items.map((item: any) => ({
          ...item,
          isEpisode: item.slug.startsWith('tap-') // Kiểm tra slug để xác định là tập phim hay không
        }));
        if(this.moviePractice?.length > 0) {
          this.movieEmbed = this.moviePractice[0].embed
        } else {
          this.movieEmbed = null;
        }
      });

      this.searchPhimBo();
      this.searchPhimLe();
    }
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
}
