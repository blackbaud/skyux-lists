import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

import {
  Observable,
  Subject
} from 'rxjs';

/**
 * @internal
 */
@Component({
  selector: 'sky-infinite-scroll-back-to-top',
  templateUrl: './infinite-scroll-back-to-top.component.html',
  styleUrls: [
    './infinite-scroll-back-to-top.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyInfiniteScrollBackToTopComponent {

  public get scrollToTopClick(): Observable<void> {
    return this._scrollToTopClick.asObservable();
  }

  private _scrollToTopClick = new Subject<void>();

  public onScrollToTopClick(): void {
    this._scrollToTopClick.next();
    this._scrollToTopClick.complete();
  }

}
