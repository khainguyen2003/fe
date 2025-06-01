import { Routes } from "@angular/router";
import { MainLayoutComponent } from "./layouts/main-layout/main-layout.component";
import { HomeComponent } from "./home/home.component";

export const ADMIN_ROUTES: Routes = [
  
  {
    path: "",
    component: HomeComponent,
  },
  
]