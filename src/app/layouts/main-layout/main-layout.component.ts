import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../../../admin/components/header/header.component";

@Component({
  selector: 'app-main-layout',
  imports: [
    HeaderComponent, 
    RouterOutlet
  ],
  standalone: true,
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
}
