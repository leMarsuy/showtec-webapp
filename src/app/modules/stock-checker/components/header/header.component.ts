import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  readonly logoSrc = 'images/logo.png';
  placeholder = 'Search...';

  searchText = new FormControl('');
}
