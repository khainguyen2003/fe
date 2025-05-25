import { AsyncPipe, CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslocoService } from '@jsverse/transloco';
import {
  TuiAlertService,
  TuiAppearance,
  TuiButton,
  tuiDateFormatProvider,
  TuiDialogContext,
  TuiDialogService,
  TuiError,
  TuiGroup,
  TuiIcon,
  TuiLabel,
  TuiTextfield,
  TuiTitle
} from '@taiga-ui/core';
import {
  TuiChevron,
  TuiChip,
  TuiDataListWrapper,
  TuiFieldErrorPipe,
  TuiFileLike,
  TuiFiles,
  TuiInputNumber,
  TuiSelect,
  TuiTabs,
  TuiTextarea,
  TuiTooltip,
} from '@taiga-ui/kit';
import { TuiForm } from '@taiga-ui/layout';
import {
  TuiInputDateModule,
  TuiInputModule,
  TuiTextfieldControllerModule
} from '@taiga-ui/legacy';
import { injectMutation } from '@tanstack/angular-query-experimental';
import {
  catchError,
  delay,
  from,
  Observable,
  of,
  Subject,
  switchMap
} from 'rxjs';
import { BreadcrumbItem, NotificationData, Option } from '../../../models/common.model';
import { EpisodeData, Movie } from '../../../models/movie.model';
import { MovieService } from '../../../services/movie/movie.service';
import { AddEditType } from '../../../utils/constants';
import { ADD_EDIT_TYPE_ENUM, SCREEN_TYPE_ENUM } from '../../../utils/enums/common.enums';
import { maxLength, minLength, minValue } from '../../../utils/validators/length-validators';
import { required } from '../../../utils/validators/required-validators';
import { identityMatcher, identityMatcherLabel, removeDiacritics, stringifyLabelSelect } from './../../../utils/functions/ui-utils';
import { EpisodeDialogComponent } from '../episode-dialog/episode-dialog.component';

@Component({
  selector: 'app-movie-create',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiError,
    TuiFieldErrorPipe,
    AsyncPipe,
    TuiButton,
    TuiChevron,
    TuiDataListWrapper,
    TuiForm,
    TuiGroup,
    TuiIcon,
    TuiInputNumber,
    TuiLabel,
    TuiSelect,
    TuiTextfield,
    TuiTitle,
    TuiTooltip,
    TuiFiles,
    TuiTextarea,
    TuiTabs,
    TuiInputModule,
    TuiAppearance,
    TuiInputDateModule,
    TuiChip,
    EpisodeDialogComponent
],
  templateUrl: './movie-create.component.html',
  styleUrl: './movie-create.component.less',
  providers: [tuiDateFormatProvider({ mode: 'DMY', separator: '/' })],
})
export class MovieCreateComponent implements OnInit, OnDestroy {
  @Input()
  public type: AddEditType = ADD_EDIT_TYPE_ENUM.CREATE;

  @Input()
  public initData: Movie | null = null;

  // Biến sử dụng để hiển thị thông báo
  @Input() notification!: Subject<NotificationData>;

  @Output()
  public backEvent: EventEmitter<string> = new EventEmitter();

  @Output()
  public changeScreenEvent: EventEmitter<SCREEN_TYPE_ENUM | string> =
    new EventEmitter();
    
  readonly #service = inject(MovieService);
  readonly #translate = inject(TranslocoService);
  readonly #alerts = inject(TuiAlertService);
  private readonly dialogService = inject(TuiDialogService);

  readonly #fb = inject(FormBuilder);

  public breadcrumbs: BreadcrumbItem[] = [];
  headerBreadcrumbs = '';

  protected form: FormGroup = {} as FormGroup;
  episodeForm: FormGroup = new FormGroup({});
  thumbControl = this.#fb.control<File | null>(null);
  posterControl = this.#fb.control<File | null>(null);
  videoControl = this.#fb.control<File | null>(null, [Validators.required]);

  thumbPreviewUrl: string | null = null;
  videoPreviewUrl: string | null = null;

  isUploading = false;
  editMode: boolean = false;
  editIndex: number | null = null;

  readonly loadingThumb$ = new Subject<TuiFileLike | null>();
  readonly failedThumb$ = new Subject<TuiFileLike | null>();

  readonly loadedPoster$ = new Subject<TuiFileLike | null>();
  readonly loadingPoster$ = new Subject<TuiFileLike | null>();
  readonly failedPoster$ = new Subject<TuiFileLike | null>();

  readonly videoRejectedFiles$ = new Subject<TuiFileLike | null>();
  readonly videoLoadingFiles$ = new Subject<TuiFileLike | null>();
  readonly videoFailedFiles$ = new Subject<TuiFileLike | null>();
  readonly videoLoadedFiles$ = this.videoControl.valueChanges.pipe(
    switchMap((file) => (file ? this.makeUploadRequest(file, 'video') : of(null)))
  );

  isOpenEpisodeDialog = false;
  editEpisodeType = ADD_EDIT_TYPE_ENUM.CREATE;

  private abortController: AbortController | null = null;

  public readonly tlHeader = 'movie.';
  // biến dùng cho các tab
  protected readonly index = 0;

  readonly identityMatcher = identityMatcher;
  readonly identityMatcherLabel = identityMatcherLabel;

  readonly stringifyLabelSelect = stringifyLabelSelect;

  protected readonly filterLabelSelect = (
    item: { value: string; label: string },
    query: string
  ): boolean =>
    removeDiacritics(item.label)
      .toLowerCase()
      .includes(removeDiacritics(query).toLowerCase());

  genres: Option[] = [
    { value: '1', label: 'Hành động' },
    { value: '2', label: 'Tình cảm' },
    { value: '3', label: 'Hài hước' },
    { value: '4', label: 'Kinh dị' },
    { value: '5', label: 'Khoa học viễn tưởng' },
    { value: '6', label: 'Hoạt hình' },
    { value: '7', label: 'Tâm lý' },
    { value: '8', label: 'Phiêu lưu' },
    { value: '9', label: 'Chiến tranh' },
    { value: '10', label: 'Hình sự' },
    { value: '11', label: 'Âm nhạc' },
    { value: '12', label: 'Lịch sử' },
    { value: '13', label: 'Viễn Tây' },
    { value: '14', label: 'Thể thao' },
    { value: '15', label: 'Gia đình' }
  ];

  directors: Option[] = [
    { value: '1', label: 'Đạo diễn khải' },
    { value: '2', label: 'Steven Spielberg' },
    { value: '3', label: 'Quentin Tarantino' },
  ];
  
  @ViewChild('episodeDialogTemplate') episodeDialogTemplate!: TemplateRef<TuiDialogContext>;

  ngOnInit(): void {
    this.detailForm();
    this.#translate.langChanges$
      .pipe(
        delay(100)
        // takeUntil
      )
      .subscribe((res) => {
        this.updateTranslateValidators();
      });
  }

  private detailForm(): void {
    const detail: any = { ...this.initData };

    this.form = this.createForm(detail);

    const data = {
      episodeNumber: null,
      title: '',
      description: '',
      sourceUrl: '',
    };
    this.createEpisodeForm(data);
  }

  private updateTranslateValidators() {
    const name = this.form.get('name');
    if (name) {
      name.setValidators([
        required(this.#translate.translate(this.tlHeader + 'name_required')),
        maxLength(
          this.#translate.translate(this.tlHeader + 'name_length'),
          2000
        ),
      ]);
      name.updateValueAndValidity();
    }

    const genre = this.form.get('genre');
    if (genre) {
      genre.setValidators([
        required(this.#translate.translate(this.tlHeader + 'genre_required')),
        minLength(this.#translate.translate(this.tlHeader + 'genre_required'), 0)
      ]);
      genre.updateValueAndValidity();
    }

    const totalEpisodes = this.form.get('totalEpisodes');
    if (totalEpisodes) {
      totalEpisodes.setValidators([
        minValue(
          1,
          this.#translate.translate(this.tlHeader + 'total_episode_min')
        ),
      ]);
      totalEpisodes.updateValueAndValidity();
    }
  }

  private createForm(dataForm: any): FormGroup {
    // set value thumb control
    return this.#fb.group({
      name: [
        dataForm?.name ?? null,
        [Validators.required, Validators.maxLength(100)],
      ],
      originalName: [dataForm?.originalName ?? null, Validators.maxLength(100)],
      title: [dataForm?.title ?? null, Validators.maxLength(200)],
      genre: [dataForm?.genre ?? null, Validators.required],
      director: [dataForm?.director ?? null, Validators.required],
      description: [
        dataForm?.description ?? null,
        [Validators.required, Validators.maxLength(1000)],
      ],
      releaseDate: [dataForm?.releaseDate ?? null, Validators.required],
      movieType: [dataForm?.movieType ?? null, Validators.required],
      durationMinutes: [
        dataForm?.durationMinutes ?? null,
        [Validators.required, Validators.min(1)],
      ],
      totalEpisodes: [dataForm?.totalEpisodes ?? null, [Validators.min(1)]],
      thumb: this.thumbControl,
      poster: this.posterControl,
      trailerUrl: [
        dataForm?.trailerUrl ?? null,
        [Validators.pattern('https?://.+')],
      ],
      sources: [dataForm?.sources ?? null],
      episodes: this.#fb.array([]),
    });
  }

  private createEpisodeForm(data?: EpisodeData) {
    this.episodeForm = this.#fb.group({
      episodeNumber: [
        data?.episodeNumber ?? null,
        [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)],
      ],
      title: [data?.title ?? '', [Validators.maxLength(100)]],
      description: [data?.description ?? '', [Validators.maxLength(500)]],
      sourceUrl: [data?.sourceUrl ?? '', [Validators.maxLength(255)]],
      index: [data?.index],
    });
  }

  get episodes(): FormArray {
    return this.form.get('episodes') as FormArray;
  }

  showDialog(content: TemplateRef<TuiDialogContext>): void {
    this.editMode = false;
    this.editIndex = null;
    this.createEpisodeForm();
    this.dialogService.open(content, { dismissible: true }).subscribe();
  }

  addEpisode() {
    this.editEpisodeType = ADD_EDIT_TYPE_ENUM.CREATE;
    this.initData = null;
    this.isOpenEpisodeDialog = true;
  }

  handleCancelEpisode() {
    this.isOpenEpisodeDialog = false;
    this.editEpisodeType = ADD_EDIT_TYPE_ENUM.CREATE;
    this.initData = null;
  }

  handleSubmitEpisode(data: EpisodeData) {

  }

  saveEpisode(): void {
    if (this.episodeForm.valid) {
      const episodes = this.form.get('episodes')?.value.slice() || [];
      const newEpisode: EpisodeData = this.episodeForm.value;
      episodes.push(newEpisode);
      this.form.get('episodes')?.setValue(episodes);
    }
  }

  editEpisode(index: number): void {
    const episodes = this.form.get('episodes')?.value;
    this.editMode = true;
    this.editIndex = index;
    this.createEpisodeForm({ ...episodes[index], index });
    this.dialogService.open(this.episodeDialogTemplate, { dismissible: true }).subscribe();
  }

  updateEpisode(observer: TuiDialogContext): void {
    if (this.episodeForm.valid) {
      const episodes = this.form.get('episodes')?.value.slice() || [];
      const updatedEpisode: EpisodeData = this.episodeForm.value;
      const index = updatedEpisode.index ?? 0;
      episodes[index] = {
        episodeNumber: updatedEpisode.episodeNumber,
        title: updatedEpisode.title,
        description: updatedEpisode.description,
        sourceUrl: updatedEpisode.sourceUrl,
      };
      this.form.get('episodes')?.setValue(episodes);
      observer.completeWith(); // Đóng dialog sau khi cập nhật
    }
  }

  removeEpisode(index: number): void {
    const episodes = this.form.get('episodes')?.value.slice() || [];
    episodes.splice(index, 1);
    this.form.get('episodes')?.setValue(episodes);
    this.form.get('totalEpisodes')?.setValue(episodes.length);
  }

  private cancelUpload(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    this.isUploading = false;
  }

  private makeUploadRequest(file: File, type: 'video'): Observable<TuiFileLike | null> {
    this.cancelUpload(); // Hủy yêu cầu trước nếu có
    this.abortController = new AbortController();

    const formData = new FormData();
    formData.append('file', file);

    this.isUploading = true;

    const upload$ = from(
      injectMutation(() => this.#service.saveDraftMutation()).mutateAsync(formData).then((res) => {
        this.videoControl.setValue(res.url as any);
        this.videoLoadingFiles$.next(null);
        this.clearVideoPreview();
        return file;
      })
    ).pipe(
      catchError((error) => {
        if (error.name === 'AbortError') {
          this.#alerts.open('Video upload cancelled.', { appearance: 'info' }).subscribe();
        } else {
          this.videoRejectedFiles$.next(file);
          this.videoLoadingFiles$.next(null);
          this.#alerts.open('Error uploading video: ' + error.message, { appearance: 'error' }).subscribe();
        }
        return of(null);
      })
    );

    return upload$;
  }

  removeThumbFile(): void {
    this.thumbControl.setValue(null);
    this.clearThumbPreview();
  }

  private clearThumbPreview(): void {
    if (this.thumbPreviewUrl) {
      URL.revokeObjectURL(this.thumbPreviewUrl);
      this.thumbPreviewUrl = null;
    }
  }

  private clearVideoPreview(): void {
    if (this.videoPreviewUrl) {
      URL.revokeObjectURL(this.videoPreviewUrl);
      this.videoPreviewUrl = null;
    }
  }

  ngOnDestroy(): void {
    
  }
}