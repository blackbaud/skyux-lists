import {
  Component,
  Input,
  OnInit
} from '@angular/core';

import {
  SkyDataManagerState,
  SkyDataViewConfig,
  SkyDataManagerService
} from '../../public/modules/data-manager/';

@Component({
  selector: 'data-view-repeater',
  templateUrl: './data-view-repeater.component.html'
})
export class DataViewRepeaterComponent implements OnInit {
  @Input()
  public items: any[];

  public get dataState(): SkyDataManagerState {
    return this._dataState;
  }
  public set dataState(value: SkyDataManagerState) {
    this._dataState = value;
    this.updateData();
    this.dataManagerService.dataState.next(value);
  }

  public viewId = 'repeaterView';
  public viewConfig: SkyDataViewConfig = {
    id: this.viewId,
    name: 'Repeater View',
    icon: 'list',
    searchEnabled: true,
    filterButtonEnabled: true,
    multiselectToolbarEnabled: true,
    onClearAllClick: this.clearAll.bind(this),
    onSelectAllClick: this.selectAll.bind(this)
  };

  public displayedItems: any[];
  public isActive: boolean;

  private _dataState: SkyDataManagerState = new SkyDataManagerState({source: 'defaultState'});

  constructor(private dataManagerService: SkyDataManagerService) {
  }

  public ngOnInit(): void {
    this.displayedItems = this.items;

    this.dataManagerService.dataState.subscribe(state => {
      this._dataState = state;
      this.updateData();
    });

    this.dataManagerService.activeViewId.subscribe(id => {
      this.isActive = id === this.viewId;
    });
  }

  public updateData(): void {
    let selectedIds = this.dataState.selectedIds || [];
    this.items.forEach(item => {
      item.selected = selectedIds.indexOf(item.id) !== -1;
    });
    this.displayedItems = this.filterItems(this.searchItems(this.items));

    if (this.dataState.onlyShowSelected) {
      this.displayedItems = this.displayedItems.filter(item => item.selected);
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
    let selectedIds = this.dataState.selectedIds || [];

    this.displayedItems.forEach(item => {
      if (!item.selected) {
        item.selected = true;
        selectedIds.push(item.id);
      }
    });

    this.dataState = this.dataState.setSelectedIds(selectedIds, this.viewId);
  }

  public clearAll(): void {
    let selectedIds = this.dataState.selectedIds || [];

    this.displayedItems.forEach(item => {
      if (item.selected) {
        let itemIndex = selectedIds.indexOf(item.id);
        item.selected = false;
        selectedIds.splice(itemIndex, 1);
      }
    });
    this.dataState = this.dataState.setSelectedIds(selectedIds, this.viewId);
  }

  public onItemSelect(isSelected: boolean, item: any): void {
    console.log('ugh');
    let selectedItems = this.dataState.selectedIds || [];
    if (isSelected) {
      selectedItems.push(item.id);
    } else {
      let index = selectedItems.indexOf(item.id);
      selectedItems.splice(index, 1);
    }

    this.dataState = this.dataState.setSelectedIds(selectedItems, this.viewId);
  }
}
