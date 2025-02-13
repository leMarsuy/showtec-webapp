import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrScannerDialogComponent } from './qr-scanner-dialog.component';

describe('QrScannerDialogComponent', () => {
  let component: QrScannerDialogComponent;
  let fixture: ComponentFixture<QrScannerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QrScannerDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrScannerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
