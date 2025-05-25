import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { RenderStatusIconComponent } from './render-status-icon/render-status-icon.component';
import { PARAM_STATUS_ENUM } from '../../utils/enums/common.enums';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'render-action',
  standalone: true,
  imports: [CommonModule, TuiButton, RenderStatusIconComponent],
  template: `
    <div>
      <app-render-status-icon
        *ngIf="this?.params?.data?.status === this?.paramStatus?.SAVE_DRAFT"
        type="info"
        label="{{ this.paramStatus.SAVE_DRAFT }}-new_create"
      />
      <app-render-status-icon
        *ngIf="this?.params?.data?.status === this?.paramStatus?.WAIT_APPROVAL"
        type="warning"
        label="{{ this.paramStatus.WAIT_APPROVAL }}-wait_approve"
      />
      <app-render-status-icon
        *ngIf="this?.params?.data?.status === this?.paramStatus?.APPROVED"
        type="success"
        label="{{ this.paramStatus.APPROVED }}-approve"
      />
      <app-render-status-icon
        *ngIf="
          this?.params?.data?.status === this?.paramStatus?.CANCEL_APPROVED
        "
        type="gray"
        label="{{ this.paramStatus.CANCEL_APPROVED }}-cancel_approve"
      />
      <app-render-status-icon
        *ngIf="this?.params?.data?.status === this?.paramStatus?.REJECT"
        type="danger"
        label="{{ this.paramStatus.REJECT }}-reject"
      />
    </div>
  `,
})

// eslint-disable-next-line @angular-eslint/component-class-suffix
export class StatusCellRender implements ICellRendererAngularComp {
  paramStatus = PARAM_STATUS_ENUM;

  params!: any;
  is_group!: boolean;

  agInit(params: any): void {
    this.params = params;
    if (params.node.group) {
      this.is_group = params.node.group;
    }
  }

  refresh(params: any): boolean {
    this.params = params;
    return true;
  }
}
