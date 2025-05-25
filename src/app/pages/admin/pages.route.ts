import { Routes } from "@angular/router";
import { MainLayoutComponent } from "./layouts/main-layout/main-layout.component";

export const ADMIN_ROUTES: Routes = [
  
  {
    path: "",
    component: MainLayoutComponent,
    loadChildren: () => import('./layouts/main-layout/pages.route').then(m => m.MAIN_ADMIN_ROUTES)
  },
]