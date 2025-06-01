import { Routes } from '@angular/router';

export const routes: Routes = [
  // Trang chủ
  {
    path: '',
    redirectTo: '/admin/dashboard',
    pathMatch: 'full'
  },
  
  // Phần Admin
  {
    path: 'admin',
    loadChildren: () => import('./layouts/admin-layout/page.routes').then(m => m.ADMIN_ROUTES)
  },
  
  // Xử lý route không tồn tại
  {
    path: '**',
    redirectTo: '/admin/dashboard'
  }
];
