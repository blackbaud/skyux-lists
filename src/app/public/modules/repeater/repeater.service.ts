import {
  EventEmitter,
  Injectable,
  OnDestroy
} from '@angular/core';

import {
  BehaviorSubject
} from 'rxjs/BehaviorSubject';

import {
  SkyRepeaterItemComponent
} from './repeater-item.component';

@Injectable()
export class SkyRepeaterService implements OnDestroy {

  public activeItemChange = new BehaviorSubject<SkyRepeaterItemComponent>(undefined);

  public focusedItemChange = new BehaviorSubject<SkyRepeaterItemComponent>(undefined);

  public itemCollapseStateChange = new EventEmitter<SkyRepeaterItemComponent>();

  public items: SkyRepeaterItemComponent[] = [];

  public ngOnDestroy(): void {
    this.activeItemChange.complete();
    this.itemCollapseStateChange.complete();
  }

  public activateItemByIndex(index: number): void {
    if (index === undefined) {
      this.activeItemChange.next(undefined);
    } else {
      const activeItem = this.items[index];
      if (activeItem) {
        this.activeItemChange.next(activeItem);
      }
    }
  }

  public registerItem(item: SkyRepeaterItemComponent): void {
    this.items.push(item);
  }

  public unregisterItem(item: SkyRepeaterItemComponent): void {
    const indexOfDestroyedItem = this.items.indexOf(item);
    if (indexOfDestroyedItem > -1) {
      this.items.splice(indexOfDestroyedItem, 1);
    }

    // If the removed item had tabindex = 0, the re-assign tabindex 0 to other item.
    if (item.tabIndex === 0) {
      if (this.items[indexOfDestroyedItem]) {
        this.items[indexOfDestroyedItem].tabIndex = 0;
      } else if (this.items[indexOfDestroyedItem - 1]) {
        this.items[indexOfDestroyedItem - 1].tabIndex = 0;
      }
    }
  }

  public onItemCollapseStateChange(item: SkyRepeaterItemComponent): void {
    this.itemCollapseStateChange.emit(item);
  }

  public focusListItem(item: SkyRepeaterItemComponent): void {
    this.focusedItemChange.next(item);
  }

  public focusNextListItem(item: SkyRepeaterItemComponent): void {
    const focusedIndex = this.items.indexOf(item);
    if (this.items.length - 1 > focusedIndex) {
      this.focusedItemChange.next(this.items[focusedIndex + 1]);
    }
  }

  public focusPreviousListItem(item: SkyRepeaterItemComponent): void {
    const focusedIndex = this.items.indexOf(item);
    if (focusedIndex > 0) {
      this.focusedItemChange.next(this.items[focusedIndex - 1]);
    }
  }
}
