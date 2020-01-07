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

import {
  SkyDataManagerSortOption
} from './models/data-manager-sort-option';

@Injectable()
export class SkyDataManagerService {
  public filters: Subject<string> = new Subject();

  public searchText: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);

  public activeSortOption: BehaviorSubject<SkyDataManagerSortOption> =
    new BehaviorSubject<SkyDataManagerSortOption>(undefined);

  public selectedColumnIds: Subject<string[]> = new Subject();

  public activeView: Subject<SkyDataViewConfig> = new Subject();

  public views: BehaviorSubject<SkyDataViewConfig[]> = new BehaviorSubject<SkyDataViewConfig[]>([]);

  public registerView(view: SkyDataViewConfig): void {
    console.log('registering view');
    console.log(view);
    let currentViews = this.views.value;

    currentViews.push(view);

    this.views.next(currentViews);

    if (view.isActive) {
      this.activeView.next(view);
    }
  }
}
