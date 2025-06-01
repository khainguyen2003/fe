import { CommonUrlApi } from "../common.api";

export class MovieUrlApi {
  public static readonly SEARCH =
  CommonUrlApi.ADMIN_SERVICE_MODULE.MOVIE.concat('/search');
  public static readonly IMPORT_EXCEL =
  CommonUrlApi.ADMIN_SERVICE_MODULE.MOVIE.concat('/import');
  public static readonly DOWNLOAD_TEMPLATE =
  CommonUrlApi.ADMIN_SERVICE_MODULE.MOVIE.concat('/download-template');
  public static readonly GET_ALL_ACTIVE =
  CommonUrlApi.ADMIN_SERVICE_MODULE.MOVIE.concat('/get-agent-options');
  public static readonly GET_ALL_MOVIE_NAME_ACTIVE =
  CommonUrlApi.ADMIN_SERVICE_MODULE.MOVIE.concat('/get-agent-name-options');
  public static readonly GET_SERTYPE =
  CommonUrlApi.ADMIN_SERVICE_MODULE.MOVIE.concat('/get-agent-sertype-search');
  public static readonly SAVE_DRAFT =
    CommonUrlApi.ADMIN_SERVICE_MODULE.MOVIE.concat('/save-draft');
  public static readonly SAVE_DRAFT_COLLECT =
    CommonUrlApi.ADMIN_SERVICE_MODULE.MOVIE.concat('/save-draft-collect');
  public static readonly SAVE_DRAFT_EPISODE =
    CommonUrlApi.ADMIN_SERVICE_MODULE.MOVIE.concat('/save-draft-episode');
  public static readonly SAVE_APPROVE =
    CommonUrlApi.ADMIN_SERVICE_MODULE.MOVIE.concat('/save-approve');
  public static readonly UPDATE_DRAFT =
    CommonUrlApi.ADMIN_SERVICE_MODULE.MOVIE.concat('/update-draft');
  public static readonly UPDATE_APPROVE =
    CommonUrlApi.ADMIN_SERVICE_MODULE.MOVIE.concat('/update-approve');
  public static readonly UPDATE =
    CommonUrlApi.ADMIN_SERVICE_MODULE.MOVIE.concat('/update');
  public static readonly REJECT =
    CommonUrlApi.ADMIN_SERVICE_MODULE.MOVIE.concat('/reject');
  public static readonly DELETE =
    CommonUrlApi.ADMIN_SERVICE_MODULE.MOVIE.concat('/delete');
  public static readonly APPROVE =
    CommonUrlApi.ADMIN_SERVICE_MODULE.MOVIE.concat('/approve');
  public static readonly CANCEL_APPROVE =
    CommonUrlApi.ADMIN_SERVICE_MODULE.MOVIE.concat('/cancel-approve');
  public static readonly UPLOAD_EXCEL =
    CommonUrlApi.ADMIN_SERVICE_MODULE.MOVIE.concat('/upload-excel');
  public static readonly SAVE_SEND_APPROVE =
    CommonUrlApi.ADMIN_SERVICE_MODULE.MOVIE.concat('/save-send-approve');
  public static readonly UPDATE_SEND_APPROVE =
    CommonUrlApi.ADMIN_SERVICE_MODULE.MOVIE.concat('/update-send-approve');
  public static readonly SEND_APPROVE =
    CommonUrlApi.ADMIN_SERVICE_MODULE.MOVIE.concat('/send-approve');
  public static readonly APPROVE_LEVEL =
    CommonUrlApi.ADMIN_SERVICE_MODULE.MOVIE.concat('/approve-level');
  public static readonly GET_BY_ID =
    CommonUrlApi.ADMIN_SERVICE_MODULE.MOVIE.concat('/');
  public static readonly EXPORT_EXCEL =
    CommonUrlApi.ADMIN_SERVICE_MODULE.MOVIE.concat('/export');
  public static readonly UPLOAD_VIDEO =
    CommonUrlApi.ADMIN_SERVICE_MODULE.MOVIE.concat('/video');
    
}