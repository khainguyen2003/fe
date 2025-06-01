import { Episode } from './../../../../pages/admin/models/movie.model';
import { CommonUrlApi } from "../common.api";

export class EpisodeUrlApi {
  public static readonly SEARCH =
  CommonUrlApi.ADMIN_SERVICE_MODULE.EPISODE.concat('/search');
  public static readonly GET_BY_MOVIE_ID =
  CommonUrlApi.ADMIN_SERVICE_MODULE.EPISODE.concat('/get-by-movie-id');
  public static readonly IMPORT_EXCEL =
  CommonUrlApi.ADMIN_SERVICE_MODULE.EPISODE.concat('/import');
  public static readonly DOWNLOAD_TEMPLATE =
  CommonUrlApi.ADMIN_SERVICE_MODULE.EPISODE.concat('/download-template');
  public static readonly CREATE =
  CommonUrlApi.ADMIN_SERVICE_MODULE.EPISODE.concat('/create');
  public static readonly UPDATE =
  CommonUrlApi.ADMIN_SERVICE_MODULE.EPISODE.concat('/update');
  public static readonly DELETE =
  CommonUrlApi.ADMIN_SERVICE_MODULE.EPISODE.concat('/delete');
  public static readonly GET_BY_ID =
    CommonUrlApi.ADMIN_SERVICE_MODULE.GENRE.concat('/');
  public static readonly EXPORT_EXCEL =
    CommonUrlApi.ADMIN_SERVICE_MODULE.GENRE.concat('/export');
    
}