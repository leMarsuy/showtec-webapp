import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoaListComponent } from './soa-list.component';

describe('SoaListComponent', () => {
  let component: SoaListComponent;
  let fixture: ComponentFixture<SoaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoaListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
