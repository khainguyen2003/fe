import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, Inject, inject, Input, Output, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { EMPTY_ARRAY, TuiHandler, TuiMapperPipe } from '@taiga-ui/cdk';
import { TuiButton, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiAccordion, TuiTree } from '@taiga-ui/kit';
import { TuiInputModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { Observable, Subject } from 'rxjs';
import { RenderActionComponent } from '../../../components/render-icon-grid/render-action/render-action.component';
import { StatusCellRender } from '../../../components/render-icon-grid/status-cell-render';
import { BreadcrumbItem, NotificationData, Pagable, TreeNode } from '../../../models/common.model';
import { Movie } from '../../../models/movie.model';
import { MovieService } from '../../../services/movie/movie.service';
import { ActionType, ACTIVE_STATUS, DISPLAY_STATUS, PARAM_STATUS } from '../../../utils/constants';
import { ACTION_TYPE_ENUM, SCREEN_PAGE_ENUM, SCREEN_TYPE_ENUM } from '../../../utils/enums/common.enums';
import { CommonUtils } from '../../../utils/functions/commom-utils';
import { removeDiacritics } from '../../../utils/functions/ui-utils';
import { identityMatcher, stringifyLabelSelect, stringifyLabelSelectHasTranslate, stringifyValueLabelSelectHasTranslate } from './../../../utils/functions/ui-utils';

@Component({
  selector: 'app-movie-list',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AgGridModule,
    TranslocoDirective,
    TranslocoModule,
    TuiAccordion,
    TuiTextfield,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiTree,
    TuiButton,
    TuiIcon,
    TuiMapperPipe,
  ],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss'
})
export class MovieListComponent {
  // Biến sử dụng để hiển thị thông báo
  @Input()
  public $notification!: Subject<NotificationData>;
  //@Input() noti$!: Observable<NotificationData>;

  @Input()
  public $detailInNoti!: Observable<number>;

  //pagination
  @Input()
  public pagination!: Pagable;

  @Input()
  public totalPage = 0;

  @Output()
  public createEvent: EventEmitter<void> = new EventEmitter();

  @Output()
  public updateEvent: EventEmitter<Movie> = new EventEmitter();

  @Output()
  public copyEvent: EventEmitter<Movie> = new EventEmitter();
  @Output()
  public changeScreenEvent: EventEmitter<SCREEN_TYPE_ENUM | string> =
    new EventEmitter();

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  public isOpenDetailDialog = false;

  dataDialog: number[] = [];

  readonly #service = inject(MovieService);
  readonly #fb = inject(FormBuilder);
  readonly #translate = inject(TranslocoService);

  readonly tlHeader = "movie.";

  //Trạng thái tham số
  statusDropdown = PARAM_STATUS;
  //Trạng thái hoạt động
  activeDropdown = ACTIVE_STATUS;
  //Trạng thái hiển thị
  displayDropdown = DISPLAY_STATUS;
  
  initData: Movie | null = null;
  dataDetail: Movie | null = null;

  isOpenAcceptDialog = false;
  typeAcceptDialog: ActionType = ACTION_TYPE_ENUM.APPROVAL;

  isOpenRejectDialog = false;
  dataReject: number[] = [];

  stringifyLabelSelect = stringifyLabelSelect;
  stringifyLabelSelectHasTranslate = stringifyLabelSelectHasTranslate(this.#translate);
  readonly identityMatcher = identityMatcher;

  readonly stringifyValueLabelSelectHasTranslate = stringifyValueLabelSelectHasTranslate(this.#translate);

  protected readonly filterLabelSelectHasTranslateFunction = (
    item: { value: string; label: string },
    query: string
  ): boolean =>
    removeDiacritics(this.#translate.translate(item.label))
      .toLowerCase()
      .includes(removeDiacritics(query).toLowerCase());

  protected readonly handler: TuiHandler<TreeNode, readonly TreeNode[]> = (item) =>
    item.children || EMPTY_ARRAY;

  formSearch: FormGroup = new FormGroup({});

  protected dataFormSearch = signal({
    pagination: this.pagination
  });

  public breadcrumbs: BreadcrumbItem[] = [
    {
      caption: 'Trang chủ',
      routerLink: `${SCREEN_PAGE_ENUM.HOME_PAGE}`,
    },
    {
      caption: 'Quản lý phim',
      routerLink: `${SCREEN_TYPE_ENUM.LIST}`,
    },
  ];

  readonly #featureQuery = injectQuery(() => this.#service.getListOption(this.dataFormSearch()));

  rowData: Movie[] = [];

  public defaultColDef: ColDef = {
    resizable: true,
    flex: 1,
  };

  public columnDefs: ColDef[] = [
    {
      field: 'checkbox',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      showDisabledCheckboxes: false,
      maxWidth: 50,
      pinned: 'left',
    },
    {
      field: 'STT',
      valueGetter: (param) => {
        if (param.node && param.node.rowIndex !== null) {
          return (
            param.node.rowIndex +
            1 +
            this.pagination.currentPage * this.pagination.itemPerpage
          );
        }
        return null;
      },
      width: 70,
      pinned: 'left',
    },
    {
      field: 'title',
      width: 200,
    },
    {
      field: 'movieType',
      width: 200,
    },
    {
      field: 'releaseDate',
      width: 100,
    },
    {
      field: 'genre',
      width: 300,
    },
    {
      field: 'views',
      width: 150,
    },
    {
      field: 'status',
      minWidth: 300,
      cellRenderer: StatusCellRender,
    },
    {
      field: 'isActive',
      minWidth: 200,
      valueFormatter: (params) => {
        if (params?.value !== null && params?.value !== undefined) {
          return this.#translate.translate(
              CommonUtils.getActiveLabel(params?.value?.toString())
          );
        }
        return params?.value;
      },
      tooltipValueGetter: (params) => {
        if (params?.value !== null && params?.value !== undefined) {
          return this.#translate.translate(
              CommonUtils.getActiveLabel(params?.value?.toString())
          );
        }
        return params?.value;
      },
    },
    {
      field: '',
      cellRenderer: RenderActionComponent,
      // minWidth: 200,
      pinned: 'right',
      cellRendererParams: {
        onEdit: (data: Movie) => this.onUpdateItem(data),
        onDelete: (data: Movie) => this.onDeleteItem(data),
        onCoppy: (data: Movie) => this.onCopyItem(data)
      },
    },
  ]

  rowDataSelected: Movie[] = [];
  
  isOpenCreateDialog = signal(false);

  isBrowser = false;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);

    this.formSearch = this.createForm();
    this.dataFormSearch.set({
      ...this.formSearch.getRawValue(),
      pagination: this.pagination,
    });
  }
  
  createForm() {
    return this.#fb.group({
      name: [null],
      genre: [null],
      desc: [null]
    })
  }

  handleSearch() {
    this.pagination.currentPage = 0;
    this.dataFormSearch.set({
      ...this.formSearch.getRawValue(),
      pagination: this.pagination,
    });
  }

  clearFilter() {
    this.formSearch = this.createForm();
  }

  handleChangOption(event: any) {
    this.rowDataSelected = this.collectData();
  }
  handleRowDoubleClicked(event: any) {
    this.dataDetail = event.data;
    this.isOpenDetailDialog = true;
  }

  private collectData(): Movie[] {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    return selectedNodes.map((node) => node.data);
  }
  private collectId(movie: Movie[]): number[] {
    return movie.map((item) => item.id!);
  }

  showCreate() {
    this.createEvent.emit();
  }

  handleSaveCreate(data: Movie) {
    this.isOpenCreateDialog.set(false);
  }

  closeCreateDialog() {
    this.isOpenCreateDialog.set(false);
  }

  onUpdateItem(data: Movie) {
    this.updateEvent.emit(data);
  }

  onDeleteItem(data: Movie) {
    const dataDelete: number[] = [data.id!];
    if (dataDelete.length === 0) {
      return;
    }
    this.dataDialog = dataDelete;
    this.isOpenAcceptDialog = true;
    this.typeAcceptDialog = ACTION_TYPE_ENUM.DELETE;
  }
  onCopyItem(data: Movie) {
    this.copyEvent.emit({
      ...data,
      id: null,
    });
  }
}
