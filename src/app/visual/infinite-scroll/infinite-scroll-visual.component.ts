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

  public firstList: any[] = [
    0, 1
  ];

  @ViewChildren(SkyRepeaterItemComponent, { read: ElementRef })
  public repeaterItems: QueryList<ElementRef>;

  public backToTopTarget: ElementRef;

  public secondList: any[] = [
    0, 1
  ];

  public secondEnabled = true;

  public ngAfterViewInit(): void {
    // Once repeater items are loaded, set the first repeater item as the "back to top" target.
    // The setTimeout avoids an ExpressionChangedAfterItHasBeenCheckedError.
    setTimeout(() => {
      this.backToTopTarget = this.repeaterItems.first;
    });
  }

  public addToFirst() {
    setTimeout(() => {
      this.firstList.push(this.firstList.length);
      this.firstList.push(this.firstList.length);
      this.firstList.push(this.firstList.length);
      this.firstList.push(this.firstList.length);
      this.firstList.push(this.firstList.length);
    }, 1000);
  }

  public addToSecond() {
    setTimeout(() => {
      this.secondList.push(this.secondList.length);
      this.secondList.push(this.secondList.length);
      this.secondList.push(this.secondList.length);
      this.secondList.push(this.secondList.length);
      this.secondList.push(this.secondList.length);
    }, 1000);
  }
}
