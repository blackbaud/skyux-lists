import {
  SkyDataManagerEvent,
  SkyDataManagerSortOption,
  SkyDataViewStateOptions
} from '.';

export interface SkyDataManagerStateOptions {
  activeSortOption?: SkyDataManagerSortOption;
  activeViewId?: string;
  additionalData?: any;
  event?: SkyDataManagerEvent | string;
  filterData?: any;
  onlyShowSelected?: boolean;
  searchText?: string;
  selectedIds?: string[];
  views?: SkyDataViewStateOptions[];
}
