import {
  SkyDataViewStateOptions
} from '.';

export class SkyDataViewState {
  public displayedColumnIds: string[] = [];
  public viewId: string;
  public additionalData: any;

  constructor(data?: SkyDataViewStateOptions) {
    if (data) {
      this.viewId = data.viewId;
      this.displayedColumnIds = data.displayedColumnIds || [];
      this.additionalData = data.additionalData;
    }
  }

  public getViewStateOptions(): SkyDataViewStateOptions {
    return {
      viewId: this.viewId,
      displayedColumnIds: this.displayedColumnIds,
      additionalData: this.additionalData
    };
  }

  public setDisplayedColumnIds(ids: string[]): SkyDataViewState {
    return new SkyDataViewState({
      viewId: this.viewId,
      displayedColumnIds: ids,
      additionalData: this.additionalData
    });
  }
}
