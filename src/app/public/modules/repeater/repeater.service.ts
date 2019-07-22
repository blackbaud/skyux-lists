import {
  EventEmitter,
  Injectable
} from '@angular/core';

import {
  BehaviorSubject
} from 'rxjs/BehaviorSubject';

import {
  SkyRepeaterItemComponent
} from './repeater-item.component';

@Injectable()
export class SkyRepeaterService {

  public activeItemId: BehaviorSubject<string> = new BehaviorSubject(undefined);

  public itemCollapseStateChange = new EventEmitter<SkyRepeaterItemComponent>();

  public items: BehaviorSubject<Array<SkyRepeaterItemComponent>> = new BehaviorSubject<Array<SkyRepeaterItemComponent>>([]);

  public activateItemByIndex(index: number): void {
    if (index === undefined) {
      this.activeItemId.next(undefined);
    } else {
      this.items.take(1).subscribe(items => {
        const activeItem = items[index];
        if (activeItem) {
          this.activeItemId.next(activeItem.itemId);
        }
      });
    }
  }

  public addItem(item: SkyRepeaterItemComponent): void {
    this.items.take(1).subscribe((currentItems) => {
      currentItems.push(item);
      this.items.next(currentItems);
    });
  }

  public destroyItem(item: SkyRepeaterItemComponent): void {
    this.items.take(1).subscribe((items) => {
      const indexOfDestroyedItem = items.indexOf(item);
      if (indexOfDestroyedItem > -1) {
        if (item.active) {
          // Try selecting the next item first.
          // If there's no next item, try selecting the previous one.
          let newActiveItem = items[indexOfDestroyedItem + 1] || items[indexOfDestroyedItem - 1];
          /*istanbul ignore else */
          if (newActiveItem) {
            this.activeItemId.next(newActiveItem.itemId);
          }
        }
        items.splice(indexOfDestroyedItem, 1);
      }
      this.items.next(items);
    });
  }

  public destroy(): void {
    this.items.complete();
    this.activeItemId.complete();
    this.itemCollapseStateChange.complete();
  }

  public onItemCollapseStateChange(item: SkyRepeaterItemComponent): void {
    this.itemCollapseStateChange.emit(item);
  }
}
