import {
  NgModule
} from '@angular/core';

import {
  SkyAppWindowRef,
  SkyMediaQueryModule
} from '@skyux/core';

/**
 * @internal
 * @deprecated This module can be removed after we upgrade SKY UX development dependencies to version 5.
 */
 @NgModule({
  imports: [
    SkyMediaQueryModule
  ],
  providers: [
    SkyAppWindowRef,
  ]
})
export class SkyListsForRootCompatModule {}
