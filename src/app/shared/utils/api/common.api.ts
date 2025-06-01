export class CommonUrlApi {
  public static readonly BASE_URL_API = 'http://localhost:8080/api';
  public static readonly ADMIN_BASE_URL_API = this.BASE_URL_API + '/admin';

  public static readonly ADMIN_SERVICE_MODULE = {
    MOVIE: this.ADMIN_BASE_URL_API + "/movies",
    GENRE: this.ADMIN_BASE_URL_API + "/genres",
    DIRECTORS: this.ADMIN_BASE_URL_API + "/directors",
    EPISODE: this.ADMIN_BASE_URL_API + "/episodes"

  }
  
  public static readonly SERVICE_MODULE = {
    BANNER_SERVICE_API: CommonUrlApi.BASE_URL_API.concat("/banner")
  }
}