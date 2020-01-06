import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

import {
  BehaviorSubject
} from 'rxjs/BehaviorSubject';

import {
  SkyDataManagerService
} from '../data-manager.service';

import {
  SkyDataViewConfig
} from '../models/data-view-config';

@Component({
  selector: 'sky-data-manager-view-switcher',
  templateUrl: './data-manager-view-switcher.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDataManagerViewSwitcherComponent {

  public get activeView(): SkyDataViewConfig {
    return this._activeView;
  }

  public set activeView(view: SkyDataViewConfig) {
    this.dataManagerService.activeView.next(view);
  }

  public get views(): BehaviorSubject<SkyDataViewConfig[]> {
    return this.dataManagerService.views;
  }

  private _activeView: SkyDataViewConfig;

  constructor(private dataManagerService: SkyDataManagerService) {
    this.dataManagerService.activeView.subscribe(view => this._activeView = view);
  }

  public onViewChange(view: SkyDataViewConfig) {
    this.dataManagerService.activeView.next(view);
  }
}
