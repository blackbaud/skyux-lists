import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  // Input,
  OnInit
  // Output,
  // EventEmitter
} from '@angular/core';

import {
  SkyDataManagerService
} from '../../data-manager.service';
import {
  SkyDataManagerState,
  SkyDataViewConfig
} from '../../models/';

@Component({
  selector: 'sky-data-manager-toolbar-item',
  templateUrl: './data-manager-toolbar-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDataManagerToolbarItemComponent implements OnInit {

  public get activeView(): SkyDataViewConfig {
    return this._activeView;
  }

  public set activeView(view: SkyDataViewConfig) {
    this._activeView = view;
    this.changeDetector.markForCheck();
  }

  public get dataState(): SkyDataManagerState {
    return this._dataState;
  }

  // @Input()
  public set dataState(value: SkyDataManagerState) {
    // this.fromDataStateSetter = true;
    this._dataState = value;
    // setTimeout(() => {
      this.dataManagerService.dataState.next(value);
    // });
  }

  // @Output()
  // public dataStateChange: EventEmitter<SkyDataManagerState> =
  //   new EventEmitter<SkyDataManagerState>();

  public isEnabled: boolean;
  private _activeView: SkyDataViewConfig;
  private _dataState: SkyDataManagerState = new SkyDataManagerState();
  // private fromDataStateSetter: boolean;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private dataManagerService: SkyDataManagerService
  ) { }

  public ngOnInit(): void {
    this.dataManagerService.activeView.subscribe(activeView => {
      this.activeView = activeView;
    });

    this.dataManagerService.dataState.subscribe(dataState => {
      this._dataState = dataState;
      // if (!this.fromDataStateSetter) {
      //   this.dataStateChange.emit(this.dataState);
      // }
      // this.fromDataStateSetter = false;
    });
  }
}
