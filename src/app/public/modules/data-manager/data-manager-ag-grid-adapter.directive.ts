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
  ColumnMovedEvent
} from 'ag-grid-community';

import {
  SkyDataManagerService
} from './data-manager.service';

import {
  SkyDataViewConfig,
  SkyDataManagerState
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
      // this.setViewConfigColumnOptions();

      this.displayColumns(this.dataManagerSvc.dataState.value);

      this.dataStateSub = this.dataManagerSvc.dataState.subscribe((dataState) => {
        this.displayColumns(dataState);
      });

      agGrid.api.sizeColumnsToFit();
    });

    agGrid.columnMoved.subscribe((event: ColumnMovedEvent) => {
      let columnOrder = agGrid.columnApi.getAllDisplayedVirtualColumns().map(
        col => col.getColDef().colId
      );

      if (event.source !== 'api') {
        const dataState = this.dataManagerSvc.dataState.value;

        const viewState = dataState
          .getViewStateById(this.viewConfig.id)
          .setDisplayedColumnIds(columnOrder);

        this.dataManagerSvc.dataState.next(
          dataState.addOrUpdateView(this.viewConfig.id, viewState)
        );
      }
    });
  }

  // private setViewConfigColumnOptions() {
  //   const agGrid = this.currentAgGrid;

  //   const columns = agGrid.columnApi.getAllColumns();

  //   const columnOptions: SkyDataManagerColumnPickerOption[] = [];

  //   for (const column of columns) {
  //     const colId = column.getColId();
  //     const colDef = column.getUserProvidedColDef();

  //     columnOptions.push({
  //       id: colId,
  //       label: colDef.headerName,
  //       description: colDef.refData && colDef.refData.description
  //     });

  //     this.viewConfig.columnOptions = columnOptions;
  //   }
  // }

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

}
