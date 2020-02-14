import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  ViewChildren
} from '@angular/core';

import {
  SkyRepeaterItemComponent
} from '../../public';

@Component({
  selector: 'infinite-scroll-visual',
  templateUrl: './infinite-scroll-visual.component.html'
})
export class InfiniteScrollVisualComponent implements AfterViewInit {

  public backToTopTarget: ElementRef;

  public enabled: boolean = true;

  public items: any[] = [
    0, 1, 2, 3, 4, 5
  ];

  @ViewChildren(SkyRepeaterItemComponent, { read: ElementRef })
  public repeaterItems: QueryList<ElementRef>;

  public ngAfterViewInit(): void {
    // Once repeater items are loaded, set the first repeater item as the "back to top" target.
    // The setTimeout avoids an ExpressionChangedAfterItHasBeenCheckedError.
    setTimeout(() => {
      this.backToTopTarget = this.repeaterItems.first;
    });
  }

  public loadMore() {
    setTimeout(() => {
      this.items.push(this.items.length);
      this.items.push(this.items.length);
      this.items.push(this.items.length);
      this.items.push(this.items.length);
      this.items.push(this.items.length);
    }, 1000);
  }
}
