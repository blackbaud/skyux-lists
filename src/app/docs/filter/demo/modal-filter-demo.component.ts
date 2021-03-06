import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component
} from '@angular/core';

import {
  SkyModalCloseArgs,
  SkyModalService
} from '@skyux/modals';

import {
  ModalFilterDemoContext
} from './modal-filter-demo-context';

import {
  ModalFilterDemoModalComponent
} from './modal-filter-demo-modal.component';

@Component({
  selector: 'app-modal-filter-demo',
  templateUrl: './modal-filter-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalFilterDemoComponent {

  public appliedFilters: any[] = [];

  public filteredItems: any[];

  public items: any[] = [
    {
      name: 'Orange',
      type: 'citrus',
      color: 'orange'
    },
    {
      name: 'Mango',
      type: 'other',
      color: 'orange'
    },
    {
      name: 'Lime',
      type: 'citrus',
      color: 'green'
    },
    {
      name: 'Strawberry',
      type: 'berry',
      color: 'red'
    },
    {
      name: 'Blueberry',
      type: 'berry',
      color: 'blue'
    }
  ];

  public showInlineFilters: boolean = false;

  constructor(
    private modal: SkyModalService,
    private changeRef: ChangeDetectorRef
  ) {
    this.filteredItems = this.items.slice();
  }

  public onDismiss(index: number): void {
    this.appliedFilters.splice(index, 1);
    this.filteredItems = this.filterItems(this.items, this.appliedFilters);
  }

  public onInlineFilterButtonClicked(): void {
    this.showInlineFilters = !this.showInlineFilters;
  }

  public onModalFilterButtonClick(): void {
    let modalInstance = this.modal.open(
      ModalFilterDemoModalComponent,
      [{
        provide: ModalFilterDemoContext,
        useValue: {
          appliedFilters: this.appliedFilters
        }
      }]
    );

    modalInstance.closed.subscribe((result: SkyModalCloseArgs) => {
      if (result.reason === 'save') {
        this.appliedFilters = result.data.slice();
        this.filteredItems = this.filterItems(this.items, this.appliedFilters);
        this.changeRef.markForCheck();
      }
    });
  }

  private fruitTypeFilterFailed(filter: any, item: any): boolean {
    return filter.name === 'fruitType' && filter.value !== 'any' && filter.value !== item.type;
  }

  private itemIsShown(filters: any[], item: any[]): boolean {
    let passesFilter = true,
        j: number;

    for (j = 0; j < filters.length; j++) {
      if (this.orangeFilterFailed(filters[j], item)) {
        passesFilter = false;
      } else if (this.fruitTypeFilterFailed(filters[j], item)) {
        passesFilter = false;
      }
    }

    return passesFilter;
  }

  private filterItems(items: any[], filters: any[]): any[] {
    let i: number,
      passesFilter: boolean,
      result: any[] = [];

    for (i = 0; i < items.length; i++) {
      passesFilter = this.itemIsShown(filters, items[i]);
      if (passesFilter) {
        result.push(items[i]);
      }
    }

    return result;
  }

  private orangeFilterFailed(filter: any, item: any): boolean {
    return filter.name === 'hideOrange' && filter.value && item.color === 'orange';
  }
}
