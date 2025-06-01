import { CommonUrlApi } from "../common.api";

export class GenreUrlApi {
  public static readonly SEARCH =
  CommonUrlApi.ADMIN_SERVICE_MODULE.GENRE.concat('/search');
  public static readonly IMPORT_EXCEL =
  CommonUrlApi.ADMIN_SERVICE_MODULE.GENRE.concat('/import');
  public static readonly DOWNLOAD_TEMPLATE =
  CommonUrlApi.ADMIN_SERVICE_MODULE.GENRE.concat('/download-template');
  public static readonly GET_ALL_ACTIVE =
  CommonUrlApi.ADMIN_SERVICE_MODULE.GENRE.concat('/get-genre-options');
  public static readonly GET_ALL_GENRE_NAME_ACTIVE =
  CommonUrlApi.ADMIN_SERVICE_MODULE.GENRE.concat('/get-genre-name-options');
  public static readonly GET_SERTYPE =
  CommonUrlApi.ADMIN_SERVICE_MODULE.GENRE.concat('/get-genre-sertype-search');
  public static readonly SAVE_DRAFT =
    CommonUrlApi.ADMIN_SERVICE_MODULE.GENRE.concat('/save-draft');
  public static readonly SAVE_APPROVE =
    CommonUrlApi.ADMIN_SERVICE_MODULE.GENRE.concat('/save-approve');
  public static readonly UPDATE_DRAFT =
    CommonUrlApi.ADMIN_SERVICE_MODULE.GENRE.concat('/update-draft');
  public static readonly UPDATE_APPROVE =
    CommonUrlApi.ADMIN_SERVICE_MODULE.GENRE.concat('/update-approve');
  public static readonly UPDATE =
    CommonUrlApi.ADMIN_SERVICE_MODULE.GENRE.concat('/update');
  public static readonly REJECT =
    CommonUrlApi.ADMIN_SERVICE_MODULE.GENRE.concat('/reject');
  public static readonly DELETE =
    CommonUrlApi.ADMIN_SERVICE_MODULE.GENRE.concat('/delete');
  public static readonly APPROVE =
    CommonUrlApi.ADMIN_SERVICE_MODULE.GENRE.concat('/approve');
  public static readonly CANCEL_APPROVE =
    CommonUrlApi.ADMIN_SERVICE_MODULE.GENRE.concat('/cancel-approve');
  public static readonly UPLOAD_EXCEL =
    CommonUrlApi.ADMIN_SERVICE_MODULE.GENRE.concat('/upload-excel');
  public static readonly SAVE_SEND_APPROVE =
    CommonUrlApi.ADMIN_SERVICE_MODULE.GENRE.concat('/save-send-approve');
  public static readonly UPDATE_SEND_APPROVE =
    CommonUrlApi.ADMIN_SERVICE_MODULE.GENRE.concat('/update-send-approve');
  public static readonly SEND_APPROVE =
    CommonUrlApi.ADMIN_SERVICE_MODULE.GENRE.concat('/send-approve');
  public static readonly APPROVE_LEVEL =
    CommonUrlApi.ADMIN_SERVICE_MODULE.GENRE.concat('/approve-level');
  public static readonly GET_BY_ID =
    CommonUrlApi.ADMIN_SERVICE_MODULE.GENRE.concat('/');
  public static readonly EXPORT_EXCEL =
    CommonUrlApi.ADMIN_SERVICE_MODULE.GENRE.concat('/export');
    
}