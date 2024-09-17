import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-soa',
  templateUrl: './edit-soa.component.html',
  styleUrl: './edit-soa.component.scss',
})
export class EditSoaComponent {
  _id!: string;
  constructor(private aRoute: ActivatedRoute) {
    aRoute.params.subscribe((res: any) => {
      this._id = res._id;
    });
  }
}
