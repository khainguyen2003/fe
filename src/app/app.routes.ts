import { Routes } from '@angular/router';

export const routes: Routes = [
  
  {
    path: "",
    pathMatch: 'full',
    loadChildren: () => import('./pages/customer/pages.route').then(r => r.CUSTOMER_ROUTES),
  },
  {
    path: "admin",
    loadChildren: () => import('./pages/admin/pages.route').then(r => r.ADMIN_ROUTES),
  },
];