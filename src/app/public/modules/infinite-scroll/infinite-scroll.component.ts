import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output
} from '@angular/core';

import {
  Subject
} from 'rxjs/Subject';

import 'rxjs/add/operator/takeWhile';

import {
  SkyInfiniteScrollDomAdapterService
} from './infinite-scroll-dom-adapter.service';

@Component({
  selector: 'sky-infinite-scroll',
  templateUrl: './infinite-scroll.component.html',
  styleUrls: ['./infinite-scroll.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    SkyInfiniteScrollDomAdapterService
  ]
})
export class SkyInfiniteScrollComponent implements OnDestroy {

  @Input()
  public get enabled(): boolean {
    return this._enabled;
  }
  public set enabled(value: boolean) {
    if (this._enabled !== value) {
      this._enabled = value;
      this.setListeners();
    }
  }

  /**
   * Indicates whether to display a back to top button when users scroll past the provided target element.
   */
  @Input()
  public set backToTopTarget(value: ElementRef) {
    this._backToTopTarget = value;
    if (value) {
        this.domAdapter.elementInViewOnScroll(this.backToTopTarget)
          .takeUntil(this.ngUnsubscribe)
          .subscribe((inView: boolean) => {
            if (this.enabled && this.backToTopTarget) {
              this.showScrollToTopButton = !inView;
            }
        });
    }
  }

  public get backToTopTarget(): ElementRef {
    return this._backToTopTarget;
  }

  @Output()
  public scrollEnd = new EventEmitter<void>();

  public isWaiting = false;

  public set showScrollToTopButton(value: boolean) {
    if (this._showScrollToTopButton !== value) {
      this._showScrollToTopButton = value;
      this.changeDetector.markForCheck();
    }
  }

  public get showScrollToTopButton(): boolean {
    return this._showScrollToTopButton;
  }

  private ngUnsubscribe = new Subject<void>();

  private _backToTopTarget: ElementRef;

  private _enabled = false;

  private _showScrollToTopButton: boolean = false;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private elementRef: ElementRef,
    private domAdapter: SkyInfiniteScrollDomAdapterService
  ) { }

  public ngOnDestroy(): void {
    this.enabled = false;
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public startInfiniteScrollLoad(): void {
    this.notifyScrollEnd();
  }

  public onScrollToTopClick(): void {
    this.domAdapter.scrollToElement(this.backToTopTarget);
  }

  private notifyScrollEnd(): void {
    this.isWaiting = true;
    this.scrollEnd.emit();
    this.changeDetector.markForCheck();
  }

  private setListeners(): void {
    if (this.enabled) {
      // The user has scrolled to the infinite scroll element.
      this.domAdapter.scrollTo(this.elementRef)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(() => {
          if (!this.isWaiting && this.enabled) {
            this.notifyScrollEnd();
          }
      });

      // New items have been loaded into the parent element.
      this.domAdapter.parentChanges(this.elementRef)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(() => {
          if (this.isWaiting) {
            this.isWaiting = false;
            this.changeDetector.markForCheck();
          }
      });
    } else {
      this.ngUnsubscribe.next();
    }
  }
}
