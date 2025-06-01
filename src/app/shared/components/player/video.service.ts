import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Lấy URL HLS của video từ backend
   * @param videoId ID của video cần phát
   * @returns Observable chứa URL của file master playlist (.m3u8)
   */
  getHlsUrl(videoId: string): Observable<string> {
    return this.http.get<any>(`${this.apiUrl}/api/videos/${videoId}/stream`)
      .pipe(
        map(response => {
          // Giả sử response có chứa trường hlsUrl
          if (response && response.hlsUrl) {
            return response.hlsUrl;
          }
          throw new Error('URL HLS không có sẵn');
        }),
        catchError(error => {
          console.error('Lỗi khi lấy URL HLS:', error);
          return throwError(() => new Error('Không thể tải URL video. Vui lòng thử lại sau.'));
        })
      );
  }

  /**
   * Lấy thông tin video từ backend
   * @param videoId ID của video
   * @returns Observable chứa thông tin chi tiết về video
   */
  getVideoDetails(videoId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/videos/${videoId}`)
      .pipe(
        catchError(error => {
          console.error('Lỗi khi lấy thông tin video:', error);
          return throwError(() => new Error('Không thể tải thông tin video.'));
        })
      );
  }
}
