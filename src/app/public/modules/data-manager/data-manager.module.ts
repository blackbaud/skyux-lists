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
  SkyDataManagerToolbarItemComponent
} from './data-manager-toolbar/data-manager-toolbar-item/data-manager-toolbar-item.component';

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
    SkyDataManagerToolbarItemComponent,
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
    SkyDataManagerColumnPickerModalComponent,
    SkyDataManagerComponent,
    SkyDataManagerLeftItemsComponent,
    SkyDataManagerRightItemsComponent,
    SkyDataManagerSectionComponent,
    SkyDataManagerToolbarComponent,
    SkyDataManagerToolbarItemComponent,
    SkyDataViewComponent
  ],
  entryComponents: [
    SkyDataManagerColumnPickerModalComponent
  ]
})
export class SkyDataManagerModule { }
