import { Routes } from "@angular/router";
import { AdminLayoutComponent } from "./admin-layout.component";

export const ADMIN_ROUTES: Routes = [
  {
    path: "",
    component: AdminLayoutComponent,
    children: [
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full",
      },
      {
        path: "dashboard",
        loadComponent: () => import('../../pages/admin/pages/dashboard/dashboard.component').then(c => c.DashboardComponent),
        title: "Dashboard - MotChill Admin"
      },
      {
        path: "movies",
        loadComponent: () => import('../../pages/admin/pages/movies/movie-list/movie-list.component').then(c => c.MovieListComponent),
        title: "Quản lý Phim - MotChill Admin"
      },
      {
        path: "episodes",
        loadComponent: () => import('../../pages/admin/pages/episode/episode-list.component').then(c => c.EpisodeListComponent),
        title: "Quản lý Tập Phim - MotChill Admin"
      },
      {
        path: "genres",
        loadComponent: () => import('../../pages/admin/pages/genres/genre-list/genre-list.component').then(c => c.GenreListComponent),
        title: "Quản lý Danh Mục - MotChill Admin"
      },
    ]
  }
];
