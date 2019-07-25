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

  public activeItemId: BehaviorSubject<string> = new BehaviorSubject(undefined);

  public itemCollapseStateChange = new EventEmitter<SkyRepeaterItemComponent>();

  public items: SkyRepeaterItemComponent[] = [];

  public ngOnDestroy(): void {
    this.activeItemId.complete();
    this.itemCollapseStateChange.complete();
  }

  public activateItemByIndex(index: number): void {
    if (index === undefined) {
      this.activeItemId.next(undefined);
    } else {
        const activeItem = this.items[index];
        if (activeItem) {
          this.activeItemId.next(activeItem.itemId);
        }
    }
  }

  public registerItem(item: SkyRepeaterItemComponent): void {
    this.items.push(item);
  }

  public unregisterItem(item: SkyRepeaterItemComponent): void {
    const indexOfDestroyedItem = this.items.indexOf(item);
    if (indexOfDestroyedItem > -1) {
      if (item.isActive) {
        // Try selecting the next item first.
        // If there's no next item, try selecting the previous one.
        let newActiveItem = this.items[indexOfDestroyedItem + 1] || this.items[indexOfDestroyedItem - 1];
        /*istanbul ignore else */
        if (newActiveItem) {
          this.activeItemId.next(newActiveItem.itemId);
        }
      }
      this.items.splice(indexOfDestroyedItem, 1);
    }
  }

  public onItemCollapseStateChange(item: SkyRepeaterItemComponent): void {
    this.itemCollapseStateChange.emit(item);
  }
}
