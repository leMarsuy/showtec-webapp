import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchAddProductComponent } from './batch-add-product.component';

describe('BatchAddProductComponent', () => {
  let component: BatchAddProductComponent;
  let fixture: ComponentFixture<BatchAddProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchAddProductComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BatchAddProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
