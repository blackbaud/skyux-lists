import {
  SkyDataViewStateOptions
} from '.';

export class SkyDataViewState {
  public selectedColumnIds: string[] = [];
  public viewId: string;
  public additionalData: any;

  constructor(data?: SkyDataViewStateOptions) {
    if (data) {
      this.viewId = data.viewId;
      this.selectedColumnIds = data.selectedColumnIds || [];
      this.additionalData = data.additionalData;
    }
  }

  public getViewStateOptions(): SkyDataViewStateOptions {
    return {
      viewId: this.viewId,
      selectedColumnIds: this.selectedColumnIds,
      additionalData: this.additionalData
    };
  }

  public setSelectedColumnIds(ids: string[]): SkyDataViewState {
    return new SkyDataViewState({
      viewId: this.viewId,
      selectedColumnIds: ids,
      additionalData: this.additionalData
    });
  }
}
