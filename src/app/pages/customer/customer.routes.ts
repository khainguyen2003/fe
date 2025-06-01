import { Routes } from '@angular/router';

export const CUSTOMER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./customer.component').then(c => c.CustomerComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent)
      },
      {
        path: 'movies',
        loadComponent: () => import('./pages/movies/movies.component').then(c => c.MoviesComponent)
      },
      {
        path: 'movie/:id',
        loadComponent: () => import('./pages/movie-detail/movie-detail.component').then(c => c.MovieDetailComponent)
      },
      {
        path: 'watch/:id/:episode',
        loadComponent: () => import('./pages/movie-watch/movie-watch.component').then(c => c.MovieWatchComponent)
      },
      {
        path: 'search',
        loadComponent: () => import('./pages/search/search.component').then(c => c.SearchComponent)
      },
      {
        path: 'genre/:id',
        loadComponent: () => import('./pages/genre/genre.component').then(c => c.GenreComponent)
      }
    ]
  }
];
