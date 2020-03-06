import {
  NgModule
} from '@angular/core';

import {
  AgGridModule
} from 'ag-grid-angular';

import {
  SkyAgGridModule
} from '@skyux/ag-grid';

import {
  SkyCheckboxModule
} from '@skyux/forms';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyBackToTopModule,
  SkyCardModule,
  SkyFluidGridModule,
  SkyInlineDeleteModule
} from '@skyux/layout';

import {
  SkyModalModule
} from '@skyux/modals';

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

import {
  SkyDataManagerFiltersModalDemoComponent
} from './visual/data-manager/data-filter-modal.component';

import {
  SkyAgGridDataManagerAdapterDirective
} from './public/modules/data-manager/data-manager-ag-grid-adapter.directive';

@NgModule({
  declarations: [
    SkyAgGridDataManagerAdapterDirective
  ],
  exports: [
    AgGridModule,
    SkyAgGridModule,
    SkyAppLinkModule,
    SkyBackToTopModule,
    SkyCardModule,
    SkyCheckboxModule,
    SkyDataManagerModule,
    SkyDropdownModule,
    SkyFilterModule,
    SkyFluidGridModule,
    SkyIconModule,
    SkyInfiniteScrollModule,
    SkyInlineDeleteModule,
    SkyModalModule,
    SkyPagingModule,
    SkyRepeaterModule,
    SkySortModule,
    SkyToolbarModule,
    SkyAgGridDataManagerAdapterDirective
  ],
  entryComponents: [
    SkyDataManagerFiltersModalDemoComponent
  ]
})
export class AppExtrasModule { }
