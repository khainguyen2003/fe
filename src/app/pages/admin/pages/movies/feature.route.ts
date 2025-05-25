import { Routes } from '@angular/router';
import { MoviesComponent } from './movies.component';

export const featureModuleRoutes: Routes = [
  {
    path: "",
    component: MoviesComponent,
    title: "Quản lý phim"
  },
]