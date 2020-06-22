import {
  Injectable
} from '@angular/core';

import {
  BehaviorSubject
} from 'rxjs/BehaviorSubject';

import {
  ReplaySubject
} from 'rxjs/ReplaySubject';

import {
  SkyDataManagerConfig,
  SkyDataManagerState,
  SkyDataManagerStateChange,
  SkyDataViewConfig,
  SkyDataViewState
} from './models';

import {
  Observable
} from 'rxjs/Observable';

import {
  filter,
  map
} from 'rxjs/operators';

@Injectable()
export class SkyDataManagerService {

  private readonly activeViewId: ReplaySubject<string> = new ReplaySubject<string>();

  private readonly dataManagerConfig = new BehaviorSubject<SkyDataManagerConfig>(undefined);

  private readonly views = new BehaviorSubject<SkyDataViewConfig[]>([]);

  private readonly dataStateChange =
    new BehaviorSubject<SkyDataManagerStateChange>(new SkyDataManagerStateChange(new SkyDataManagerState({}), 'defaultState'));

  public getCurrentDataState(): SkyDataManagerState {
    return this.dataStateChange.value && this.dataStateChange.value.dataState;
  }

  public getDataStateUpdates(source: string): Observable<SkyDataManagerState> {
    // filter out events from the provided source and emit just the dataState
    const dataStateObservable = this.dataStateChange.pipe(
      filter(stateChange => source !== stateChange.source),
      map(stateChange => stateChange.dataState)
    );
    return dataStateObservable;
  }

  public updateDataState(state: SkyDataManagerState, source: string): void {
    const dataState = this.dataStateChange as BehaviorSubject<SkyDataManagerStateChange>;
    const dataStateChange = new SkyDataManagerStateChange(state, source);

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
    let viewConfig: SkyDataViewConfig = currentViews.find(view => view.id === viewId);

    return viewConfig;
  }

  public registerOrUpdateView(view: SkyDataViewConfig): void {
    let currentViews: SkyDataViewConfig[] = this.views.value;
    let existingViewIndex = currentViews.findIndex(currentView => currentView.id === view.id);

    if (existingViewIndex !== -1) {
      currentViews[existingViewIndex] = view;
    } else {
      currentViews.push(view);
    }

    this.views.next(currentViews);

    this.activeViewId.take(1).subscribe(id => {
      this.activeViewId.next(id);
    });

    let dataState = this.getCurrentDataState();
    let currentViewState = dataState.getViewStateById(view.id);

    if (!currentViewState) {
      let newViewState = new SkyDataViewState({ viewId: view.id });
      let newDataState = dataState.addOrUpdateView(view.id, newViewState);

      this.updateDataState(newDataState, 'service');
    }
  }
}
