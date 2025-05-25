// import { CommonModule, isPlatformBrowser } from '@angular/common';
// import { Component, Inject, inject, OnInit, PLATFORM_ID, signal, ViewChild } from '@angular/core';
// import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { TranslocoDirective, TranslocoModule } from '@jsverse/transloco';
// import { EMPTY_ARRAY, TuiHandler, TuiMapperPipe } from '@taiga-ui/cdk';
// import { TuiButton, TuiIcon, TuiTextfield } from '@taiga-ui/core';
// import { TuiAccordion } from '@taiga-ui/experimental';
// import { TuiTree } from '@taiga-ui/kit';
// import { TuiInputModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
// import { injectQuery } from '@tanstack/angular-query-experimental';
// import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
// import { ColDef } from 'ag-grid-community';
// import { Pagable, TreeNode } from '../../models/common.model';
// import { Movie } from '../../models/movie.model';
// import { MovieService } from '../../services/movie/movie.service';
// import { flatten } from '../../utils/functions/commom-utils';
// import { MovieCreateComponent } from "./movie-create/movie-create.component";

// @Component({
//   selector: 'app-movies',
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     FormsModule,
//     AgGridModule,
//     TranslocoDirective,
//     TranslocoModule,
//     TuiAccordion,
//     TuiTextfield,
//     TuiInputModule,
//     TuiTextfieldControllerModule,
//     TuiTree,
//     TuiButton,
//     TuiIcon,
//     TuiMapperPipe,
//     MovieCreateComponent
// ],
//   templateUrl: './movies.component.html',
//   styleUrl: './movies.component.scss'
// })
// export class MoviesComponent implements OnInit {
//   readonly #service = inject(MovieService);

//   readonly #fb = inject(FormBuilder);

//   readonly tlHeader = "movie.";
  
//   initData: Movie | null = null;

//   protected map = new Map<TreeNode, boolean>();
//   protected readonly genreData: TreeNode = {
//     text: '',
//     children: [
//       {
//         id: 1,
//         text: 'Hành động',
//         children: [
//           { id: 2, text: 'Siêu anh hùng' },
//           { id: 3, text: 'Chiến tranh' },
//         ],
//       },
//       {
//         id: 4,
//         text: 'Hài hước',
//         children: [
//           { id: 5, text: 'Châm biếm' },
//           { id: 6, text: 'Lãng mạn' },
//         ],
//       },
//     ]
//   };

//   public pagination: Pagable = {
//     itemPerpage: 10,
//     currentPage: 0,
//   };
//   public totalPage!: number;

//   protected readonly handler: TuiHandler<TreeNode, readonly TreeNode[]> = (item) =>
//     item.children || EMPTY_ARRAY;

//   formSearch: FormGroup = new FormGroup({});

//   protected dataFormSearch = signal({
//     pagination: this.pagination
//   });

//   readonly #featureQuery = injectQuery(() => this.#service.getListOption(this.dataFormSearch()));

//   rowData: Movie[] = [];

//   public defaultColDef: ColDef = {
//     resizable: true,
//     flex: 1,
//   };

//   public columnDefs: ColDef[] = [
//     {
//       field: 'checkbox',
//       checkboxSelection: true,
//       headerCheckboxSelection: true,
//       showDisabledCheckboxes: false,
//       maxWidth: 50,
//       pinned: 'left',
//     },
//     {
//       field: 'STT',
//       valueGetter: (param) => {
//         if (param.node && param.node.rowIndex !== null) {
//           return (
//             param.node.rowIndex +
//             1 +
//             this.pagination.currentPage * this.pagination.itemPerpage
//           );
//         }
//         return null;
//       },
//       width: 70,
//       pinned: 'left',
//     },

//   ]

//   rowDataSelected: Movie[] = [];
//   acceptLabel = '';
//   // acceptStatus: TuiNotification = 'warning';
//   public isOpenDetailDialog = false;
//   dataDetail: Movie | null = null;

//   @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  
//   isOpenCreateDialog = signal(false);

//   isBrowser = false;
//   constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

//   ngOnInit(): void {
//     this.isBrowser = isPlatformBrowser(this.platformId);

//     this.formSearch = this.createForm();
//     this.dataFormSearch.set({
//       ...this.formSearch.getRawValue(),
//       pagination: this.pagination,
//     });
//   }
  
//   createForm() {
//     return this.#fb.group({
//       name: [null],
//       genre: [null],
//       desc: [null]
//     })
//   }

//   handleSearch() {
//     this.pagination.currentPage = 0;
//     this.dataFormSearch.set({
//       ...this.formSearch.getRawValue(),
//       pagination: this.pagination,
//     });
//   }

//   clearFilter() {
//     this.formSearch = this.createForm();
//   }

//   protected readonly getValue = (
//       item: TreeNode,
//       map: Map<TreeNode, boolean>,
//   ): boolean | null => {
//     let result: boolean | null = null;
//     const flat = flatten(item);
//     const key = flat[0]!;

//     if (key) {
//         result = !!map.get(key);
//     }

//     for (const item of flat) {
//         if (result !== !!map.get(item)) {
//             return null;
//         }
//     }

//     return result;
//   };

//   protected onChecked(node: TreeNode, value: boolean): void {
//     debugger
//     flatten(node).forEach((item) => this.map.set(item, value));
//     this.map = new Map(this.map.entries());
//   }

//   handleChangOption(event: any) {
//     this.rowDataSelected = this.collectData();
//   }
//   handleRowDoubleClicked(event: any) {
//     this.dataDetail = event.data;
//     this.isOpenDetailDialog = true;
//   }

//   private collectData(): Movie[] {
//     const selectedNodes = this.agGrid.api.getSelectedNodes();
//     return selectedNodes.map((node) => node.data);
//   }
//   private collectId(movie: Movie[]): number[] {
//     return movie.map((item) => item.id!);
//   }

//   handleCreate() {
//     this.isOpenCreateDialog.set(true);
//   }

//   handleSaveCreate(data: Movie) {
//     this.isOpenCreateDialog.set(false);
//   }

//   closeCreateDialog() {
//     this.isOpenCreateDialog.set(false);
//   }
// }
