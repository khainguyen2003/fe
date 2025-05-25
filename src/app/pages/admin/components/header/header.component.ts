import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TuiActiveZone } from '@taiga-ui/cdk/directives/active-zone';
import { TuiObscured } from '@taiga-ui/cdk/directives/obscured';
import {
  TuiAppearance,
  TuiButton,
  TuiDataList,
  TuiDropdown
} from '@taiga-ui/core';
import {
  TuiAvatar,
  TuiChevron,
  TuiTabs
} from '@taiga-ui/kit';
import {
  TuiHeader,
  TuiNavigation
} from '@taiga-ui/layout';
import { BehaviorSubject } from 'rxjs';
import { MenuItem } from '../../models/menu.model';
import { LanguageSwitcherComponent } from "../language-switcher/language-switcher.component";

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive,
    TuiAppearance,
    TuiAvatar,
    TuiObscured,
    TuiActiveZone,
    TuiDropdown,
    TuiNavigation,
    TuiDataList,
    TuiButton,
    TuiTabs,
    TuiHeader,
    TuiChevron,
    LanguageSwitcherComponent
  ],
})
export class HeaderComponent implements OnInit {
  readonly #ADMIN_URL = '/admin';

  menus: MenuItem[] = [
    {
      id: 1,
      name: 'Tổng quan',
      icon: 'fas fa-eye',
      link: this.#ADMIN_URL + '/',
      hidden: false,
    },
    {
      id: 2,
      name: 'Phim',
      icon: 'fas fa-cube',
      subMenus: [
        { id: 21, name: 'Quản lý phim', icon: '@tui.clapperboard', link: this.#ADMIN_URL + '/movies' },
        { id: 22, name: 'Quản lý thể loại phim', icon: '@tui.list', link: this.#ADMIN_URL + '/genres' },
        { id: 23, name: 'Quản lý quốc gia', icon: '@tui.earth', link: this.#ADMIN_URL + '/countries' },
        { id: 24, name: 'Quản lý diễn viên', icon: '@tui.user', link: this.#ADMIN_URL + '/actors' },
        { id: 25, name: 'Quản lý đạo diễn', icon: '@tui.square-user-round', link: this.#ADMIN_URL + '/directors' },
      ],
      hidden: false,
    }
  ];

  isMobileMenuOpen = new BehaviorSubject<boolean>(false);
  isPromoBannerVisible = new BehaviorSubject<boolean>(true);
  userPhone = '0999999912';

  protected openUserMenu = false;

  ngOnInit(): void {
    this.showPromoBanner();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.next(!this.isMobileMenuOpen.value);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      this.onUserMenuClick();
    }
  }

  protected onUserMenuClick(): void {
    this.openUserMenu = !this.openUserMenu;
  }

  protected onUserMenuObscured(obscured: boolean): void {
    if (obscured) {
      this.openUserMenu = false;
    }
  }

  protected onUserMenuActiveZone(active: boolean): void {
    this.openUserMenu = active && this.openUserMenu;
  }

  logout(): void {
    // TODO: Implement logout logic
  }

  showPromoBanner(): void {
    this.isPromoBannerVisible.next(true);
  }

  closePromoBanner(): void {
    this.isPromoBannerVisible.next(false);
  }
}
