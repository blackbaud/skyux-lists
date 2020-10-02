import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  SkyCheckboxModule
} from '@skyux/forms';

import {
  SkyFilterModule,
  SkyRepeaterModule
} from '@skyux/lists';

import {
  SkyToolbarModule
} from '@skyux/layout';

import {
  FilterDemoComponent
} from './filter-demo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SkyCheckboxModule,
    SkyFilterModule,
    SkyRepeaterModule,
    SkyToolbarModule
  ],
  declarations: [
    FilterDemoComponent
  ],
  exports: [
    FilterDemoComponent
  ]
})
export class FilterDemoModule { }
