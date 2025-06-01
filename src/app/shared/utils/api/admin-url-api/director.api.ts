import { CommonUrlApi } from "../common.api";

export class DirectorUrlApi {
  public static readonly SEARCH =
  CommonUrlApi.ADMIN_SERVICE_MODULE.DIRECTORS.concat('/search');
  public static readonly IMPORT_EXCEL =
  CommonUrlApi.ADMIN_SERVICE_MODULE.DIRECTORS.concat('/import');
  public static readonly DOWNLOAD_TEMPLATE =
  CommonUrlApi.ADMIN_SERVICE_MODULE.DIRECTORS.concat('/download-template');
  public static readonly GET_ALL_ACTIVE =
  CommonUrlApi.ADMIN_SERVICE_MODULE.DIRECTORS.concat('/get-genre-options');
  public static readonly GET_ALL_DIRECTORS_NAME_ACTIVE =
  CommonUrlApi.ADMIN_SERVICE_MODULE.DIRECTORS.concat('/get-genre-name-options');
  public static readonly GET_SERTYPE =
  CommonUrlApi.ADMIN_SERVICE_MODULE.DIRECTORS.concat('/get-genre-sertype-search');
  public static readonly SAVE_DRAFT =
    CommonUrlApi.ADMIN_SERVICE_MODULE.DIRECTORS.concat('/save-draft');
  public static readonly SAVE_APPROVE =
    CommonUrlApi.ADMIN_SERVICE_MODULE.DIRECTORS.concat('/save-approve');
  public static readonly UPDATE_DRAFT =
    CommonUrlApi.ADMIN_SERVICE_MODULE.DIRECTORS.concat('/update-draft');
  public static readonly UPDATE_APPROVE =
    CommonUrlApi.ADMIN_SERVICE_MODULE.DIRECTORS.concat('/update-approve');
  public static readonly UPDATE =
    CommonUrlApi.ADMIN_SERVICE_MODULE.DIRECTORS.concat('/update');
  public static readonly REJECT =
    CommonUrlApi.ADMIN_SERVICE_MODULE.DIRECTORS.concat('/reject');
  public static readonly DELETE =
    CommonUrlApi.ADMIN_SERVICE_MODULE.DIRECTORS.concat('/delete');
  public static readonly APPROVE =
    CommonUrlApi.ADMIN_SERVICE_MODULE.DIRECTORS.concat('/approve');
  public static readonly CANCEL_APPROVE =
    CommonUrlApi.ADMIN_SERVICE_MODULE.DIRECTORS.concat('/cancel-approve');
  public static readonly UPLOAD_EXCEL =
    CommonUrlApi.ADMIN_SERVICE_MODULE.DIRECTORS.concat('/upload-excel');
  public static readonly SAVE_SEND_APPROVE =
    CommonUrlApi.ADMIN_SERVICE_MODULE.DIRECTORS.concat('/save-send-approve');
  public static readonly UPDATE_SEND_APPROVE =
    CommonUrlApi.ADMIN_SERVICE_MODULE.DIRECTORS.concat('/update-send-approve');
  public static readonly SEND_APPROVE =
    CommonUrlApi.ADMIN_SERVICE_MODULE.DIRECTORS.concat('/send-approve');
  public static readonly APPROVE_LEVEL =
    CommonUrlApi.ADMIN_SERVICE_MODULE.DIRECTORS.concat('/approve-level');
  public static readonly GET_BY_ID =
    CommonUrlApi.ADMIN_SERVICE_MODULE.DIRECTORS.concat('/');
  public static readonly EXPORT_EXCEL =
    CommonUrlApi.ADMIN_SERVICE_MODULE.DIRECTORS.concat('/export');
    
}