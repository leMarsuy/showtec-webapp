import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSoaComponent } from './create-soa.component';

describe('CreateSoaComponent', () => {
  let component: CreateSoaComponent;
  let fixture: ComponentFixture<CreateSoaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSoaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateSoaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
