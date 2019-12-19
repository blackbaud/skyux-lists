import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  Subject
} from 'rxjs/Subject';

import {
  SkyUIConfigService
} from '@skyux/core';

import {
  SkyDataManagerService
} from './data-manager.service';

import {
  SkyDataManagerConfig,
  SkyDataManagerState,
  SkyDataManagerStateOptions
} from './models';

@Component({
  selector: 'sky-data-manager',
  templateUrl: './data-manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDataManagerComponent implements OnDestroy, OnInit {

  @Input()
  public set activeViewId(value: string) {
    this.dataManagerService.activeViewId.next(value);
  }

  @Input()
  public dataManagerConfig: SkyDataManagerConfig;

  @Input()
  public defaultDataState: SkyDataManagerState = new SkyDataManagerState({});

  @Input()
  public settingsKey: string;

  // the source to provide for data state changes
  private _source = 'dataManger';
  private _ngUnsubscribe = new Subject();

  constructor(
    private dataManagerService: SkyDataManagerService,
    private uiConfigService: SkyUIConfigService
    ) { }

  public ngOnInit(): void {
    if (this.settingsKey) {
      this.uiConfigService.getConfig(this.settingsKey, this.defaultDataState.getStateOptions())
        .take(1)
        .subscribe((config: SkyDataManagerStateOptions) => {
          this.dataManagerService.updateDataState(new SkyDataManagerState(config), this._source);
        });
    } else {
      this.dataManagerService.updateDataState(this.defaultDataState, this._source);
    }

    if (this.settingsKey) {
      this.dataManagerService.getDataStateSubscription(this._source)
        .takeUntil(this._ngUnsubscribe)
        .subscribe(state => {
          this.uiConfigService.setConfig(
            this.settingsKey,
            state.getStateOptions()
          )
            .takeUntil(this._ngUnsubscribe)
            .subscribe(
              () => { },
              (err) => {
                console.warn('Could not save data manager settings.');
                console.warn(err);
              }
            );
        });
    }

    this.dataManagerService.dataManagerConfig.next(this.dataManagerConfig);
  }

  public ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
