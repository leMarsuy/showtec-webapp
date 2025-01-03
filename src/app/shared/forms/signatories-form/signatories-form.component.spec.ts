import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatoriesFormComponent } from './signatories-form.component';

describe('SignatoriesFormComponent', () => {
  let component: SignatoriesFormComponent;
  let fixture: ComponentFixture<SignatoriesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignatoriesFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SignatoriesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
