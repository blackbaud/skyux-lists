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
  SkyDataManagerState, SkyDataManagerStateOptions, SkyDataManagerConfig
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
  public defaultDataState: SkyDataManagerState = new SkyDataManagerState();

  @Input()
  public settingsKey: string;

  private ngUnsubscribe = new Subject();

  constructor(
    private dataManagerService: SkyDataManagerService,
    private uiConfigService: SkyUIConfigService
    ) { }

  public ngOnInit(): void {
    if (this.settingsKey) {
      this.uiConfigService.getConfig(this.settingsKey, this.defaultDataState.getStateOptions())
        .take(1)
        .subscribe((config: SkyDataManagerStateOptions) => {
          this.dataManagerService.dataState.next(new SkyDataManagerState(config));
        });
    } else {
      this.dataManagerService.dataState.next(this.defaultDataState);
    }

    if (this.settingsKey) {
      this.dataManagerService.dataState
        .takeUntil(this.ngUnsubscribe)
        .subscribe(state => {
          this.uiConfigService.setConfig(
            this.settingsKey,
            state.getStateOptions()
          )
            .takeUntil(this.ngUnsubscribe)
            .subscribe(
              () => { },
              (err) => {
                console.warn('Could not save grid settings.');
                console.warn(err);
              }
            );
        });
    }

    this.dataManagerService.dataManagerConfig.next(this.dataManagerConfig);
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
