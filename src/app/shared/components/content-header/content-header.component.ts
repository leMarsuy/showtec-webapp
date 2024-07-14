import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContentHeaderAction } from '@core/interfaces/content-header-action.interface';

@Component({
  selector: 'app-content-header',
  templateUrl: './content-header.component.html',
  styleUrl: './content-header.component.scss',
})
export class ContentHeaderComponent {
  @Input() label: string = '';
  @Input() icon: string = '';
  @Input() actions: ContentHeaderAction[] = [];
  @Output() actionEmitter: EventEmitter<string> = new EventEmitter();
}
