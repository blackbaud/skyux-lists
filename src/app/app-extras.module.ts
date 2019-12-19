import {
  NgModule
} from '@angular/core';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyCardModule,
  SkyFluidGridModule
} from '@skyux/layout';

import {
  SkyDropdownModule
} from '@skyux/popovers';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyToolbarModule
} from '@skyux/layout';

import {
  SkyDataManagerModule,
  SkyFilterModule,
  SkyInfiniteScrollModule,
  SkyPagingModule,
  SkyRepeaterModule,
  SkySortModule
} from './public';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyCardModule,
    SkyDataManagerModule,
    SkyDropdownModule,
    SkyFilterModule,
    SkyFluidGridModule,
    SkyIconModule,
    SkyInfiniteScrollModule,
    SkyPagingModule,
    SkyRepeaterModule,
    SkySortModule,
    SkyToolbarModule
  ]
})
export class AppExtrasModule { }
