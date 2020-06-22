import {
  SkyDataManagerFilterData
} from './data-manager-filter-data';

import {
  SkyDataManagerSortOption
} from './data-manager-sort-option';

import {
  SkyDataViewStateOptions
} from './data-view-state-options';

export interface SkyDataManagerStateOptions {
  activeSortOption?: SkyDataManagerSortOption;
  activeViewId?: string;
  additionalData?: any;
  filterData?: SkyDataManagerFilterData;
  onlyShowSelected?: boolean;
  searchText?: string;
  selectedIds?: string[];
  views?: SkyDataViewStateOptions[];
}
