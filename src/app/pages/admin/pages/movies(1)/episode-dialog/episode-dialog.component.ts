import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiDialogContext, TuiError, TuiTextfield } from '@taiga-ui/core';
import { TuiFieldErrorPipe, TuiInputNumber } from '@taiga-ui/kit';
import { TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { injectContext } from '@taiga-ui/polymorpheus';

export interface EpisodeData {
  episodeNumber?: number | null;
  title: string;
  description: string;
  sourceUrl: string;
  index?: number | null; // For editing
}

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
  ],
})
export class EpisodeDialogComponent {
  episodeForm: FormGroup;
  editMode: boolean = false;
  public readonly context = injectContext<TuiDialogContext<EpisodeData | null, EpisodeData>>();
  private readonly fb = inject(FormBuilder);

  test: string;

  constructor() {
    debugger
    this.test = 'ab';
    const data = this.context.data || {
      episodeNumber: null,
      title: '',
      description: '',
      sourceUrl: '',
    };
    this.editMode = !!data.index || data.index === 0;
    this.episodeForm = this.fb.group({
      episodeNumber: [
        data.episodeNumber,
        [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)],
      ],
      title: [data.title, [Validators.maxLength(100)]],
      description: [data.description, [Validators.maxLength(500)]],
      sourceUrl: [data.sourceUrl, [Validators.maxLength(255)]],
    });
  }

  submitEpisode(): void {
    if (this.episodeForm.valid) {
      const episodeData: EpisodeData = {
        ...this.episodeForm.value,
        index: this.editMode ? this.context.data?.index : null,
      };
      this.context.completeWith(episodeData);
    }
  }

  handleCancel(): void {
    this.context.completeWith(null); // Đóng dialog và   về null, giờ hợp lệ với type mới
  }
}