import {
  NgModule
} from '@angular/core';

import {
  SkyCardModule,
  SkyToolbarModule
} from '@skyux/layout';

import {
  SkyRepeaterModule
} from '../../repeater/repeater.module';

import {
  SkyDataManagerModule
} from '../data-manager.module';

import {
  SkyDataManagerService
} from '../data-manager.service';

@NgModule({
  imports: [
    SkyCardModule,
    SkyDataManagerModule,
    SkyRepeaterModule,
    SkyToolbarModule
  ],
  exports: [
    SkyCardModule,
    SkyDataManagerModule,
    SkyRepeaterModule,
    SkyToolbarModule
  ],
  providers: [
    SkyDataManagerService
  ]
})
export class DataManagerFixtureModule { }
