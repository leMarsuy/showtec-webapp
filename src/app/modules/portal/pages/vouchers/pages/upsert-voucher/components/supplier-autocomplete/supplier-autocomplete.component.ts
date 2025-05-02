import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpGetResponse } from '@app/core/interfaces/http-get-response.interface';
import { Supplier } from '@app/core/models/supplier.model';
import { SupplierApiService } from '@app/shared/services/api/supplier-api/supplier-api.service';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';

@Component({
  selector: 'app-supplier-autocomplete',
  standalone: true,
  imports: [
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './supplier-autocomplete.component.html',
  styleUrl: './supplier-autocomplete.component.scss',
})
export class SupplierAutocompleteComponent implements OnInit, OnDestroy {
  @Output() selectionChange = new EventEmitter<string>();

  supplierControl = new FormControl('');
  suppliers: Supplier[] = [];
  filteredSuppliers$!: Observable<string[]>;
  isLoading: boolean = true;
  private destroyed$ = new Subject<void>();

  constructor(private supplierService: SupplierApiService) {}

  ngOnInit() {
    // Initialize the filtered list to prevent an empty state
    this.filteredSuppliers$ = this.supplierControl.valueChanges.pipe(
      takeUntil(this.destroyed$),
      debounceTime(500),
      distinctUntilChanged(),
      startWith(''), // ✅ Ensures initial filtering happens
      filter((value) => typeof value === 'string'),
      switchMap((keyword) => this._filterSupplierByKeyword(keyword || '')),
    );

    // Fetch suppliers from API
    this.fetchSuppliers();
  }

  fetchSuppliers() {
    this.supplierService.getSuppliers().subscribe((resp) => {
      const response = resp as HttpGetResponse;
      this.suppliers = response.records as Supplier[];
      this.isLoading = false;
    });
  }

  optionSelected(value: string) {
    this.selectionChange.emit(value);
  }

  _filterSupplierByKeyword(value: string): Observable<string[]> {
    if (!this.suppliers) {
      return of([]);
    }
    const filterValue = value.toLowerCase();
    const supplierNames = this.suppliers.map((supplier) => supplier.name);

    if (!value) {
      return of(supplierNames);
    }

    return of(
      supplierNames.filter((name) => name.toLowerCase().includes(filterValue)),
    );
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
