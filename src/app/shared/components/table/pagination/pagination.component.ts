import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  @Input() totalItems = 0;
  @Input() itemsPerPage: string | number = 10;
  @Input() itemsPerPageOptions: number[] = [5, 10, 25, 50];
  @Input() currentPage: number = 1;
  @Input() loading!: boolean;

  @Output() paginationChange = new EventEmitter<any>();

  totalPages = 0;
  pageNumbers: number[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalItems'] || changes['itemsPerPage']) {
      this.calculateTotalPages();
    }
  }

  private calculateTotalPages(): void {
    this.totalPages = Math.ceil(
      this.totalItems / parseInt(this.itemsPerPage.toString()),
    );
    this.pageNumbers = Array(this.totalPages)
      .fill(0)
      .map((_, i) => i + 1);

    this.currentPage = 1;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginationChange.emit({
        pageIndex: this.currentPage,
        pageSize: this.itemsPerPage,
      });
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  onItemsPerPageChange(newPageSize: any): void {
    this.itemsPerPage = +newPageSize;
    this.calculateTotalPages();
    this.goToPage(1); // Reset to the first page when items per page change
    this.paginationChange.emit({
      pageIndex: this.currentPage,
      pageSize: this.itemsPerPage,
    });
  }

  get getRange(): string {
    const start =
      (this.currentPage - 1) * parseInt(this.itemsPerPage.toString()) + 1;
    const end = Math.min(
      this.currentPage * parseInt(this.itemsPerPage.toString()),
      this.totalItems,
    );
    return `${start}-${end}`;
  }
}
