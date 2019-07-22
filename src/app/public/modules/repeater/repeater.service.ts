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

  public activateItem(item: SkyRepeaterItemComponent): void {
    this.items.take(1).subscribe(items => {
      const index = items.indexOf(item);
      if (index > -1) {
        this.activeItemId.next(item.itemId);
      }
    });
  }

  public activateItemByIndex(index: number): void {
    this.items.take(1).subscribe(items => {
      const activeItem = items[index];
      if (activeItem) {
        this.activeItemId.next(activeItem.itemId);
      }
    });
  }

  public addItem(item: SkyRepeaterItemComponent): void {
    this.items.take(1).subscribe((currentItems) => {
      // let lastTabIndex = this.getLastItemIndex(currentItems);
      // if (currentItems && (lastTabIndex || lastTabIndex === 0)) {
      //   item.itemId = lastTabIndex + 1;
      // }
      currentItems.push(item);
      this.items.next(currentItems);
      console.log('add item. new array:');
      console.log(currentItems);
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

  private getLastItemIndex(tabs: Array<SkyRepeaterItemComponent>): number {
    // let result: any = undefined;
    // for (let i = 0; i < tabs.length; i++) {
    //   if (typeof tabs[i].itemId === 'number' &&
    //     (result === undefined || result < tabs[i].itemId)) {
    //     result = tabs[i].itemId;
    //   }
    // }
    return tabs.length;
  }

  private getItemByIndex(index: number, items: Array<SkyRepeaterItemComponent>) {
    return items[index];
    // for (let i = 0, n = items.length; i < n; i++) {
    //   let item = items[i];
    //   if (item.itemId === index) {
    //     return item;
    //   }
    // }
    // return undefined;
  }

  private getIndexByItem(items: Array<SkyRepeaterItemComponent>, item: SkyRepeaterItemComponent): number {
    return items.indexOf(item);
  }
}
