import {
  NgModule
} from '@angular/core';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyFluidGridModule
} from '@skyux/layout';

import {
  SkyDropdownModule
} from '@skyux/popovers';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyFilterModule,
  SkyInfiniteScrollModule,
  SkyPagingModule,
  SkyRepeaterModule,
  SkySortModule
} from './public';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyDropdownModule,
    SkyFilterModule,
    SkyFluidGridModule,
    SkyIconModule,
    SkyInfiniteScrollModule,
    SkyPagingModule,
    SkyRepeaterModule,
    SkySortModule
  ]
})
export class AppExtrasModule { }
