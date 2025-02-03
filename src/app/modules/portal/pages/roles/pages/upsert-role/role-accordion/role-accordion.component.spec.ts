import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleAccordionComponent } from './role-accordion.component';

describe('RoleAccordionComponent', () => {
  let component: RoleAccordionComponent;
  let fixture: ComponentFixture<RoleAccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoleAccordionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
