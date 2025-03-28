import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeStatusModalComponent } from './change-status-modal.component';

describe('ChangeStatusModalComponent', () => {
  let component: ChangeStatusModalComponent;
  let fixture: ComponentFixture<ChangeStatusModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangeStatusModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeStatusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
