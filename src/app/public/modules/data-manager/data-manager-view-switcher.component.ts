import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

import {
  BehaviorSubject
} from 'rxjs/BehaviorSubject';

import {
  SkyDataManagerService
} from './data-manager.service';

import {
  DataViewConfig
} from './models/data-view-config';

@Component({
  selector: 'sky-data-manager-view-switcher',
  templateUrl: './data-manager-view-switcher.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDataManagerViewSwitcherComponent {

  public get activeView(): DataViewConfig {
    return this._activeView;
  }

  public set activeView(view: DataViewConfig) {
    this.dataManagerService.activeView.next(view);
  }

  public get views(): BehaviorSubject<DataViewConfig[]> {
    return this.dataManagerService.views;
  }

  private _activeView: DataViewConfig;

  constructor(private dataManagerService: SkyDataManagerService) {
    this.dataManagerService.activeView.subscribe(view => this._activeView = view);
  }

  public onViewChange(view: DataViewConfig) {
    this.dataManagerService.activeView.next(view);
  }
}
