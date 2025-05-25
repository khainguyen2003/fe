import { Routes } from "@angular/router";
import { MainLayoutComponent } from "./layouts/main-layout/main-layout.component";

export const CUSTOMER_ROUTES: Routes = [
  
  {
    path: "",
    pathMatch: 'full',
    component: MainLayoutComponent,
    children: [
      {
        path: "",
        loadChildren: () => import('./pages/home/feature.route').then(m => m.featureModuleRoutes)
      },
      { 
        path: ':category', 
        loadChildren: () => import('./pages/movie-list/feature.route')
          .then(m => m.featureModuleRoutes) 
      },
      { 
        path: 'phim/:slug', 
        loadChildren: () => import('./pages/details/feature.route')
          .then(m => m.featureModuleRoutes) 
      },
    ]
  },
  
];