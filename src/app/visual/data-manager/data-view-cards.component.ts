import {
  Component,
  Input,
  EventEmitter,
  Output
} from '@angular/core';

import {
  SkyDataManagerState,
  SkyDataViewConfig
} from '../../public/modules/data-manager/';
import { SkyDataManagerFiltersModalDemoComponent } from './data-filter-modal.component';

@Component({
  selector: 'data-view-cards',
  templateUrl: './data-view-cards.component.html'
})
export class DataViewCardsComponent {

  public get dataState(): SkyDataManagerState {
    return this._dataState;
  }

  @Input()
  public set dataState(state: SkyDataManagerState) {
    this._dataState = state;
    this.displayedItems = this.sortItems(this.filterItems(this.searchItems(this.items)));
  }

  public viewConfig: SkyDataViewConfig = {
    id: 'cardsView',
    name: 'Cards View',
    icon: 'th-large',
    sortEnabled: true,
    searchEnabled: true,
    filterButtonEnabled: true,
    filterModalComponent: SkyDataManagerFiltersModalDemoComponent,
    showSortButtonText: true,
    sortOptions: [
      {
        id: 'az',
        label: 'Name (A - Z)',
        descending: false,
        propertyName: 'name'
      },
      {
        id: 'za',
        label: 'Name (Z - A)',
        descending: true,
        propertyName: 'name'
      }
    ]
  };

  public items: any[] = [
    {
      name: 'Orange',
      description: 'A round, orange fruit. A great source of vitamin C.',
      type: 'citrus',
      color: 'orange'
    },
    {
      name: 'Mango',
      description: 'Very difficult to peel. Delicious in smoothies, but don\'t eat the skin.',
      type: 'other',
      color: 'orange'
    },
    {
      name: 'Lime',
      description: 'A sour, green fruit used in many drinks. It grows on trees.',
      type: 'citrus',
      color: 'green'
    },
    {
      name: 'Strawberry',
      description: 'A red fruit that goes well with shortcake. It is the name of both the fruit and the plant!',
      type: 'berry',
      color: 'red'
    },
    {
      name: 'Blueberry',
      description: 'A small, blue fruit often found in muffins. When not ripe, they can be sour.',
      type: 'berry',
      color: 'blue'
    },
    {
      name: 'Banana',
      description: 'A yellow fruit with a thick skin. Monkeys love them, and in some countries it is customary to eat the peel.',
      type: 'other',
      color: 'yellow'
    }
  ];

  public get isActive(): boolean {
    return this._isActive;
  }

  public set isActive(value: boolean) {
    this._isActive = value;

    if (value) {
      this.activeViewChange.emit(this.viewConfig);
    }
  }

  @Output()
  public activeViewChange: EventEmitter<SkyDataViewConfig> = new EventEmitter<SkyDataViewConfig>();

  private _dataState: SkyDataManagerState;
  private _isActive: boolean = false;

  public displayedItems = this.items;

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
    this.dataState = this.dataState.setSearchText('be');
  }
}
