import {
  Component
} from '@angular/core';

import {
  SkyModalInstance
} from '@skyux/modals';

import {
  SkyDataManagerFilterModalContext
} from '../../public/modules/data-manager';

@Component({
  selector: 'sky-demo-filter-modal-form',
  templateUrl: './data-filter-modal.component.html'
})
export class SkyDataManagerFiltersModalDemoComponent {

  public fruitType: string;

  public hideOrange: boolean;

  constructor(
    public context: SkyDataManagerFilterModalContext,
    public instance: SkyModalInstance
  ) {
      this.fruitType = this.context.filterData && this.context.filterData.type ?
        this.context.filterData.type : 'any';
      this.hideOrange = this.context.filterData && this.context.filterData.hideOrange ?
        this.context.filterData.hideOrange : false;
    }

  public applyFilters() {
    let result = {
      type: this.fruitType,
      hideOrange: this.hideOrange
    };

    this.instance.save(result);
  }

  public clearAllFilters() {
    this.hideOrange = false;
    this.fruitType = 'any';
  }

  public cancel() {
    this.instance.cancel();
  }
}
