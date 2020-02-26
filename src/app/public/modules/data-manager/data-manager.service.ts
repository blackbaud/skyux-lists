import {
  Injectable
} from '@angular/core';

import {
  BehaviorSubject
} from 'rxjs/BehaviorSubject';

import {
  SkyDataManagerConfig,
  SkyDataManagerState,
  SkyDataViewConfig,
  SkyDataViewState
} from './models';

@Injectable()
export class SkyDataManagerService {

  public activeViewId: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);

  public dataManagerConfig: BehaviorSubject<SkyDataManagerConfig> =
    new BehaviorSubject<SkyDataManagerConfig>(undefined);

  public views: BehaviorSubject<SkyDataViewConfig[]> = new BehaviorSubject<SkyDataViewConfig[]>([]);

  public dataState: BehaviorSubject<SkyDataManagerState> =
    new BehaviorSubject<SkyDataManagerState>(new SkyDataManagerState({source: 'defaultState'}));

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

    let dataState = this.dataState.getValue();
    let currentViewState = dataState.getViewStateById(view.id);

    if (!currentViewState) {
      let newViewState = new SkyDataViewState({ viewId: view.id });
      let newDataState = dataState.addOrUpdateView(view.id, newViewState, 'defaultState');

      this.dataState.next(newDataState);
    }
  }
}
