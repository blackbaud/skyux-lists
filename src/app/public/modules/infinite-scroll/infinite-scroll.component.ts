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
  SkyDockItem,
  SkyDockService
} from '@skyux/layout';

import {
  Subject
} from 'rxjs/Subject';

import 'rxjs/add/operator/takeWhile';

import {
  SkyInfiniteScrollDomAdapterService
} from './infinite-scroll-dom-adapter.service';

import {
  SkyInfiniteScrollBackToTopComponent
} from './infinite-scroll-back-to-top.component';

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
  }

  public get backToTopTarget(): ElementRef {
    return this._backToTopTarget;
  }

  @Output()
  public scrollEnd = new EventEmitter<void>();

  public isWaiting = false;

  private dockItem: SkyDockItem<SkyInfiniteScrollBackToTopComponent>;

  private ngUnsubscribe = new Subject<void>();

  private _backToTopTarget: ElementRef;

  private _enabled = false;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private elementRef: ElementRef,
    private domAdapter: SkyInfiniteScrollDomAdapterService,
    private dockService: SkyDockService
  ) { }

  public ngOnDestroy(): void {
    this.enabled = false;
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public startInfiniteScrollLoad(): void {
    this.notifyScrollEnd();
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

      // Enable back to top listeners.
      if (this.backToTopTarget) {
        this.domAdapter.elementInViewOnScroll(this.backToTopTarget)
          .takeUntil(this.ngUnsubscribe)
          .subscribe((elementInView: boolean) => {
            // Add back to top button if user scrolls down.
            if (!this.dockItem && !elementInView) {
              this.addBackToTop();
            }
            // Remove back to top button if user scrolls back up.
            if (this.dockItem && elementInView) {
              this.dockItem.destroy();
              this.dockItem = undefined;
            }
        });
      }
    } else {
      this.ngUnsubscribe.next();
    }
  }

  private addBackToTop(): void {
    this.dockItem = this.dockService.insertComponent(SkyInfiniteScrollBackToTopComponent);
    this.dockItem.componentInstance.scrollToTopClick
      .takeUntil(this.ngUnsubscribe)
      .subscribe(() => {
        // Listen for clicks on the "back to top" button so we know when to scroll up.
        this.domAdapter.scrollToElement(this.backToTopTarget);
    });
  }
}
