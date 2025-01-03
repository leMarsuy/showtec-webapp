import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonFormLoadingComponent } from './skeleton-form-loading.component';

describe('SkeletonFormLoadingComponent', () => {
  let component: SkeletonFormLoadingComponent;
  let fixture: ComponentFixture<SkeletonFormLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonFormLoadingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonFormLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
