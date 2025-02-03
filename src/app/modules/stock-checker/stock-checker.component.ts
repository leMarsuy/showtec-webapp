import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { ConfigApiService } from '@app/shared/services/api/config-api/config-api.service';
import { StockCheckerService } from './stock-checker.service';

@Component({
  selector: 'app-stock-checker',
  templateUrl: './stock-checker.component.html',
  styleUrl: './stock-checker.component.scss',
})
export class StockCheckerComponent implements OnInit {
  readonly logoSrc = 'images/logo.png';

  private readonly configApi = inject(ConfigApiService);
  private readonly snackbar = inject(SnackbarService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly stockCheckerService = inject(StockCheckerService);

  constructor() {
    this.configApi.getProductClassifications().subscribe({
      next: (classifications) => {
        this.stockCheckerService.setClassifications(
          classifications as Array<string>,
        );
      },
      error: ({ error }: HttpErrorResponse) => {
        console.error(error);
        this.snackbar.openErrorSnackbar(error.errorCode, error.message);
      },
    });
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ isUser }) => {
      this.stockCheckerService.setIsUser(isUser);
    });
  }
}
