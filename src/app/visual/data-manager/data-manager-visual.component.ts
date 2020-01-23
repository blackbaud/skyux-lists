import { Component } from '@angular/core';
import { SkyDataManagerState, SkyDataViewConfig, SkyDataManagerService } from '../../public';

@Component({
  selector: 'data-manager-visual',
  templateUrl: './data-manager-visual.component.html',
  providers: [SkyDataManagerService]
})
export class DataManagerVisualComponent {

  public activeView: SkyDataViewConfig;

  public dataState = new SkyDataManagerState({
    filterData: {
      hideOrange: true
    }
  });

  constructor(private dataManagerService: SkyDataManagerService) {
    this.dataManagerService.activeView.subscribe(view => this.activeView = view);
  }

  public searchSo() {
    this.dataManagerService.dataState.next(this.dataState.setSearchText('so'));
  }
}
