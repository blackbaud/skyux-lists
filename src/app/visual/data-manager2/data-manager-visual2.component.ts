import {
  Component
} from '@angular/core';

import {
  SkyUIConfigService
} from '@skyux/core';

import {
  LocalStorageConfigService
} from '../data-manager/local-storage-config.service';

import {
  SkyDataManagerService
} from '../../public';

@Component({
  selector: 'app-data-manager-visual2',
  templateUrl: './data-manager-visual2.component.html',
  styleUrls: ['./data-manager-visual2.component.scss'],
  providers: [
    SkyDataManagerService,
    {
      provide: SkyUIConfigService,
      useClass: LocalStorageConfigService
    }
  ]
})
export class DataManagerVisual2Component {

}
