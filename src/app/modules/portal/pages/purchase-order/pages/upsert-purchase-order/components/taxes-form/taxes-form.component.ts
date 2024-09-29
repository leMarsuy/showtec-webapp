import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Color } from '@app/core/enums/color.enum';
import { ColumnType } from '@app/core/enums/column-type.enum';
import { TableColumn } from '@app/core/interfaces/table-column.interface';
import { Tax } from '@app/core/models/soa.model';

@Component({
  selector: 'app-taxes-form',
  templateUrl: './taxes-form.component.html',
  styleUrl: './taxes-form.component.scss',
})
export class TaxesFormComponent implements OnInit {
  @Input() listedTaxes: Tax[] = [];
  @Output() taxesEmitter = new EventEmitter<Tax[]>();

  columns: TableColumn[] = [
    {
      label: 'Name',
      dotNotationPath: 'name',
      type: ColumnType.STRING,
    },
    {
      label: 'Value',
      dotNotationPath: 'value',
      type: ColumnType.PERCENTAGE,
    },
    {
      label: 'Remove',
      dotNotationPath: '_id',
      type: ColumnType.ACTION,
      width: '[2rem]',
      actions: [
        {
          icon: 'remove',
          action: 'remove',
          name: 'Remove Tax',
          color: Color.ERROR,
        },
      ],
    },
  ];

  page: PageEvent = {
    pageIndex: 0,
    pageSize: 100,
    length: 0,
  };

  taxForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    value: new FormControl(undefined, [Validators.required]),
  });

  constructor() {}

  ngOnInit(): void {
    this.page.length = this.listedTaxes.length;
  }

  actionEventHandler(e: any) {
    const { action } = e.action;

    switch (action) {
      case 'remove':
        this._removeFromList(e.i);
        this._emitTaxes();
        break;

      default:
        break;
    }
  }

  pushToList() {
    this.listedTaxes.push({
      ...(this.taxForm.getRawValue() as any),
    });
    this.listedTaxes = [...this.listedTaxes];
    this.page.length = this.listedTaxes.length;
    this.taxForm.reset();
    this._emitTaxes();
  }

  private _emitTaxes() {
    this.taxesEmitter.emit(this.listedTaxes);
  }
  private _removeFromList(i: number) {
    this.listedTaxes.splice(i, 1);
    this.listedTaxes = [...this.listedTaxes];
    this.page.length--;
  }
}
