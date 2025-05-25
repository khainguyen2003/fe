import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { Subject } from 'rxjs';
import { NotificationComponent } from "../../components/notification/notification.component";
import { NotificationData, Pagable } from '../../models/common.model';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie/movie.service';
import { ScreenType } from '../../utils/custom-type';
import { ADD_EDIT_TYPE_ENUM, SCREEN_TYPE_ENUM } from '../../utils/enums/common.enums';
import { parseJsonToObject } from '../../utils/functions/json-utils';
import { MovieListComponent } from './movie-list/movie-list.component';
import { MovieCreateComponent } from './movie-create/movie-create.component';

@Component({
  selector: 'app-movies',
  imports: [
    CommonModule,
    TranslocoModule,
    NotificationComponent,
    MovieListComponent,
    MovieCreateComponent
],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss'
})
export class MoviesComponent implements OnInit{
  readonly #service = inject(MovieService);

  $notification = new Subject<NotificationData>();
  $noti = this.$notification.asObservable();

  detail = new Subject<number>();
  $detail = this.detail.asObservable();

  public readonly tlHeaderTs = 'movie.';

  public currentPage: ScreenType | null = null;

  public pagination: Pagable = {
    itemPerpage: 10,
    currentPage: 0,
  };
  public totalPage!: number;

  public initData: Movie | null = null;
  public type: ADD_EDIT_TYPE_ENUM.CREATE | ADD_EDIT_TYPE_ENUM.UPDATE =
    ADD_EDIT_TYPE_ENUM.CREATE;

  ngOnInit(): void {
    this.currentPage = SCREEN_TYPE_ENUM.LIST;
  }

  changeScreenHandler(event: string): void {
    if (this.currentPage !== event) {
      this.currentPage = event as ScreenType;
    }
  }

  updateHandler(data: Movie) {
    this.currentPage = SCREEN_TYPE_ENUM.UPDATE;
    this.initData = data?.newData ? parseJsonToObject(data.newData) : data;
  }

  createHandler() {
    this.initData = null;
    this.type = ADD_EDIT_TYPE_ENUM.CREATE;
    this.currentPage = SCREEN_TYPE_ENUM.CREATE;
  }

  copyHandler(data: Movie) {
    this.currentPage = SCREEN_TYPE_ENUM.CREATE;
    this.initData = data;
  }

  detailDataHandler(data: number) {
    this.detail.next(data);
  }
}
