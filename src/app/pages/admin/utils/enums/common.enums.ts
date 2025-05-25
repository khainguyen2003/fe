
export enum PARAM_STATUS_ENUM {
  SAVE_DRAFT = 1,
  WAIT_APPROVAL = 3,
  APPROVED = 4,
  REJECT = 5,
  CANCEL_APPROVED = 7,
}

export enum DISPLAY_STATUS_ENUM {
  DISPLAY = 1,
  NOT_DISPLAY = 0,
  DISPLAY_APPROVED = 2, // trạng thái display sau khi bản ghi được phê duyệt
}

export enum RESPONSE_STATUS_ENUM {
  SUCCESS = '00',
  INVALID_FAILED = '01'
  //Thêm các status khác ở đây
}

export enum PARAM_LEVEL_ENUM {
  LEVEL_1 = '1',
  LEVEL_2 = '2',
}

export enum ACTIVE_STATUS_ENUM {
  ACTIVE = '1',
  IN_ACTIVE = '0',
}

export enum ACTIVE_STATUS_NUMBER_ENUM {
  ACTIVE = 1,
  IN_ACTIVE = 0,
}

export enum ACTION_TYPE_ENUM {
  DELETE = 'delete',
  REJECT = 'reject',
  APPROVAL = 'approval',
  CANCEL_APPROVAL = 'cancelApproval',
  SEND_APPROVAL = 'sendApproval',
}

export enum ADD_EDIT_TYPE_ENUM {
  CREATE = 'create',
  UPDATE = 'update',
}
export enum NOTI_TYPE_ENUM {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
}

export enum SCREEN_TYPE_ENUM {
  LIST = 'list',
  ADD_EDIT = 'add-edit',
  UPDATE = 'update',
  CREATE = 'create',
}

export enum SCREEN_PAGE_ENUM {
  HOME_PAGE = '/param/home-page',
}

export enum DATE_FORMAT_ENUM {
  DD_MM_YYYY_HH_MM_SS_DASH = 'dd/MM/yyyy HH:mm:ss',
  DD_MM_YYYY = 'dd/MM/yyyy',
  DD_MM_YYYY_HH_MM_SS = 'dd-MM-yyyy HH:mm:ss',
  YYYY_MM_DD = 'yyyy/MM/dd',
  DD_MM_YYYY_DASH = 'dd-MM-yyyy',
  YYYY_MM_DD_DASH = 'yyyy-MM-dd',
}
export enum IS_REAL_TIME_ENUM {
  ACTIVE = 'Y',
  IN_ACTIVE = 'N',
}

// Không được Viêt Thêm ************************
export enum FUNCTION_ALLOWS_ENUM {
  SEARCH = 'search',
  SAVE_DRAFT = 'saveDraft',
  SAVE_AND_APPROVE = 'saveAndApprove',
  SAVE_AND_SEND_APPROVAL = 'saveAndSendApproval',
  UPDATE = 'update',
  UPDATE_DRAFT = 'updateDraft',
  UPDATE_AND_APPROVE = 'updateAndApprove',
  UPDATE_AND_SEND_APPROVAL = 'updateAndSendApproval',
  SEND_APPROVE = 'sendApprove',
  APPROVE = 'approve',
  CANCEL_APPROVAL = 'cancelApproval',
  REJECT = 'reject',
  DISPLAY = 'display',
  EXPORT_EXCEL = 'exportExcel',
  VIEW_DETAIL = 'viewdetail',
  DELETE = 'delete',
  HISTORY = 'history',
  IMPORT_EXCEL = 'importExcel',
  COPY = 'copy',
  CREATE = 'create',
  EDIT = 'edit',
}
