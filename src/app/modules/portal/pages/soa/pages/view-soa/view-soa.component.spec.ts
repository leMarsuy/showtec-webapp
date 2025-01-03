import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSoaComponent } from './view-soa.component';

describe('ViewSoaComponent', () => {
  let component: ViewSoaComponent;
  let fixture: ComponentFixture<ViewSoaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewSoaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewSoaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
