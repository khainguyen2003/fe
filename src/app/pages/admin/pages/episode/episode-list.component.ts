import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

interface Episode {
  id: number;
  title: string;
  episodeNumber: number;
  duration: number;
  videoUrl: string;
  thumbnailUrl: string;
  status: 'published' | 'processing' | 'draft';
  views: number;
  createdAt: Date;
}

interface Movie {
  id: number;
  name: string;
  thumbnailUrl: string;
  totalEpisodes: number;
}

@Component({
  selector: 'app-episode-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NgbModalModule
  ],
  templateUrl: './episode-list.component.html',
  styleUrls: ['./episode-list.component.scss']
})
export class EpisodeListComponent implements OnInit {
  // Thông tin phim
  movie: Movie | null = null;
  movieId: number = 0;
  
  // Danh sách tập phim
  episodes: Episode[] = [];
  
  // Form thêm/sửa tập phim
  episodeForm: FormGroup;
  currentEpisode: Episode | null = null;
  isEditMode: boolean = false;
  
  // Tham chiếu modal
  modalRef: NgbModalRef | null = null;
  
  // File upload
  selectedVideoFile: File | null = null;
  selectedThumbnailFile: File | null = null;
  isUploading: boolean = false;
  uploadProgress: number = 0;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {
    this.episodeForm = this.fb.group({
      title: ['', [Validators.required]],
      episodeNumber: [null, [Validators.required, Validators.min(1)]],
      duration: [null, [Validators.required, Validators.min(1)]],
      status: ['draft', [Validators.required]]
    });
  }
  
  ngOnInit(): void {
    // Lấy ID phim từ route
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.movieId = +params['id'];
        this.loadMovieDetails();
        this.loadEpisodes();
      } else {
        this.router.navigate(['/admin/movies']);
      }
    });
  }
  
  // Tải thông tin phim
  loadMovieDetails(): void {
    // Trong thực tế, bạn sẽ gọi API để lấy thông tin phim
    // Giả lập dữ liệu phim cho mục đích demo
    this.movie = {
      id: this.movieId,
      name: 'Avengers: Endgame',
      thumbnailUrl: 'assets/img/sample/avengers.jpg',
      totalEpisodes: 5
    };
  }
  
  // Tải danh sách tập phim
  loadEpisodes(): void {
    // Trong thực tế, bạn sẽ gọi API để lấy danh sách tập phim
    // Giả lập dữ liệu cho mục đích demo
    this.episodes = [
      {
        id: 1,
        title: 'Tập 1: Hậu quả cuộc chiến',
        episodeNumber: 1,
        duration: 45,
        videoUrl: 'https://example.com/video1.m3u8',
        thumbnailUrl: 'assets/img/sample/episode1.jpg',
        status: 'published',
        views: 12500,
        createdAt: new Date('2023-01-15')
      },
      {
        id: 2,
        title: 'Tập 2: Kế hoạch mới',
        episodeNumber: 2,
        duration: 42,
        videoUrl: 'https://example.com/video2.m3u8',
        thumbnailUrl: 'assets/img/sample/episode2.jpg',
        status: 'published',
        views: 10200,
        createdAt: new Date('2023-01-18')
      },
      {
        id: 3,
        title: 'Tập 3: Cuộc hành trình',
        episodeNumber: 3,
        duration: 48,
        videoUrl: 'https://example.com/video3.m3u8',
        thumbnailUrl: 'assets/img/sample/episode3.jpg',
        status: 'processing',
        views: 8500,
        createdAt: new Date('2023-01-22')
      }
    ];
  }
  
  // Mở modal thêm/sửa tập phim
  openEpisodeModal(modal: any, episode?: Episode): void {
    this.isEditMode = !!episode;
    this.currentEpisode = episode || null;
    
    if (this.isEditMode && episode) {
      this.episodeForm.patchValue({
        title: episode.title,
        episodeNumber: episode.episodeNumber,
        duration: episode.duration,
        status: episode.status
      });
    } else {
      // Tạo tập mới, tự động thiết lập số tập tiếp theo
      const nextEpisodeNumber = this.episodes.length > 0 
        ? Math.max(...this.episodes.map(e => e.episodeNumber)) + 1 
        : 1;
        
      this.episodeForm.patchValue({
        title: `Tập ${nextEpisodeNumber}`,
        episodeNumber: nextEpisodeNumber,
        duration: null,
        status: 'draft'
      });
    }
    
    this.modalRef = this.modalService.open(modal, { 
      size: 'lg',
      backdrop: 'static',
      centered: true
    });
  }
  
  // Đóng modal
  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close();
      this.resetForm();
    }
  }
  
  // Reset form
  resetForm(): void {
    this.episodeForm.reset({
      title: '',
      episodeNumber: null,
      duration: null,
      status: 'draft'
    });
    this.selectedVideoFile = null;
    this.selectedThumbnailFile = null;
    this.isEditMode = false;
    this.currentEpisode = null;
    this.uploadProgress = 0;
  }
  
  // Xử lý chọn file video
  onVideoFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      this.selectedVideoFile = element.files[0];
    }
  }
  
  // Xử lý chọn file hình thu nhỏ
  onThumbnailFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      this.selectedThumbnailFile = element.files[0];
    }
  }
  
  // Lưu tập phim
  saveEpisode(): void {
    if (this.episodeForm.invalid) {
      return;
    }
    
    // Mô phỏng quá trình upload file
    this.isUploading = true;
    
    // Mô phỏng tiến trình upload
    const timer = setInterval(() => {
      this.uploadProgress += 10;
      if (this.uploadProgress >= 100) {
        clearInterval(timer);
        this.finishSaveEpisode();
      }
    }, 300);
  }
  
  // Hoàn thành lưu tập phim
  finishSaveEpisode(): void {
    const formValues = this.episodeForm.value;
    
    if (this.isEditMode && this.currentEpisode) {
      // Cập nhật tập phim hiện có
      const index = this.episodes.findIndex(e => e.id === this.currentEpisode!.id);
      if (index !== -1) {
        this.episodes[index] = {
          ...this.currentEpisode,
          title: formValues.title,
          episodeNumber: formValues.episodeNumber,
          duration: formValues.duration,
          status: formValues.status
        };
      }
    } else {
      // Tạo tập phim mới
      const newEpisode: Episode = {
        id: Math.max(0, ...this.episodes.map(e => e.id)) + 1,
        title: formValues.title,
        episodeNumber: formValues.episodeNumber,
        duration: formValues.duration,
        videoUrl: 'https://example.com/new-video.m3u8', // URL mẫu
        thumbnailUrl: 'assets/img/sample/episode-default.jpg', // URL mẫu
        status: formValues.status,
        views: 0,
        createdAt: new Date()
      };
      
      this.episodes.push(newEpisode);
      
      // Cập nhật tổng số tập
      if (this.movie) {
        this.movie.totalEpisodes = this.episodes.length;
      }
    }
    
    // Reset trạng thái
    this.isUploading = false;
    this.uploadProgress = 0;
    
    // Đóng modal
    this.closeModal();
    
    // Sắp xếp lại danh sách tập theo số tập
    this.episodes.sort((a, b) => a.episodeNumber - b.episodeNumber);
  }
  
  // Xóa tập phim
  deleteEpisode(episode: Episode): void {
    if (confirm(`Bạn có chắc chắn muốn xóa tập "${episode.title}"?`)) {
      // Lọc bỏ tập phim khỏi danh sách
      this.episodes = this.episodes.filter(e => e.id !== episode.id);
      
      // Cập nhật tổng số tập
      if (this.movie) {
        this.movie.totalEpisodes = this.episodes.length;
      }
    }
  }
  
  // Trở về trang danh sách phim
  backToMovieList(): void {
    this.router.navigate(['/admin/movies']);
  }
  
  // Chuyển đến trang quản lý chi tiết phim
  goToMovieEdit(): void {
    this.router.navigate(['/admin/movies/edit', this.movieId]);
  }
}