// import { AsyncPipe, CommonModule } from '@angular/common';
// import { HttpClient, HttpRequest } from '@angular/common/http';
// import {
//   Component,
//   EventEmitter,
//   inject,
//   INJECTOR,
//   Input,
//   OnDestroy,
//   OnInit,
//   Output,
//   TemplateRef,
//   ViewChild
// } from '@angular/core';
// import {
//   FormArray,
//   FormBuilder,
//   FormGroup,
//   ReactiveFormsModule,
//   Validators,
// } from '@angular/forms';
// import { TranslocoService } from '@jsverse/transloco';
// import {
//   TuiAlertService,
//   TuiAppearance,
//   TuiButton,
//   tuiDateFormatProvider,
//   TuiDialog,
//   TuiDialogContext,
//   TuiDialogService,
//   TuiError,
//   TuiGroup,
//   TuiIcon,
//   TuiLabel,
//   TuiTextfield,
//   TuiTitle
// } from '@taiga-ui/core';
// import {
//   TuiChevron,
//   TuiChip,
//   TuiDataListWrapper,
//   TuiFieldErrorPipe,
//   TuiFileLike,
//   TuiFiles,
//   TuiInputNumber,
//   TuiSelect,
//   TuiTabs,
//   TuiTextarea,
//   TuiTooltip,
// } from '@taiga-ui/kit';
// import { TuiForm } from '@taiga-ui/layout';
// import {
//   TuiInputDateModule,
//   TuiInputModule,
//   TuiTextfieldControllerModule
// } from '@taiga-ui/legacy';
// import {
//   catchError,
//   delay,
//   finalize,
//   map,
//   Observable,
//   of,
//   Subject,
//   switchMap,
//   timer
// } from 'rxjs';
// import { EpisodeData } from '../../../components/episode-dialog/episode-dialog.component';
// import { Option } from '../../../models/common.model';
// import { Movie } from '../../../models/movie.model';
// import { MovieService } from '../../../services/movie/movie.service';
// import { maxLength, minLength, minValue } from '../../../utils/validators/length-validators';
// import { required } from '../../../utils/validators/required-validators';
// import { stringifyLabelSelect } from './../../../utils/functions/ui-utils';

// @Component({
//   selector: 'app-movie-create',
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     TuiDialog,
//     TuiInputModule,
//     TuiTextfieldControllerModule,
//     TuiError,
//     TuiFieldErrorPipe,
//     AsyncPipe,
//     TuiButton,
//     TuiChevron,
//     TuiDataListWrapper,
//     TuiForm,
//     TuiGroup,
//     TuiIcon,
//     TuiInputNumber,
//     TuiLabel,
//     TuiSelect,
//     TuiTextfield,
//     TuiTitle,
//     TuiTooltip,
//     TuiFiles,
//     TuiTextarea,
//     TuiTabs,
//     TuiInputModule,
//     TuiAppearance,
//     TuiInputDateModule,
//     TuiChip,
//   ],
//   templateUrl: './movie-create.component.html',
//   styleUrl: './movie-create.component.less',
//   providers: [tuiDateFormatProvider({ mode: 'DMY', separator: '/' })],
// })
// export class MovieCreateComponent implements OnInit, OnDestroy {
//   @Input()
//   isOpen = false;

//   @Input()
//   initData: Movie | null = null;

//   @Output()
//   public cancelEvent: EventEmitter<void> = new EventEmitter();

//   @Output()
//   public submitEvent: EventEmitter<Movie> = new EventEmitter();

//   readonly #service = inject(MovieService);
//   readonly #translate = inject(TranslocoService);
//   readonly #alerts = inject(TuiAlertService);

//   readonly #fb = inject(FormBuilder);
//   private readonly http = inject(HttpClient);
//   private readonly dialogService = inject(TuiDialogService);

//   readonly tlHeader = 'movie.';

//   private readonly injector = inject(INJECTOR);

//   // biến dùng cho các tab
//   protected readonly index = 0;

//   genreDropdown: Option[] = [];

//   protected form: FormGroup = new FormGroup({});
//   episodeForm: FormGroup = new FormGroup({});
//   thumbControl = this.#fb.control<File | null>(null);
//   posterControl = this.#fb.control<File | null>(null);
//   videoControl = this.#fb.control<File | null>(null, [Validators.required]);

//   thumbPreviewUrl: string | null = null;
//   videoPreviewUrl: string | null = null;

//   isUploading = false;
//   editMode: boolean = false;
//   editIndex: number | null = null;

//   readonly loadingThumb$ = new Subject<TuiFileLike | null>();
//   readonly failedThumb$ = new Subject<TuiFileLike | null>();

//   readonly loadedPoster$ = new Subject<TuiFileLike | null>();
//   readonly loadingPoster$ = new Subject<TuiFileLike | null>();
//   readonly failedPoster$ = new Subject<TuiFileLike | null>();

//   readonly videoRejectedFiles$ = new Subject<TuiFileLike | null>();
//   readonly videoLoadingFiles$ = new Subject<TuiFileLike | null>();
//   readonly videoFailedFiles$ = new Subject<TuiFileLike | null>();
//   readonly videoLoadedFiles$ = this.videoControl.valueChanges.pipe(
//     switchMap((file) => (file ? this.makeUploadRequest(file, 'video') : of(null)))
//   );

//   private abortController: AbortController | null = null;
//   private uploadSubscription: Observable<TuiFileLike | null> = of(null);

//   @ViewChild('episodeDialogTemplate') episodeDialogTemplate!: TemplateRef<TuiDialogContext>;

//   servers: Option[] = [
//     { value: '1', label: 'Server 1' },
//     { value: '2', label: 'Server 2' },
//     { value: '3', label: 'Server 3' },
//   ]; 

//   protected persons: Option[] = [
//     { value: 'Roman', label: 'Sedov' },
//     { value: 'Alex', label: 'Inkin' },
//   ];

//   stringifyLabelSelect = stringifyLabelSelect;

//   ngOnInit(): void {
//     this.detailForm();
//     this.thumbControl.valueChanges.subscribe((file: File | null) => {
//       if (file) {
//         this.loadingThumb$.next(file);
//         this.thumbPreviewUrl = URL.createObjectURL(file);
//       } else {
//         this.clearThumbPreview();
//       }
//     });
//     this.#translate.langChanges$
//       .pipe(
//         delay(100)
//       )
//       .subscribe(() => {
//         this.updateTranslateValidators();
//       });

//     this.episodeForm = this.#fb.group({
//       episodeNumber: [null, [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)]],
//       title: ['', [Validators.maxLength(100)]],
//       description: ['', [Validators.maxLength(500)]],
//       sourceUrl: ['', [Validators.maxLength(255)]],
//     });
//   }

//   private clearThumbPreview(): void {
//     if (this.thumbPreviewUrl) {
//       URL.revokeObjectURL(this.thumbPreviewUrl);
//       this.thumbPreviewUrl = null;
//     }
//   }

//   private clearVideoPreview(): void {
//     if (this.videoPreviewUrl) {
//       URL.revokeObjectURL(this.videoPreviewUrl);
//       this.videoPreviewUrl = null;
//     }
//   }

//   private detailForm(): void {
//     const detail: any = { ...this.initData };

//     this.form = this.createForm(detail);

//     const data = {
//       episodeNumber: null,
//       title: '',
//       description: '',
//       sourceUrl: '',
//     };
//     this.createEpisodeForm(data);
//   }

//   private updateTranslateValidators() {
//     const name = this.form.get('name');
//     if (name) {
//       name.setValidators([
//         required(this.#translate.translate(this.tlHeader + 'name_required')),
//         maxLength(
//           this.#translate.translate(this.tlHeader + 'name_length'),
//           2000
//         ),
//       ]);
//       name.updateValueAndValidity();
//     }

//     const genre = this.form.get('genre');
//     if (genre) {
//       genre.setValidators([
//         required(this.#translate.translate(this.tlHeader + 'genre_required')),
//         minLength(this.#translate.translate(this.tlHeader + 'genre_required'), 0)
//       ]);
//       genre.updateValueAndValidity();
//     }

//     const totalEpisodes = this.form.get('totalEpisodes');
//     if (totalEpisodes) {
//       totalEpisodes.setValidators([
//         minValue(
//           1,
//           this.#translate.translate(this.tlHeader + 'total_episode_min')
//         ),
//       ]);
//       totalEpisodes.updateValueAndValidity();
//     }
//   }

//   protected readonly loadedThumb$ = this.thumbControl.valueChanges.pipe(
//     switchMap((file) => this.processFile(file))
//   );

//   protected processFile(
//     file: TuiFileLike | null
//   ): Observable<TuiFileLike | null> {
//     this.failedThumb$.next(null);

//     if (this.thumbControl.invalid || !file) {
//       return of(null);
//     }

//     this.loadingThumb$.next(file);

//     return timer(1000).pipe(
//       map(() => {
//         if (Math.random() > 0.5) {
//           return file;
//         }

//         this.failedThumb$.next(file);

//         return null;
//       }),
//       finalize(() => this.loadingThumb$.next(null))
//     );
//   }

//   private createForm(dataForm: any): FormGroup {
//     // set value thumb control
//     return this.#fb.group({
//       name: [
//         dataForm?.name ?? null,
//         [Validators.required, Validators.maxLength(100)],
//       ],
//       originalName: [dataForm?.originalName ?? null, Validators.maxLength(100)],
//       title: [dataForm?.title ?? null, Validators.maxLength(200)],
//       genre: [dataForm?.genre ?? null, Validators.required],
//       director: [dataForm?.director ?? null, Validators.required],
//       description: [
//         dataForm?.description ?? null,
//         [Validators.required, Validators.maxLength(1000)],
//       ],
//       releaseDate: [dataForm?.releaseDate ?? null, Validators.required],
//       movieType: [dataForm?.movieType ?? null, Validators.required],
//       durationMinutes: [
//         dataForm?.durationMinutes ?? null,
//         [Validators.required, Validators.min(1)],
//       ],
//       totalEpisodes: [dataForm?.totalEpisodes ?? null, [Validators.min(1)]],
//       thumb: this.thumbControl,
//       poster: this.posterControl,
//       trailerUrl: [
//         dataForm?.trailerUrl ?? null,
//         [Validators.pattern('https?://.+')],
//       ],
//       sources: [dataForm?.sources ?? null],
//       episodes: this.#fb.array([]),
//     });
//   }

//   private createEpisodeForm(data?: EpisodeData) {
//     this.episodeForm = this.#fb.group({
//       episodeNumber: [
//         data?.episodeNumber ?? null,
//         [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)],
//       ],
//       title: [data?.title ?? '', [Validators.maxLength(100)]],
//       description: [data?.description ?? '', [Validators.maxLength(500)]],
//       sourceUrl: [data?.sourceUrl ?? '', [Validators.maxLength(255)]],
//       index: [data?.index],
//     });
//   }

//   get episodes(): FormArray {
//     return this.form.get('episodes') as FormArray;
//   }

//   showDialog(content: TemplateRef<TuiDialogContext>): void {
//     this.editMode = false;
//     this.editIndex = null;
//     this.createEpisodeForm();
//     this.dialogService.open(content, { dismissible: true }).subscribe();
//   }

//   addEpisode(observer: TuiDialogContext): void {
//     if (this.episodeForm.valid) {
//       const episodes = this.form.get('episodes')?.value.slice() || [];
//       const newEpisode: EpisodeData = this.episodeForm.value;
//       episodes.push(newEpisode);
//       this.form.get('episodes')?.setValue(episodes);
//       this.form.get('totalEpisodes')?.setValue(episodes.length);
//       observer.completeWith(); // Đóng dialog sau khi thêm
//     }
//   }

//   editEpisode(index: number): void {
//     const episodes = this.form.get('episodes')?.value;
//     this.editMode = true;
//     this.editIndex = index;
//     this.createEpisodeForm({ ...episodes[index], index });
//     this.dialogService.open(this.episodeDialogTemplate, { dismissible: true }).subscribe();
//   }

//   updateEpisode(observer: TuiDialogContext): void {
//     if (this.episodeForm.valid) {
//       const episodes = this.form.get('episodes')?.value.slice() || [];
//       const updatedEpisode: EpisodeData = this.episodeForm.value;
//       const index = updatedEpisode.index ?? 0;
//       episodes[index] = {
//         episodeNumber: updatedEpisode.episodeNumber,
//         title: updatedEpisode.title,
//         description: updatedEpisode.description,
//         sourceUrl: updatedEpisode.sourceUrl,
//       };
//       this.form.get('episodes')?.setValue(episodes);
//       observer.completeWith(); // Đóng dialog sau khi cập nhật
//     }
//   }

//   removeEpisode(index: number): void {
//     const episodes = this.form.get('episodes')?.value.slice() || [];
//     episodes.splice(index, 1);
//     this.form.get('episodes')?.setValue(episodes);
//     this.form.get('totalEpisodes')?.setValue(episodes.length);
//   }

//   generateNameAndSlug(index: number): void {
//     const episode = this.episodes.at(index) as FormGroup;
//     if (!episode.get('name')?.value) {
//       episode.get('name')?.setValue(`Episode ${index + 1}`);
//     }
//     if (!episode.get('slug')?.value) {
//       const generatedSlug = (
//         episode.get('name')?.value || `episode-${index + 1}`
//       )
//         .toLowerCase()
//         .replace(/\s+/g, '-');
//       episode.get('slug')?.setValue(generatedSlug);
//     }
//   }

//   handleCancel(): void {
//     this.form.reset();
//     this.episodes.clear();
//     this.thumbControl.reset();
//     this.posterControl.reset();
//     this.cancelEvent.emit();
//     this.isOpen = false; // Đóng dialog chính
//   }

//   handleCancelEpisode(observer: TuiDialogContext): void {
//     this.episodeForm.reset();
//     this.editMode = false;
//     this.editIndex = null;
//     observer.completeWith(); // Đóng dialog tập phim
//   }

//   handlerConfirm(): void {
//     if (this.form.invalid) {
//       this.#alerts
//         .open('Vui lòng điền đầy đủ các trường bắt buộc', {
//           appearance: 'error',
//         })
//         .subscribe();
//       return;
//     }
//     this.submitEvent.emit(this.form.value);
//     this.handleCancel();
//   }

//   removeFile(control: string): void {
//     if (control === 'thumb') this.thumbControl.setValue(null);
//     else if (control === 'poster') this.posterControl.setValue(null);
//   }

//   removeThumbFile(): void {
//     this.thumbControl.setValue(null);
//     this.clearThumbPreview();
//   }

//   removeVideoFile(): void {
//     this.cancelUpload();
//     this.videoControl.setValue(null);
//     this.videoRejectedFiles$.next(null);
//     this.videoLoadingFiles$.next(null);
//     this.clearVideoPreview();
//   }

//   private cancelUpload(): void {
//     if (this.abortController) {
//       this.abortController.abort();
//       this.abortController = null;
//     }
//     this.isUploading = false;
//   }

//   private makeUploadRequest(file: File, type: 'video'): Observable<TuiFileLike | null> {
//     this.cancelUpload(); // Hủy yêu cầu trước nếu có
//     this.abortController = new AbortController();

//     const formData = new FormData();
//     formData.append('file', file);

//     const request = new HttpRequest('POST', 'http://localhost:8080/upload/video', formData, {
//       reportProgress: false
//     });

//     this.isUploading = true;

//     return this.http.request(request).pipe(
//       map((event: any) => {
//         if (event.body && event.body.url) {
//           return event.body;
//         }
//         return null;
//       }),
//       map((response) => {
//         if (response) {
//           this.videoControl.setValue(response.url as any);
//           this.videoLoadingFiles$.next(null);
//           this.clearVideoPreview();
//           return file;
//         }
//         return null;
//       }),
//       catchError((error) => {
//         if (error.name === 'AbortError') {
//           this.#alerts.open('Video upload cancelled.', { appearance: 'info' }).subscribe();
//         } else {
//           this.videoRejectedFiles$.next(file);
//           this.videoLoadingFiles$.next(null);
//           this.#alerts.open('Error uploading video: ' + error.message, { appearance: 'error' }).subscribe();
//         }
//         return of(null);
//       })
//     ).pipe(map(() => file));
//   }

//   handleSaveDraft() {
//     if (this.form.valid) {
//       this.getFormCreate();

//       this.isUploading = true; // Ngăn gửi nhiều lần
//       this.#service.saveDraftMutation
//       this.http
//         .post(`http://localhost:8080/api/admin/movies`, formData)
//         .subscribe({
//           next: (response: any) => {
//             this.#alerts.open(`Movie "${response.title}" saved successfully!`, { appearance: 'success' }).subscribe();
//             this.form.reset();
//             this.clearThumbPreview();
//           },
//           error: (error) => {
//             this.#alerts.open('Error saving movie: ' + (error.error || error.message), { appearance: 'error' }).subscribe();
//           },
//         });
//     } else {
//       this.form.markAllAsTouched();
//       this.#alerts.open('Vui lòng điền tất cả các trường bắt buộc', { appearance: 'error' }).subscribe();
//     }
//   }

//   getFormCreate(): FormData {
//     const dataSubmit = this.form.getRawValue();
//       const returnObj = { ...this.initData, ...dataSubmit };
//       const formData = new FormData();
//       const thumbFile: any = this.thumbControl.value;
//       if (thumbFile instanceof File) {
//         formData.append('thumb', thumbFile);
//       }

//       const movieData = {
//         name: returnObj.name,
//         originalName: returnObj.originalName,
//         title: returnObj.title,
//         genre: returnObj.genre,
//         director: returnObj.director?.id,
//         description: returnObj.description,
//         releaseDate: returnObj.releaseDate,
//         movieType: returnObj.movieType,
//         durationMinutes: returnObj.durationMinutes,
//         totalEpisodes: returnObj.totalEpisodes,
//         poster: returnObj.poster,
//         sources: returnObj.sources,
//       };
//       formData.append('movie', new Blob([JSON.stringify(movieData)], { type: 'application/json' }));

//       return formData;
//   }

//   handleSaveApprove() {}

//   ngOnDestroy(): void {
//     this.clearThumbPreview();
//   }
// }