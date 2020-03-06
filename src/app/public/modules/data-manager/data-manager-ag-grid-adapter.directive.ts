import {
  AfterContentInit,
  Directive,
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
  SortChangedEvent
} from 'ag-grid-community';

import {
  SkyDataManagerService
} from './data-manager.service';

import {
  SkyDataViewConfig,
  SkyDataManagerState,
  SkyDataManagerSortOption
} from './models';

@Directive({
  selector: '[skyAgGridDataManager]'
})
export class SkyAgGridDataManagerAdapterDirective implements AfterContentInit {

  @Input()
  public viewConfig: SkyDataViewConfig;

  private currentAgGrid: AgGridAngular;

  @ContentChildren(AgGridAngular, { descendants: true })
  public agGridList: QueryList<AgGridAngular>;

  private dataStateSub: Subscription;

  constructor(private dataManagerSvc: SkyDataManagerService) { }

  public ngAfterContentInit() {
    this.checkForAgGrid();

    this.agGridList.changes.subscribe(() => this.checkForAgGrid());
  }

  private checkForAgGrid() {
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

  private unregisterAgGrid() {
    this.currentAgGrid = undefined;

    if (this.dataStateSub) {
      this.dataStateSub.unsubscribe();
    }
  }

  private registerAgGrid() {
    this.unregisterAgGrid();

    const agGrid = this.agGridList.first;

    this.currentAgGrid = agGrid;

    agGrid.gridReady.subscribe(() => {
      this.viewConfig.onSelectAllClick = this.selectAll.bind(this);
      this.viewConfig.onClearAllClick = this.clearAll.bind(this);

      this.displayColumns(this.dataManagerSvc.getCurrentDataState());

      this.dataStateSub = this.dataManagerSvc.getDataStateSubscription(this.viewConfig.id).subscribe((dataState) => {
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

        const viewState = dataState
          .getViewStateById(this.viewConfig.id)
          .setDisplayedColumnIds(columnOrder);

        this.dataManagerSvc.updateDataState(
          dataState.addOrUpdateView(this.viewConfig.id, viewState),
          this.viewConfig.id
        );
      }
    });

    agGrid.rowSelected.subscribe(() => {
      const selectedIds = agGrid.api.getSelectedNodes().map(row => row.data.id);
      const dataState = this.dataManagerSvc.getCurrentDataState();
      this.dataManagerSvc.updateDataState(
        dataState.setSelectedIds(selectedIds),
        this.viewConfig.id
      );
    });

    agGrid.sortChanged.subscribe((event: SortChangedEvent) => {
      const gridSortModel = agGrid.api.getSortModel();
      const dataState = this.dataManagerSvc.getCurrentDataState();
      let sortOption: SkyDataManagerSortOption;

      if (gridSortModel.length) {
        const activeSortModel = gridSortModel[0];
        const activeSortColumn = agGrid.columnApi.getColumn(activeSortModel.colId);
        const dataManagerConfig = this.dataManagerSvc.dataManagerConfig.value;

        sortOption = dataManagerConfig.sortOptions.find(option => {
          return option.propertyName === activeSortColumn.getColDef().field &&
            option.descending === (activeSortModel.sort === 'desc');
        });
      }
      this.dataManagerSvc.updateDataState(
        dataState.setActiveSortOption(sortOption),
        this.viewConfig.id
        );
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
