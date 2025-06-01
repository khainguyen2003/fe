import { Routes } from '@angular/router';

export const CUSTOMER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(c => c.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent),
      },
      {
        path: 'phim',
        loadComponent: () => import('./pages/movie-list/movie-list.component').then(c => c.MovieListComponent)
      },
      {
        path: 'phim/:slug',
        loadComponent: () => import('./pages/details/details.component').then(c => c.DetailsComponent)
      },
      // {
      //   path: 'watch/:id/:episode',
      //   loadComponent: () => import('./pages/movie-watch/movie-watch.component').then(c => c.MovieWatchComponent)
      // },
      // {
      //   path: 'search',
      //   loadComponent: () => import('./pages/search/search.component').then(c => c.SearchComponent)
      // },
      // {
      //   path: 'genre/:id',
      //   loadComponent: () => import('./pages/genre/genre.component').then(c => c.GenreComponent)
      // }
    ]
  }
];
