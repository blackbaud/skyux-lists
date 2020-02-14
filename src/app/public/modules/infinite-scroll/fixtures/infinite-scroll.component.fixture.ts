import {
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';

import {
  SkyInfiniteScrollComponent
} from '../infinite-scroll.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './infinite-scroll.component.fixture.html'
})
export class SkyInfiniteScrollTestComponent {

  public backToTopTarget: ElementRef;

  public enabled: boolean;

  public items: object[] = [];

  @ViewChild('infiniteScrollComponent')
  public infiniteScrollComponent: SkyInfiniteScrollComponent;

  @ViewChildren('listItem')
  public repeaterItems: QueryList<ElementRef>;

  @ViewChild('wrapper')
  public wrapper: ElementRef;

  public onScrollEnd(): void {
    const num: number = this.items.length;
    for (let i: number = num; i < num + 10; i++) {
      this.items.push({
        name: `test object: #${i}`
      });
    }
  }

  public loadItems(numItems: number): void {
    this.items = [];
    for (let i = 0; i < numItems; i++) {
      this.items.push({
        name: 'test object: #' + i
      });
    }
  }
}
