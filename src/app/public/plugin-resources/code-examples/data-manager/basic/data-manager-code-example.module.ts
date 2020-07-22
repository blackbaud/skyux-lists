import {
  NgModule
} from '@angular/core';

import {
  SkyModalModule
} from '@skyux/modals';

import {
  DataManagerCodeExampleComponent
} from './data-manager-code-example.component';

import {
  SkyDataManagerFiltersModalCodeExampleComponent
} from './data-filter-modal.component';

@NgModule({
  declarations: [
    DataManagerCodeExampleComponent,
    SkyDataManagerFiltersModalCodeExampleComponent
  ],
  imports: [
    SkyModalModule
  ],
  exports: [
    DataManagerCodeExampleComponent
  ],
  entryComponents: [
    DataManagerCodeExampleComponent,
    SkyDataManagerFiltersModalCodeExampleComponent
  ]
})
export class DataManagerCodeExampleModule { }
