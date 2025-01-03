import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsArrayFormComponent } from './accounts-array-form.component';

describe('AccountsArrayFormComponent', () => {
  let component: AccountsArrayFormComponent;
  let fixture: ComponentFixture<AccountsArrayFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountsArrayFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountsArrayFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
