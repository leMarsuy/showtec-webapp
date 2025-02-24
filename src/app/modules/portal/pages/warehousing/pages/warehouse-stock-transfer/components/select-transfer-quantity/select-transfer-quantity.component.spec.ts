import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTransferQuantityComponent } from './select-transfer-quantity.component';

describe('SelectTransferQuantityComponent', () => {
  let component: SelectTransferQuantityComponent;
  let fixture: ComponentFixture<SelectTransferQuantityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectTransferQuantityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectTransferQuantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
