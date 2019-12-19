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
  DataViewConfig
} from './models/data-view-config';

@Injectable()
export class SkyDataManagerService {
  public filters: Subject<string> = new Subject();

  public searchText: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);

  public sort: Subject<string> = new Subject();

  public selectedColumnIds: Subject<string[]> = new Subject();

  public activeView: Subject<DataViewConfig> = new Subject();

  public views: BehaviorSubject<DataViewConfig[]> = new BehaviorSubject<DataViewConfig[]>([]);

  public registerView(view: DataViewConfig): void {
    let currentViews = this.views.value;

    currentViews.push(view);

    this.views.next(currentViews);

    if (view.isActive) {
      this.activeView.next(view);
    }
  }
}
