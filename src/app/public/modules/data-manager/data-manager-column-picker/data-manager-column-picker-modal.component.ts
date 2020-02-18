import {
  Component,
  OnInit
} from '@angular/core';

import {
  SkyModalInstance
} from '@skyux/modals';

import {
  SkyDataManagerColumnPickerModalContext
} from './data-manager-column-picker-modal-context';

import {
  SkyDataManagerService
} from '../data-manager.service';

import {
  SkyDataManagerState,
  SkyDataViewConfig
} from '../models';

class Column {
  public id: string;
  public label: string;
  public isSelected: boolean;
  public description?: string;
}

@Component({
  selector: 'sky-data-manager-column-picker-modal',
  templateUrl: './data-manager-column-picker-modal.component.html',
  providers: [SkyDataManagerService]
})
export class SkyDataManagerColumnPickerModalComponent implements OnInit {
  public get dataState(): SkyDataManagerState {
    return this._dataState;
  }

  public set dataState(value: SkyDataManagerState) {
    this._dataState = value;
    this.displayedColumnData = this.searchColumns(this.columnData);
  }

  public title = 'Choose columns to show in the list';
  public columnData: Column[];
  public displayedColumnData: Column[];
  public viewConfig: SkyDataViewConfig = {
    id: 'columnPicker',
    name: 'Column Picker',
    searchEnabled: true,
    searchExpandMode: 'fit',
    multiselectToolbarEnabled: true,
    onSelectAllClick: this.selectAll.bind(this),
    onClearAllClick: this.clearAll.bind(this)
  };

  private _dataState: SkyDataManagerState;

  constructor(
    public context: SkyDataManagerColumnPickerModalContext,
    public dataManagerService: SkyDataManagerService,
    public instance: SkyModalInstance
  ) { }

  public ngOnInit(): void {
    this.columnData = this.context.columnOptions.map(columnOption => {
      return {
        id: columnOption.id,
        label: columnOption.label,
        description: columnOption.description,
        isSelected: this.isSelected(columnOption.id)
      };
    });

    this.dataManagerService.dataState.subscribe(state => {
      this.dataState = state;
    });
  }

  public searchColumns(columns: Column[]): Column[] {
    let searchedColumns = columns;
    let searchText = this.dataState && this.dataState.searchText;

    if (searchText) {
      searchedColumns = columns.filter(function (item: any) {
        let property: any;

        for (property in item) {
          if (item.hasOwnProperty(property) && (property === 'label' || property === 'description')) {
            const propertyText = item[property].toLowerCase();
            if (propertyText.indexOf(searchText) > -1) {
              return true;
            }
          }
        }

        return false;
      });
    }
    return searchedColumns;
  }

  public selectAll(): void {
    this.displayedColumnData.forEach(column => column.isSelected = true);
  }

  public clearAll(): void {
    this.displayedColumnData.forEach(column => column.isSelected = false);
  }

  public cancelChanges(): void {
    this.instance.cancel();
  }

  public isSelected(id: string) {
    return this.context.displayedColumnIds.findIndex(colId => colId === id) !== -1;
  }

  public applyChanges(): void {
    this.instance.save(this.columnData.filter(col => col.isSelected));
  }
}
