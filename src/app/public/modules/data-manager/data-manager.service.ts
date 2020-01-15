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
  SkyDataViewConfig
} from './models/data-view-config';
import { SkyDataManagerState } from './models';

// import {
//   SkyDataManagerSortOption
// } from './models/data-manager-sort-option';

@Injectable()
export class SkyDataManagerService {

  public activeView: Subject<SkyDataViewConfig> = new Subject();

  public views: BehaviorSubject<SkyDataViewConfig[]> = new BehaviorSubject<SkyDataViewConfig[]>([]);

  public dataState: Subject<SkyDataManagerState> =
    new Subject<SkyDataManagerState>();

  public registerOrUpdateView(view: SkyDataViewConfig, isActive: boolean): void {
    let currentViews = this.views.value;
    let existingViewIndex = currentViews.findIndex(currentView => currentView.id === view.id);

    if (existingViewIndex !== -1) {
      currentViews[existingViewIndex] = view;
    } else {
      currentViews.push(view);
    }

    this.views.next(currentViews);

    if (isActive) {
      this.activeView.next(view);
    }
  }
}
