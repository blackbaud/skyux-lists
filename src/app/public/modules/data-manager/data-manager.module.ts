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
  SkyI18nModule
} from '@skyux/i18n';

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
} from '../filter/filter.module';

import {
  SkyRepeaterModule
} from '../repeater/repeater.module';

import {
  SkySortModule
} from '../sort/sort.module';

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
    SkyI18nModule,
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
  ],
  providers: [
    SkyUIConfigService
  ]
})
export class SkyDataManagerModule { }
