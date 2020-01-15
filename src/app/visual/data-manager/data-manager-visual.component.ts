import { Component } from '@angular/core';
import { SkyDataManagerState, SkyDataViewConfig } from '../../public';

@Component({
  selector: 'data-manager-visual',
  templateUrl: './data-manager-visual.component.html'
})
export class DataManagerVisualComponent {

  public activeView: SkyDataViewConfig;

  public dataState = new SkyDataManagerState({
    filterData: {
      hideOrange: true
    }
  });

  public searchSo() {
    this.dataState = this.dataState.setSearchText('so');
  }

  public setActiveView(view: SkyDataViewConfig): void {
    this.activeView = view;
  }
}
