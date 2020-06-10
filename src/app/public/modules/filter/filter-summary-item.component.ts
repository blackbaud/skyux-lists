import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

@Component({
  selector: 'sky-filter-summary-item',
  styleUrls: ['./filter-summary-item.component.scss'],
  templateUrl: './filter-summary-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyFilterSummaryItemComponent {

  /**
   * Indicates whether the filter summary item has a close button.
   */
  @Input()
  public dismissible = true;

  /**
   * An event that is emitted when the summary item close button is clicked.
   */
  @Output()
  public dismiss = new EventEmitter<void>();

  /**
   * An event that is emitted when the summary item is clicked.
   */
  @Output()
  public itemClick = new EventEmitter<void>();

  public onItemDismiss(): void {
    this.dismiss.emit();
  }

  public onItemClick(): void {
    this.itemClick.emit();
  }

  public onItemKeypress(): void {
    this.itemClick.emit();
  }
}
