import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PORTAL_PATHS } from '@app/core/constants/nav-paths';

@Component({
  selector: 'app-create-soa',
  templateUrl: './create-soa.component.html',
  styleUrl: './create-soa.component.scss',
})
export class CreateSoaComponent {
  private router = inject(Router);

  navigateBack() {
    this.router.navigate([PORTAL_PATHS.soas.relativeUrl]);
  }
}
