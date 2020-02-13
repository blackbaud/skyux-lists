import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyAppWindowRef
} from '@skyux/core';

import {
  SkyWaitModule
} from '@skyux/indicators';

import {
  SkyDockModule
} from '@skyux/layout';

import {
  SkyListsResourcesModule
} from '../shared';

import {
  SkyInfiniteScrollComponent
} from './infinite-scroll.component';

import {
  SkyInfiniteScrollBackToTopComponent
} from './infinite-scroll-back-to-top.component';

@NgModule({
  declarations: [
    SkyInfiniteScrollComponent,
    SkyInfiniteScrollBackToTopComponent
  ],
  imports: [
    CommonModule,
    SkyDockModule,
    SkyListsResourcesModule,
    SkyWaitModule
  ],
  exports: [
    SkyInfiniteScrollComponent
  ],
  providers: [
    SkyAppWindowRef
  ],
  entryComponents: [
    SkyInfiniteScrollBackToTopComponent
  ]
})
export class SkyInfiniteScrollModule { }
