import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-particulars-array-form',
  templateUrl: './particulars-array-form.component.html',
  styleUrl: './particulars-array-form.component.scss',
})
export class ParticularsArrayFormComponent implements OnInit {
  @Input() title!: string;
  @Input({ required: true }) fArray!: FormArray;
  @Input() defaultValueArray!: Array<any> | null;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    if (this.defaultValueArray) {
      for (const row of this.defaultValueArray) {
        this.addRow(row);
      }
    } else this.addRow();
  }

  addRow(row?: any) {
    const formGroup = this.formBuilder.group({
      description: [row?.description || '', Validators.required],
      amount: [row?.amount || '', Validators.required],
    });

    this.fArray.push(formGroup, { emitEvent: false });
  }

  removeRow(index: number) {
    this.fArray.removeAt(index);
  }
}
