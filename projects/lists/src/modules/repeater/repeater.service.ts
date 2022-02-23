import { EventEmitter, Injectable, OnDestroy } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { SkyRepeaterItemComponent } from './repeater-item.component';

/**
 * @internal
 */
@Injectable()
export class SkyRepeaterService implements OnDestroy {
  public activeItemChange = new BehaviorSubject<SkyRepeaterItemComponent>(
    undefined
  );

  public expandMode: string;

  public itemCollapseStateChange = new EventEmitter<SkyRepeaterItemComponent>();

  public items: SkyRepeaterItemComponent[] = [];

  public orderChange = new BehaviorSubject<void>(undefined);

  public repeaterGroupId: number;

  public ngOnDestroy(): void {
    this.activeItemChange.complete();
    this.itemCollapseStateChange.complete();
    this.orderChange.complete();
  }

  public registerItem(item: SkyRepeaterItemComponent): void {
    this.items.push(item);
  }

  public unregisterItem(item: SkyRepeaterItemComponent): void {
    const indexOfDestroyedItem = this.items.indexOf(item);
    if (indexOfDestroyedItem > -1) {
      this.items.splice(indexOfDestroyedItem, 1);
    }
  }

  public onItemCollapseStateChange(item: SkyRepeaterItemComponent): void {
    this.itemCollapseStateChange.emit(item);
  }

  public getItemIndex(item: SkyRepeaterItemComponent): number {
    return this.items.indexOf(item);
  }

  public registerOrderChange(): void {
    this.orderChange.next();
  }

  public reorderItem(oldIndex: number, newIndex: number): void {
    this.items.splice(newIndex, 0, this.items.splice(oldIndex, 1)[0]);
  }
}
