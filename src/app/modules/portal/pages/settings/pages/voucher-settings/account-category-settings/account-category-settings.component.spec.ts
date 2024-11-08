import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountCategorySettingsComponent } from './account-category-settings.component';

describe('AccountCategorySettingsComponent', () => {
  let component: AccountCategorySettingsComponent;
  let fixture: ComponentFixture<AccountCategorySettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountCategorySettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountCategorySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
