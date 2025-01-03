import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertVoucherComponent } from './upsert-voucher.component';

describe('UpsertVoucherComponent', () => {
  let component: UpsertVoucherComponent;
  let fixture: ComponentFixture<UpsertVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpsertVoucherComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UpsertVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
