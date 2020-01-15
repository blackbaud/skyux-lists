import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';

import {
  SkyDataManagerService
} from './data-manager.service';
import {
  SkyDataManagerState,
  SkyDataViewConfig
} from './models/';

@Component({
  selector: 'sky-data-view',
  templateUrl: './data-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDataViewComponent implements OnInit {

  @Input()
  public get viewConfig(): SkyDataViewConfig {
    return this._viewConfig;
  }

  public set viewConfig(config: SkyDataViewConfig) {
    this._viewConfig = config;
    setTimeout(() => {
      this.dataManagerService.registerOrUpdateView(this.viewConfig, this.isActive);
    });
  }

  public get dataState(): SkyDataManagerState {
    return this._dataState;
  }

  @Input()
  public set dataState(value: SkyDataManagerState) {
    this._dataState = value;
    this.fromDataStateSetter = true;
    setTimeout(() => { this.dataManagerService.dataState.next(value); });
  }

  @Output()
  public dataStateChange: EventEmitter<SkyDataManagerState> =
    new EventEmitter<SkyDataManagerState>();

  @Input()
  public get isActive(): boolean {
    return this._isActive;
  }

  public set isActive(value: boolean) {
    this._isActive = value;
    this.isActiveChange.emit(value);
    this.changeDetector.markForCheck();
  }

  @Output()
  public isActiveChange: EventEmitter<boolean> =
    new EventEmitter<boolean>(true);

  private _dataState: SkyDataManagerState;
  private _isActive = false;
  private _viewConfig: SkyDataViewConfig;
  private fromDataStateSetter: boolean;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private dataManagerService: SkyDataManagerService
  ) { }

  public ngOnInit(): void {
    this.dataManagerService.activeView.subscribe(activeView => {
      this.isActive = this.viewConfig && this.viewConfig.id === activeView.id;
      // if (this.dataState) {
        this.dataStateChange.emit(this.dataState);
      // }
    });

    this.dataManagerService.dataState.subscribe(dataState => {
      this._dataState = dataState;
      if (!this.fromDataStateSetter && this.isActive) {
        this.dataStateChange.emit(this.dataState);
      }
      this.fromDataStateSetter = false;
    });
  }
}
