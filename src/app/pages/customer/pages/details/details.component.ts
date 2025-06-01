import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Movie, MovieFilter } from '../../models/movie.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MovieService } from '../../services/movies/movie.service';
import { HttpClient } from '@angular/common/http';
import Hls from 'hls.js';
import { HlsPlayerComponent } from "../../../../shared/components/player/hls-player.component";

@Component({
  selector: 'app-details',
  imports: [
    CommonModule,
    RouterLink,
    HlsPlayerComponent
],standalone: true,
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
  readonly #movieService = inject(MovieService);

  movie: any;
  moviePractice: any = null;
  movieEmbed: any = null;
  movieNation: any = null;

  slug: string = '';
  phimLe: Movie[] = [];
  phimBo: Movie[] = [];
  
  currentEpisodeId: number | null = null;
  isLoadingVideo: boolean = false;
  videoError: string | null = null;
  videoProcessing: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.route.paramMap.subscribe(params => {
      this.slug = params.get('slug') || '';
    });
  }

  ngOnInit(): void {
    if(this.slug) {
      this.#movieService.getMovieBySlug(this.slug).subscribe((res) => {
        this.movie = res?.movie;
        this.movieNation = this.movie.category;
        this.moviePractice = this.movie?.episodes[0].items.map((item: any) => ({
          ...item,
          isEpisode: item.slug.startsWith('tap-') // Kiểm tra slug để xác định là tập phim hay không
        }));
        
        // Tự động chọn tập đầu tiên nếu có
        if(this.moviePractice?.length > 0 && this.moviePractice[0].id) {
          this.playEpisode(this.moviePractice[0].id);
        }
      });

      this.searchPhimBo();
      this.searchPhimLe();
    }
  }


  searchPhimLe() {
    this.#movieService.getMoviesByGenre({
      genre: 'phim-le',
      page: 0,
      limit: 10
    }).subscribe((res) => {
      this.phimLe = res?.items
    })
  }

  searchPhimBo() {
    this.#movieService.getMoviesByGenre({
      genre: 'phim-bo',
      page: 0,
      limit: 10
    }).subscribe((res) => {
      this.phimBo = res?.items
    })
  }
  
  /**
   * Phát video của tập phim
   * @param episodeId ID của tập phim cần phát
   */
  playEpisode(episodeId: number) {
    if (this.currentEpisodeId === episodeId && this.movieEmbed) {
      return; // Đã chọn tập này rồi, không cần tải lại
    }
    
    this.currentEpisodeId = episodeId;
    this.isLoadingVideo = true;
    this.videoError = null;
    this.videoProcessing = false;
    this.movieEmbed = null;
    
    // Gọi API lấy URL của tập phim
    this.http.get<any>(`http://localhost:8080/api/videos/episode/${episodeId}/stream`)
      .subscribe({
        next: (response) => {
          this.isLoadingVideo = false;
          
          // Kiểm tra nếu video đang xử lý
          if (response.status === 'processing') {
            this.videoProcessing = true;
            return;
          }
          
          // Lấy URL HLS
          if (response.hlsUrl) {
            this.movieEmbed = 'http://localhost:8080' + response.hlsUrl;
          } else {
            this.videoError = 'Không tìm thấy video của tập phim';
          }
        },
        error: (err) => {
          this.isLoadingVideo = false;
          this.videoError = err.error?.error || 'Không thể tải video';
          console.error('Lỗi khi tải video:', err);
        }
      });
  }
  

}
