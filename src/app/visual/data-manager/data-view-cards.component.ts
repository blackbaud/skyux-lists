import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit
} from '@angular/core';

import {
  SkyDataManagerState,
  SkyDataViewConfig,
  SkyDataManagerService
} from '../../public/public_api';

@Component({
  selector: 'data-view-cards',
  templateUrl: './data-view-cards.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataViewCardsComponent implements OnInit {
  @Input()
  public items: any[];

  public dataState: SkyDataManagerState;
  public displayedItems: any[];
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

  constructor(
    private changeDetector: ChangeDetectorRef,
    private dataManagerService: SkyDataManagerService
    ) { }

  public ngOnInit(): void {
    this.displayedItems = this.items;

    this.dataManagerService.initDataView(this.viewConfig);

    this.dataManagerService.getDataStateUpdates(this.viewId).subscribe(state => {
      this.dataState = state;
      this.displayedItems = this.sortItems(this.filterItems(this.searchItems(this.items)));
      this.changeDetector.detectChanges();
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

    if (filterData && filterData.filters) {
      let filters = filterData.filters;
      filteredItems = items.filter((item: any) => {
        if (((filters.hideOrange && item.color !== 'orange') || !filters.hideOrange) &&
            ((filters.type !== 'any' && item.type === filters.type) || (!filters.type || filters.type === 'any'))) {
              return true;
            }
        return false;
      });
    }

    return filteredItems;
  }

  public searchBe() {
    this.dataState.searchText = 'be';
    this.dataManagerService.updateDataState(this.dataState, 'searchButton');
  }
}
