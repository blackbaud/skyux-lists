import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';

import {
  SkyDataManagerService
} from './data-manager.service';

@Component({
  selector: 'sky-data-manager',
  templateUrl: './data-manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDataManagerComponent implements OnInit {

// @Input()
// public set activeViewId(value: string) {
//   this._activeViewId = value;

//   this.dataManagerService.setActiveViewById(value);
// }

// public get activeViewId(): string {
//   return this._activeViewId;
// }

// private _activeViewId: string;

@Input()
public activeViewId: string;

constructor(private dataManagerService: SkyDataManagerService) { }

public ngOnInit(): void {
  console.log(this.activeViewId);
  this.dataManagerService.setActiveViewById(this.activeViewId);
}

}
