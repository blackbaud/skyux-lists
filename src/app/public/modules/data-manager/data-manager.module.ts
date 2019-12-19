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
  SkyToolbarModule
} from '@skyux/layout';

import {
  SkySearchModule
} from '@skyux/lookup';

import {
  SkyRadioModule
} from '@skyux/forms';

import {
  SkyDataManagerComponent
} from './data-manager.component';

import {
  SkyDataManagerSearchComponent
} from './data-manager-search.component';

import {
  SkyDataManagerViewSwitcherComponent
} from './data-manager-view-switcher.component';

import {
  SkyDataViewComponent
} from './data-view.component';

@NgModule({
  declarations: [
    SkyDataManagerComponent,
    SkyDataManagerSearchComponent,
    SkyDataManagerViewSwitcherComponent,
    SkyDataViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyRadioModule,
    SkySearchModule,
    SkyToolbarModule
  ],
  exports: [
    SkyDataManagerComponent,
    SkyDataManagerSearchComponent,
    SkyDataManagerViewSwitcherComponent,
    SkyDataViewComponent
  ]
})
export class SkyDataManagerModule { }
