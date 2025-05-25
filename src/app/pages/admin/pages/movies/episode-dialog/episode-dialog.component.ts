import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiAlertService, TuiButton, TuiDialog, TuiError, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiFieldErrorPipe, TuiInputFiles, TuiInputNumber, TuiProgress, TuiTextarea } from '@taiga-ui/kit';
import { TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { AddEditType } from '../../../utils/constants';
import { ADD_EDIT_TYPE_ENUM, NOTI_TYPE_ENUM, RESPONSE_STATUS_ENUM } from '../../../utils/enums/common.enums';
import { EpisodeData } from '../../../models/movie.model';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { MovieService } from '../../../services/movie/movie.service';
import { FileItem, FileUploadModule, FileUploader  } from 'ng2-file-upload';
import { tuiPure } from '@taiga-ui/cdk';


@Component({
  selector: 'app-episode-dialog',
  templateUrl: './episode-dialog.component.html',
  styleUrls: ['./episode-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiTextfield,
    TuiButton,
    TuiError,
    TuiInputNumber,
    TuiTextfieldControllerModule,
    TuiFieldErrorPipe,
    AsyncPipe,
    TuiTextarea,
    FileUploadModule,
    TuiInputFiles,
    TuiIcon,
    TuiProgress,
    TuiDialog
  ],
})
export class EpisodeDialogComponent implements OnInit {
  @Input() isOpen = true;
  @Input() type: AddEditType = ADD_EDIT_TYPE_ENUM.CREATE;
  @Input() initData: EpisodeData | null = null;

  @Output() cancelEvent = new EventEmitter<void>();
  @Output() submitEvent = new EventEmitter<EpisodeData>();

  readonly #service = inject(MovieService);
  private readonly notificationService = inject(TuiAlertService)

  isFileOver: boolean = false;

  private readonly fb = inject(FormBuilder);

  uploader: FileUploader = new FileUploader({
    url: 'http://localhost:8080/api/files/upload',
    autoUpload: false,
    allowedMimeType: ['video/mp4', 'video/avi', 'video/mov'], // Restrict to video files
    maxFileSize: 1 * 1024 * 1024 * 1024, // 1GB max file size
    parametersBeforeFiles: false
  });
  uploadProgress: number | null = null;
  @ViewChild('fileInput') fileInput: any;

  episodeForm = new FormGroup({});

  ngOnInit(): void {
    this.episodeForm = this.createForm(null);

    this.uploader.onAfterAddingFile = (fileItem: FileItem) => {
      debugger
      const allowedTypes = ['video/mp4', 'video/avi', 'video/mov'];
      const maxSize = 1 * 1024 * 1024 * 1024; // 1GB
      if (!allowedTypes.includes(fileItem._file.type) || fileItem._file.size > maxSize) {
        this.notificationService.open('Invalid file: Only MP4, AVI, MOV up to 1GB allowed', { appearance: 'error' }).subscribe();
        this.uploader.removeFromQueue(fileItem);
      }
    };

    // Track progress for each chunk
    this.uploader.onProgressItem = (fileItem: FileItem, progress: number) => {
      this.uploadProgress = progress;
    };

    // Handle completion of each chunk
    this.uploader.onCompleteItem = (item: FileItem, response: string, status: number) => {
      if (status === 200 && this.uploadProgress === 100) {
        this.notificationService.open('File uploaded successfully!', { appearance: 'success' }).subscribe();
      } else if (status !== 200) {
        this.notificationService.open(`Upload failed: ${response}`, { appearance: 'error' }).subscribe();
        this.uploadProgress = null;
      }
    };

    // Handle errors
    this.uploader.onErrorItem = (item: FileItem, response: string) => {
      this.notificationService.open(`Upload failed: ${response}`, { appearance: 'error' }).subscribe();
      this.uploadProgress = null;
    };

    // Clear progress when all items are complete
    this.uploader.onCompleteAll = () => {
      if (this.uploadProgress === 100) {
        this.uploadProgress = null;
      }
    };

  }

  createForm(data: EpisodeData | null): FormGroup {
    return this.fb.group({
      episodeNumber: [
        data?.episodeNumber ?? null,
        [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)],
      ],
      title: [data?.title ?? null, [Validators.maxLength(100)]],
      description: [data?.description ?? null, [Validators.maxLength(500)]],
      sourceUrl: [data?.sourceUrl ?? null, [Validators.maxLength(255)]],
    });
  }

  getFormData(): EpisodeData {
    const dataSubmit = this.episodeForm.getRawValue();
    const returnObj = { ...this.initData, ...dataSubmit };

    return {
      episodeNumber: returnObj?.episodeNumber ?? null,
      title: returnObj?.title ?? '',
      description: returnObj?.description ?? '',
      sourceUrl: returnObj?.sourceUrl ?? '',
      index: returnObj?.index ?? null,
    }
  }

  submitEpisode(): void {
    if (this.episodeForm.valid) {
      this.submitEvent.emit(this.getFormData());
    }
  }

  handleCancel(): void {
    this.cancelEvent.emit();
  }

  
  private saveDraft() {
    injectMutation(() => this.#service.saveDraftEpisodeMutation())
      .mutateAsync(this.getFormData())
      .then((res) => {
        if (RESPONSE_STATUS_ENUM.SUCCESS === res.status) {
          
        } else {
          
        }
      })
      .catch((error) => {
        
      });
  }

  @tuiPure
  onFileDrop(files: File[]): void {
    this.uploader.clearQueue();
    if (files.length) {
      this.uploader.addToQueue(files);
      this.uploadProgress = null;
    }
  }

  @tuiPure
  onFileOver(isOver: boolean): void {
    this.isFileOver = isOver;
  }

  @tuiPure
  onFileSelected(event: any): void {
    debugger
    this.uploader.clearQueue();
    const files = event.target.files || event;
    if (files.length) {
      this.uploader.addToQueue(files);
      this.uploadProgress = null;
    }
  }

  @tuiPure
  uploadFile(): void {
    debugger
    if (this.uploader.queue.length === 0) {
      this.notificationService.open('Please select a file', { appearance: 'error' }).subscribe();
      return;
    }
    this.uploader.uploadAll();
  }

  @tuiPure
  cancelUpload(): void {
    this.uploader.cancelAll();
    this.uploadProgress = null;
    this.notificationService.open('Upload cancelled', { appearance: 'info' }).subscribe();
  }
}