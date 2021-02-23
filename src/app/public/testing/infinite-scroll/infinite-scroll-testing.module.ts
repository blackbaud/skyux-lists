import {
  NgModule
} from '@angular/core';

import {
  SkyInfiniteScrollModule
} from '../../modules/infinite-scroll/infinite-scroll.module';

@NgModule({
  exports: [
    SkyInfiniteScrollModule
  ]
})
export class SkyInfiniteScrollTestingModule { }
