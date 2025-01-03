import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertRoleComponent } from './upsert-role.component';

describe('UpsertRoleComponent', () => {
  let component: UpsertRoleComponent;
  let fixture: ComponentFixture<UpsertRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpsertRoleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UpsertRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
