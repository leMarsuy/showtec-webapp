import { Component, OnInit } from '@angular/core';
import { AuthService } from '@shared/services/api';
import { User } from '@core/models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  appName = 'Inventory Management System';
  logoSrc = 'images/logo.png';
  me!: User;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.me().subscribe((res) => {
      this.me = res;
    });
  }
}
