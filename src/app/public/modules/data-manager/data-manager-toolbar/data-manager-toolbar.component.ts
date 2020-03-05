import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

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
  SkyDataManagerColumnPickerOption,
  SkyDataManagerConfig,
  SkyDataManagerSortOption,
  SkyDataManagerState,
  SkyDataViewConfig
} from '../models';

import {
  SkyDataManagerFilterModalContext
} from '../data-manager-filter-context';

@Component({
  selector: 'sky-data-manager-toolbar',
  templateUrl: './data-manager-toolbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDataManagerToolbarComponent implements OnInit {

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
  private _views: SkyDataViewConfig[] = [];

  constructor(
    private changeDetector: ChangeDetectorRef,
    private dataManagerService: SkyDataManagerService,
    private modalService: SkyModalService
  ) { }

   public ngOnInit(): void {
    this.dataManagerService.activeViewId.subscribe(activeViewId => {
      if (activeViewId) {
        this.activeView = this.dataManagerService.getViewById(activeViewId);
        this.changeDetector.markForCheck();
      }
    });

    this.dataManagerService.views.subscribe(views => {
      this.views = views;
    });

    this.dataManagerService.getDataStateSubscription(this._source).subscribe(dataState => {
      this._dataState = dataState;
      this.onlyShowSelected = dataState.onlyShowSelected;
      this.changeDetector.markForCheck();
    });

    this.dataManagerService.dataManagerConfig.subscribe(config => {
      this.dataManagerConfig = config;
    });
   }

   public sortSelected(sortOption: SkyDataManagerSortOption) {
    this.dataState = this.dataState.setActiveSortOption(sortOption);
   }

  public onViewChange(viewId: string) {
    this.dataManagerService.activeViewId.next(viewId);
  }

  public searchApplied(text: string) {
    this.dataState = this.dataState.setSearchText(text);
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
          this.dataState = this.dataState.setFilterData(result.data);
        }
      });
    }
  }

  public openColumnPickerModal(): void {
    const context = new SkyDataManagerColumnPickerModalContext();
    const currentViewState = this.dataState.getViewStateById(this.activeView.id);
    context.columnOptions = this.activeView && this.activeView.columnOptions;
    context.displayedColumnIds = currentViewState.displayedColumnIds;

    const options: any = {
      providers: [{ provide: SkyDataManagerColumnPickerModalContext, useValue: context }]
    };

    const modalInstance = this.modalService.open(SkyDataManagerColumnPickerModalComponent, options);

    modalInstance.closed.subscribe((result: SkyModalCloseArgs) => {
      if (result.reason === 'save') {
        const displayedColumnIds =
          result.data.map((col: SkyDataManagerColumnPickerOption) => col.id);

        const updatedViewState = currentViewState.setDisplayedColumnIds(displayedColumnIds);
        this.dataState = this.dataState.addOrUpdateView(this.activeView.id, updatedViewState);
        }
    });
  }

  public selectAll(): void {
    this.activeView.onSelectAllClick();
  }

  public clearAll(): void {
    this.activeView.onClearAllClick();
  }

  public onOnlyShowSelected(event: SkyCheckboxChange) {
    this.dataState = this.dataState.setOnlyShowSelected(event.checked);
  }
}
