import { Component } from '@angular/core';
import { AlertService } from './alert.service';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [
    NgbToastModule, NgTemplateOutlet
  ],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  host: { class: 'toast-container position-fixed top-0 end-0 p-3', style: 'z-index: 1200' },
})
export class AlertComponent {
  constructor(public toastService: AlertService) { }
}
