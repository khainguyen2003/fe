import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HlsPlayerComponent } from './hls-player.component';

@Component({
  selector: 'app-hls-player-demo',
  standalone: true,
  imports: [CommonModule, HlsPlayerComponent],
  template: `
    <div class="player-container">
      <h2>Demo Trình Phát Video HLS</h2>
      
      <div class="video-list">
        <div class="video-item" *ngFor="let video of videos" (click)="selectVideo(video.id)">
          <div class="thumbnail" [class.active]="selectedVideoId === video.id">
            <img [src]="video.thumbnail" alt="Thumbnail">
            <span class="play-icon">▶</span>
          </div>
          <div class="video-info">
            <div class="video-title">{{ video.title }}</div>
            <div class="video-duration">{{ video.duration }}</div>
          </div>
        </div>
      </div>
      
      <div class="player-wrapper">
        <app-hls-player [videoId]="selectedVideoId"></app-hls-player>
      </div>
    </div>
  `,
  styles: [`
    .player-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      font-family: 'Roboto', Arial, sans-serif;
    }
    
    h2 {
      margin-bottom: 20px;
      color: #333;
    }
    
    .video-list {
      display: flex;
      overflow-x: auto;
      gap: 15px;
      padding-bottom: 15px;
      margin-bottom: 25px;
    }
    
    .video-item {
      flex: 0 0 auto;
      width: 200px;
      cursor: pointer;
      transition: transform 0.2s;
    }
    
    .video-item:hover {
      transform: scale(1.03);
    }
    
    .thumbnail {
      position: relative;
      width: 100%;
      height: 112px;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 8px;
      border: 2px solid transparent;
    }
    
    .thumbnail.active {
      border-color: #e50914;
    }
    
    .thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .play-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: rgba(0,0,0,0.6);
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s;
    }
    
    .video-item:hover .play-icon {
      opacity: 1;
    }
    
    .video-info {
      padding: 5px;
    }
    
    .video-title {
      font-weight: bold;
      margin-bottom: 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .video-duration {
      font-size: 12px;
      color: #777;
    }
    
    .player-wrapper {
      width: 100%;
      border-radius: 8px;
      overflow: hidden;
    }
  `]
})
export class HlsPlayerDemoComponent implements OnInit {
  // Danh sách video mẫu
  videos = [
    {
      id: 'chu_thuat_hoi_chien',
      title: 'Chú Thuật Hồi Chiến',
      thumbnail: 'assets/thumbnails/chu_thuat_hoi_chien.jpg',
      duration: '24:15'
    },
    {
      id: 'kimetsu_no_yaiba',
      title: 'Kimetsu no Yaiba',
      thumbnail: 'assets/thumbnails/kimetsu.jpg',
      duration: '23:40'
    },
    {
      id: 'one_piece',
      title: 'One Piece',
      thumbnail: 'assets/thumbnails/one_piece.jpg',
      duration: '25:10'
    }
  ];
  
  // ID của video đang được chọn
  selectedVideoId: string = '';
  
  constructor() {}
  
  ngOnInit(): void {
    // Mặc định chọn video đầu tiên
    if (this.videos.length > 0) {
      this.selectedVideoId = this.videos[0].id;
    }
  }
  
  // Phương thức chọn video
  selectVideo(videoId: string): void {
    this.selectedVideoId = videoId;
  }
}
