import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyDropdownModule
} from '@skyux/popovers';

import {
  SkyRepeaterModule
} from '../repeater.module';

import {
  RepeaterDynamicFixtureComponent
} from './repeater-dynamic.component.fixture';

import {
  RepeaterTestComponent
} from './repeater.component.fixture';

import {
  RepeaterInlineFormFixtureComponent
} from './repeater-inline-form.component.fixture';

@NgModule({
  declarations: [
    RepeaterDynamicFixtureComponent,
    RepeaterInlineFormFixtureComponent,
    RepeaterTestComponent
  ],
  imports: [
    CommonModule,
    SkyDropdownModule,
    SkyRepeaterModule
  ],
  exports: [
    RepeaterDynamicFixtureComponent,
    RepeaterInlineFormFixtureComponent,
    RepeaterTestComponent
  ]
})
export class SkyRepeaterFixturesModule { }
