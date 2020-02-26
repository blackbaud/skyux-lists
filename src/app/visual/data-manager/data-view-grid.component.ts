import {
  Component,
  Input,
  OnInit
} from '@angular/core';

import {
  SkyAgGridService,
  SkyCellType
} from '@skyux/ag-grid';

import {
  ColumnApi,
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ColumnMovedEvent,
  RowSelectedEvent
} from 'ag-grid-community';

import {
  SkyDataManagerState,
  SkyDataViewConfig,
  SkyDataManagerService
} from '../../public/modules/data-manager/';

@Component({
  selector: 'data-view-grid',
  templateUrl: './data-view-grid.component.html'
})
export class DataViewGridComponent implements OnInit {

  @Input()
  public items: any[];

  public viewId = 'gridView';

  public columnDefs: ColDef[] = [
    {
      colId: 'selected',
      field: 'selected',
      headerName: '',
      maxWidth: 50,
      type: SkyCellType.RowSelector,
      suppressMovable: true,
      lockPosition: true,
      lockVisible: true
    },
    {
      colId: 'name',
      field: 'name',
      headerName: 'Fruit name',
      width: 150
    },
    {
      colId: 'description',
      field: 'description',
      headerName: 'Description'
    }
  ];

  public get dataState(): SkyDataManagerState {
    return this._dataState;
  }
  public set dataState(value: SkyDataManagerState) {
    this._dataState = value;
    this.dataManagerService.dataState.next(value);
    if (value.source !== this.viewId) {
      this.updateData();
    }
  }

  public viewConfig: SkyDataViewConfig = {
    id: this.viewId,
    name: 'Grid View',
    icon: 'table',
    searchEnabled: true,
    sortEnabled: true,
    multiselectToolbarEnabled: true,
    columnPickerEnabled: true,
    filterButtonEnabled: true,
    columnOptions: [
      {
        id: 'selected',
        alwaysDisplayed: true
      },
      {
        id: 'name',
        label: 'Fruit name',
        description: 'The name of the fruit.'
      },
      {
        id: 'description',
        label: 'Description',
        description: 'Some information about the fruit.'
      }
    ],
    onClearAllClick: this.clearAll.bind(this),
    onSelectAllClick: this.selectAll.bind(this)
  };

  public colApi: ColumnApi;
  public columnsReady = false;
  public displayedItems: any[];
  public gridApi: GridApi;
  public gridOptions: GridOptions;
  public isActive: boolean;

  private _dataState: SkyDataManagerState = new SkyDataManagerState({source: 'defaultState'});

  constructor(
    private agGridService: SkyAgGridService,
    private dataManagerService: SkyDataManagerService
  ) {}

  public ngOnInit(): void {
    this.displayedItems = this.items;
    this.gridOptions = this.agGridService.getGridOptions(
      {
        gridOptions: {
          columnDefs: this.columnDefs,
          onGridReady: this.onGridReady.bind(this),
          onColumnMoved: this.onColumnMove.bind(this),
          onRowSelected: this.onRowSelectionChange.bind(this)
        }
      });

    this.dataManagerService.dataState.subscribe(state => {
      this._dataState = state;
      this.setInitialColumnOrder();

      if (state.source !== this.viewId) {
        this.updateData();
      }
    });

    this.dataManagerService.activeViewId.subscribe(id => {
        this.isActive = id === this.viewId;
    });
  }

  public updateData(): void {
    this.displayColumns();
    this.sortItems();
    this.displayedItems = this.filterItems(this.searchItems(this.items));

    if (this.dataState.onlyShowSelected) {
      this.displayedItems = this.displayedItems.filter(item => item.selected);
    }
  }

  public displayColumns(): void {
    if (this.colApi) {
      let viewState = this.dataState.getViewStateById(this.viewId);
      let visibleColumns = viewState.displayedColumnIds;
      this.columnDefs.forEach((col: ColDef) => {
        let colIndex = visibleColumns.indexOf(col.colId);
        this.colApi.setColumnVisible(col.colId, colIndex !== -1);
        this.colApi.moveColumn(col.colId, colIndex);
      });
    }
  }

  public setInitialColumnOrder(): void {
    let viewState = this.dataState.getViewStateById(this.viewId);
    let visibleColumns = viewState.displayedColumnIds;

    this.columnDefs.sort((col1, col2) => {
        let col1Index = visibleColumns.findIndex(colId => colId === col1.colId);
        let col2Index = visibleColumns.findIndex(colId => colId === col2.colId);

        if (col1Index === -1) {
          col1.hide = true;
          return 0;
        } else if (col2Index === -1) {
          col2.hide = true;
          return 0;
        } else {
          return col1Index - col2Index;
        }
    });

    this.columnsReady = true;
  }

  public onColumnMove(event: ColumnMovedEvent): void {
    if (event.source !== 'api') {
      let columnOrder = this.colApi.getAllDisplayedVirtualColumns().map(col => col.getColDef().colId);
      let viewState = this.dataState.getViewStateById(this.viewId);

      viewState = viewState.setDisplayedColumnIds(columnOrder);
      this.dataState = this.dataState.addOrUpdateView(this.viewId, viewState, this.viewId);
    }
  }

  public onGridReady(event: GridReadyEvent): void {
    this.colApi = event.columnApi;
    this.gridApi = event.api;
    this.gridApi.sizeColumnsToFit();
    this.updateData();
  }

  public sortItems(): void {
    let sortOption = this.dataState.activeSortOption;
    if (this.gridApi && sortOption) {
      this.gridApi.setSortModel([{
        colId: sortOption.propertyName,
        sort: sortOption.descending ? 'desc' : 'asc'
      }]);
    }
  }

  public searchItems(items: any[]): any[] {
    let searchedItems = items;
    let searchText = this.dataState && this.dataState.searchText;

    if (searchText) {
      searchedItems = items.filter(function (item: any) {
        let property: any;

        for (property in item) {
          if (item.hasOwnProperty(property) && (property === 'name' || property === 'description')) {
            const propertyText = item[property].toLowerCase();
            if (propertyText.indexOf(searchText) > -1) {
              return true;
            }
          }
        }

        return false;
      });
    }
    return searchedItems;
  }

  public filterItems(items: any[]): any[] {
    let filteredItems = items;
    let filterData = this.dataState && this.dataState.filterData;

    if (filterData) {
      filteredItems = items.filter((item: any) => {
        if (((filterData.hideOrange && item.color !== 'orange') || !filterData.hideOrange) &&
            ((filterData.type !== 'any' && item.type === filterData.type) || (!filterData.type || filterData.type === 'any'))) {
              return true;
            }
        return false;
      });
    }

    return filteredItems;
  }

  public selectAll(): void {
    this.gridApi.selectAll();
  }

  public clearAll(): void {
    this.gridApi.deselectAll();
  }

  public onRowSelectionChange(event: RowSelectedEvent): void {
    let selectedIds = this.gridApi.getSelectedNodes().map(row => row.data.id);
    this.dataState = this.dataState.setSelectedIds(selectedIds, this.viewId);
  }
}
