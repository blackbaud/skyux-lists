import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

import {
  Subject
} from 'rxjs';

import {
  SkyDropdownMessage,
  SkyDropdownMessageType
} from '@skyux/popovers';

import {
  SkySortService
} from './sort.service';

let nextId = 0;
@Component({
  selector: 'sky-sort',
  styleUrls: ['./sort.component.scss'],
  templateUrl: './sort.component.html',
  providers: [
    SkySortService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkySortComponent {

  /**
   * Indicates whether to display text on the sort button beside the sort icon.
   */
  @Input()
  public showButtonText = false;

  public dropdownController = new Subject<SkyDropdownMessage>();

  public sortByHeadingId: string = `sky-sort-heading-${++nextId}`;

  public dropdownClicked(): void {
    this.dropdownController.next({
      type: SkyDropdownMessageType.Close
    });
  }
}
