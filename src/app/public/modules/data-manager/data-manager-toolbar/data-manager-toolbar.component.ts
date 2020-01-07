import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
   OnInit
} from '@angular/core';

import {
  SkyDataManagerService
} from '../data-manager.service';

// import {
//   delay
// } from 'rxjs/operators';

import {
  SkyDataManagerSortOption
} from '../models/data-manager-sort-option';
import { SkyDataViewConfig } from '..';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'sky-data-manager-toolbar',
  templateUrl: './data-manager-toolbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDataManagerToolbarComponent implements OnInit {

  public get activeSortOptionId(): string {
    const activeSortOption = this.dataManagerService.activeSortOption.getValue();
    return activeSortOption && activeSortOption.id;
  }

  public get activeView(): SkyDataViewConfig {
    return this._activeView;
  }

  public set activeView(view: SkyDataViewConfig) {
    this._activeView = view;
    this.changeDetector.markForCheck();
  }

  public get searchText(): Subject<string> {
    return this.dataManagerService.searchText;
  }

  public get views(): SkyDataViewConfig[] {
    return this._views;
  }

  public set views(views: SkyDataViewConfig[]) {
    this._views = views;
    this.changeDetector.markForCheck();
  }

  private _activeView: SkyDataViewConfig;
  private _views: SkyDataViewConfig[];

  constructor(
    private changeDetector: ChangeDetectorRef,
    private dataManagerService: SkyDataManagerService
  ) { }

   public ngOnInit(): void {
    this.dataManagerService.activeView.subscribe(view => {
      if (view) {
        this.activeView = view;
        this.changeDetector.markForCheck();
      }
    });

    this.dataManagerService.views.subscribe(views => {
        this.views = views;
      });
   }

   public sortSelected(sortOption: SkyDataManagerSortOption) {
    this.dataManagerService.activeSortOption.next(sortOption);
   }

  public onViewChange(view: SkyDataViewConfig) {
    this.dataManagerService.activeView.next(view);
  }

  public searchApplied(text: string) {
    this.dataManagerService.searchText.next(text);
  }
}
