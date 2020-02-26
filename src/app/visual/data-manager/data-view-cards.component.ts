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
  selector: 'data-view-cards',
  templateUrl: './data-view-cards.component.html'
})
export class DataViewCardsComponent implements OnInit {
  @Input()
  public items: any[];

  public get dataState(): SkyDataManagerState {
    return this._dataState;
  }

  public set dataState(state: SkyDataManagerState) {
    this._dataState = state;
    this.displayedItems = this.sortItems(this.filterItems(this.searchItems(this.items)));
  }

  public viewId = 'cardsView';
  public viewConfig: SkyDataViewConfig = {
    id: this.viewId,
    name: 'Cards View',
    icon: 'th-large',
    sortEnabled: true,
    searchEnabled: true,
    filterButtonEnabled: true,
    showSortButtonText: true
  };

  private _dataState: SkyDataManagerState;

  public displayedItems: any[];

  constructor(private dataManagerService: SkyDataManagerService) {}

  public ngOnInit(): void {
    this.displayedItems = this.items;

    this.dataManagerService.dataState.subscribe(state => {
      this.dataState = state;
    });
  }

  public sortItems(items: any[]): any[] {
    let result = items;
    let sortOption = this.dataState && this.dataState.activeSortOption;

    if (sortOption) {
      result = items.sort(function (a: any, b: any) {
        let descending = sortOption.descending ? -1 : 1,
          sortProperty = sortOption.propertyName;

        if (a[sortProperty] > b[sortProperty]) {
          return (descending);
        } else if (a[sortProperty] < b[sortProperty]) {
          return (-1 * descending);
        } else {
          return 0;
        }
      });
    }

    return result;
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

  public searchBe() {
    this.dataManagerService.dataState.next(this.dataState.setSearchText('be', this.viewId));
  }
}
