import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountTitleSettingsComponent } from './account-title-settings.component';

describe('AccountTitleSettingsComponent', () => {
  let component: AccountTitleSettingsComponent;
  let fixture: ComponentFixture<AccountTitleSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountTitleSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountTitleSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
