export type ActionType =
  | 'delete'
  | 'reject'
  | 'approval'
  | 'cancelApproval'
  | 'sendApproval';
export type AddEditType = 'create' | 'update';
export type DetailDataType =
  | { field: string; label: string; convert?: (...args: any[]) => string }[]
  | null;
export type lableParamType = string | number | null;
export type ScreenType = 'list' | 'add-edit' | 'create' | 'update' | null;
