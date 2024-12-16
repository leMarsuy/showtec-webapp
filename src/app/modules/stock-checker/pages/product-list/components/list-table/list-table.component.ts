import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Color } from '@app/core/enums/color.enum';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-list-table',
  templateUrl: './list-table.component.html',
  styleUrl: './list-table.component.scss',
})
export class ListTableComponent implements OnInit, OnDestroy {
  @Input()
  dataSource: any = null;

  @Input()
  isLoading = false;

  @Input() page: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: -1,
  };

  @Output() rowEmitter: EventEmitter<any> = new EventEmitter();
  @Output() pageEmitter: EventEmitter<PageEvent> = new EventEmitter();
  @Output() actionEmitter: EventEmitter<any> = new EventEmitter();

  private destroyed$ = new Subject<void>();

  isTableLoading$ = new BehaviorSubject<boolean>(false);
  isTableLoading = false;

  pageSizeOptions = [10, 25, 50];

  displayedColumns!: string[];

  columns: any[] = [
    {
      label: 'SKU',
      // dotNotationPath: 'sku',
      dotNotationPath: 'productDisplay', //Custom Object
      type: 'productDisplay',
    },
    {
      label: 'Stocked Product',
      dotNotationPath: '_$stockSummary.In Stock',
      type: 'number',
    },
    {
      label: 'Price',
      dotNotationPath: 'price.amount',
      type: 'currency',
    },
    {
      label: 'Classification',
      dotNotationPath: 'classification',
    },
    // {
    //   label: 'Action',
    //   dotNotationPath: 'action',
    //   type: 'action',
    //   actions: [
    //     {
    //       name: 'Test',
    //       icon: 'edit',
    //       action: 'test',
    //       color: Color.INFO,
    //     },
    //     {
    //       name: 'Test',
    //       icon: 'edit',
    //       action: 'test',
    //       color: Color.INFO,
    //     },
    //     {
    //       name: 'Test',
    //       icon: 'edit',
    //       action: 'test',
    //       color: Color.INFO,
    //     },
    //   ],
    // },
  ];

  ngOnInit(): void {
    this.displayedColumns = this.columns.map(
      (column) => column.dotNotationPath
    );
    this.isTableLoading$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isLoading) => {
        this.isTableLoading = isLoading;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.isTableLoading$.next(changes['isLoading']?.currentValue);
  }

  onPaginationChange(event: any) {
    const pageIndex = event.pageIndex - 1;

    this.pageEmitter.emit({
      pageIndex,
      pageSize: event.pageSize,
      length: event.length,
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
