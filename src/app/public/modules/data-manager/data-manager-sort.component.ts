// import {
//   ChangeDetectionStrategy,
//   Component
// } from '@angular/core';

// import {
//   BehaviorSubject
// } from 'rxjs/BehaviorSubject';

// import {
//   SkyDataManagerService
// } from './data-manager.service';

// import {
//   DataViewConfig
// } from './models/data-view-config';

// @Component({
//   selector: 'sky-data-manager-sort',
//   templateUrl: './data-manager-sort.component.html',
//   changeDetection: ChangeDetectionStrategy.OnPush
// })
// export class SkyDataManagerSortComponent {

//   public get activeViewId(): string {
//     return this._activeViewId;
//   }

//   public set activeViewId(id: string) {
//     this.dataManagerService.activeView.next(id);
//   }

//   public get views(): BehaviorSubject<DataViewConfig[]> {
//     return this.dataManagerService.views;
//   }

//   private _activeViewId: string;

//   constructor(private dataManagerService: SkyDataManagerService) {
//     this.dataManagerService.activeView.subscribe(id => this._activeViewId = id);
//    }

//    public onViewChange(change: {value: string}) {
//      this.dataManagerService.activeView.next(change.value);
//    }
// }
