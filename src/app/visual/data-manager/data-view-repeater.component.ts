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
    this.displayedItems = this.filterItems(this.searchItems(this.items));
  }

  public viewConfig: SkyDataViewConfig = {
    id: 'repeaterView',
    name: 'Repeater View',
    icon: 'list',
    searchEnabled: true,
    filterButtonEnabled: true,
    multiselectToolbarEnabled: true,
    onClearAllClick: this.clearAll.bind(this),
    onSelectAllClick: this.selectAll.bind(this)
  };

  public displayedItems: any[];

  private _dataState: SkyDataManagerState = new SkyDataManagerState();

  constructor(private dataManagerService: SkyDataManagerService) {
  }

  public ngOnInit(): void {
    this.displayedItems = this.items;

    this.dataManagerService.dataState.subscribe(state => {
      this.dataState = state;
    });
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
  }

  public clearAll(): void {
    this.displayedItems.forEach(item => {
      item.selected = false;
    });
  }
}
