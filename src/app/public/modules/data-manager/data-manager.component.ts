import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

import {
  SkyDataManagerService
} from './data-manager.service';

@Component({
  selector: 'sky-data-manager',
  templateUrl: './data-manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SkyDataManagerService]
})
export class SkyDataManagerComponent {

}
