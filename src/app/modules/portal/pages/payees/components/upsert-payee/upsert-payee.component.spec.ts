import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertPayeeComponent } from './upsert-payee.component';

describe('UpsertPayeeComponent', () => {
  let component: UpsertPayeeComponent;
  let fixture: ComponentFixture<UpsertPayeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpsertPayeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpsertPayeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
