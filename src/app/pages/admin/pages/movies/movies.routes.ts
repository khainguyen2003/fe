import { Routes } from '@angular/router';

export const MOVIES_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    loadComponent: () => import('./movie-list/movie-list.component').then(c => c.MovieListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./movie-create/movie-create.component').then(c => c.MovieCreateComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./movie-edit/movie-edit.component').then(c => c.MovieEditComponent)
  },
  {
    path: 'episodes/:id',
    loadComponent: () => import('./episode-list/episode-list.component').then(c => c.EpisodeListComponent)
  }
];
