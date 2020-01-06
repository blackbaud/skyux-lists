import {
  SkyDataManagerSortOption
} from './data-manager-sort-option';

import {
  SkyDataManagerColumnPickerOption
} from './data-manager-column-picker-option';

export class SkyDataViewConfig {
  public columnPickerEnabled?: boolean;
  public columnOptions?: SkyDataManagerColumnPickerOption[];
  public filterButtonEnabled?: boolean;
  public icon?: string;
  public id: string;
  public isActive: boolean;
  public name: string;
  public searchEnabled?: boolean;
  public sortEnabled?: boolean;
  public sortOptions?: SkyDataManagerSortOption[];
}
