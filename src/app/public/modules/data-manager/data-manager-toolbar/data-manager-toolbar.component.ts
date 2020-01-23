import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
   OnInit
} from '@angular/core';

import {
  SkyDataManagerService
} from '../data-manager.service';

import {
  SkyDataManagerSortOption
} from '../models/data-manager-sort-option';
import { SkyDataViewConfig, SkyDataManagerColumnPickerOption } from '..';
import { SkyDataManagerColumnPickerModalContext } from '../data-manager-column-picker/data-manager-column-picker-modal-context';
import { SkyModalService, SkyModalCloseArgs } from '@skyux/modals';
import { SkyDataManagerColumnPickerModalComponent } from '../data-manager-column-picker/data-manager-column-picker-modal.component';
import { SkyDataManagerState } from '../models';
import { SkyDataManagerFilterModalContext } from '../data-manager-filter-context';

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

  public set activeView(view: SkyDataViewConfig) {
    this._activeView = view;
    this.changeDetector.markForCheck();
  }

  public get dataState(): SkyDataManagerState {
    return this._dataState;
  }

  public set dataState(value: SkyDataManagerState) {
    this._dataState = value;
    this.dataManagerService.dataState.next(value);
  }

  public get views(): SkyDataViewConfig[] {
    return this._views;
  }

  public set views(value: SkyDataViewConfig[]) {
    this._views = value;
    this.changeDetector.markForCheck();
  }

  private _activeView: SkyDataViewConfig;
  private _dataState: SkyDataManagerState;
  private _views: SkyDataViewConfig[] = [];

  constructor(
    private changeDetector: ChangeDetectorRef,
    private dataManagerService: SkyDataManagerService,
    private modalService: SkyModalService
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

    this.dataManagerService.dataState.subscribe(dataState => {
      this._dataState = dataState;
      this.changeDetector.markForCheck();
    });
   }

   public sortSelected(sortOption: SkyDataManagerSortOption) {
    this.dataState = this.dataState.setActiveSortOption(sortOption);
   }

  public onViewChange(view: SkyDataViewConfig) {
    this.dataManagerService.activeView.next(view);
  }

  public searchApplied(text: string) {
    this.dataState = this.dataState.setSearchText(text);
  }

  public filterButtonClicked(): void {
    const context = new SkyDataManagerFilterModalContext();
    const filterModal = this.activeView && this.activeView.filterModalComponent;

    context.filterData = this.dataState && this.dataState.filterData;

    const options: any = {
      providers: [{ provide: SkyDataManagerFilterModalContext, useValue: context }]
    };

    const modalInstance = this.modalService.open(filterModal, options);

    modalInstance.closed.subscribe((result: SkyModalCloseArgs) => {
      if (result.reason === 'save') {
        this.dataState = this.dataState.setFilterData(result.data);
      }
    });
  }

  public openColumnPickerModal(): void {
    const context = new SkyDataManagerColumnPickerModalContext();
    context.columnOptions = this.activeView && this.activeView.columnOptions;

    const options: any = {
      providers: [{ provide: SkyDataManagerColumnPickerModalContext, useValue: context }]
    };

    const modalInstance = this.modalService.open(SkyDataManagerColumnPickerModalComponent, options);

    modalInstance.closed.subscribe((result: SkyModalCloseArgs) => {
      if (result.reason === 'save') {
        const selectedColumnIds =
          result.data.map((col: SkyDataManagerColumnPickerOption) => col.id);
        this.dataState = this.dataState.setSelectedColumnIds(selectedColumnIds);
      }
    });
  }
}
