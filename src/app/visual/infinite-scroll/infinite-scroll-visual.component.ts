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

  public showScrollableContainer: boolean = false;

  @ViewChildren(SkyRepeaterItemComponent, { read: ElementRef })
  private repeaterItems: QueryList<ElementRef>;

  public ngAfterViewInit(): void {
    this.setBackToTopTarget();
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

  public toggleScrollableContainer(): void {
    this.showScrollableContainer = !this.showScrollableContainer;
    this.setBackToTopTarget();
  }

  /**
   * Set the first repeater item as the "back to top" target.
   * The setTimeout avoids an ExpressionChangedAfterItHasBeenCheckedError.
   */
  private setBackToTopTarget(): void {
    setTimeout(() => {
      this.backToTopTarget = this.repeaterItems.first;
    });
  }
}
