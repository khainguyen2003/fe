import { Platform } from '@angular/cdk/platform';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { fromEvent, Subscription, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

// Khai báo các biến toàn cục từ các thư viện đã nạp qua angular.json
// eslint-disable-next-line no-var
declare var shaka: any;
// eslint-disable-next-line no-var
declare var $: any;

@Component({
  selector: 'app-hls-player',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule
  ],
  templateUrl: './hls-player.component.html',
  styleUrls: ['./hls-player.component.scss']
})
export class HlsPlayerComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @ViewChild('videoPlayer', { static: false }) videoElementRef!: ElementRef;
  @ViewChild('videoContainer', { static: false }) videoContainerRef!: ElementRef;

  // Video DOM elements
  private videoElement!: HTMLVideoElement;
  private videoContainerElement!: HTMLElement;

  // Input properties
  @Input() posterUrl: string | null = null;
  @Input() dashManifestUrl: string | null = null;
  @Input() keyId: string | null = null;
  @Input() initialTime: string = '0';
  @Input() width = '854';
  @Input() height = '480';
  @Input() muted = false;
  @Input() src: string = '';
  @Input() autoplay = false;
  @Output() loaded = new EventEmitter<void>();
  @Output() videoLoadError = new EventEmitter<any>();
  @Output() playerEvents = new EventEmitter<Event>();
  @Output() textTracksChanged = new EventEmitter<any[]>();

  player: any;
  private updateTimer: any = null;

  // Player state
  public isLoading: boolean = true;
  public isPlaying: boolean = false;
  public isMuted: boolean = false;
  public isFullscreen: boolean = false;
  public isPictureInPicture: boolean = false;
  public duration: number = 0;
  public currentTime: number = 0;
  public currentTimePercent: number = 0;
  public bufferPercent: number = 0;
  public volume: number = 1;
  public errorMessage: string | null = null;
  
  // Quality properties
  public selectedQuality: string | null = null;
  public availableQualities: string[] = [];
  public isQualityMenuOpen: boolean = false;

  // Subtitle properties
  public availableSubtitles: {id: string; language: string; label: string}[] = [];
  public selectedSubtitle: string | null = null;
  public subtitlesEnabled: boolean = true;
  public isSubtitleMenuOpen: boolean = false;

  // RxJS subscriptions
  private eventSubscriptions: Subscription = new Subscription();

  constructor(private readonly platform: Platform) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.player && changes['dashManifestUrl']) {
      this.player.unload();
      this.load();
    }
    if (this.player && changes['currentTime']) {
      this.player.getMediaElement().currentTime = changes['currentTime'].currentValue;
    }
  }

  ngOnInit(): void {
    // Đảm bảo Shaka Player đã được tải
    if (typeof shaka === 'undefined') {
      console.error('Shaka Player chưa được tải. Vui lòng kiểm tra lại cấu hình trong angular.json');
      this.errorMessage = 'Không thể tải Shaka Player';
      return;
    }
    
    // Đăng ký polyfill cho Shaka
    shaka.polyfill.installAll();
    
    // Kiểm tra browser có hỗ trợ Shaka Player không
    if (!shaka.Player.isBrowserSupported()) {
      console.error('Browser không hỗ trợ Shaka Player');
      this.errorMessage = 'Trình duyệt của bạn không hỗ trợ Shaka Player';
      return;
    }
    
    // Khởi tạo trình phát khi component được tạo
    if (this.src) {
      // Chờ DOM render xong để đảm bảo videoElement đã sẵn sàng
      setTimeout(() => {
        this.initPlayer();
      }, 0);
    }
  }

  public load() {
    this.player
      .load(this.dashManifestUrl)
      .then(() => {
        const textTracks = this.player.getTextTracks();
        if (textTracks.length > 0) {
          this.player.setTextTrackVisibility(true);
          this.player.selectTextTrack(textTracks[0]);
        }
        this.videoElement.play();
        this.loaded.emit();
      })
      .catch((e: any) => {
        this.videoLoadError.emit(e);
      });
  }

  ngAfterViewInit(): void {
    shaka.polyfill.installAll();

    // Check to see if the browser supports the basic APIs Shaka needs.
    if (shaka.Player.isBrowserSupported()) {
      // Everything looks good!
      this.videoElement = this.videoElementRef.nativeElement;
      this.videoContainerElement = this.videoContainerRef.nativeElement;
      this.initPlayer();
    } else {
      // This browser does not have the minimum set of APIs we need.
      throwError('Browser not supported!');
    }
  }

  ngOnDestroy(): void {
    // Dọn dẹp trình phát khi component bị hủy
    this.destroyPlayer();
    this.stopTimeUpdate();
    this.eventSubscriptions.unsubscribe();

    // Remove fullscreen change listeners if added
    document.removeEventListener('fullscreenchange', this.fullscreenChangeHandler);
  }

  initPlayer(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.resetPlayerState();

    // Đợi cho đến khi DOM được tạo
    setTimeout(() => {
      if (!this.videoElementRef) {
        this.errorMessage = 'Không thể tìm thấy phần tử video';
        this.isLoading = false;
        return;
      }

      const videoElement = this.videoElementRef.nativeElement;

      // Set up event listeners for the video element
      this.setupVideoEventListeners(videoElement);

      // Tạo player mới
      this.player = new shaka.Player(videoElement);

      // Gắn bộ xử lý lỗi
      this.player.addEventListener('error', this.onErrorEvent.bind(this));

      // Cấu hình trình phát
      this.configurePlayer();

      // Tải video
      this.loadVideo();
    }, 0);
  }

  resetPlayerState(): void {
    this.isPlaying = false;
    this.isMuted = false;
    this.volume = 1;
    this.currentTime = 0;
    this.duration = 0;
    this.currentTimePercent = 0;
    this.bufferPercent = 0;
  }

  setupVideoEventListeners(videoElement: HTMLVideoElement): void {
    // Giải phóng các đăng ký sự kiện cũ
    this.eventSubscriptions.unsubscribe();
    this.eventSubscriptions = new Subscription();
    
    // Sử dụng RxJS để theo dõi các sự kiện video
    const timeUpdateEvents = fromEvent(videoElement, 'timeupdate').pipe(
      map(() => ({
        currentTime: videoElement.currentTime,
        duration: videoElement.duration || 0,
        percent: videoElement.duration ? (videoElement.currentTime / videoElement.duration) * 100 : 0
      }))
    );
    
    this.eventSubscriptions.add(
      timeUpdateEvents.subscribe(({ currentTime, duration, percent }) => {
        this.currentTime = currentTime;
        this.duration = duration;
        this.currentTimePercent = percent;
        
        // Cập nhật buffer
        if (videoElement.buffered.length > 0) {
          const bufferedEnd = videoElement.buffered.end(videoElement.buffered.length - 1);
          this.bufferPercent = (bufferedEnd / duration) * 100;
        }
      })
    );

    videoElement.addEventListener('play', () => {
      this.isPlaying = true;
    });

    videoElement.addEventListener('pause', () => {
      this.isPlaying = false;
    });

    videoElement.addEventListener('loadedmetadata', () => {
      this.duration = videoElement.duration;
      this.volume = videoElement.volume;
    });

    videoElement.addEventListener('volumechange', () => {
      this.isMuted = videoElement.muted;
      this.volume = videoElement.volume;
    });
    
    // Xử lý sự kiện Picture-in-Picture
    videoElement.addEventListener('enterpictureinpicture', () => {
      this.isPictureInPicture = true;
    });
    
    videoElement.addEventListener('leavepictureinpicture', () => {
      this.isPictureInPicture = false;
    });
  }

  configurePlayer(): void {
    if (this.player == null) return;

    // Cấu hình trình phát
    this.player.configure({
      streaming: {
        rebufferingGoal: 2,
        bufferingGoal: 15,        // Tăng buffer goal để giảm hiện tượng đứng yên
        bufferBehind: 60,         // Tăng buffer phía sau
        smallGapLimit: 1.5,       // Tự động vượt qua khoảng trống nhỏ
        jumpLargeGaps: true,      // Tự động vượt qua khoảng trống lớn
        // Cố gắng lại nhiều lần hơn để tải segments
        retryParameters: {
          maxAttempts: 8,
          baseDelay: 1000,
          backoffFactor: 1.5,
          fuzzFactor: 0.5,
          timeout: 30000
        }
      },
      abr: {
        enabled: true,
        defaultBandwidthEstimate: 1000000, // Ước tính băng thông ban đầu
        switchInterval: 4,               // Tần suất chuyển đổi chất lượng
        bandwidthDowngradeTarget: 0.9,   // Ngưỡng hạ cấp
        bandwidthUpgradeTarget: 0.7      // Ngưỡng nâng cấp
      }
    });

    // Bắt sự kiện khi có thay đổi tracks
    this.player.addEventListener('trackschanged', () => {
      this.updateQualityOptions();
    });
  }

  loadVideo(): void {
    if (!this.player) {
      this.errorMessage = 'Thiếu player';
      this.isLoading = false;
      return;
    }

    const url = this.dashManifestUrl ?? this.src;
    if (!url) {
      this.errorMessage = 'Thiếu URL video';
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      // Thiết lập lại player trước khi tải video mới
      if (this.videoElement) {
        // Xóa listeners trước đó để tránh trùng lặp
        this.videoElement.removeEventListener('ended', this.handleVideoEnded);
        this.videoElement.addEventListener('ended', this.handleVideoEnded);
      }

      // Tải video với timeout dài hơn
      this.player.load(url)
        .then(() => {
          this.isLoading = false;
          this.loaded.emit();
          
          // Thiết lập thời gian ban đầu nếu có
          if (this.initialTime && this.videoElement) {
            const initialTimeInSeconds = parseInt(this.initialTime, 10);
            if (!isNaN(initialTimeInSeconds)) {
              this.videoElement.currentTime = initialTimeInSeconds;
            }
          }
          
          // Khởi động cập nhật thời gian
          this.startTimeUpdate();
          
          // Cập nhật danh sách chất lượng có sẵn
          this.updateQualityOptions();
          
          // Cập nhật danh sách phụ đề nếu có
          this.updateSubtitleOptions();

          // Bắt đầu phát nếu autoplay được bật
          if (this.autoplay && this.videoElement) {
            const playPromise = this.videoElement.play();
            if (playPromise !== undefined) {
              playPromise.catch(error => {
                console.warn('Autoplay không được cho phép:', error);
              });
            }
          }
        })
        .catch((error: any) => this.onError(error));
    } catch (error) {
      this.onError(error as Error);
    }
  }

  // Xử lý sự kiện khi video kết thúc
  handleVideoEnded = () => {
    // Đảm bảo rằng video đã phát hết 100%
    if (this.videoElement && this.duration > 0) {
      // Đảm bảo rằng thanh tiến trình được cập nhật đến 100%
      this.currentTime = this.duration;
      this.currentTimePercent = 100;
      this.isPlaying = false;
      // Emit event cho video đã phát xong
      this.playerEvents.emit(new Event('ended'));
    }
  }

  updateQualityOptions(): void {
    if (this.player == null) return;

    // Lấy các tracks video hiện có
    const tracks = this.player.getVariantTracks();
    const qualities = tracks
      .filter((track: any) => track.type === 'variant' && track.videoBandwidth)
      .map((track: any) => {
        const bandwidthMbps = Math.round((track.videoBandwidth ?? 0) / 1000000 * 10) / 10;
        const height = track.height ?? 0;
        return {
          id: track.id,
          label: `${height}p (${bandwidthMbps} Mbps)`,
          height: height,
          bandwidth: track.videoBandwidth
        };
      })
      .sort((a: any, b: any) => {
        // Sắp xếp theo chiều cao trước
        const heightDiff = b.height - a.height;
        if (heightDiff !== 0) return heightDiff;
        
        // Nếu cùng chiều cao thì sắp xếp theo bandwidth
        return (b.bandwidth ?? 0) - (a.bandwidth ?? 0);
      });

    this.availableQualities = qualities.map((q: any) => q.label);

    // Lấy track hiện tại đang active
    const activeTrack = tracks.find((t: any) => t.active);
    if (activeTrack?.height) {
      const bandwidthMbps = Math.round((activeTrack.videoBandwidth ?? 0) / 1000000 * 10) / 10;
      this.selectedQuality = `${activeTrack.height}p (${bandwidthMbps} Mbps)`;
    }
  }

  updateSubtitleOptions(): void {
    if (this.player == null) return;
    
    // Lấy danh sách phụ đề
    const textTracks = this.player.getTextTracks();
    
    if (textTracks && textTracks.length > 0) {
      // Đã có phụ đề
      this.availableSubtitles = textTracks.map((track: any) => ({
        id: track.id,
        language: track.language,
        label: track.label ?? `${track.language} (${track.roles?.[0] ?? 'Default'})`
      }));
      
      // Phát sự kiện thay đổi phụ đề
      this.textTracksChanged.emit(this.availableSubtitles);
      
      // Chọn phụ đề tiếng Việt mặc định nếu có
      const viTrack = textTracks.find((t: any) => t.language === 'vi');
      if (viTrack) {
        this.selectSubtitle(viTrack.id);
      }
    } else {
      // Không có phụ đề
      this.availableSubtitles = [];
    }
  }

  // Thay đổi chất lượng video
  onQualityChange(quality: string): void {
    if (!this.player) return;

    const tracks = this.player.getVariantTracks();
    const height = parseInt(quality.split('p')[0]);

    // Tìm track phù hợp với chiều cao đã chọn
    const matchingTracks = tracks.filter((track: any) => track.height === height);

    if (matchingTracks.length > 0) {
      // Sắp xếp theo bandwidth để lấy chất lượng tốt nhất ở độ phân giải này
      const track = matchingTracks.sort((a: any, b: any) => (b.bandwidth ?? 0) - (a.bandwidth ?? 0))[0];
      this.player.selectVariantTrack(track, true);
      this.selectedQuality = quality;
    }
  }

  // Xử lý sự kiện lỗi
  onErrorEvent(event: any): void {
    this.onError(event.detail || new Error('Unknown player error'));
  }

  onError(error: Error): void {
    console.error('Lỗi Player:', error);
    this.errorMessage = 'Lỗi phát video: ' + error.message;
    this.isLoading = false;
  }

  destroyPlayer(): void {
    if (this.player) {
      this.player.removeEventListener('error', this.onErrorEvent.bind(this));
      this.player.destroy();
      this.player = null;
    }

    const videoElement = this.videoElementRef?.nativeElement;
    if (videoElement) {
      videoElement.removeEventListener('playing', () => {});
      videoElement.removeEventListener('pause', () => {});
      videoElement.removeEventListener('ended', () => {});
      videoElement.removeEventListener('loadedmetadata', () => {});
      videoElement.removeEventListener('volumechange', () => {});
    }
  }

  // Custom controls implementation
  togglePlayPause(): void {
    if (!this.videoElementRef?.nativeElement) return;

    const video = this.videoElementRef.nativeElement;
    if (video.paused || video.ended) {
      video.play();
      this.isPlaying = true;
    } else {
      video.pause();
      this.isPlaying = false;
    }
  }

  toggleMute(): void {
    if (!this.videoElementRef?.nativeElement) return;

    const video = this.videoElementRef.nativeElement;
    video.muted = !video.muted;
    this.isMuted = video.muted;
  }

  onVolumeChange(event: Event): void {
    if (!this.videoElementRef?.nativeElement) return;

    const input = event.target as HTMLInputElement;
    const video = this.videoElementRef.nativeElement;
    video.volume = parseFloat(input.value);
    this.volume = video.volume;

    // Unmute if volume is changed manually
    if (this.volume > 0 && video.muted) {
      video.muted = false;
      this.isMuted = false;
    }
  }

  onSeekBarChange(event: Event): void {
    if (!this.videoElementRef?.nativeElement || !this.duration) return;

    const input = event.target as HTMLInputElement;
    const seekTo = (parseFloat(input.value) / 100) * this.duration;

    this.videoElementRef.nativeElement.currentTime = seekTo;
    this.currentTime = seekTo;
    this.currentTimePercent = (this.currentTime / this.duration) * 100;
  }

  startTimeUpdate(): void {
    this.stopTimeUpdate(); // Clear any existing timer

    this.updateTimer = setInterval(() => {
      if (!this.videoElementRef?.nativeElement) return;

      const video = this.videoElementRef.nativeElement;
      this.currentTime = video.currentTime;
      this.duration = video.duration ?? 0;

      // Update progress
      if (this.duration > 0) {
        this.currentTimePercent = (this.currentTime / this.duration) * 100;
      } else {
        this.currentTimePercent = 0;
      }

      // Update buffer progress
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        this.bufferPercent = (bufferedEnd / this.duration) * 100;
      }
    }, 250);
  }

  stopTimeUpdate(): void {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
      this.updateTimer = null;
    }
  }

  formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '00:00';

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // Fullscreen handling
  fullscreenChangeHandler = () => {
    this.isFullscreen = !!document.fullscreenElement;
  };

  @HostListener('document:fullscreenchange', ['$event'])
  onFullscreenChange(): void {
    this.fullscreenChangeHandler();
  }

  toggleFullscreen(): void {
    if (!this.videoElementRef?.nativeElement) return;

    const container = this.videoElementRef.nativeElement.closest('.hls-player-container');
    if (!container) return;

    if (!document.fullscreenElement) {
      // Enter fullscreen
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    } else {
      // Exit fullscreen
      document.exitFullscreen();
    }
  }

  // Picture-in-Picture handling
  togglePictureInPicture(): void {
    if (!this.videoElementRef?.nativeElement) return;

    const video = this.videoElementRef.nativeElement;

    if (document.pictureInPictureEnabled) {
      if (video !== document.pictureInPictureElement) {
        video.requestPictureInPicture().catch((error: any) => {
          console.error('Picture-in-Picture failed:', error);
        });
      } else {
        document.exitPictureInPicture().catch((error: any) => {
          console.error('Picture-in-Picture exit failed:', error);
        });
      }
    }
  }

  // Keyboard event handling
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    // Prevent default behavior for these keys
    if (['Space', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'M', 'm', 'F', 'f', 'P', 'p', 'T', 't'].includes(event.key)) {
      event.preventDefault();
    }

    switch (event.key) {
      case ' ':
      case 'k':
      case 'K':
        this.togglePlayPause();
        break;

      case 'ArrowLeft':
        // Lùi 10 giây
        if (this.videoElementRef?.nativeElement) {
          this.videoElementRef.nativeElement.currentTime = Math.max(0, this.videoElementRef.nativeElement.currentTime - 10);
        }
        break;

      case 'ArrowRight':
        // Tiến 10 giây
        if (this.videoElementRef?.nativeElement) {
          this.videoElementRef.nativeElement.currentTime = Math.min(this.videoElementRef.nativeElement.duration, this.videoElementRef.nativeElement.currentTime + 10);
        }
        break;

      case 'ArrowUp':
        // Tăng âm lượng
        this.adjustVolume(0.1);
        break;

      case 'ArrowDown':
        // Giảm âm lượng
        this.adjustVolume(-0.1);
        break;

      case 'm':
      case 'M':
        this.toggleMute();
        break;

      case 'f':
      case 'F':
        this.toggleFullscreen();
        break;

      case 'p':
      case 'P':
        this.togglePictureInPicture();
        break;
        
      case 't':
      case 'T':
        this.toggleSubtitles();
        break;
    }
  }

  // Điều chỉnh âm lượng
  adjustVolume(amount: number): void {
    if (!this.videoElementRef?.nativeElement) return;
    
    const video = this.videoElementRef.nativeElement;
    let newVolume = video.volume + amount;
    
    // Giới hạn âm lượng từ 0-1
    newVolume = Math.max(0, Math.min(1, newVolume));
    
    video.volume = newVolume;
    this.volume = newVolume;
    
    // Nếu tăng âm lượng từ 0, bỏ chế độ mute
    if (newVolume > 0 && video.muted) {
      video.muted = false;
      this.isMuted = false;
    }
  }
  
  skipForward(): void {
    if (!this.videoElementRef?.nativeElement) return;
    const video = this.videoElementRef.nativeElement;
    video.currentTime = Math.min(video.duration ?? 0, video.currentTime + 10); // Skip ahead 10 seconds
  }
  
  skipBackward(): void {
    if (!this.videoElementRef?.nativeElement) return;
    const video = this.videoElementRef.nativeElement;
    video.currentTime = Math.max(0, video.currentTime - 10); // Skip back 10 seconds
  }
  
  toggleSubtitles(): void {
    if (this.availableSubtitles.length === 0 || this.player == null) return;
    
    this.subtitlesEnabled = !this.subtitlesEnabled;
    this.player.setTextTrackVisibility(this.subtitlesEnabled);
  }
  
  // Toggle subtitle menu visibility
  toggleSubtitleMenu(): void {
    this.isSubtitleMenuOpen = !this.isSubtitleMenuOpen;
    if (this.isSubtitleMenuOpen) {
      this.isQualityMenuOpen = false; // Close quality menu if open
    }
  }

  // Toggle quality menu visibility
  toggleQualityMenu(): void {
    this.isQualityMenuOpen = !this.isQualityMenuOpen;
    if (this.isQualityMenuOpen) {
      this.isSubtitleMenuOpen = false; // Close subtitle menu if open
    }
  }
  
  selectSubtitle(id: number | string): void {
    if (this.player == null) return;
    
    const textTracks = this.player.getTextTracks();
    const track = textTracks.find((t: any) => t.id === id);
    
    if (track) {
      this.player.selectTextTrack(track);
      this.player.setTextTrackVisibility(true);
      this.subtitlesEnabled = true;
      
      const subtitle = this.availableSubtitles.find(s => s.id === id);
      this.selectedSubtitle = subtitle?.label ?? null;
    }
  }
  
  increaseVolume(): void {
    if (!this.videoElementRef?.nativeElement) return;
    const video = this.videoElementRef.nativeElement;
    video.volume = Math.min(1, video.volume + 0.1);
    this.volume = video.volume;
    
    if (video.muted) {
      video.muted = false;
      this.isMuted = false;
    }
  }
  
  decreaseVolume(): void {
    if (!this.videoElementRef?.nativeElement) return;
    const video = this.videoElementRef.nativeElement;
    video.volume = Math.max(0, video.volume - 0.1);
    this.volume = video.volume;
  }
}
