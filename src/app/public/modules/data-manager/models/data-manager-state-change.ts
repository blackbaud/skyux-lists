import {
  SkyDataManagerState
} from './data-manager-state';

export class SkyDataManagerStateChange {
  public dataState: SkyDataManagerState;
  public source: string;

  constructor(dataState: SkyDataManagerState, source: string) {
    this.dataState = new SkyDataManagerState(dataState.getStateOptions());
    this.source = source;
  }
}
