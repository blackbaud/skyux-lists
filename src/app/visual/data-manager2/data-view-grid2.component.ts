import {
  ChangeDetectionStrategy,
  Component,
  OnInit
} from '@angular/core';

import {
  GridOptions
} from 'ag-grid-community';

import {
  SkyAgGridService
} from '@skyux/ag-grid';

import {
  SkyDataManagerService,
  SkyDataViewConfig
} from '../../public';

import {
  DataManagerVisual2DataService
} from './data-manager-visual2-data.service';

@Component({
  selector: 'app-data-view-grid2',
  templateUrl: './data-view-grid2.component.html',
  styleUrls: ['./data-view-grid2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    DataManagerVisual2DataService
  ]
})
export class DataViewGrid2Component implements OnInit {
  public isActive: boolean;

  public gridOptions: GridOptions;

  public viewConfig: SkyDataViewConfig = {
    id: 'gridView',
    name: 'Grid view',
    icon: 'table',
    columnPickerEnabled: true,
    columnOptions: [
      {
        id: 'col1',
        label: 'Column 1',
        description: 'Description for column 1'
      },
      {
        id: 'col2',
        label: 'Column 2',
        description: 'Description for column 2'
      },
      {
        id: 'col3',
        label: 'Column 3',
        description: 'Description for column 3'
      }
    ]
  };

  public gridInitialized: boolean;

  public displayedItems: any[];

  constructor(
    private agGridSvc: SkyAgGridService,
    private dataManagerSvc: SkyDataManagerService,
    private dataSvc: DataManagerVisual2DataService
  ) { }

  public ngOnInit() {
    this.gridOptions = this.agGridSvc.getGridOptions({
      gridOptions: {
        columnDefs: [
          {
            colId: 'col1',
            field: 'col1',
            headerName: 'Column 1'
          },
          {
            colId: 'col2',
            field: 'col2',
            headerName: 'Column 2'
          },
          {
            colId: 'col3',
            field: 'col3',
            headerName: 'Column 3'
          }
        ]
      }
    });

    this.dataManagerSvc.activeViewId.subscribe((id) => {
      this.isActive = id === this.viewConfig.id;
    });

    this.dataManagerSvc.dataState.subscribe((dataState) => {
      let gridView = dataState.getViewStateById(this.viewConfig.id);

      if (gridView) {
        this.dataSvc.getData().subscribe((data) => {
          this.displayedItems = data.items;
        });

        this.gridInitialized = true;
      }
    });
  }
}
