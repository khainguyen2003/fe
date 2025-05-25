import { Routes } from '@angular/router';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';

export const MAIN_ADMIN_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: DashboardComponent,
    title: 'Motchill',
  },
  {
    path: 'genres',
    loadChildren: () =>
      import('../../pages/genre/feature.route').then(
        (m) => m.featureModuleRoutes
      ),
  },
  {
    path: 'movies',
    loadChildren: () =>
      import('../../pages/movies/feature.route').then(
        (m) => m.featureModuleRoutes
      ),
  },
  {
    path: 'movies/add', // Đường dẫn để thêm phim mới
    loadComponent: () =>
      import('../../pages/movies/movie-create/movie-create.component').then( // Đường dẫn đến component
        (c) => c.MovieCreateComponent
      ),
    title: 'Thêm Phim Mới', // Tiêu đề trang
  },
];
