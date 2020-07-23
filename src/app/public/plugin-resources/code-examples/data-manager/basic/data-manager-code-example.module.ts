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
  SkyCardModule,
  SkyToolbarModule
} from '@skyux/layout';

import {
  SkyModalModule
} from '@skyux/modals';

import {
  DataManagerCodeExampleComponent
} from './data-manager-code-example.component';

import {
  SkyDataManagerFiltersModalCodeExampleComponent
} from './data-filter-modal.component';

import {
  SkyDataManagerModule,
  SkyRepeaterModule
} from '../../../../public_api';

@NgModule({
  declarations: [
    DataManagerCodeExampleComponent,
    SkyDataManagerFiltersModalCodeExampleComponent
  ],
  imports: [
    AgGridModule,
    SkyAgGridModule,
    SkyCardModule,
    SkyDataManagerModule,
    SkyModalModule,
    SkyRepeaterModule,
    SkyToolbarModule
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
