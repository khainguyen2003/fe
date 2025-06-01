import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
  isSidebarCollapsed = false;
  username = 'Admin';
  currentYear = new Date().getFullYear();

  // Menu items for the sidebar
  menuItems = [
    { title: 'Dashboard', icon: 'bi bi-speedometer2', route: '/admin/dashboard', active: true },
    { title: 'Quản lý Phim', icon: 'bi bi-film', route: '/admin/movies', active: false },
    { title: 'Quản lý Tập Phim', icon: 'bi bi-collection-play', route: '/admin/episodes', active: false },
    { title: 'Quản lý Thể Loại', icon: 'bi bi-bookmark', route: '/admin/genres', active: false },
    { title: 'Quản lý Đạo Diễn', icon: 'bi bi-camera-reels', route: '/admin/directors', active: false },
    { title: 'Quản lý Diễn Viên', icon: 'bi bi-person-badge', route: '/admin/actors', active: false },
    { title: 'Quản lý Danh Mục', icon: 'bi bi-tags', route: '/admin/categories', active: false },
    { title: 'Báo Cáo & Thống Kê', icon: 'bi bi-bar-chart', route: '/admin/reports', active: false },
  ];
  
  constructor() { }

  ngOnInit() {
    // Check which menu item should be active based on current URL
    const currentUrl = window.location.pathname;
    this.menuItems.forEach(item => {
      item.active = currentUrl.includes(item.route);
    });
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  setActiveMenuItem(selectedItem: any) {
    this.menuItems.forEach(item => {
      item.active = (item === selectedItem);
    });
  }
}
