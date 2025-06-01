import { Component } from '@angular/core';
import { ChartData, RecentMovie, StatCard } from '../../models/common.model';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  // Thống kê tổng quan
  statCards: StatCard[] = [
    {
      title: 'Tổng phim',
      value: 125,
      icon: 'bi bi-film',
      color: 'primary',
      increase: 12,
      link: '/admin/movies'
    },
    {
      title: 'Tập phim',
      value: 892,
      icon: 'bi bi-collection-play',
      color: 'success',
      increase: 24,
      link: '/admin/movies'
    },
    {
      title: 'Thể loại',
      value: 18,
      icon: 'bi bi-tags',
      color: 'info',
      increase: 5,
      link: '/admin/genres'
    },
    {
      title: 'Người dùng',
      value: 2435,
      icon: 'bi bi-people',
      color: 'warning',
      increase: 32,
      link: '/admin/users'
    }
  ];

  // Phim được thêm gần đây
  recentMovies: RecentMovie[] = [];

  // Dữ liệu biểu đồ
  viewsChartData: ChartData = {
    labels: [],
    datasets: [
      {
        label: 'Lượt xem',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  // Dữ liệu biểu đồ thể loại
  genreChartData: ChartData = {
    labels: [],
    datasets: [
      {
        label: 'Số lượng phim',
        data: [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  constructor() {}

  ngOnInit(): void {
    this.loadRecentMovies();
    this.loadChartData();
  }

  private loadRecentMovies(): void {
    // Giả lập dữ liệu phim mới
    this.recentMovies = [
      {
        id: 1,
        name: 'Avengers: Endgame',
        thumbnail: 'assets/img/sample/avengers.jpg',
        status: 'published',
        views: 12500,
        date: new Date('2023-05-28')
      },
      {
        id: 2,
        name: 'Joker',
        thumbnail: 'assets/img/sample/joker.jpg',
        status: 'published',
        views: 9800,
        date: new Date('2023-05-25')
      },
      {
        id: 3,
        name: 'Parasite',
        thumbnail: 'assets/img/sample/parasite.jpg',
        status: 'processing',
        views: 7600,
        date: new Date('2023-05-23')
      },
      {
        id: 4,
        name: 'The Batman',
        thumbnail: 'assets/img/sample/batman.jpg',
        status: 'published',
        views: 6200,
        date: new Date('2023-05-20')
      },
      {
        id: 5,
        name: 'Spider-Man: No Way Home',
        thumbnail: 'assets/img/sample/spiderman.jpg',
        status: 'processing',
        views: 5400,
        date: new Date('2023-05-18')
      }
    ];
  }

  private loadChartData(): void {
    // Giả lập dữ liệu biểu đồ lượt xem
    this.viewsChartData = {
      labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
      datasets: [
        {
          label: 'Lượt xem',
          data: [1500, 2200, 1800, 2400, 2800, 3200, 3800],
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }
      ]
    };

    // Giả lập dữ liệu biểu đồ thể loại
    this.genreChartData = {
      labels: ['Hành động', 'Tình cảm', 'Hài hước', 'Kinh dị', 'Viễn tưởng'],
      datasets: [
        {
          label: 'Số lượng phim',
          data: [30, 15, 20, 18, 22],
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  }
}
