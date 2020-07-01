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
  SkyDataManagerColumnPickerComponent
} from './data-manager-column-picker/data-manager-column-picker.component';

import {
  SkyDataManagerComponent
} from './data-manager.component';

import {
  SkyDataManagerToolbarLeftItemsComponent
} from './data-manager-toolbar/data-manager-toolbar-left-items/data-manager-toolbar-left-items.component';

import {
  SkyDataManagerToolbarRightItemsComponent
} from './data-manager-toolbar/data-manager-toolbar-right-items/data-manager-toolbar-right-items.component';

import {
  SkyDataManagerToolbarSectionComponent
} from './data-manager-toolbar/data-manager-toolbar-section/data-manager-toolbar-section.component';

import {
  SkyDataManagerToolbarComponent
} from './data-manager-toolbar/data-manager-toolbar.component';

import {
  SkyDataViewComponent
} from './data-view.component';

@NgModule({
  declarations: [
    SkyDataManagerColumnPickerComponent,
    SkyDataManagerComponent,
    SkyDataManagerToolbarLeftItemsComponent,
    SkyDataManagerToolbarRightItemsComponent,
    SkyDataManagerToolbarSectionComponent,
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
    SkyDataManagerColumnPickerComponent,
    SkyDataManagerComponent,
    SkyDataManagerToolbarLeftItemsComponent,
    SkyDataManagerToolbarRightItemsComponent,
    SkyDataManagerToolbarSectionComponent,
    SkyDataManagerToolbarComponent,
    SkyDataViewComponent
    ],
  entryComponents: [
    SkyDataManagerColumnPickerComponent
  ],
  providers: [
    SkyUIConfigService
  ]
})
export class SkyDataManagerModule { }
