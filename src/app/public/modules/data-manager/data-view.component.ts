import {
  ChangeDetectorRef,
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
  takeUntil
} from 'rxjs/operators';

import {
  SkyDataManagerService
} from './data-manager.service';

import {
  SkyDataViewConfig
} from './models/data-view-config';

@Component({
  selector: 'sky-data-view',
  templateUrl: './data-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDataViewComponent implements OnDestroy, OnInit {

  @Input()
  public get viewConfig(): SkyDataViewConfig {
    return this._viewConfig;
  }

  public set viewConfig(config: SkyDataViewConfig) {
    this._viewConfig = config;
    setTimeout(() => {
      this.dataManagerService.registerOrUpdateView(this.viewConfig);
    });
  }

  @Input()
  public get isActive(): boolean {
    return this._isActive;
  }

  public set isActive(value: boolean) {
    this._isActive = value;
    this.changeDetector.markForCheck();
  }

  private _isActive = false;
  private _ngUnsubscribe = new Subject();
  private _viewConfig: SkyDataViewConfig;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private dataManagerService: SkyDataManagerService
  ) { }

  public ngOnInit(): void {
    this.dataManagerService.getActiveViewIdUpdates()
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe(activeViewId => {
        this.isActive = this.viewConfig && this.viewConfig.id === activeViewId;
      });
  }

  public ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
