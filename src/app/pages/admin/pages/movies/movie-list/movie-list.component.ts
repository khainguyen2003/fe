import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbDropdownModule, NgbModalRef, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { Movie } from '../../../../customer/models/movie.model';
import { Genre } from '../../../models/genre.model';
import { GenreService } from '../../../services/genres/genre.service';
import { AlertService } from '../../../../../shared/components/alert/alert.service';
import { MovieService } from '../../../../customer/services/movies/movie.service';
import { BreadcrumbItem, Option, Pagable } from '../../../models/common.model';
import { ACTION_TYPE_ENUM, ADD_EDIT_TYPE_ENUM, SCREEN_PAGE_ENUM, SCREEN_TYPE_ENUM } from '../../../../../shared/enums/common.enums';
import { ActionType } from '../../../../../shared/constants/constants';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbPaginationModule,
    NgbDropdownModule,
    RouterModule
  ],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent implements OnInit {
  private readonly service = inject(MovieService);
  private readonly genreService = inject(GenreService);
  private readonly alertService = inject(AlertService);

  // Thuộc tính form và dữ liệu
  formSearch: FormGroup  = new FormGroup({});
  public pagination: Pagable = {
    itemPerpage: 10,
    currentPage: 0,
  };
  public totalPage!: number;

  protected dataFormSearch = signal({
    pagination: this.pagination,
  });

  public breadcrumbs: BreadcrumbItem[] = [
    {
      caption: 'Trang chủ',
      routerLink: `${SCREEN_PAGE_ENUM.HOME_PAGE}`,
    },
    {
      caption: 'Quản lý danh mục',
      routerLinkActiveOptions: { exact: true },
      routerLink: `${SCREEN_TYPE_ENUM.LIST}`,
    },
  ];

  public type: ADD_EDIT_TYPE_ENUM.CREATE | ADD_EDIT_TYPE_ENUM.UPDATE =
      ADD_EDIT_TYPE_ENUM.CREATE;
  protected itemPages: Array<{ value: number; label: string }> = [];


  rowData: Genre[] = [];
  rowDataSelected: Genre[] = [];
  dataDialog: number[] = [];

  dataDetail: Genre | null = null;
  typeDetail: ActionType | null = null;
  isOpenDetailDialog = false;

  isOpenAcceptDialog = false;
  typeAcceptDialog: ActionType = ACTION_TYPE_ENUM.APPROVAL;

  isOpenRejectDialog = false;
  dataReject: number[] = [];

  data: Movie[] = [];
  showList: boolean = true;

  // Modal reference
  modalRef: NgbModalRef | null = null;
  
  // Thuộc tính phân trang
  page: number = 1;
  totalPages: number = 5;
  totalItems: number = 0;
  itemsPerPage: number = 10;

  // Form thêm/sửa thể loại
  initData: Movie | null = null;
  isEditMode = false;
  
  // Danh sách thể loại
  genreDropdown: Option[] = [];

  addEditForm = new FormGroup({

  })
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    // 
    this.itemPages = [
      { value: 10, label: `10 / Trang` },
      { value: 20, label: `20 / Trang` },
      { value: 50, label: `50 / Trang` },
      { value: 100, label: `100 / Trang` },
    ];

    this.formSearch = this.createFormSearch();
    this.dataFormSearch.set({
      ...this.formSearch.getRawValue(),
      pagination: this.pagination,
    });

    // Khởi tạo dữ liệu mẫu cho thể loại
    this.genreDropdown = [
      { value: 'action', label: 'Hành động' },
      { value: 'comedy', label: 'Hài hước' },
      { value: 'drama', label: 'Chính kịch' },
      { value: 'horror', label: 'Kinh dị' },
      { value: 'romance', label: 'Tình cảm' },
      { value: 'fantasy', label: 'Viễn tưởng' },
      { value: 'sci-fi', label: 'Khoa học viễn tưởng' }
    ];
    
    this.totalItems = this.data.length;
  }

  fetchMovies() {
    this.dataFormSearch.set({
      ...this.formSearch.getRawValue(),
      pagination: this.pagination,
    });
    this.getData(this.dataFormSearch());
  }

  getData(filter: any): void {
    // Giả lập dữ liệu thể loại
    this.service.getList(filter).subscribe({
      next: (response) => {
        debugger

        this.rowData = response?.content || [];
        this.rowDataSelected = [];
        this.totalPage = Math.ceil(
          this.rowData.length / this.pagination.itemPerpage
        );
      },
      error: (err) => {
        console.error('Lỗi khi tải danh sách thể loại:', err);
        this.rowData = [];
      },
    });

    this.totalGenres = this.genres.length;
    this.applyFilter();
  }

  fetchGenre() {
    this.genreService.getGenreOnSelect({}).subscribe({
      next: (res) => {
        console.log(res);
        
        this.genreDropdown = res;
      }
    })
  }

  createFormSearch() {
    return this.fb.group({
      name: [''],
      genre: [[]],
      status: ['']
    });
  }

  handleCreate(): void {
    this.router.navigate(['../create'], { relativeTo: this.route });
  }

  searchMovies(): void {
    // Logic tìm kiếm sẽ được thực hiện ở đây
    console.log('Tìm kiếm với:', this.formSearch.value);
    // Mock lại dữ liệu tìm kiếm để demo
    const searchTerm = this.formSearch.get('name')?.value?.toLowerCase();
    const statusFilter = this.formSearch.get('status')?.value;
    
    if (searchTerm || statusFilter) {
      this.data = this.data.filter(movie => {
        let matchName = true;
        let matchStatus = true;
        
        if (searchTerm) {
          matchName = movie.name.toLowerCase().includes(searchTerm);
        }
        
        if (statusFilter) {
          matchStatus = movie.status === statusFilter;
        }
        
        return matchName && matchStatus;
      });
    } else {
      this.loadSampleData();
    }
    
    this.totalItems = this.data.length;
    this.page = 1;
  }

  resetFormSearch(): void {
    this.formSearch.reset({ name: '', genre: [], status: '' });
    this.loadSampleData();
    this.totalItems = this.data.length;
    this.page = 1;
  }

  onUpdateMovie(item: MovieItem): void {
    this.router.navigate(['../edit', item.id], { relativeTo: this.route });
  }

  onEpisodeMovie(item: MovieItem): void {
    this.router.navigate(['../episodes', item.id], { relativeTo: this.route });
  }

  onDeleteMovie(item: MovieItem): void {
    if (confirm(`Bạn có chắc chắn muốn xóa phim "${item.name}"?`)) {
      // Mock xóa phim
      this.data = this.data.filter(movie => movie.id !== item.id);
      this.totalItems = this.data.length;
      alert('Đã xóa phim thành công!');
    }
  }

  onPageChange(newPage: number): void {
    if (newPage > 0 && newPage <= this.totalPages) {
      this.page = newPage;
      // Trong thực tế sẽ gọi API với tham số page mới
      console.log('Đã chuyển đến trang:', newPage);
    }
  }

  getPageArray(): number[] {
    const pages: number[] = [];
    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.totalPages = totalPages;
    
    // Hiển thị tối đa 5 trang
    const maxPagesToShow = 5;
    let startPage: number;
    let endPage: number;
    
    if (totalPages <= maxPagesToShow) {
      // Nếu tổng số trang ít hơn hoặc bằng max, hiển thị tất cả
      startPage = 1;
      endPage = totalPages;
    } else {
      // Nếu nhiều trang, tính toán phạm vi hiển thị xung quanh trang hiện tại
      const maxPagesBeforeCurrentPage = Math.floor(maxPagesToShow / 2);
      const maxPagesAfterCurrentPage = Math.ceil(maxPagesToShow / 2) - 1;
      
      if (this.page <= maxPagesBeforeCurrentPage) {
        // Nếu đang ở gần trang đầu
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (this.page + maxPagesAfterCurrentPage >= totalPages) {
        // Nếu đang ở gần trang cuối
        startPage = totalPages - maxPagesToShow + 1;
        endPage = totalPages;
      } else {
        // Ở giữa
        startPage = this.page - maxPagesBeforeCurrentPage;
        endPage = this.page + maxPagesAfterCurrentPage;
      }
    }
    
    // Tạo mảng các số trang
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  openGenreModal(content: any, genre?: Genre): void {
    this.isEditMode = !!genre;
    this.currentGenre = genre || null;

    if (this.isEditMode && genre) {
      this.genreForm.patchValue({
        name: genre.name,
        slug: genre.slug,
        description: genre.description,
        status: genre.status
      });
    } else {
      this.genreForm.reset({
        name: '',
        slug: '',
        description: '',
        status: 'active'
      });
    }

    // Lắng nghe sự kiện thay đổi tên để tạo slug
    this.genreForm.get('name')?.valueChanges.subscribe(name => {
      if (!this.isEditMode || !this.genreForm.get('slug')?.dirty) {
        this.genreForm.get('slug')?.setValue(this.generateSlug(name));
      }
    });

    this.modalRef = this.modalService.open(content, {
      backdrop: 'static',
      centered: true
    });
  }
}
