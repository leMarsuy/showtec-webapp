import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { filter, fromEvent, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-pop-tooltip',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  template: `
    <main
      class="flex flex-col justify-center gap-2 fixed bg-white rounded-md px-2.5 py-3 mt-2.5 -translate-x-1/2 z-[9999] shadow-md border border-gray-200"
      [style.top.px]="top"
      [style.left.px]="left"
    >
      <section class="flex items-center">
        <mat-icon fontIcon="info" class="text-amber-500 text-[24px] mr-2.5" />
        <span class="text-sm">{{ text }}</span>
      </section>
      <section class="flex items-center justify-end gap-2.5">
        <button mat-button (click)="onClick(false)">Cancel</button>
        <button mat-flat-button (click)="onClick(true)">OK</button>
      </section>
    </main>
  `,
})
export class PopTooltipComponent implements AfterViewInit, OnDestroy {
  @Input() text!: string;
  @Input() top = 0;
  @Input() left = 0;
  @Output() optionClicked: EventEmitter<boolean> = new EventEmitter();

  private document = inject<Document>(DOCUMENT);
  private elementRef = inject(ElementRef);

  private destroyed$ = new Subject<void>();

  private componentInstantiate = 0;

  ngAfterViewInit(): void {
    fromEvent<MouseEvent>(this.document, 'click')
      .pipe(
        takeUntil(this.destroyed$),
        filter((event) => {
          const clickTargetHtml = event.target as HTMLElement;
          return !this.isOrContainsClickTarget(
            this.elementRef.nativeElement,
            clickTargetHtml,
          );
        }),
      )
      .subscribe(() => {
        //To prevent closing the component immediately  when invoked by the directive
        if (!this.componentInstantiate) {
          this.componentInstantiate++;
        } else {
          this.onClick(false);
        }
      });
  }

  private isOrContainsClickTarget(
    element: HTMLElement,
    clickTarget: HTMLElement,
  ) {
    return element == clickTarget || element.contains(clickTarget);
  }

  onClick(isConfirmed: boolean) {
    this.optionClicked.emit(isConfirmed);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
