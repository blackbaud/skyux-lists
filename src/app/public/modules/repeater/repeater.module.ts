import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';

import {
  SkyLogModule
} from '@skyux/core';

import {
  SkyCheckboxModule
} from '@skyux/forms';

import {
  SkyChevronModule,
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyInlineFormModule
} from '@skyux/inline-form';

import {
  DragulaModule
} from 'ng2-dragula';

import {
  SkyRepeaterComponent
} from './repeater.component';

import {
  SkyRepeaterItemContentComponent
} from './repeater-item-content.component';

import {
  SkyRepeaterItemContextMenuComponent
} from './repeater-item-context-menu.component';

import {
  SkyRepeaterItemComponent
} from './repeater-item.component';

import {
  SkyRepeaterItemTitleComponent
} from './repeater-item-title.component';

import {
  SkyListsResourcesModule
} from '../shared/lists-resources.module';

@NgModule({
  declarations: [
    SkyRepeaterComponent,
    SkyRepeaterItemComponent,
    SkyRepeaterItemContentComponent,
    SkyRepeaterItemContextMenuComponent,
    SkyRepeaterItemTitleComponent
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    DragulaModule,
    SkyChevronModule,
    SkyCheckboxModule,
    SkyIconModule,
    SkyInlineFormModule,
    SkyListsResourcesModule,
    SkyLogModule
  ],
  exports: [
    SkyRepeaterComponent,
    SkyRepeaterItemComponent,
    SkyRepeaterItemContentComponent,
    SkyRepeaterItemContextMenuComponent,
    SkyRepeaterItemTitleComponent
  ]
})
export class SkyRepeaterModule { }
