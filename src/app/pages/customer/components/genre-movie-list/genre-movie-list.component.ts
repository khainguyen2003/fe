import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Movie } from '../../models/movie.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-genre-movie-list',
  imports: [
    CommonModule,
    RouterLink
  ],
  standalone: true,
  templateUrl: './genre-movie-list.component.html',
  styleUrl: './genre-movie-list.component.scss'
})
export class GenreMovieListComponent {
  @Input()
  title!: string;

  @Input()
  movies!: Movie[];


}
