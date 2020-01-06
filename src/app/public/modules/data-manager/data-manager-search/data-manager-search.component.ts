import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component
} from '@angular/core';

import {
  SkyDataManagerService
} from '../data-manager.service';

import { delay } from 'rxjs/operators';

import {
  Subject
} from 'rxjs/Subject';

@Component({
  selector: 'sky-data-manager-search',
  templateUrl: './data-manager-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDataManagerSearchComponent {

  public get searchText(): Subject<string> {
    return this.dataManagerService.searchText;
  }

  public get searchEnabled(): boolean {
    return this._searchEnabled;
  }

  public set searchEnabled(enabled: boolean) {
    this._searchEnabled = enabled;
    this.changeDetector.markForCheck();
  }

  private _searchEnabled: boolean;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private dataManagerService: SkyDataManagerService
  ) {
    this.dataManagerService.activeView
      .pipe(
        delay(0)
    ).subscribe(view => this.searchEnabled = view && view.searchEnabled);
   }

   public searchApplied(text: string) {
    this.dataManagerService.searchText.next(text);
   }
}
