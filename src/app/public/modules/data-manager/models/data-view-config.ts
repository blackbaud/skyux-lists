import {
  SkyDataManagerColumnPickerOption
} from './data-manager-column-picker-option';

export interface SkyDataViewConfig {
  additionalOptions?: Object;
  columnOptions?: SkyDataManagerColumnPickerOption[];
  columnPickerEnabled?: boolean;
  filterButtonEnabled?: boolean;
  icon?: string;
  id: string;
  multiselectToolbarEnabled?: boolean;
  name: string;
  onClearAllClick?: Function;
  onSelectAllClick?: Function;
  searchEnabled?: boolean;
  searchExpandMode?: string;
  showFilterButtonText?: boolean;
  showSortButtonText?: boolean;
  sortEnabled?: boolean;
}
