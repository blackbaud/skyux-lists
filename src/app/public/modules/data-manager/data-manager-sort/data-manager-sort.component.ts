import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input
} from '@angular/core';

import {
  SkyDataManagerService
} from '../data-manager.service';

import {
  delay
} from 'rxjs/operators';

import {
  SkyDataManagerSortOption
} from '../models/data-manager-sort-option';

@Component({
  selector: 'sky-data-manager-sort',
  templateUrl: './data-manager-sort.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDataManagerSortComponent {

  @Input()
  public showButtonText: boolean;

  public sortOptions: SkyDataManagerSortOption[];

  public get activeSortOptionId(): string {
    const activeSortOption = this.dataManagerService.activeSortOption.getValue();
    return activeSortOption && activeSortOption.id;
  }

  public get sortEnabled(): boolean {
    return this._sortEnabled;
  }

  public set sortEnabled(enabled: boolean) {
    this._sortEnabled = enabled;
    this.changeDetector.markForCheck();
  }

  private _sortEnabled: boolean;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private dataManagerService: SkyDataManagerService
  ) {
    this.dataManagerService.activeView
      .pipe(
        delay(0)
    ).subscribe(view => {
      console.log(view);
      this.sortEnabled = view && view.sortEnabled;
      this.sortOptions = view && view.sortOptions;
    });
   }

   public sortSelected(sortOption: SkyDataManagerSortOption) {
     console.log('sort selected');
     console.log(sortOption);
    this.dataManagerService.activeSortOption.next(sortOption);
   }
}
