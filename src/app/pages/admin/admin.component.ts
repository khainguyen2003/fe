import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  // Dữ liệu menu
  menuItems = [
    { 
      icon: 'bi bi-speedometer2', 
      title: 'Dashboard', 
      link: '/admin/dashboard' 
    },
    { 
      icon: 'bi bi-film', 
      title: 'Quản lý phim', 
      link: '/admin/movies' 
    },
    { 
      icon: 'bi bi-tags', 
      title: 'Thể loại', 
      link: '/admin/genres' 
    },
    { 
      icon: 'bi bi-people', 
      title: 'Người dùng', 
      link: '/admin/users' 
    },
    { 
      icon: 'bi bi-gear', 
      title: 'Cài đặt', 
      link: '/admin/settings' 
    }
  ];

  // Thông tin người dùng
  userInfo = {
    name: 'Admin',
    email: 'admin@motchill.com',
    avatar: 'assets/img/avatar.jpg'
  };
  
  // Toggle sidebar cho giao diện mobile
  isSidebarExpanded = true;
  
  toggleSidebar() {
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }
}
