import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TuiBreadcrumbs } from '@taiga-ui/kit';

@Component({
  selector: 'app-page-header',
  imports: [
    CommonModule,
    TuiBreadcrumbs
  ],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss'
})
export class PageHeaderComponent {

}
