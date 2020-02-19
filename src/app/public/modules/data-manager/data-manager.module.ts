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
  SkyUIConfigService
} from '@skyux/core';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyCheckboxModule,
  SkyRadioModule
} from '@skyux/forms';

import {
  SkyToolbarModule
} from '@skyux/layout';

import {
  SkySearchModule
} from '@skyux/lookup';

import {
  SkyModalModule
} from '@skyux/modals';

import {
  SkyFilterModule
} from '../filter';

import {
  SkyRepeaterModule
} from '../repeater';

import {
  SkySortModule
} from '../sort';

import {
  SkyDataManagerColumnPickerModalComponent
} from './data-manager-column-picker/data-manager-column-picker-modal.component';

import {
  SkyDataManagerComponent
} from './data-manager.component';

import {
  SkyDataManagerLeftItemsComponent
} from './data-manager-left-items/data-manager-left-items.component';

import {
  SkyDataManagerRightItemsComponent
} from './data-manager-right-items/data-manager-right-items.component';

import {
  SkyDataManagerSectionComponent
} from './data-manager-section/data-manager-section.component';

import {
  SkyDataManagerToolbarComponent
} from './data-manager-toolbar/data-manager-toolbar.component';

import {
  SkyDataViewComponent
} from './data-view.component';

@NgModule({
  providers: [
    SkyUIConfigService
  ],
  declarations: [
    SkyDataManagerColumnPickerModalComponent,
    SkyDataManagerComponent,
    SkyDataManagerLeftItemsComponent,
    SkyDataManagerRightItemsComponent,
    SkyDataManagerSectionComponent,
    SkyDataManagerToolbarComponent,
    SkyDataViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyCheckboxModule,
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
    SkyDataManagerColumnPickerModalComponent,
    SkyDataManagerComponent,
    SkyDataManagerLeftItemsComponent,
    SkyDataManagerRightItemsComponent,
    SkyDataManagerSectionComponent,
    SkyDataManagerToolbarComponent,
    SkyDataViewComponent
  ],
  entryComponents: [
    SkyDataManagerColumnPickerModalComponent
  ]
})
export class SkyDataManagerModule { }
