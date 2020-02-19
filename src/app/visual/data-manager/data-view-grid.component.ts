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
  ColumnMovedEvent
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
  public isActive: boolean;

  public columnDefs = [
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
    this.updateData();
  }

  public gridOptions: GridOptions;

  public viewConfig: SkyDataViewConfig = {
    id: 'gridView',
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

  public displayedItems: any[];
  public gridApi: GridApi;
  public colApi: ColumnApi;

  private _dataState: SkyDataManagerState = new SkyDataManagerState();

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
          onGridReady: (event: GridReadyEvent) => {
            this.colApi = event.columnApi;
            this.gridApi = event.api;
            this.gridApi.sizeColumnsToFit();
            this.updateData();
          },
          onColumnMoved: (event: ColumnMovedEvent) => {
            let columnOrder = this.colApi.getAllDisplayedVirtualColumns().map(col => col.getColDef().colId);
            if (event.source !== 'api') {
            let viewState = this.dataState.getViewStateById('gridView');

            viewState = viewState.setDisplayedColumnIds(columnOrder);
            this.dataState = this.dataState.addOrUpdateView('gridView', viewState);
          }
        }
        }
      });

    this.dataManagerService.dataState.subscribe(state => {
      this._dataState = state;
      this.updateData();
    });

    this.dataManagerService.activeViewId.subscribe(id => {
        this.isActive = id === 'gridView';
    });
  }

  public updateData(): void {
    this.displayColumns();
    this.sortItems();
    this.displayedItems = this.filterItems(this.searchItems(this.items));
  }

  public displayColumns(): void {
    let viewState = this.dataState.getViewStateById('gridView');
    if (this.colApi) {
      let visibleColumns = viewState.displayedColumnIds;
      console.log(visibleColumns);
      this.columnDefs.forEach((col: ColDef) => {
        let colIndex = visibleColumns.indexOf(col.colId);
        this.colApi.setColumnVisible(col.colId, colIndex !== -1);
        this.colApi.moveColumn(col.colId, colIndex);
      });
    }
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
    this.displayedItems.forEach(item => {
      item.selected = true;
    });
    this.gridApi.selectAll();
  }

  public clearAll(): void {
    this.displayedItems.forEach(item => {
      item.selected = false;
    });
    this.gridApi.deselectAll();
  }
}
