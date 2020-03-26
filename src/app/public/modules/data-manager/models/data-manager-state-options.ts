import {
  SkyDataManagerFilterData,
  SkyDataManagerSortOption,
  SkyDataViewStateOptions
} from '.';

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
