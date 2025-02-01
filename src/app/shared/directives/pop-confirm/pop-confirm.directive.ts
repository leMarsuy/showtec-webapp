import { DOCUMENT } from '@angular/common';
import {
  ApplicationRef,
  ComponentRef,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Injector,
  Input,
  OnDestroy,
  Output,
  ViewContainerRef,
} from '@angular/core';
import { PopTooltipComponent } from './pop-tooltip.component';

@Directive({
  selector: '[popConfirm]',
  standalone: true,
})
export class PopConfirmDirective implements OnDestroy {
  @Input() tooltipTitle: string = 'Do you want to continue?';
  @Output() afterTooltipClose: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  private toolTipComponent?: ComponentRef<any>;
  private document = inject<Document>(DOCUMENT);

  constructor(
    private viewContainerRef: ViewContainerRef,
    private injector: Injector,
    private appRef: ApplicationRef,
    private elementRef: ElementRef,
  ) {}

  @HostListener('click') OnMouseClick() {
    if (this.toolTipComponent) return;

    this.toolTipComponent = this.viewContainerRef.createComponent(
      PopTooltipComponent,
      { injector: this.injector },
    );

    this.document.body.appendChild(
      this.toolTipComponent.location.nativeElement,
    );

    this.setTooltipComponentProperties();
    this.toolTipComponent.hostView.detectChanges();
  }

  private setTooltipComponentProperties() {
    if (!this.toolTipComponent) return;

    this.toolTipComponent.instance.text = this.tooltipTitle;
    const { left, right, bottom } =
      this.elementRef.nativeElement.getBoundingClientRect();

    this.toolTipComponent.instance.left = (right - left) / 2 + left;
    this.toolTipComponent.instance.top = bottom;
    this.toolTipComponent.instance.optionClicked.subscribe(
      (isConfirmed: any) => {
        this.onTooltipClose(isConfirmed);
      },
    );
  }

  private destroyTooltipComponent() {
    if (this.toolTipComponent) {
      this.appRef.detachView(this.toolTipComponent?.hostView);
      this.toolTipComponent.destroy();
    }

    this.toolTipComponent = undefined;
  }

  private onTooltipClose(isConfirmed: boolean) {
    this.destroyTooltipComponent();
    this.afterTooltipClose.emit(isConfirmed);
  }

  ngOnDestroy(): void {
    this.destroyTooltipComponent();
  }
}
