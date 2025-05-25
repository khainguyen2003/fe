import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  // dùng cho xử lý sự kiện scroll trang
  isScrolledDown = false;
  private prevScrollPos = 0;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  handleScroll() {
      if (this.isBrowser) {
        this.prevScrollPos = window.pageYOffset;
  
        window.addEventListener('scroll', () => {
          const currentScrollPos = window.pageYOffset;
          this.isScrolledDown = currentScrollPos > this.prevScrollPos;
          this.prevScrollPos = currentScrollPos;
        });
      }
    }
}
