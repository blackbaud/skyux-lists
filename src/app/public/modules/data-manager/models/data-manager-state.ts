import {
  SkyDataManagerFilter
} from './data-manager-filter';

import {
  SkyDataManagerSortOption
} from './data-manager-sort-option';

import {
  SkyDataManagerEvent
} from './data-manager-event';

export class SkyDataState {
  public activeSortOption: SkyDataManagerSortOption;
  public appliedFilters: SkyDataManagerFilter[];
  public eventSource: SkyDataManagerEvent;
  public searchText: string;
  public selectedColumnIds: string[];

  constructor(data?: any) {
    if (data) {
      this.activeSortOption = data.activeSortOption;
      this.appliedFilters = data.appliedFilters;
      this.eventSource = data.eventSource;
      this.searchText = data.searchText;
      this.selectedColumnIds = data.selectedColumnIds;
    }
  }
}
