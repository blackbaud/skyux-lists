import {
  Component
} from '@angular/core';

@Component({
  selector: 'infinite-scroll-visual',
  templateUrl: './infinite-scroll-visual.component.html'
})
export class InfiniteScrollVisualComponent {
  public firstList: any[] = [
    0, 1
  ];
  public secondList: any[] = [
    0, 1
  ];

  public secondEnabled = true;

  public addToFirst() {
    this.firstList.push(this.firstList.length);
    this.firstList.push(this.firstList.length);
  }

  public addToSecond() {
    this.secondList.push(this.secondList.length);
    this.secondList.push(this.secondList.length);
  }
}
