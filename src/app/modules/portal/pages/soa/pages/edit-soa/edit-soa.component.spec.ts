import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSoaComponent } from './edit-soa.component';

describe('EditSoaComponent', () => {
  let component: EditSoaComponent;
  let fixture: ComponentFixture<EditSoaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSoaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSoaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
