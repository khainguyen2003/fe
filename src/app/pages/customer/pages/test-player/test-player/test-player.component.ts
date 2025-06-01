import { Component, OnInit } from '@angular/core';
import { HlsPlayerComponent } from "../../../../../shared/components/player/hls-player.component";
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-test-player',
  standalone: true,
  imports: [HlsPlayerComponent, CommonModule],
  templateUrl: './test-player.component.html',
  styleUrl: './test-player.component.scss'
})
export class TestPlayerComponent implements OnInit {
  public videoUrl: string | null = null;
  public loading: boolean = false;
  public error: string | null = null;

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.getVideoUrl();
  }

  getVideoUrl(): void {
    this.loading = true;
    this.http.get<{hlsUrl: string}>('http://localhost:8080/api/videos/chu_thuat_hoi_chien/stream')
      .subscribe({
        next: (response) => {
          this.videoUrl = 'http://localhost:8080' + response.hlsUrl;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Không thể tải video: ' + (err.error?.error ?? err.message);
          this.loading = false;
          console.error('Error fetching video URL:', err);
        }
      });
  }
}
