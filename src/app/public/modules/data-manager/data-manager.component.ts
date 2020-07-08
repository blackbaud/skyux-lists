import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  Subject
} from 'rxjs';

import {
  take,
  takeUntil
} from 'rxjs/operators';

import {
  SkyUIConfigService
} from '@skyux/core';

import {
  SkyDataManagerService
} from './data-manager.service';

import {
  SkyDataManagerConfig
} from './models/data-manager-config';

import {
  SkyDataManagerState
} from './models/data-manager-state';

import {
  SkyDataManagerStateOptions
} from './models/data-manager-state-options';

/**
 * The top-level data manager component that can be used to provide inital config and state data and
 * specify a sticky settings key. The `SkyDataManagerService` should be provided at this level.
 */
@Component({
  selector: 'sky-data-manager',
  templateUrl: './data-manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDataManagerComponent implements OnDestroy, OnInit {

  /**
   * The ID of the initial active view.
   * @required
   */
  @Input()
  public set activeViewId(value: string) {
    this.dataManagerService.updateActiveViewId(value);
  }

  /**
   * The data manager configuration. See the SkyDataManagerConfig interface.
   * @required
   */
  @Input()
  public dataManagerConfig: SkyDataManagerConfig;

  /**
   * The data state used if no settings key is provided, or if no data state is saved in the SKY UI config service for the user.
   */
  @Input()
  public defaultDataState: SkyDataManagerState = new SkyDataManagerState({});

  /**
   * The sticky settings key the current data state for each user is saved under in the SKY UI config service.
   * @required
   */
  @Input()
  public settingsKey: string;

  // the source to provide for data state changes
  private _source = 'dataManager';
  private _ngUnsubscribe = new Subject();

  constructor(
    private dataManagerService: SkyDataManagerService,
    private uiConfigService: SkyUIConfigService
  ) { }

  public ngOnInit(): void {
    if (this.settingsKey) {
      this.uiConfigService.getConfig(this.settingsKey, this.defaultDataState.getStateOptions())
        .pipe(take(1))
        .subscribe((config: SkyDataManagerStateOptions) => {
          this.dataManagerService.updateDataState(new SkyDataManagerState(config), this._source);
        });
    } else {
      this.dataManagerService.updateDataState(this.defaultDataState, this._source);
    }

    if (this.settingsKey) {
      this.dataManagerService.getDataStateUpdates(this._source)
        .pipe(takeUntil(this._ngUnsubscribe))
        .subscribe((state: SkyDataManagerState) => {
          this.uiConfigService.setConfig(
            this.settingsKey,
            state.getStateOptions()
          )
            .pipe(takeUntil(this._ngUnsubscribe))
            .subscribe(
              () => { },
              (err) => {
                console.warn('Could not save data manager settings.');
                console.warn(err);
              }
            );
        });
    }

    this.dataManagerService.updateDataManagerConfig(this.dataManagerConfig);
  }

  public ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
