import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertProductClassificationComponent } from './upsert-product-classification.component';

describe('UpsertProductClassificationComponent', () => {
  let component: UpsertProductClassificationComponent;
  let fixture: ComponentFixture<UpsertProductClassificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpsertProductClassificationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UpsertProductClassificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
