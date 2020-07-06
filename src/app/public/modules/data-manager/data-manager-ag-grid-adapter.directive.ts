import {
  AfterContentInit,
  Directive,
  ChangeDetectorRef,
  ContentChildren,
  QueryList,
  Input
} from '@angular/core';

import {
  Subscription
} from 'rxjs';

import {
  AgGridAngular
} from 'ag-grid-angular';

import {
  ColumnMovedEvent,
  RowSelectedEvent
} from 'ag-grid-community';

import {
  SkyDataManagerService
} from './data-manager.service';

import {
  SkyDataViewConfig
} from './models/data-view-config';

import {
  SkyDataManagerState
} from './models/data-manager-state';

import {
  SkyDataManagerSortOption
} from './models/data-manager-sort-option';

@Directive({
  selector: '[skyAgGridDataManager]'
})
export class SkyAgGridDataManagerAdapterDirective implements AfterContentInit {

  @Input()
  private viewConfig: SkyDataViewConfig;

  private currentAgGrid: AgGridAngular;

  @ContentChildren(AgGridAngular, { descendants: true })
  public agGridList: QueryList<AgGridAngular>;

  private dataStateSub: Subscription;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private dataManagerSvc: SkyDataManagerService) { }

  public ngAfterContentInit(): void {
    this.checkForAgGrid();

    this.agGridList.changes.subscribe(() => this.checkForAgGrid());
  }

  private checkForAgGrid(): void {
    const agGridCount = this.agGridList.length;

    if (agGridCount > 1) {
      throw new Error(
        'A data view may only have one active ag-Grid child component instance at a time.'
      );
    } else if (agGridCount === 0) {
      this.unregisterAgGrid();
    } else if (this.agGridList.first !== this.currentAgGrid) {
      this.registerAgGrid();
    }
  }

  private unregisterAgGrid(): void {
    this.currentAgGrid = undefined;

    if (this.dataStateSub) {
      this.dataStateSub.unsubscribe();
    }
  }

  private registerAgGrid(): void {
    this.unregisterAgGrid();

    const agGrid = this.agGridList.first;

    this.currentAgGrid = agGrid;

    agGrid.gridReady.subscribe(() => {
      this.viewConfig.onSelectAllClick = this.selectAll.bind(this);
      this.viewConfig.onClearAllClick = this.clearAll.bind(this);

      this.displayColumns(this.dataManagerSvc.getCurrentDataState());

      this.dataStateSub = this.dataManagerSvc.getDataStateUpdates(this.viewConfig.id).subscribe((dataState: SkyDataManagerState) => {
        this.displayColumns(dataState);
      });

      agGrid.api.sizeColumnsToFit();
    });

    agGrid.columnMoved.subscribe((event: ColumnMovedEvent) => {
      let columnOrder = agGrid.columnApi.getAllDisplayedVirtualColumns().map(
        col => col.getColDef().colId
      );

      if (event.source !== 'api') {
        const dataState = this.dataManagerSvc.getCurrentDataState();

        const viewState = dataState.getViewStateById(this.viewConfig.id);
        viewState.displayedColumnIds = columnOrder;

        this.dataManagerSvc.updateDataState(
          dataState.addOrUpdateView(this.viewConfig.id, viewState),
          this.viewConfig.id
        );
      }
    });

    agGrid.rowSelected.subscribe((event: RowSelectedEvent) => {
      const row = event.node;
      let dataState = this.dataManagerSvc.getCurrentDataState();
      let selectedIds = dataState.selectedIds;
      const rowIndex = selectedIds.indexOf(row.data.id);

      if (row.isSelected() && rowIndex === -1) {
        selectedIds.push(row.data.id);
      } else if (!row.isSelected() && rowIndex !== -1) {
        selectedIds.splice(rowIndex, 1);
      }

      dataState.selectedIds = selectedIds;
      this.dataManagerSvc.updateDataState(dataState, this.viewConfig.id);
      this.changeDetector.markForCheck();
    });

    agGrid.sortChanged.subscribe(() => {
      const gridSortModel = agGrid.api.getSortModel();
      const dataState = this.dataManagerSvc.getCurrentDataState();
      let sortOption: SkyDataManagerSortOption;

      if (gridSortModel.length) {
        const activeSortModel = gridSortModel[0];
        const activeSortColumn = agGrid.columnApi.getColumn(activeSortModel.colId);
        const dataManagerConfig = this.dataManagerSvc.getCurrentDataManagerConfig();

        sortOption = dataManagerConfig.sortOptions.find((option: SkyDataManagerSortOption) => {
          return option.propertyName === activeSortColumn.getColDef().field &&
            option.descending === (activeSortModel.sort === 'desc');
        });
      }
      dataState.activeSortOption = sortOption;
      this.dataManagerSvc.updateDataState(dataState, this.viewConfig.id);
    });
  }

  private displayColumns(dataState: SkyDataManagerState): void {
    const agGrid = this.currentAgGrid;
    const viewState = dataState.getViewStateById(this.viewConfig.id);
    const displayedColumnIds = viewState.displayedColumnIds || [];
    const columns = agGrid.columnApi.getAllColumns();

    for (const column of columns) {
      const colId = column.getColId();
      const colIndex = displayedColumnIds.indexOf(colId);

      agGrid.columnApi.setColumnVisible(colId, colIndex !== -1);
      agGrid.columnApi.moveColumn(colId, colIndex);
    }
  }

  private selectAll(): void {
    const agGrid = this.agGridList.first;
    agGrid.api.selectAll();
  }

  private clearAll(): void {
    const agGrid = this.agGridList.first;
    agGrid.api.deselectAll();
  }

}
