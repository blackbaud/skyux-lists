import {
  Injectable,
  OnDestroy
} from '@angular/core';

import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  Subject
} from 'rxjs';

import {
  filter,
  map,
  take,
  takeUntil
} from 'rxjs/operators';

import {
  SkyUIConfigService
} from '@skyux/core';

import {
  SkyDataManagerConfig
} from './models/data-manager-config';

import {
  SkyDataManagerState
} from './models/data-manager-state';

import {
  SkyDataManagerStateChange
} from './models/data-manager-state-change';

import {
  SkyDataManagerStateOptions
} from './models/data-manager-state-options';

import {
  SkyDataViewConfig
} from './models/data-view-config';

import {
  SkyDataViewState
} from './models/data-view-state';

import {
  SkyInitDataManagerArgs
} from './models/init-data-manager-args';

/**
 * The data manager service provides ways for data views, toolbar items, and more to stay up to date
 * with the active view ID, data manager config, registered views and their configs, and data state.
 * There are methods to get current values, update values, and get subscriptions to the changing values.<br/> <br/>
 * This service should be provided component-level for each instance a data manager is used.
 * It should not be provided at the module level or in `app-extras`. This allows multiple data
 * managers to be used and self-contained.
 */
@Injectable()
export class SkyDataManagerService implements OnDestroy {

  public isInitialized = false;

  private readonly activeViewId: ReplaySubject<string> = new ReplaySubject<string>();

  private readonly dataManagerConfig = new BehaviorSubject<SkyDataManagerConfig>(undefined);

  private readonly views = new BehaviorSubject<SkyDataViewConfig[]>([]);

  private readonly dataStateChange =
    new BehaviorSubject<SkyDataManagerStateChange>(new SkyDataManagerStateChange(new SkyDataManagerState({}), 'defaultState'));

  private _ngUnsubscribe = new Subject();
  private _initSource = 'dataManagerServiceInit';

  constructor(
    private uiConfigService: SkyUIConfigService
  ) { }

  public ngOnDestroy(): void {
    this.activeViewId.complete();
    this.dataManagerConfig.complete();
    this.views.complete();
    this.dataStateChange.complete();
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  public initDataManager(args: SkyInitDataManagerArgs): void {
    const defaultDataState = args.defaultDataState;
    const settingsKey = args.settingsKey;

    this.updateActiveViewId(args.activeViewId);
    this.updateDataManagerConfig(args.dataManagerConfig);

    if (settingsKey) {
      this.uiConfigService.getConfig(settingsKey, defaultDataState.getStateOptions())
        .pipe(take(1))
        .subscribe((config: SkyDataManagerStateOptions) => {
          this.updateDataState(new SkyDataManagerState(config), this._initSource);
        });
    } else {
      this.updateDataState(defaultDataState, this._initSource);
    }

    if (settingsKey) {
      this.getDataStateUpdates(this._initSource)
        .pipe(takeUntil(this._ngUnsubscribe))
        .subscribe((state: SkyDataManagerState) => {
          this.uiConfigService.setConfig(
            settingsKey,
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

    this.isInitialized = true;
  }

  public initDataView(viewConfig: SkyDataViewConfig): void {
    let currentViews: SkyDataViewConfig[] = this.views.value;

    currentViews.push(viewConfig);
    this.views.next(currentViews);

    // When the initial activeViewId is set there are no views registered. We have to re-emit
    // the activeId so the newly registered view is notified that it is active.
    this.activeViewId.pipe(take(1)).subscribe(id => {
      this.activeViewId.next(id);
    });

    const dataState = this.getCurrentDataState();
    const currentViewState = dataState.getViewStateById(viewConfig.id);

    /* istanbul ignore else */
    if (!currentViewState) {
      const newViewState = new SkyDataViewState({ viewId: viewConfig.id });
      const newDataState = dataState.addOrUpdateView(viewConfig.id, newViewState);

      this.updateDataState(newDataState, this._initSource);
    }
  }

  public getCurrentDataState(): SkyDataManagerState {
    return this.dataStateChange.value && this.dataStateChange.value.dataState;
  }

  /**
   * Returns an observable that views and other data manager entities can subscribe to that excludes
   * updates originating from the provided source. This allows subscribers to only respond to
   * changes they did not create and helps prevent infinite loops of updates and responses.
   * @param sourceId The ID of the entity subscribing to data state updates. This can be any value you choose,
   * but should be unique within the data manager instance and should also be used when that entity updates the state.
   */
  public getDataStateUpdates(sourceId: string): Observable<SkyDataManagerState> {
    // filter out events from the provided source and emit just the dataState
    const dataStateObservable = this.dataStateChange.pipe(
      filter(stateChange => sourceId !== stateChange.source),
      map(stateChange => stateChange.dataState)
    );
    return dataStateObservable;
  }

  /**
   * Updates the data state and emits a new value to entities subscribed to data state changes.
   * @param state The new state value. See the SkyDataManagerState interface.
   * @param sourceId The ID of the entity updating the state. This can be any value you choose,
   * but should be unique within the data manager instance and should also be used when that entity
   * subscribes to state changes via `getDataStateUpdates`.
   */
  public updateDataState(state: SkyDataManagerState, sourceId: string): void {
    const dataState = this.dataStateChange as BehaviorSubject<SkyDataManagerStateChange>;
    const dataStateChange = new SkyDataManagerStateChange(state, sourceId);

    dataState.next(dataStateChange);
  }

  public getCurrentDataManagerConfig(): SkyDataManagerConfig {
    return this.dataManagerConfig.value;
  }

  public getDataManagerConfigUpdates(): Observable<SkyDataManagerConfig> {
    return this.dataManagerConfig;
  }

  public updateDataManagerConfig(value: SkyDataManagerConfig): void {
    this.dataManagerConfig.next(value);
  }

  public getDataViewsUpdates(): Observable<SkyDataViewConfig[]> {
    return this.views;
  }

  public getActiveViewIdUpdates(): Observable<string> {
    return this.activeViewId;
  }

  public updateActiveViewId(id: string): void {
    this.activeViewId.next(id);
  }

  public getViewById(viewId: string): SkyDataViewConfig {
    const currentViews: SkyDataViewConfig[] = this.views.value;
    const viewConfig: SkyDataViewConfig = currentViews.find(view => view.id === viewId);

    return viewConfig;
  }

  public updateViewConfig(view: SkyDataViewConfig): void {
    let currentViews: SkyDataViewConfig[] = this.views.value;
    const existingViewIndex = currentViews.findIndex(currentView => currentView.id === view.id);

    if (existingViewIndex === -1) {
      console.error('A view with the id {id} already exists.', view.id);
    } else {

    currentViews[existingViewIndex] = view;
    this.views.next(currentViews);
    }
  }
}
