import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbDropdownModule, NgbModal, NgbModalRef, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../../../../shared/components/alert/alert.service';
import { ActionType, MOVIE_STATUS, MOVIE_TYPES } from '../../../../../shared/constants/constants';
import { ACTION_TYPE_ENUM, ADD_EDIT_TYPE_ENUM, SCREEN_PAGE_ENUM, SCREEN_TYPE_ENUM } from '../../../../../shared/enums/common.enums';
import { MOVIE_STATUS_ENUM } from '../../../../../shared/enums/param.enums';
import { MovieUtils } from '../../../../../shared/utils/functions/param.utils';
import { MovieService } from '../../../../customer/services/movies/movie.service';
import { BreadcrumbItem, Option, Pagable } from '../../../models/common.model';
import { GenreService } from '../../../services/genres/genre.service';
import { MovieAddEditComponent } from '../movie-add-edit/movie-add-edit.component';
import { Movie } from '../../../models/movie.model';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbPaginationModule,
    NgbDropdownModule,
    RouterModule,
    MovieAddEditComponent
  ],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent implements OnInit {
  private readonly service = inject(MovieService);
  private readonly genreService = inject(GenreService);
  private readonly alertService = inject(AlertService);
  private readonly modalService = inject(NgbModal);

  @ViewChild('movieModal') movieModal: any;

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
      caption: 'Quản lý phim',
      routerLinkActiveOptions: { exact: true },
      routerLink: `${SCREEN_TYPE_ENUM.LIST}`,
    },
  ];

  public type: ADD_EDIT_TYPE_ENUM.CREATE | ADD_EDIT_TYPE_ENUM.UPDATE =
      ADD_EDIT_TYPE_ENUM.CREATE;
  protected itemPages: Array<{ value: number; label: string }> = [];

  movieStatus = MOVIE_STATUS_ENUM;

  getMovieStatusLabel(value: string | number): string {
    return MovieUtils.getMovieStatusLabel(value);
  }


  rowData: Movie[] = [];
  rowDataSelected: Movie[] = [];
  dataDialog: number[] = [];

  dataDetail: Movie | null = null;
  typeDetail: ActionType | null = null;
  isOpenDetailDialog = false;

  isOpenAcceptDialog = false;
  typeAcceptDialog: ActionType = ACTION_TYPE_ENUM.APPROVAL;

  isOpenRejectDialog = false;
  dataReject: number[] = [];

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
  movieTypeDropdown: Option[] = MOVIE_TYPES;
  movieStatusDropdown: Option[] = MOVIE_STATUS;

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

    this.fetchMovies();

    // Khởi tạo dữ liệu mẫu cho thể loại
    this.fetchGenre();
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
        console.error('Lỗi khi tải danh sách phim:', err);
        this.rowData = [];
      },
    });
  }

  handleSearch() {
    this.pagination.currentPage = 0;
    this.dataFormSearch.set({
      ...this.formSearch.getRawValue(),
      pagination: this.pagination,
    });
    this.fetchMovies();
  }

  handlePageChange(event: number) {
    this.rowDataSelected = [];
    this.pagination.currentPage = event;

    this.getData({
      ...this.dataFormSearch,
      pagination: this.pagination,
    });
  }

  handleSearchPage() {
    const page = this.formSearch.getRawValue().searchPage;
    if (!page) {
      return;
    }
    if (page > this.totalPage || page < 1) {
      //thông báo lỗi
    } else {
      this.pagination.currentPage = page - 1;
      this.getData({
        ...this.dataFormSearch,
        pagination: this.pagination,
      });
      this.rowDataSelected = [];
    }
  }

  clearForm() {
    this.formSearch = this.createFormSearch();
    this.page = 1;
  }

  selectLimitOnPage(page: number) {
    this.rowDataSelected = [];
    this.pagination.currentPage = 0;
    this.pagination.itemPerpage = page;
    this.getData({
      ...this.dataFormSearch,
      pagination: this.pagination,
    });
  }

  protected get checked(): boolean | null {
    const every = this.rowData.every(({ selected }) => selected);
    const some = this.rowData.some(({ selected }) => selected);

    return every || (some && null);
  }

  private collectData(): Movie[] {
    return this.rowData.filter(item => item.selected);
  }

  protected onCheck(checked: boolean): void {
    this.rowData.forEach((item) => {
      item.selected = checked;
    });

    this.rowDataSelected = this.rowData;
  }

  onStatusChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValues = Array.from(selectElement.selectedOptions).map(
      (option) => Number(option.value) // hoặc giữ nguyên nếu bạn dùng string
    );
    this.formSearch.get('status')?.setValue(selectedValues);
  }

  onGenreChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValues = Array.from(selectElement.selectedOptions).map(
      (option) => Number(option.value) // hoặc giữ nguyên nếu bạn dùng string
    );
    this.formSearch.get('status')?.setValue(selectedValues);
  }

  onMovieTypeChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValues = Array.from(selectElement.selectedOptions).map(
      (option) => Number(option.value) // hoặc giữ nguyên nếu bạn dùng string
    );
    this.formSearch.get('status')?.setValue(selectedValues);
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

  onEpisodeMovie(item: Movie): void {
    this.router.navigate(['../episodes', item.id], { relativeTo: this.route });
  }

  onDeleteMovie(item: Movie): void {
    if (confirm(`Bạn có chắc chắn muốn xóa phim "${item.name}"?`)) {
      
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

  openMovieModal(content: any, movie?: Movie): void {
    this.isEditMode = !!movie;
    this.initData = movie || null;
  
    this.modalRef = this.modalService.open(content, {
      size: 'lg',
      backdrop: 'static',
      centered: true,
      scrollable: true
    });
  }
  
  // Đóng modal
  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }
  
  // Xử lý sự kiện lưu phim từ component con
  onMovieSaved(movie: Movie): void {
    this.fetchMovies(); // Làm mới danh sách
    this.closeModal();
    this.alertService.showSuccess({header: `Phim đã được ${this.isEditMode ? 'cập nhật' : 'thêm mới'} thành công!`, body: ''});
  }
  
  // Xử lý sự kiện hủy từ component con
  onCancelled(): void {
    this.closeModal();
  }
  
  // Sửa phương thức handleCreate để mở modal thay vì chuyển trang
  handleCreate(): void {
    // Mở modal thêm phim mới thay vì chuyển trang
    this.openMovieModal(this.movieModal);
  }
  
  // Sửa phương thức onUpdateMovie để mở modal thay vì chuyển trang
  onUpdateMovie(item: Movie): void {
    // Mở modal sửa phim thay vì chuyển trang
    this.openMovieModal(this.movieModal, item);
  }
}
