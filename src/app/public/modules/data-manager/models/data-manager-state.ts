import {
  SkyDataManagerSortOption
} from './data-manager-sort-option';

import {
  SkyDataManagerEvent
} from './data-manager-event';

export class SkyDataManagerState {
  public activeSortOption: SkyDataManagerSortOption;
  public additionalData: any;
  public filterData: any;
  public event: SkyDataManagerEvent | string;
  public searchText: string;
  public selectedColumnIds: string[];

  constructor(
    data?: {
      activeSortOption?: SkyDataManagerSortOption,
      additionalData?: any,
      filterData?: any,
      event?: SkyDataManagerEvent | string,
      searchText?: string,
      selectedColumnIds?: string[]
    }
  ) {
    if (data) {
      this.activeSortOption = data.activeSortOption;
      this.additionalData = data.additionalData;
      this.filterData = data.filterData;
      this.event = data.event;
      this.searchText = data.searchText;
      this.selectedColumnIds = data.selectedColumnIds;
    }
  }

  public setActiveSortOption(option: SkyDataManagerSortOption): SkyDataManagerState {
    return new SkyDataManagerState({
      activeSortOption: option,
      additionalData: this.additionalData,
      filterData: this.filterData,
      event: SkyDataManagerEvent.Sort,
      searchText: this.searchText,
      selectedColumnIds: this.selectedColumnIds
    });
  }

  public setAdditionalData(data: any, event?: string): SkyDataManagerState {
    return new SkyDataManagerState({
      activeSortOption: this.activeSortOption,
      additionalData: data,
      filterData: this.filterData,
      event: event,
      searchText: this.searchText,
      selectedColumnIds: this.selectedColumnIds
    });
  }

  public setFilterData(filters: any): SkyDataManagerState {
    return new SkyDataManagerState({
      activeSortOption: this.activeSortOption,
      additionalData: this.additionalData,
      filterData: filters,
      event: SkyDataManagerEvent.Filter,
      searchText: this.searchText,
      selectedColumnIds: this.selectedColumnIds
    });
  }

  public setSearchText(text: string): SkyDataManagerState {
    return new SkyDataManagerState({
      activeSortOption: this.activeSortOption,
      additionalData: this.additionalData,
      filterData: this.filterData,
      event: SkyDataManagerEvent.Search,
      searchText: text,
      selectedColumnIds: this.selectedColumnIds
    });
  }

  public setSelectedColumnIds(ids: string[]): SkyDataManagerState {
    return new SkyDataManagerState({
      activeSortOption: this.activeSortOption,
      additionalData: this.additionalData,
      filterData: this.filterData,
      event: SkyDataManagerEvent.ColumnPicker,
      searchText: this.searchText,
      selectedColumnIds: ids
    });
  }
}
