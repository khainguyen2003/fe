import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TuiAlertOptions, TuiAlertService, TuiButton, TuiLoader } from '@taiga-ui/core';
import { NotificationData } from '../../../models/common.model';
import { TuiAvatar, TuiProgress } from '@taiga-ui/kit';
import { TuiPopover } from '@taiga-ui/cdk';
import {POLYMORPHEUS_CONTEXT} from '@taiga-ui/polymorpheus';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'pmh-param-alert-template',
  standalone: true,
  imports: [
    CommonModule,
    TuiButton,
    TuiProgress,
    TuiAvatar,
    TranslocoModule
  ],
  templateUrl: './alert-template.component.html',
  styleUrls: ['./alert-template.component.css'],
})
export class AlertTemplateComponent {
  private readonly context =
    inject<TuiPopover<TuiAlertOptions<any>, any>>(POLYMORPHEUS_CONTEXT);

  protected item: NotificationData;

  protected openConfirmCancelDownloadDialog = false;

  protected readonly alert = inject(TuiAlertService);

  public status: 'success' | 'error' | 'warning' = 'success';

  //private readonly SUCCESS_CODE = '00';

  constructor() {
    this.item = this.context.data;
  }

  protected handleClosePush(): void {
    this.item.completed = false;
    this.context.completeWith(this.item);
  }

  protected handleDetailData(): void {
    this.item.completed = true;
    this.context.completeWith(this.item);
  }
}
