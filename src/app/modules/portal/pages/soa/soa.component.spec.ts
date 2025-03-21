import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoaComponent } from './soa.component';

describe('SoaComponent', () => {
  let component: SoaComponent;
  let fixture: ComponentFixture<SoaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SoaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
