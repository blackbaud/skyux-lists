import {
  SkyDataManagerSortOption
} from './data-manager-sort-option';

export interface SkyDataManagerConfig {
  additionalOptions?: Object;
  filterModalComponent?: any;
  sortOptions?: SkyDataManagerSortOption[];
}
