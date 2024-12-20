import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherSettingsComponent } from './voucher-settings.component';

describe('VoucherSettingsComponent', () => {
  let component: VoucherSettingsComponent;
  let fixture: ComponentFixture<VoucherSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VoucherSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VoucherSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
