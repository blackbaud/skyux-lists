import {
  NgModule
} from '@angular/core';

import {
  SkyModalModule
} from '@skyux/modals';

import {
  DataManagerDemoComponent
} from './data-manager-demo.component';

import {
  SkyDataManagerFiltersModalDemoComponent
} from './data-filter-modal.component';

@NgModule({
  declarations: [
    DataManagerDemoComponent,
    SkyDataManagerFiltersModalDemoComponent
  ],
  imports: [
    SkyModalModule
  ],
  exports: [
    DataManagerDemoComponent
  ],
  entryComponents: [
    DataManagerDemoComponent,
    SkyDataManagerFiltersModalDemoComponent
  ]
})
export class DataManagerDemoModule { }
