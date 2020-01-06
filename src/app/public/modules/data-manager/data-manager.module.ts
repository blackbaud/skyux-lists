import {
  NgModule
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  CommonModule
} from '@angular/common';

import {
  SkyFilterModule
} from '../filter';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyRadioModule
} from '@skyux/forms';

import {
  SkyRepeaterModule
} from '../repeater';

import {
  SkyModalModule
} from '@skyux/modals';

import {
  SkySearchModule
} from '@skyux/lookup';

import {
  SkySortModule
} from '../sort';

import {
  SkyToolbarModule
} from '@skyux/layout';

import {
  SkyDataManagerColumnPickerComponent
} from './data-manager-column-picker/data-manager-column-picker.component';

import {
  SkyDataManagerColumnPickerModalComponent
} from './data-manager-column-picker/data-manager-column-picker-modal.component';

import {
  SkyDataManagerComponent
} from './data-manager.component';

import {
  SkyDataManagerFilterButtonComponent
} from './data-manager-filter-button/data-manager-filter-button.component';

import {
  SkyDataManagerSearchComponent
} from './data-manager-search/data-manager-search.component';

import {
  SkyDataManagerSortComponent
} from './data-manager-sort/data-manager-sort.component';

import {
  SkyDataManagerViewSwitcherComponent
} from './data-manager-view-switcher/data-manager-view-switcher.component';

import {
  SkyDataViewComponent
} from './data-view.component';

@NgModule({
  declarations: [
    SkyDataManagerColumnPickerComponent,
    SkyDataManagerColumnPickerModalComponent,
    SkyDataManagerComponent,
    SkyDataManagerFilterButtonComponent,
    SkyDataManagerSearchComponent,
    SkyDataManagerSortComponent,
    SkyDataManagerViewSwitcherComponent,
    SkyDataViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyFilterModule,
    SkyIconModule,
    SkyModalModule,
    SkyRadioModule,
    SkyRepeaterModule,
    SkySearchModule,
    SkySortModule,
    SkyToolbarModule
  ],
  exports: [
    SkyDataManagerColumnPickerComponent,
    SkyDataManagerColumnPickerModalComponent,
    SkyDataManagerComponent,
    SkyDataManagerFilterButtonComponent,
    SkyDataManagerSearchComponent,
    SkyDataManagerSortComponent,
    SkyDataManagerViewSwitcherComponent,
    SkyDataViewComponent
  ],
  entryComponents: [
    SkyDataManagerColumnPickerModalComponent
  ]
})
export class SkyDataManagerModule { }
