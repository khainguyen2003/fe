import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbPaginationModule, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Actor } from '../../../models/actor.model';

@Component({
  selector: 'app-actor-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule
  ],
  templateUrl: './actor-list.component.html',
  styleUrls: ['./actor-list.component.scss']
})
export class ActorListComponent implements OnInit {
  // Danh sách diễn viên
  actors: Actor[] = [];
  filteredActors: Actor[] = [];
  
  // Phân trang
  page = 1;
  pageSize = 10;
  totalActors = 0;
  
  // Form tìm kiếm
  searchTerm = '';
  
  // Form thêm/sửa diễn viên
  actorForm: FormGroup;
  currentActor: Actor | null = null;
  isEditMode = false;
  
  // File upload
  selectedAvatarFile: File | null = null;
  
  // Modal reference
  modalRef: NgbModalRef | null = null;
  
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {
    this.actorForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      birthDate: [null],
      birthPlace: [''],
      biography: [''],
      status: ['active', Validators.required]
    });
  }
  
  ngOnInit(): void {
    this.loadActors();
  }
  
  // Tải danh sách diễn viên
  loadActors(): void {
    // Giả lập dữ liệu diễn viên
    this.actors = [
      {
        id: 1,
        name: 'Tom Hanks',
        avatar: 'assets/img/actors/tom-hanks.jpg',
        birthDate: new Date('1956-07-09'),
        birthPlace: 'Concord, California, USA',
        biography: 'Thomas Jeffrey Hanks là một diễn viên và nhà làm phim người Mỹ. Ông được biết đến với cả vai hài và kịch và được coi là một biểu tượng văn hóa Mỹ.',
        movieCount: 28,
        status: 'active',
        createdAt: new Date('2022-01-15')
      },
      {
        id: 2,
        name: 'Leonardo DiCaprio',
        avatar: 'assets/img/actors/leonardo-dicaprio.jpg',
        birthDate: new Date('1974-11-11'),
        birthPlace: 'Los Angeles, California, USA',
        biography: 'Leonardo Wilhelm DiCaprio là một diễn viên, nhà sản xuất phim và nhà hoạt động môi trường người Mỹ. Ông nổi tiếng với các vai diễn trong phim sinh học, thời kỳ và phim đương đại.',
        movieCount: 33,
        status: 'active',
        createdAt: new Date('2022-01-20')
      },
      {
        id: 3,
        name: 'Meryl Streep',
        avatar: 'assets/img/actors/meryl-streep.jpg',
        birthDate: new Date('1949-06-22'),
        birthPlace: 'Summit, New Jersey, USA',
        biography: 'Mary Louise "Meryl" Streep là một nữ diễn viên người Mỹ. Thường được mô tả là "nữ diễn viên vĩ đại nhất trong thế hệ của cô", Streep được đánh giá cao vì khả năng diễn xuất và khả năng thích ứng với các vai trò khác nhau.',
        movieCount: 45,
        status: 'active',
        createdAt: new Date('2022-02-01')
      },
      {
        id: 4,
        name: 'Robert Downey Jr.',
        avatar: 'assets/img/actors/robert-downey.jpg',
        birthDate: new Date('1965-04-04'),
        birthPlace: 'New York City, USA',
        biography: 'Robert John Downey Jr. là một diễn viên và nhà sản xuất người Mỹ. Sự nghiệp của ông đã được đặc trưng bởi thành công quan trọng và thương mại trong tuổi trẻ của mình.',
        movieCount: 53,
        status: 'active',
        createdAt: new Date('2022-02-10')
      },
      {
        id: 5,
        name: 'Scarlett Johansson',
        avatar: 'assets/img/actors/scarlett-johansson.jpg',
        birthDate: new Date('1984-11-22'),
        birthPlace: 'New York City, USA',
        biography: 'Scarlett Ingrid Johansson là một nữ diễn viên người Mỹ. Cô là một trong những nữ diễn viên có thu nhập cao nhất thế giới từ năm 2018 và đã xuất hiện nhiều lần trong danh sách Forbes Celebrity 100.',
        movieCount: 48,
        status: 'active',
        createdAt: new Date('2022-02-15')
      },
      {
        id: 6,
        name: 'Brad Pitt',
        avatar: 'assets/img/actors/brad-pitt.jpg',
        birthDate: new Date('1963-12-18'),
        birthPlace: 'Shawnee, Oklahoma, USA',
        biography: 'William Bradley Pitt là một diễn viên và nhà sản xuất phim người Mỹ. Ông là người nhận được nhiều giải thưởng, bao gồm hai giải Oscar, giải Primetime Emmy và bốn giải Quả cầu vàng.',
        movieCount: 84,
        status: 'active',
        createdAt: new Date('2022-03-01')
      }
    ];
    
    this.totalActors = this.actors.length;
    this.applyFilter();
  }
  
  // Áp dụng bộ lọc
  applyFilter(): void {
    if (!this.searchTerm) {
      this.filteredActors = [...this.actors];
    } else {
      const searchTermLower = this.searchTerm.toLowerCase();
      this.filteredActors = this.actors.filter(actor => 
        actor.name.toLowerCase().includes(searchTermLower) || 
        (actor.birthPlace && actor.birthPlace.toLowerCase().includes(searchTermLower)) ||
        (actor.biography && actor.biography.toLowerCase().includes(searchTermLower))
      );
    }
    
    this.totalActors = this.filteredActors.length;
    this.page = 1; // Reset về trang đầu tiên sau khi lọc
  }
  
  // Mở modal thêm/sửa diễn viên
  openActorModal(content: any, actor?: Actor): void {
    this.isEditMode = !!actor;
    this.currentActor = actor || null;
    this.selectedAvatarFile = null;
    
    if (this.isEditMode && actor) {
      this.actorForm.patchValue({
        name: actor.name,
        birthDate: actor.birthDate ? this.formatDateForInput(actor.birthDate) : null,
        birthPlace: actor.birthPlace || '',
        biography: actor.biography || '',
        status: actor.status
      });
    } else {
      this.actorForm.reset({
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
  
  // Lưu diễn viên
  saveActor(): void {
    if (this.actorForm.invalid) {
      // Đánh dấu tất cả các trường là đã chạm vào để hiển thị lỗi
      Object.keys(this.actorForm.controls).forEach(key => {
        this.actorForm.get(key)?.markAsTouched();
      });
      return;
    }
    
    const formValues = this.actorForm.value;
    const birthDate = formValues.birthDate ? new Date(formValues.birthDate) : undefined;
    
    if (this.isEditMode && this.currentActor) {
      // Cập nhật diễn viên hiện có
      const index = this.actors.findIndex(a => a.id === this.currentActor!.id);
      if (index !== -1) {
        this.actors[index] = {
          ...this.currentActor,
          name: formValues.name,
          birthDate: birthDate,
          birthPlace: formValues.birthPlace,
          biography: formValues.biography,
          status: formValues.status
          // Giữ nguyên avatar nếu không có file mới
        };
        
        // Cập nhật avatar nếu có file mới
        if (this.selectedAvatarFile) {
          // Trong thực tế, bạn sẽ tải lên file và nhận URL từ server
          // Ở đây chỉ giả lập quá trình này
          this.actors[index].avatar = 'assets/img/actors/new-avatar.jpg';
        }
      }
    } else {
      // Tạo diễn viên mới
      const newActor: Actor = {
        id: Math.max(0, ...this.actors.map(a => a.id)) + 1,
        name: formValues.name,
        avatar: this.selectedAvatarFile ? 'assets/img/actors/new-avatar.jpg' : 'assets/img/actors/default-avatar.jpg',
        birthDate: birthDate,
        birthPlace: formValues.birthPlace,
        biography: formValues.biography,
        status: formValues.status,
        movieCount: 0,
        createdAt: new Date()
      };
      
      this.actors.unshift(newActor); // Thêm vào đầu danh sách
    }
    
    this.closeModal();
    this.applyFilter(); // Cập nhật danh sách hiển thị
  }
  
  // Xóa diễn viên
  deleteActor(actor: Actor): void {
    if (confirm(`Bạn có chắc chắn muốn xóa diễn viên "${actor.name}"?`)) {
      // Lọc bỏ diễn viên khỏi danh sách
      this.actors = this.actors.filter(a => a.id !== actor.id);
      this.applyFilter(); // Cập nhật danh sách hiển thị
    }
  }
  
  // Thay đổi trạng thái diễn viên
  toggleStatus(actor: Actor): void {
    const index = this.actors.findIndex(a => a.id === actor.id);
    if (index !== -1) {
      this.actors[index].status = this.actors[index].status === 'active' ? 'inactive' : 'active';
      this.applyFilter(); // Cập nhật danh sách hiển thị
    }
  }
  
  // Lấy danh sách diễn viên hiển thị trên trang hiện tại
  get paginatedActors(): Actor[] {
    const startItem = (this.page - 1) * this.pageSize;
    return this.filteredActors.slice(startItem, startItem + this.pageSize);
  }
  
  // Cắt ngắn nội dung biography
  truncateBiography(text: string, maxLength: number = 100): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
}