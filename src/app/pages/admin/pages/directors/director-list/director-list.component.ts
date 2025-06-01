import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbModalRef, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { SCREEN_PAGE_ENUM, SCREEN_TYPE_ENUM } from '../../../../../shared/enums/common.enums';
import { BreadcrumbItem, Pagable, Status } from '../../../models/common.model';
import { Director } from '../../../models/director.model';
import { DirectorService } from '../../../services/director.service';

@Component({
  selector: 'app-director-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule
  ],
  templateUrl: './director-list.component.html',
  styleUrls: ['./director-list.component.scss']
})
export class DirectorListComponent implements OnInit {
  readonly #service = inject(DirectorService);

  // Danh sách đạo diễn
  directors: Director[] = [];
  filteredDirectors: Director[] = [];
  
  // Phân trang
  page = 1;
  pageSize = 10;
  totalDirectors = 0;

  isLoading = false;
  
  // Form tìm kiếm
  searchTerm = '';
  
  // Form thêm/sửa đạo diễn
  directorForm: FormGroup;
  currentDirector: Director | null = null;
  isEditMode = false;
  
  // File upload
  selectedAvatarFile: File | null = null;
  
  // Modal reference
  modalRef: NgbModalRef | null = null;

  rowData: Director[] = [];
  rowDataSelected: Director[] = [];

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
  
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {
    this.directorForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      birthDate: [null],
      birthPlace: [''],
      biography: [''],
      status: ['active', Validators.required]
    });
  }
  
  ngOnInit(): void {
    this.loadDirectors();
  }
  
  // Tải danh sách đạo diễn
  loadDirectors(): void {
    // Giả lập dữ liệu đạo diễn
    this.directors = [
      {
        id: 1,
        name: 'Christopher Nolan',
        avatar: 'assets/img/directors/christopher-nolan.jpg',
        birthDate: new Date('1970-07-30'),
        birthPlace: 'London, England',
        biography: 'Christopher Edward Nolan CBE là một nhà làm phim người Anh-Mỹ nổi tiếng với các bộ phim phi thường thời gian, kiến trúc và vật chất phi tuyến tính, cùng các chủ đề về nhận thức con người, đạo đức con người và bản chất của thời gian.',
        movieCount: 11,
        status: 'active' as Status,
        createdAt: new Date('2022-01-15')
      },
      {
        id: 2,
        name: 'Steven Spielberg',
        avatar: 'assets/img/directors/steven-spielberg.jpg',
        birthDate: new Date('1946-12-18'),
        birthPlace: 'Cincinnati, Ohio, USA',
        biography: 'Steven Allan Spielberg KBE là một nhà làm phim người Mỹ. Ông được coi là một trong những nhà tiên phong của kỷ nguyên Blockbuster mới của Hollywood và là một trong những nhà làm phim có ảnh hưởng nhất trong lịch sử điện ảnh.',
        movieCount: 33,
        status: 'active' as Status,
        createdAt: new Date('2022-01-20')
      },
      {
        id: 3,
        name: 'Martin Scorsese',
        avatar: 'assets/img/directors/martin-scorsese.jpg',
        birthDate: new Date('1942-11-17'),
        birthPlace: 'New York City, USA',
        biography: 'Martin Charles Scorsese là một nhà làm phim và nhà sản xuất người Mỹ, người đã có sự nghiệp kéo dài hơn 50 năm. Ông được coi rộng rãi là một trong những nhà làm phim vĩ đại nhất và có ảnh hưởng nhất trong lịch sử điện ảnh.',
        movieCount: 25,
        status: 'active' as Status,
        createdAt: new Date('2022-02-01')
      },
      {
        id: 4,
        name: 'Quentin Tarantino',
        avatar: 'assets/img/directors/quentin-tarantino.jpg',
        birthDate: new Date('1963-03-27'),
        birthPlace: 'Knoxville, Tennessee, USA',
        biography: 'Quentin Jerome Tarantino là một nhà làm phim và diễn viên người Mỹ. Các bộ phim của ông nổi tiếng với đặc điểm phi tuyến tính, sự thẩm mỹ hóa bạo lực, tham chiếu văn hóa đại chúng, phong cách, và đối thoại dài.',
        movieCount: 9,
        status: 'active' as Status,
        createdAt: new Date('2022-02-10')
      },
      {
        id: 5,
        name: 'James Cameron',
        avatar: 'assets/img/directors/james-cameron.jpg',
        birthDate: new Date('1954-08-16'),
        birthPlace: 'Kapuskasing, Ontario, Canada',
        biography: 'James Francis Cameron CC là một nhà làm phim, nhà sản xuất, nhà viết kịch, biên tập, nghệ sĩ và kỹ sư người Canada. Ông được biết đến với việc làm các bộ phim khoa học viễn tưởng và sử thi có ngân sách lớn.',
        movieCount: 8,
        status: 'active' as Status,
        createdAt: new Date('2022-02-15')
      }
    ];
    
    this.totalDirectors = this.directors.length;
    this.applyFilter();
  }
  
  // Áp dụng bộ lọc
  applyFilter(): void {
    if (!this.searchTerm) {
      this.filteredDirectors = [...this.directors];
    } else {
      const searchTermLower = this.searchTerm.toLowerCase();
      this.filteredDirectors = this.directors.filter(director => 
        director.name.toLowerCase().includes(searchTermLower) || 
        (director.birthPlace && director.birthPlace.toLowerCase().includes(searchTermLower)) ||
        (director.biography && director.biography.toLowerCase().includes(searchTermLower))
      );
    }
    
    this.totalDirectors = this.filteredDirectors.length;
    this.page = 1; // Reset về trang đầu tiên sau khi lọc
  }
  
  // Mở modal thêm/sửa đạo diễn
  openDirectorModal(content: any, director?: Director): void {
    this.isEditMode = !!director;
    this.currentDirector = director || null;
    this.selectedAvatarFile = null;
    
    if (this.isEditMode && director) {
      this.directorForm.patchValue({
        name: director.name,
        birthDate: director.birthDate ? this.formatDateForInput(director.birthDate) : null,
        birthPlace: director.birthPlace || '',
        biography: director.biography || '',
        status: director.status
      });
    } else {
      this.directorForm.reset({
        name: '',
        birthDate: null,
        birthPlace: '',
        biography: '',
        status: 'active'
      });
    }
    
    this.modalRef = this.modalService.open(content, {
      backdrop: 'static',
      size: 'lg',
      centered: true
    });
  }
  
  // Format Date to YYYY-MM-DD for input[type=date]
  formatDateForInput(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
  
  // Đóng modal
  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }
  
  // Xử lý chọn file avatar
  onAvatarFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      this.selectedAvatarFile = element.files[0];
    }
  }
  
  // Lưu đạo diễn
  saveDirector(): void {
    if (this.directorForm.invalid) {
      // Đánh dấu tất cả các trường là đã chạm vào để hiển thị lỗi
      Object.keys(this.directorForm.controls).forEach(key => {
        this.directorForm.get(key)?.markAsTouched();
      });
      return;
    }
    
    const formValues = this.directorForm.value;
    const birthDate = formValues.birthDate ? new Date(formValues.birthDate) : undefined;
    
    if (this.isEditMode && this.currentDirector) {
      // Cập nhật đạo diễn hiện có
      const index = this.directors.findIndex(d => d.id === this.currentDirector!.id);
      if (index !== -1) {
        this.directors[index] = {
          ...this.currentDirector,
          name: formValues.name,
          birthDate: birthDate,
          birthPlace: formValues.birthPlace,
          biography: formValues.biography,
          status: formValues.status as Status
          // Giữ nguyên avatar nếu không có file mới
        };
        
        // Cập nhật avatar nếu có file mới
        if (this.selectedAvatarFile) {
          // Trong thực tế, bạn sẽ tải lên file và nhận URL từ server
          // Ở đây chỉ giả lập quá trình này
          this.directors[index].avatar = 'assets/img/directors/new-avatar.jpg';
        }
      }
    } else {
      // Tạo đạo diễn mới
      const newDirector: Director = {
        id: Math.max(0, ...this.directors.map(d => d.id)) + 1,
        name: formValues.name,
        avatar: this.selectedAvatarFile ? 'assets/img/directors/new-avatar.jpg' : 'assets/img/directors/default-avatar.jpg',
        birthDate: birthDate,
        birthPlace: formValues.birthPlace,
        biography: formValues.biography || '',
        status: formValues.status as Status,
        movieCount: 0,
        createdAt: new Date()
      };
      
      this.directors.unshift(newDirector); // Thêm vào đầu danh sách
    }
    
    this.closeModal();
    this.applyFilter(); // Cập nhật danh sách hiển thị
  }
  
  // Xóa đạo diễn
  deleteDirector(director: Director): void {
    if (confirm(`Bạn có chắc chắn muốn xóa đạo diễn "${director.name}"?`)) {
      // Lọc bỏ đạo diễn khỏi danh sách
      this.directors = this.directors.filter(d => d.id !== director.id);
      this.applyFilter(); // Cập nhật danh sách hiển thị
    }
  }
  
  // Thay đổi trạng thái đạo diễn
  toggleStatus(director: Director): void {
    const index = this.directors.findIndex(d => d.id === director.id);
    if (index !== -1) {
      this.directors[index].status = this.directors[index].status === 'active' ? 'inactive' : 'active';
      this.applyFilter(); // Cập nhật danh sách hiển thị
    }
  }

  handlePageChange(event: number) {
    this.rowDataSelected = [];
    this.pagination.currentPage = event;

    this.getData({
      ...this.dataFormSearch,
      pagination: this.pagination,
    });
  }

  getData(filter: any) {
    const sub = this.#service.getList(filter).subscribe({
      next: (response) => {
        this.rowData = response.data?.content || [];
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

    // this.subscription.add(sub);
  }
  
  // Lấy danh sách đạo diễn hiển thị trên trang hiện tại
  get paginatedDirectors(): Director[] {
    const startItem = (this.page - 1) * this.pageSize;
    return this.filteredDirectors.slice(startItem, startItem + this.pageSize);
  }
  
  // Cắt ngắn nội dung biography
  truncateBiography(text: string, maxLength: number = 100): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
}
