import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductClassificationSettingsComponent } from './product-classification-settings.component';

describe('ProductClassificationSettingsComponent', () => {
  let component: ProductClassificationSettingsComponent;
  let fixture: ComponentFixture<ProductClassificationSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductClassificationSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductClassificationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
