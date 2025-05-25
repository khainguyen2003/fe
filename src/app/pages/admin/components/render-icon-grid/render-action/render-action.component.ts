import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import {
  ACTIVE_STATUS_NUMBER_ENUM,
  DISPLAY_STATUS_ENUM,
  FUNCTION_ALLOWS_ENUM,
  PARAM_STATUS_ENUM,
} from '../../../utils/enums/common.enums';
import { TuiButton, TuiHint, TuiIcon } from '@taiga-ui/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'pmh-param-render-action',
  standalone: true,
  imports: [
    CommonModule,
    TuiButton,
    TuiIcon,
    TuiHint
  ],
  template: `
    <div class="icon-action">
      <span *ngIf="isHistory">
        <bidv-icon
          icon="bidvIconHistoryOutline"
          tuiHint="Lịch sử"
          tuiButton
          appearance="primary"
          (click)="onHistory()"
          class="icon-style"
        ></bidv-icon>
      </span>
      <span *ngIf="isCoppy">
        <bidv-icon
          icon="bidvIconCopyAddOutline"
          tuiHint="Sao chép"
          tuiButton
          appearance="primary"
          (click)="onCoppy()"
          class="icon-style"
        ></bidv-icon>
      </span>
      <span *ngIf="isEdit">
        <bidv-icon
          icon="bidvIconEditOutline"
          tuiHint="Chỉnh sửa"
          tuiButton
          appearance="primary"
          (click)="onEditClick()"
          class="icon-style"
        ></bidv-icon>
      </span>
      <span *ngIf="isDelete">
        <bidv-icon
          icon="bidvIconDeleteOutline"
          tuiHint="Xóa"
          size="s"
          tuiButton
          appearance="primary"
          (click)="onDeleteClick()"
          class="icon-style"
        ></bidv-icon>
      </span>
    </div>
  `,
  styleUrls: ['./render-action.component.scss'],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class RenderActionComponent implements ICellRendererAngularComp {
  params!: any;
  functionCode!: string;
  function = FUNCTION_ALLOWS_ENUM;
  public isEdit = false;
  public isDelete = false;
  public isCoppy = true;
  public isHistory = true;
  //Tập biến quyết định có hiển thị các nút khi thỏa mãn một số điều kiện hay không
  public isDisplayEdit = true;
  public isDisplayCoppy = true;
  public isDisplayHistory = true;
  public isDisplayDelete = true;

  //Điều kiện sửa
  private readonly STATUS_ALLOWS_EDIT = [
    PARAM_STATUS_ENUM.CANCEL_APPROVED,
    PARAM_STATUS_ENUM.SAVE_DRAFT,
    PARAM_STATUS_ENUM.REJECT,
  ];

  //Điều kiện xóa
  private readonly STATUS_ALLOWS_DELETE = [
    PARAM_STATUS_ENUM.SAVE_DRAFT,
    PARAM_STATUS_ENUM.REJECT,
    PARAM_STATUS_ENUM.CANCEL_APPROVED,
  ];
  private readonly DISPLAY_ALLOWS_DELETE = [
    DISPLAY_STATUS_ENUM.DISPLAY,
    DISPLAY_STATUS_ENUM.NOT_DISPLAY,
  ];
  private readonly ACTIVE_ALLOWS_DELETE = [ACTIVE_STATUS_NUMBER_ENUM.IN_ACTIVE];

  agInit(params: any): void {
    this.params = params;
    this.isDisplayEdit = params?.isDisplayEdit ?? true;
    this.isDisplayCoppy = params?.isDisplayCoppy ?? true;
    this.isDisplayHistory = params?.isDisplayHistory ?? true;
    this.isDisplayDelete = params?.isDisplayDelete ?? true;
    if (params?.convertDisplayEdit && params?.data && this.isDisplayEdit) {
      this.isDisplayEdit = params?.convertDisplayEdit(params?.data);
    }
    if (params?.convertDisplayDelete && params?.data && this.isDisplayDelete) {
      this.isDisplayDelete = params?.convertDisplayDelete(params?.data);
    }

    if (params?.convertDisplayCopy && params?.data && this.isDisplayCoppy) {
      this.isDisplayCoppy = params?.convertDisplayCopy(params?.data);
    }
    if (params?.functionCode) {
      this.functionCode = params.functionCode;
    }
    if (params?.data) {
      const status = params?.data?.status;
      const isDisplay =
        params?.data?.isDisplay !== undefined &&
        params?.data?.isDisplay !== null;
      if (
        //  isDisplay &&
        this.STATUS_ALLOWS_EDIT.includes(status) &&
        this.isDisplayEdit
      ) {
        this.isEdit = true;
      }
      if (
        this.STATUS_ALLOWS_DELETE.includes(status) &&
        isDisplay &&
        this.DISPLAY_ALLOWS_DELETE.includes(params?.data?.isDisplay) &&
        this.ACTIVE_ALLOWS_DELETE.includes(params?.data?.isActive) &&
        this.isDisplayDelete
      ) {
        this.isDelete = true;
      }

      if (!this.isDisplayHistory) {
        this.isHistory = false;
      }
      if (!this.isDisplayCoppy) {
        this.isCoppy = false;
      }
    }
  }

  refresh(params: any): boolean {
    this.params = params;
    return true;
  }

  onEditClick() {
    if (this?.params?.onEdit) {
      this.params.onEdit(this.params.data);
    }
  }

  onDeleteClick() {
    if (this?.params?.onDelete) {
      this.params.onDelete(this.params.data);
    }
  }
  onCoppy() {
    if (this?.params?.onCoppy) {
      this.params.onCoppy(this.params.data);
    }
  }

  onHistory() {
    console.log(this.functionCode);

    if (this?.params?.onHistory) {
      this.params.onHistory(this.params.data);
    }
  }
}
