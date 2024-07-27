import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-out-delivery',
  templateUrl: './edit-out-delivery.component.html',
  styleUrl: './edit-out-delivery.component.scss',
})
export class EditOutDeliveryComponent {
  _id!: string;
  constructor(private aRoute: ActivatedRoute) {
    aRoute.params.subscribe((res: any) => {
      this._id = res._id;
    });
  }
}
