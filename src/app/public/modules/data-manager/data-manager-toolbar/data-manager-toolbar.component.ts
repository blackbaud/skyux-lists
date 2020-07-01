import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  Subject
} from 'rxjs';

import {
  takeUntil
} from 'rxjs/operators';

import {
  SkyCheckboxChange
} from '@skyux/forms';

import {
  SkyModalCloseArgs,
  SkyModalService
} from '@skyux/modals';

import {
  SkyDataManagerService
} from '../data-manager.service';

import {
  SkyDataManagerColumnPickerModalContext
} from '../data-manager-column-picker/data-manager-column-picker-modal-context';

import {
  SkyDataManagerColumnPickerModalComponent
} from '../data-manager-column-picker/data-manager-column-picker-modal.component';

import {
  SkyDataManagerColumnPickerOption
} from '../models/data-manager-column-picker-option';

import {
  SkyDataManagerConfig
} from '../models/data-manager-config';

import {
  SkyDataManagerSortOption
} from '../models/data-manager-sort-option';

import {
  SkyDataManagerState
} from '../models/data-manager-state';

import {
  SkyDataViewConfig
} from '../models/data-view-config';

import {
  SkyDataManagerFilterModalContext
} from '../data-manager-filter-context';

@Component({
  selector: 'sky-data-manager-toolbar',
  templateUrl: './data-manager-toolbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDataManagerToolbarComponent implements OnDestroy, OnInit {

  public get activeSortOptionId(): string {
    const activeSortOption = this.dataState && this.dataState.activeSortOption;
    return activeSortOption && activeSortOption.id;
  }

  public get activeView(): SkyDataViewConfig {
    return this._activeView;
  }

  public set activeView(value: SkyDataViewConfig) {
    this._activeView = value;
    this.changeDetector.markForCheck();
  }

  public get dataManagerConfig(): SkyDataManagerConfig {
    return this._dataManagerConfig;
  }

  public set dataManagerConfig(value: SkyDataManagerConfig) {
    this._dataManagerConfig = value;
    this.changeDetector.markForCheck();
  }

  public get dataState(): SkyDataManagerState {
    return this._dataState;
  }

  public set dataState(value: SkyDataManagerState) {
    this._dataState = value;
    this.dataManagerService.updateDataState(value, this._source);
  }

  public get views(): SkyDataViewConfig[] {
    return this._views;
  }

  public set views(value: SkyDataViewConfig[]) {
    this._views = value;
    this.changeDetector.markForCheck();
  }

  public onlyShowSelected: boolean;

    // the source to provide for data state changes
    private _source = 'toolbar';
  private _activeView: SkyDataViewConfig;
  private _dataManagerConfig: SkyDataManagerConfig;
  private _dataState: SkyDataManagerState;
  private _ngUnsubscribe = new Subject();
  private _views: SkyDataViewConfig[] = [];

  constructor(
    private changeDetector: ChangeDetectorRef,
    private dataManagerService: SkyDataManagerService,
    private modalService: SkyModalService
  ) { }

   public ngOnInit(): void {
    this.dataManagerService.getActiveViewIdUpdates()
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe(activeViewId => {
        /* istanbul ignore else */
        if (activeViewId) {
          this.activeView = this.dataManagerService.getViewById(activeViewId);
          this.changeDetector.markForCheck();
        }
      });

    this.dataManagerService.getDataViewsUpdates()
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe(views => {
        this.views = views;
      });

    this.dataManagerService.getDataStateUpdates(this._source)
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe(dataState => {
        this._dataState = dataState;
        this.onlyShowSelected = dataState.onlyShowSelected;
        this.changeDetector.markForCheck();
      });

    this.dataManagerService.getDataManagerConfigUpdates()
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe(config => {
        this.dataManagerConfig = config;
      });
   }

   public sortSelected(sortOption: SkyDataManagerSortOption): void {
    this.dataState.activeSortOption = sortOption;
    this.dataManagerService.updateDataState(this.dataState, this._source);
   }

  public onViewChange(viewId: string): void {
    this.dataManagerService.updateActiveViewId(viewId);
  }

  public searchApplied(text: string): void {
    this.dataState.searchText = text;
    this.dataManagerService.updateDataState(this.dataState, this._source);
  }

  public filterButtonClicked(): void {
    const context = new SkyDataManagerFilterModalContext();
    const filterModal = this.dataManagerConfig && this.dataManagerConfig.filterModalComponent;

    context.filterData = this.dataState && this.dataState.filterData;

    const options: any = {
      providers: [{ provide: SkyDataManagerFilterModalContext, useValue: context }]
    };

    if (filterModal) {
      const modalInstance = this.modalService.open(filterModal, options);

      modalInstance.closed.subscribe((result: SkyModalCloseArgs) => {
        if (result.reason === 'save') {
          this.dataState.filterData = result.data;
          this.dataManagerService.updateDataState(this.dataState, this._source);
        }
      });
    }
  }

  public openColumnPickerModal(): void {
    const context = new SkyDataManagerColumnPickerModalContext();
    const viewState = this.dataState.getViewStateById(this.activeView.id);
    context.columnOptions = this.activeView && this.activeView.columnOptions;
    context.displayedColumnIds = viewState.displayedColumnIds;

    const options: any = {
      providers: [{ provide: SkyDataManagerColumnPickerModalContext, useValue: context }]
    };

    const modalInstance = this.modalService.open(SkyDataManagerColumnPickerModalComponent, options);

    modalInstance.closed.subscribe((result: SkyModalCloseArgs) => {
      if (result.reason === 'save') {
        const displayedColumnIds = result.data.map((col: SkyDataManagerColumnPickerOption) => col.id);

        viewState.displayedColumnIds = displayedColumnIds;
        this.dataState = this.dataState.addOrUpdateView(this.activeView.id, viewState);
        }
    });
  }

  public selectAll(): void {
    this.activeView.onSelectAllClick();
  }

  public clearAll(): void {
    this.activeView.onClearAllClick();
  }

  public onOnlyShowSelected(event: SkyCheckboxChange): void {
    this.dataState.onlyShowSelected = event.checked;
    this.dataManagerService.updateDataState(this.dataState, this._source);
  }

  public ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
