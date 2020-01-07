import {
  SkyDataManagerSortOption
} from './data-manager-sort-option';

import {
  SkyDataManagerColumnPickerOption
} from './data-manager-column-picker-option';

export class SkyDataViewConfig {
  public columnOptions?: SkyDataManagerColumnPickerOption[];
  public columnPickerEnabled?: boolean;
  public filterButtonEnabled?: boolean;
  public icon?: string;
  public id: string;
  public isActive: boolean;
  public name: string;
  public searchEnabled?: boolean;
  public showFilterButtonText?: boolean;
  public showSortButtonText?: boolean;
  public sortEnabled?: boolean;
  public sortOptions?: SkyDataManagerSortOption[];
}
