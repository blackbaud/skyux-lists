import {
  Injectable
} from '@angular/core';

import {
  BehaviorSubject
} from 'rxjs/BehaviorSubject';

import {
  Subject
} from 'rxjs/Subject';

import {
  SkyDataManagerState,
  SkyDataViewConfig
} from './models';

@Injectable()
export class SkyDataManagerService {

  public activeView: Subject<SkyDataViewConfig> = new Subject();

  public views: BehaviorSubject<SkyDataViewConfig[]> = new BehaviorSubject<SkyDataViewConfig[]>([]);

  public dataState: Subject<SkyDataManagerState> = new BehaviorSubject<SkyDataManagerState>(new SkyDataManagerState());

  public setActiveViewById(activeViewId: string): void {
    const currentViews: SkyDataViewConfig[] = this.views.value;
    let viewConfig: SkyDataViewConfig = currentViews.find(view => view.id === activeViewId);

    console.log(currentViews);
    setTimeout(() => {
      this.activeView.next(viewConfig);
    });
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
  }
}
