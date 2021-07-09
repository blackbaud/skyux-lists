import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyDropdownModule
} from '@skyux/popovers';

import {
  SkyThemeModule
} from '@skyux/theme';

import {
  SkyListsResourcesModule
} from '../shared/lists-resources.module';

import {
  SkySortItemComponent
} from './sort-item.component';

import {
  SkySortComponent
} from './sort.component';

@NgModule({
  declarations: [
    SkySortComponent,
    SkySortItemComponent
  ],
  imports: [
    CommonModule,
    SkyDropdownModule,
    SkyIconModule,
    SkyListsResourcesModule,
    SkyThemeModule
  ],
  exports: [
    SkySortComponent,
    SkySortItemComponent
  ]
})
export class SkySortModule { }
