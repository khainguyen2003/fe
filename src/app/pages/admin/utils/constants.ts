import { CommonUrlApi } from '../../../shared/utils/api/common.api';
import { Language, MenuItem } from './../models/menu.model';
export const PARAM_STATUS = [
  { value: '1', label: 'save_draft' },
  { value: '3', label: 'wait_approve' },
  { value: '4', label: 'approved' },
  { value: '5', label: 'reject' },
  { value: '7', label: 'cancel_approval' },
];

export const ACTIVE_STATUS = [
  { value: '0', label: 'disabled' },
  { value: '1', label: 'active' },
];

export const ACTIVE_DRAFT_STATUS = [
  { value: '0', label: 'off' },
  { value: '1', label: 'on' },
];

export const DISPLAY_STATUS = [
  { value: '0', label: 'hidden' },
  { value: '1', label: 'display' },
];

export type ActionType =
  | 'delete'
  | 'reject'
  | 'approval'
  | 'cancelApproval'
  | 'sendApproval';
export type AddEditType = 'create' | 'update';

export type NotiType = 'success' | 'error' | 'warning';

export const toolTipShowDelay = 600;
export const toolTipHideDelay = 1000;

const ADMIN_URL = '/admin';

export const languages: Language[] = [
  {
    code: 'vi-VN',
    name: 'Tiếng Việt',
    flag: 'https://cdn-app.kiotviet.vn/retailler/Content/img/country-flags/vn.png',
  },
  {
    code: 'en-US',
    name: 'English',
    flag: 'https://cdn-app.kiotviet.vn/retailler/Content/img/country-flags/us.png',
  },
];