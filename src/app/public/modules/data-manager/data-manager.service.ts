import {
  Injectable,
  OnDestroy
} from '@angular/core';

import {
  BehaviorSubject,
  Observable,
  ReplaySubject
} from 'rxjs';

import {
  filter,
  map,
  take
} from 'rxjs/operators';

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
  SkyDataViewConfig
} from './models/data-view-config';

import {
  SkyDataViewState
} from './models/data-view-state';

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

  private readonly activeViewId: ReplaySubject<string> = new ReplaySubject<string>();

  private readonly dataManagerConfig = new BehaviorSubject<SkyDataManagerConfig>(undefined);

  private readonly views = new BehaviorSubject<SkyDataViewConfig[]>([]);

  private readonly dataStateChange =
    new BehaviorSubject<SkyDataManagerStateChange>(new SkyDataManagerStateChange(new SkyDataManagerState({}), 'defaultState'));

  public ngOnDestroy(): void {
    this.activeViewId.complete();
    this.dataManagerConfig.complete();
    this.views.complete();
    this.dataStateChange.complete();
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

  public registerOrUpdateView(view: SkyDataViewConfig): void {
    let currentViews: SkyDataViewConfig[] = this.views.value;
    const existingViewIndex = currentViews.findIndex(currentView => currentView.id === view.id);

    if (existingViewIndex !== -1) {
      currentViews[existingViewIndex] = view;
    } else {
      currentViews.push(view);
    }

    this.views.next(currentViews);

    this.activeViewId.pipe(take(1)).subscribe(id => {
      this.activeViewId.next(id);
    });

    const dataState = this.getCurrentDataState();
    const currentViewState = dataState.getViewStateById(view.id);

    if (!currentViewState) {
      const newViewState = new SkyDataViewState({ viewId: view.id });
      const newDataState = dataState.addOrUpdateView(view.id, newViewState);

      this.updateDataState(newDataState, 'service');
    }
  }
}
