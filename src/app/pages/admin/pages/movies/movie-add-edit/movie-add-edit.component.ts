import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDatepickerModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { MOVIE_STATUS, MOVIE_TYPES } from '../../../../../shared/constants/constants';
import { MOVIE_STATUS_ENUM } from '../../../../../shared/enums/param.enums';
import { Option } from '../../../models/common.model';
import { GenreService } from '../../../services/genres/genre.service';
import { MovieService } from '../../../../customer/services/movies/movie.service';
import { AlertService } from '../../../../../shared/components/alert/alert.service';
import { Movie, MovieRequest } from '../../../models/movie.model';

@Component({
  selector: 'app-movie-add-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    NgSelectModule
  ],
  templateUrl: './movie-add-edit.component.html',
  styleUrls: ['./movie-add-edit.component.scss']
})
export class MovieAddEditComponent implements OnInit {
  @Input() initData: Movie | null = null;
  @Output() saved = new EventEmitter<Movie>();
  @Output() canceled = new EventEmitter<void>();

  private readonly service = inject(MovieService);
  private readonly alertService = inject(AlertService);

  movieForm!: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  movieTypes = MOVIE_TYPES;
  movieStatuses = MOVIE_STATUS;
  genreOptions: Option[] = [];
  
  // File uploads
  thumbImageFile: File | null = null;
  posterImageFile: File | null = null;
  thumbPreviewUrl: string | ArrayBuffer | null = null;
  posterPreviewUrl: string | ArrayBuffer | null = null;

  movieStatus = MOVIE_STATUS_ENUM;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private genreService: GenreService
  ) {}

  ngOnInit(): void {
    this.initForm(this.initData);
    // Load genre options
    this.loadGenres();
  }

  initForm(data: Movie | null): void {
    this.movieForm = this.fb.group({
      name: [data?.name ?? null, [Validators.required]],
      originalName: [data?.originalName ?? null, [Validators.required]],
      description: [data?.description ?? null],
      totalEpisodes: [data?.totalEpisodes ?? 1, [Validators.min(1)]],
      time: [data?.time ?? null],
      quality: [data?.quality ?? null],
      language: [data?.quality ?? null],
      director: [data?.director ?? []],
      casts: [data?.casts ?? []],
      genres: [data?.genres.map(genre => genre.id) ?? []],
      type: [data?.type ?? 1, [Validators.required]],
    });

    if (data?.thumbUrl) {
      this.thumbPreviewUrl = data?.thumbUrl;
    }
    if (data?.posterUrl) {
      this.posterPreviewUrl = data?.posterUrl;
    }
  }

  loadGenres(): void {
    // Gọi service để lấy danh sách thể loại
    const params = {
      page: 1,
      limit: 1000,
      sort: 'id',
      isActive: '1'
    };
    
    this.genreService.getGenreOnSelect(params).subscribe({
      next: (response) => {
        console.log(response);
        this.genreOptions = response;
      },
      error: (error) => {
        console.error('Lỗi khi tải danh sách thể loại:', error);
      }
    });
  }

  onThumbImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.thumbImageFile = input.files[0];
      this.previewImage(this.thumbImageFile, 'thumb');
    }
  }

  onPosterImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.posterImageFile = input.files[0];
      this.previewImage(this.posterImageFile, 'poster');
    }
  }

  previewImage(file: File, type: 'thumb' | 'poster'): void {
    const reader = new FileReader();
    reader.onload = () => {
      if (type === 'thumb') {
        this.thumbPreviewUrl = reader.result;
      } else {
        this.posterPreviewUrl = reader.result;
      }
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (this.movieForm.invalid) {
      // Mark all fields as touched để hiển thị các lỗi validation
      Object.keys(this.movieForm.controls).forEach(key => {
        const control = this.movieForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;

    // Lấy dữ liệu từ form
    const formData = this.movieForm.value;

    // Chuẩn bị dữ liệu để gửi đi
    const movieData: MovieRequest = {
      ...this.initData,
      ...formData,
      // Trong thực tế, bạn sẽ xử lý upload ảnh và lấy URL từ API response
      thumbUrl: this.thumbPreviewUrl ? this.thumbPreviewUrl.toString() : '',
      posterUrl: this.posterPreviewUrl ? this.posterPreviewUrl.toString() : '',
    };

    this.service.saveDraft(movieData).subscribe({
      next: (res) => {
        this.alertService.showSuccess(
          {
            header: 'Lưu thành công',
            body: res.message
          });
      },
      error: (err) => {
        this.alertService.showDanger(
          {
            header: 'Lưu thất bại',
            body: err.error?.message
          });
      },
    });
  }

  onCancel(): void {
    this.canceled.emit();
    // Hoặc chuyển hướng về trang danh sách nếu là một trang riêng biệt
    // this.router.navigate(['../'], { relativeTo: this.route });
  }

  // Helpers
  get isMovieSeries(): boolean {
    return this.movieForm.get('type')?.value === 2;
  }

  get formControls() {
    return this.movieForm.controls;
  }
}
