import {
  ChangeDetectionStrategy,
  Component,
  OnInit
} from '@angular/core';

import {
  SkyDataManagerService
} from './data-manager.service';

@Component({
  selector: 'sky-data-manager',
  templateUrl: './data-manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SkyDataManagerService]
})
export class SkyDataManagerComponent implements OnInit {

  // @Input()
  // public showSelectedFilters: boolean = true;

  // public get selectedFilters(): any {
  //   return this.dataManagerService.filters.take(1);
  // }

  // @Input()
  // public set selectedFilters(filters: any) {
  //   this.dataManagerService.filters.next(filters);
  // }

  // @Input()
  // public set activeViewId(id: string) {
  //   this.dataManagerService.activeViewId.next(id);
  // }

  // constructor(private dataManagerService: SkyDataManagerService) {}

  public ngOnInit(): void {
    // this.dataManagerService.activeViewId.subscribe(id => this._activeViewId = id);
  }
}
