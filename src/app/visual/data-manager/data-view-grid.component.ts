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
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent
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
    this.dataManagerService.updateDataState(value, this.viewId);
    this.updateData();
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
        alwaysDisplayed: true,
        label: 'selected'
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
    ]
  };

  public displayedItems: any[];
  public gridApi: GridApi;
  public gridInitialized: boolean;
  public gridOptions: GridOptions;
  public isActive: boolean;

  private _dataState: SkyDataManagerState = new SkyDataManagerState({});

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
          onGridReady: this.onGridReady.bind(this)
        }
      });

    this.dataManagerService.getDataStateSubscription(this.viewId).subscribe(state => {
      this._dataState = state;
      this.setInitialColumnOrder();
      this.updateData();
    });

    this.dataManagerService.activeViewId.subscribe(id => {
        this.isActive = id === this.viewId;
    });
  }

  public updateData(): void {
    this.sortItems();
    this.displayedItems = this.filterItems(this.searchItems(this.items));

    if (this.dataState.onlyShowSelected) {
      this.displayedItems = this.displayedItems.filter(item => item.selected);
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

    this.gridInitialized = true;
  }

  public onGridReady(event: GridReadyEvent): void {
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
}
