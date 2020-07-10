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

// import {
//   SkyDataViewConfig
// } from './models/data-view-config';

/**
 * A data view is rendered within a data manager component.
 * It can subscribe to data state changes via the `SkyDataManagerService` and apply the filters,
 * search text, and more to the data it is displaying.
 */
@Component({
  selector: 'sky-data-view',
  templateUrl: './data-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDataViewComponent implements OnDestroy, OnInit {

  /**
   * The configuration for the view. See the `SkyDataViewConfig` interface.
   * @required
   */
  // @Input()
  // public get viewConfig(): SkyDataViewConfig {
  //   return this._viewConfig;
  // }

  @Input()
  public viewId: string;

  // public set viewConfig(config: SkyDataViewConfig) {
  //   this._viewConfig = config;
  //   setTimeout(() => {
  //     this.dataManagerService.registerOrUpdateView(this.viewConfig);
  //   });
  // }

  public get isActive(): boolean {
    return this._isActive;
  }

  public set isActive(value: boolean) {
    this._isActive = value;
    this.changeDetector.markForCheck();
  }

  public _isActive = false;
  private _ngUnsubscribe = new Subject();
  // private _viewConfig: SkyDataViewConfig;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private dataManagerService: SkyDataManagerService
  ) { }

  public ngOnInit(): void {
    this.dataManagerService.getActiveViewIdUpdates()
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe(activeViewId => {
        this.isActive = this.viewId === activeViewId;
      });
  }

  public ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
