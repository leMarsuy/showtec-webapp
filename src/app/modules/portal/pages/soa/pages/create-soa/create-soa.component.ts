import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-soa',
  templateUrl: './create-soa.component.html',
  styleUrl: './create-soa.component.scss',
})
export class CreateSoaComponent {
  private router = inject(Router);

  navigateBack() {
    this.router.navigate(['portal', 'soa']);
  }
}
