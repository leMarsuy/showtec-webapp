import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxesFormComponent } from './taxes-form.component';

describe('TaxesFormComponent', () => {
  let component: TaxesFormComponent;
  let fixture: ComponentFixture<TaxesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaxesFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
