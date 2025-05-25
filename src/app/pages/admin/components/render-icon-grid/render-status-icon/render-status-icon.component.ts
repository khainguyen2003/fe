import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { TuiBadge } from '@taiga-ui/kit';
import { TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'app-render-status-icon',
  standalone: true,
  imports: [CommonModule, TuiBadge, TuiIcon, TranslocoModule],
  templateUrl: './render-status-icon.component.html',
  styleUrls: ['./render-status-icon.component.scss'],
})
export class RenderStatusIconComponent {
  @Input()
  public type!: 'success' | 'danger' | 'warning' | 'info' | 'gray';

  @Input()
  public label!: string;
}
