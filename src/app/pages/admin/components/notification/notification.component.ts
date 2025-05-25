import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import {
  Component,
  EventEmitter,
  Inject,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of, switchMap } from 'rxjs';
import { AlertTemplateComponent } from './alert-template/alert-template.component';
import { NotificationData } from '../../models/common.model';
import { TuiAlertService } from '@taiga-ui/core';
@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit, OnDestroy {
  public alertData: NotificationData | null = null;

  @Input()
  value$!: Observable<NotificationData>;

  @Output()
  public notificationEvent: EventEmitter<any> = new EventEmitter();

  notification!: Observable<void>;
  private readonly alerts: TuiAlertService;

  private notiSubscriptions: any;
  constructor(
    @Inject(TuiAlertService) alerts: TuiAlertService,
    @Inject(Injector) private readonly injector: Injector
  ) {
    this.alerts = alerts;
  }

  ngOnInit(): void {
    this.value$.subscribe((value) => {
      this.alertData = value;
      this.initNotification();
      this.notiSubscriptions = this.notification.subscribe();
    });
  }

  private initNotification(): void {
    this.notification = this.alerts
      .open<NotificationData>(
        new PolymorpheusComponent(AlertTemplateComponent, this.injector),
        {
          data: this.alertData,
          closeable: true,
          autoClose: 3000,
        }
      )
      .pipe(
        switchMap((response: NotificationData) => {
          if (response.completed) {
            if (response.id) {
              this.emitData(response.id);
            } else if (response.data) {
              this.emitData(response.data);
            }
          }
          return of(void 0);
        })
      );
  }
  showNotification(): void {
    this.notification.subscribe();
  }

  emitData(data: any): void {
    this.notificationEvent.emit(data);
  }

  ngOnDestroy(): void {
    if (this.notiSubscriptions) {
      this.notiSubscriptions.unsubscribe();
    }
  }
}
