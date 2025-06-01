import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbPaginationModule, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Genre, GenreUpdate } from '../../../models/genre.model';
import { GenreService } from '../../../services/genres/genre.service';
import { ACTION_TYPE_ENUM, ADD_EDIT_TYPE_ENUM, SCREEN_PAGE_ENUM, SCREEN_TYPE_ENUM } from '../../../../../shared/enums/common.enums';
import { BreadcrumbItem, Pagable } from '../../../models/common.model';
import { ActionType } from '../../../../../shared/constants/constants';
import { AlertService } from '../../../../../shared/components/alert/alert.service';

@Component({
  selector: 'app-genre-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule
  ],
  templateUrl: './genre-list.component.html',
  styleUrls: ['./genre-list.component.scss']
})
export class GenreListComponent implements OnInit {

  private readonly service = inject(GenreService);
  private readonly alertService = inject(AlertService);

  formSearch: FormGroup = new FormGroup({});

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

  public initData: Genre | null = null;

  // Danh sách thể loại
  genres: Genre[] = [];
  filteredGenres: Genre[] = [];

  // Phân trang
  page = 1;
  pageSize = 10;
  totalGenres = 0;

  // Form tìm kiếm
  searchTerm = '';

  // Form thêm/sửa thể loại
  currentGenre: Genre | null = null;
  isEditMode = false;

  // Modal reference
  modalRef: NgbModalRef | null = null;

  private subscriptionDetail: any;

  genreForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {
    this.genreForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      slug: ['', [Validators.pattern('^[a-z0-9]+(?:-[a-z0-9]+)*$')]],
      description: [''],
    });
  }

  ngOnInit(): void {

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
    this.fetchGenres();
  }

  fetchGenres(): void {
    this.dataFormSearch.set({
      ...this.formSearch.getRawValue(),
      pagination: this.pagination,
    });
    this.getData(this.dataFormSearch());
  }

  // Tải danh sách thể loại
  getData(filter: any): void {
    // Giả lập dữ liệu thể loại
    this.service.getList(filter).subscribe({
      next: (response) => {
        debugger
        console.log(response);

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

  createFormSearch() {
    return this.fb.group({
      search: [null],
    });
  }

  handleSearch() {
    this.pagination.currentPage = 0;
    this.dataFormSearch.set({
      ...this.formSearch.getRawValue(),
      pagination: this.pagination,
    });
    this.fetchGenres();
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

  // Áp dụng bộ lọc
  applyFilter(): void {
    if (!this.searchTerm) {
      this.filteredGenres = this.genres;
    } else {
      const searchTermLower = this.searchTerm.toLowerCase();
      this.filteredGenres = this.genres.filter(genre =>
        genre.name.toLowerCase().includes(searchTermLower) ||
        genre.description.toLowerCase().includes(searchTermLower)
      );
    }

    this.totalGenres = this.filteredGenres.length;
    this.page = 1; // Reset về trang đầu tiên sau khi lọc
  }

  // Tự động tạo slug từ tên
  generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
      .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
      .replace(/ì|í|ị|ỉ|ĩ/g, 'i')
      .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
      .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
      .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
      .replace(/đ/g, 'd')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  protected get checked(): boolean | null {
    const every = this.rowData.every(({ selected }) => selected);
    const some = this.rowData.some(({ selected }) => selected);

    return every || (some && null);
  }

  private collectData(): Genre[] {
    return this.rowData.filter(item => item.selected);
  }

  protected onCheck(checked: boolean): void {
    this.rowData.forEach((item) => {
      item.selected = checked;
    });

    this.rowDataSelected = this.rowData;
  }

  // Mở modal thêm/sửa thể loại
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

  // Đóng modal
  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  private getFormData(): GenreUpdate {
    const returnObj = { ...this.currentGenre, ...this.genreForm.value };
    return {
      id: returnObj?.id,
      name: returnObj?.name,
      slug: returnObj?.slug
    }
  }

  // Lưu thể loại
  saveGenre(): void {
    if (this.genreForm.invalid) {
      // Đánh dấu tất cả các trường là đã chạm vào để hiển thị lỗi
      Object.keys(this.genreForm.controls).forEach(key => {
        this.genreForm.get(key)?.markAsTouched();
      });
      return;
    }

    if (this.isEditMode && this.currentGenre) {
      this.service.updateDraft(this.getFormData()).subscribe({
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
      this.handleSearch();
    } else {
      // Tạo thể loại mới
      this.service.saveDraft(this.getFormData()).subscribe({
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
      this.handleSearch();
    }

    this.closeModal();
    this.applyFilter(); // Cập nhật danh sách hiển thị
  }

  // Xóa thể loại
  deleteGenre(genre: Genre): void {
    if (confirm(`Bạn có chắc chắn muốn xóa thể loại "${genre.name}"?`)) {
      // Lọc bỏ thể loại khỏi danh sách
      this.genres = this.genres.filter(g => g.id !== genre.id);
      this.applyFilter(); // Cập nhật danh sách hiển thị
    }
  }

  onDeleteItem(data: Genre) {
    const dataDelete: number[] = [data.id!];
    if (dataDelete.length === 0) {
      return;
    }
    if (confirm(`Bạn có chắc chắn muốn xóa thể loại "${data.name}"?`)) {
      this.dataDialog = dataDelete;
      this.service.delete(dataDelete).subscribe({
        next: (res) => {
          this.alertService.showSuccess(
            {
              header: 'Xóa thành công',
              body: res.message
            });

          this.handleSearch();
        },
        error: (err) => {
          this.alertService.showDanger(
            {
              header: 'Xóa thất bại',
              body: err.error?.message
            });
        },
      })
      this.isOpenAcceptDialog = true;
      this.typeAcceptDialog = ACTION_TYPE_ENUM.DELETE;
    }
    
  }

  // Thay đổi trạng thái thể loại
  toggleStatus(genre: Genre): void {
    const index = this.genres.findIndex(g => g.id === genre.id);
    if (index !== -1) {
      this.genres[index].status = this.genres[index].status === 'active' ? 'inactive' : 'active';
      this.applyFilter(); // Cập nhật danh sách hiển thị
    }
  }
}