import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
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
  @Input() initialValue!: any;

  @Output() selectionChange = new EventEmitter<any>();

  supplierControl: any = new FormControl('');
  suppliers: Supplier[] = [];
  filteredSuppliers$!: Observable<any[]>;
  isLoading: boolean = true;
  private destroyed$ = new Subject<void>();

  constructor(private supplierService: SupplierApiService) {}

  ngOnInit() {
    this.filteredSuppliers$ = this.supplierControl.valueChanges.pipe(
      takeUntil(this.destroyed$),
      debounceTime(500),
      distinctUntilChanged(),
      startWith(''), // ✅ Ensures initial filtering happens
      filter((value) => typeof value === 'string'),
      switchMap((keyword) => this._filterSupplierByKeyword(keyword || '')),
    );

    this.fetchSuppliers();
  }

  fetchSuppliers() {
    this.supplierService.getSuppliers().subscribe((resp) => {
      const response = resp as HttpGetResponse;
      this.suppliers = response.records as Supplier[];
      if (this.initialValue.payee) {
        const supplier = this.initialValue._supplierId
          ? this.suppliers.find(
              (supplier) => supplier._id === this.initialValue._supplierId,
            )
          : null;
        this.supplierControl.setValue(
          supplier || this.initialValue.payee || this.initialValue || '',
        );
      }
      this.isLoading = false;
    });
  }

  optionSelected(value: any) {
    this.selectionChange.emit({
      name: value.name || value,
      _id: value._id || null,
    });
  }

  _filterSupplierByKeyword(value: any) {
    if (!this.suppliers) {
      return of([]);
    }
    const filterValue = value.toLowerCase();

    if (!value) {
      return of(this.suppliers);
    }

    return of(
      this.suppliers.filter((supplier) =>
        supplier.name.toLowerCase().includes(filterValue),
      ),
    );
  }

  displayFn(supplier: any): string {
    const name: string = supplier.name || supplier || '';
    return name;
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
