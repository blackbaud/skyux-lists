import {
  Injectable
} from '@angular/core';

import {
  BehaviorSubject
} from 'rxjs/BehaviorSubject';

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

  public readonly activeViewId: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);

  public readonly dataManagerConfig: BehaviorSubject<SkyDataManagerConfig> =
    new BehaviorSubject<SkyDataManagerConfig>(undefined);

  public readonly views = new BehaviorSubject<SkyDataViewConfig[]>([]);

  public readonly dataStateChange: Observable<SkyDataManagerStateChange> =
    new BehaviorSubject<SkyDataManagerStateChange>(new SkyDataManagerStateChange(new SkyDataManagerState({}), 'defaultState'));

  public getCurrentDataState(): SkyDataManagerState {
    const dataStateChangeObservable = this.dataStateChange as BehaviorSubject<SkyDataManagerStateChange>;
    return dataStateChangeObservable.value && dataStateChangeObservable.value.dataState;
  }

  public getDataStateSubscription(source: string): Observable<SkyDataManagerState> {
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

    let activeViewId = this.activeViewId.value;
    this.activeViewId.next(activeViewId);

    let dataState = this.getCurrentDataState();
    let currentViewState = dataState.getViewStateById(view.id);

    if (!currentViewState) {
      let newViewState = new SkyDataViewState({ viewId: view.id });
      let newDataState = dataState.addOrUpdateView(view.id, newViewState);

      this.updateDataState(newDataState, 'service');
    }
  }
}
