import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';

import {
  SkyDataManagerService
} from './data-manager.service';
import { SkyDataViewConfig } from './models/data-view-config';

@Component({
  selector: 'sky-data-view',
  templateUrl: './data-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDataViewComponent implements OnInit {

  @Input()
  public viewConfig: SkyDataViewConfig;

  public get isActive(): boolean {
    return this.viewConfig.isActive;
  }

  public set isActive(active: boolean) {
    this.viewConfig.isActive = active;
    this.changeDetector.markForCheck();
  }

  constructor(
    private changeDetector: ChangeDetectorRef,
    private dataManagerService: SkyDataManagerService
  ) { }

  public ngOnInit(): void {
    this.dataManagerService.registerView(this.viewConfig);

    this.dataManagerService.activeView.subscribe(activeView => {
      this.isActive = this.viewConfig && this.viewConfig.id === activeView.id;
    });
  }
}
