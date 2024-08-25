import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsSoldComponent } from './products-sold.component';

describe('ProductsSoldComponent', () => {
  let component: ProductsSoldComponent;
  let fixture: ComponentFixture<ProductsSoldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsSoldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsSoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
