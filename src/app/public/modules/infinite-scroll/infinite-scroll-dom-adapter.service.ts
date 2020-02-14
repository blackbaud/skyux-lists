import {
  ElementRef,
  EventEmitter,
  Injectable,
  OnDestroy
} from '@angular/core';

import {
  SkyAppWindowRef
} from '@skyux/core';

import {
  Observable
} from 'rxjs/Observable';

import {
  Subject
} from 'rxjs/Subject';

import 'rxjs/add/observable/fromEvent';

import 'rxjs/add/operator/filter';

@Injectable()
export class SkyInfiniteScrollDomAdapterService implements OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  private observer: MutationObserver;

  private _parentChanges = new EventEmitter<void>();

  constructor(
    private windowRef: SkyAppWindowRef
  ) { }

  public ngOnDestroy(): void {
    this._parentChanges.complete();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * This event is triggered when child nodes are added to the infinite
   * scroll parent container. e.g., A repeating list of elements was added.
   * @param elementRef The infinite scroll element reference.
   */
  public parentChanges(elementRef: ElementRef): Observable<void> {
    this.createObserver(elementRef.nativeElement);
    return this._parentChanges;
  }

  /**
   * This event is triggered when the provided element reference
   * is visible (or scrolled to) within its scrollable parent container.
   * @param elementRef The infinite scroll element reference.
   */
  public scrollTo(elementRef: ElementRef): Observable<void> {
    const parent = this.findScrollableParent(elementRef.nativeElement);

    return Observable
      .fromEvent(parent, 'scroll')
      .takeUntil(this.ngUnsubscribe)
      .filter(() => {
        return this.isElementScrolledInView(
          elementRef.nativeElement,
          parent
        );
    }).map(() => undefined); // Change to void return type
  }

  /**
   * This event returns a boolean on scroll indicating whether the provided element is in view.
   * @param elementRef The target element reference.
   */
  public elementInViewOnScroll(elementRef: ElementRef): Observable<boolean> {
    const parent = this.findScrollableParent(elementRef.nativeElement);

    return Observable
      .fromEvent(parent, 'scroll')
      .takeUntil(this.ngUnsubscribe)
      .map(() => {
        const isInView = this.isElementScrolledInView(
          elementRef.nativeElement,
          parent
        );
        return isInView;
    });
  }

  /**
   * Scrolls the window or scrollable parent to the provided element.
   * @param elementRef The target element reference.
   */
  public scrollToElement(elementRef: ElementRef): void {
    /* sanity check */
    /* istanbul ignore if */
    if (!elementRef || !elementRef.nativeElement) {
      return;
    }

    const windowObj = this.windowRef.nativeWindow;
    const parent = this.findScrollableParent(elementRef.nativeElement);

    if (parent === windowObj) {
      this.windowRef.nativeWindow.scrollTo(
        elementRef.nativeElement.offsetLeft,
        elementRef.nativeElement.offsetTop
      );
    } else {
      parent.scrollTop = elementRef.nativeElement.offsetTop;
    }
  }

  private createObserver(element: any): void {
    this.observer = new MutationObserver((mutations: MutationRecord[]) => {
      const hasUpdates = !!mutations.find((mutation) => {
        return (
          !element.contains(mutation.target) &&
          mutation.addedNodes.length > 0
        );
      });

      if (hasUpdates) {
        this._parentChanges.emit();
      }
    });

    const windowObj = this.windowRef.nativeWindow;
    const parent = this.findScrollableParent(element);
    const observedParent = (parent === windowObj) ? windowObj.document.body : parent;

    this.observer.observe(
      observedParent,
      {
        childList: true,
        subtree: true
      }
    );
  }

  private findScrollableParent(element: any): any {
    const regex = /(auto|scroll)/;
    const windowObj = this.windowRef.nativeWindow;
    const bodyObj = windowObj.document.body;

    let style = windowObj.getComputedStyle(element);
    let parent = element;

    do {
      parent = parent.parentNode;
      style = windowObj.getComputedStyle(parent);
    } while (
      !regex.test(style.overflow) &&
      !regex.test(style.overflowY) &&
      parent !== bodyObj
    );

    if (parent === bodyObj) {
      return windowObj;
    }

    return parent;
  }

  private isElementScrolledInView(
    element: any,
    parentElement: any
  ): boolean {
    const windowObj = this.windowRef.nativeWindow;
    const elementRect = element.getBoundingClientRect();

    if (parentElement === windowObj) {
      return (elementRect.top >= 0) && (elementRect.bottom <= window.innerHeight);
    }

    const parentRect = parentElement.getBoundingClientRect();
    return (elementRect.top >= 0) && (elementRect.bottom <= parentRect.height);
  }
}
