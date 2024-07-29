import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoaFormComponent } from './soa-form.component';

describe('SoaFormComponent', () => {
  let component: SoaFormComponent;
  let fixture: ComponentFixture<SoaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoaFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
