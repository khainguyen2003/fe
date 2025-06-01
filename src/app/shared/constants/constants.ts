import { Option } from "../../pages/admin/models/common.model";

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

export const MOVIE_TYPES: Option[] = [
  {
    value: "1",
    label: "Phim lẻ"
  },
  {
    value: "2",
    label: "Phim bộ"
  },
  {
    value: "3",
    label: "TV Show"
  }
]  

export const MOVIE_STATUS: Option[] = [
  { value: "1", label: "Tạo mới" },
  { value: "2", label: "Chờ duyệt" },
  { value: "3", label: "Đã phê duyệt" },
  { value: "4", label: "Hủy duyệt" },
  { value: "5", label: "Từ chối" },
  { value: "6", label: "Đã phát hành" },
  { value: "7", label: "Hủy phát hành" },
  { value: "8", label: "Đã hết hạn" },
];