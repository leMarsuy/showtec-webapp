import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticularsArrayFormComponent } from './particulars-array-form.component';

describe('ParticularsArrayFormComponent', () => {
  let component: ParticularsArrayFormComponent;
  let fixture: ComponentFixture<ParticularsArrayFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticularsArrayFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ParticularsArrayFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
