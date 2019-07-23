import {
  AfterContentInit,
  Component,
  ContentChildren,
  Input,
  QueryList,
  OnChanges,
  OnDestroy,
  SimpleChanges
} from '@angular/core';

import 'rxjs/add/operator/distinctUntilChanged';

import {
  Subject
} from 'rxjs/Subject';

import {
  SkyRepeaterItemComponent
} from './repeater-item.component';

import {
  SkyRepeaterService
} from './repeater.service';

@Component({
  selector: 'sky-repeater',
  styleUrls: ['./repeater.component.scss'],
  templateUrl: './repeater.component.html',
  providers: [SkyRepeaterService]
})
export class SkyRepeaterComponent implements AfterContentInit, OnChanges, OnDestroy {

  @Input()
  public activeIndex: number;

  @Input()
  public set expandMode(value: string) {
    this._expandMode = value;
    this.updateForExpandMode();
  }

  public get expandMode(): string {
    return this._expandMode || 'none';
  }

  @ContentChildren(SkyRepeaterItemComponent)
  public items: QueryList<SkyRepeaterItemComponent>;

  private ngUnsubscribe = new Subject<void>();

  private _expandMode = 'none';

  constructor(
    private repeaterService: SkyRepeaterService
  ) {
    this.repeaterService.itemCollapseStateChange
      .takeUntil(this.ngUnsubscribe)
      .subscribe((item: SkyRepeaterItemComponent) => {
        if (this.expandMode === 'single' && item.isExpanded) {
          this.items.forEach((otherItem) => {
            if (otherItem !== item && otherItem.isExpanded) {
              otherItem.isExpanded = false;
            }
          });
        }
      });

    this.updateForExpandMode();
  }

  public ngAfterContentInit() {
    // Initialize each item's index (in case items are instantiated out of order).
    this.items.forEach(item => item.initializeItem());
    this.items.changes
      .takeUntil(this.ngUnsubscribe)
      .subscribe((change: QueryList<SkyRepeaterItemComponent>) => {
        change
          .filter(item => this.repeaterService.items.indexOf(item) < 0)
          .forEach(item => item.initializeItem());
      });

    // If activeIndex has been set on init, call service to activate the appropriate item.
    setTimeout(() => {
      if (this.activeIndex || this.activeIndex === 0) {
        this.repeaterService.activateItemByIndex(this.activeIndex);
      }
    });

    // Watch for changes on the service's activeItemId and activate the appropriate item.
    this.repeaterService.activeItemId
      .takeUntil(this.ngUnsubscribe)
      .distinctUntilChanged()
      .subscribe((activeItemId) => {
        // HACK: Not selecting the active item in a timeout causes an error.
        // https://github.com/angular/angular/issues/6005
        setTimeout(() => {
          const activeItem = this.items.find(item => {
            return item.itemId === activeItemId;
          });
          const activeIndex = this.items.toArray().indexOf(activeItem);
          if (activeIndex !== this.activeIndex) {
            this.activeIndex = activeIndex;
          }
        });
    });

    // HACK: Not updating for expand mode in a timeout causes an error.
    // https://github.com/angular/angular/issues/6005
    this.items.changes
      .takeUntil(this.ngUnsubscribe)
      .subscribe(() => {
        setTimeout(() => {
          this.updateForExpandMode(this.items.last);
        }, 0);
      });

    setTimeout(() => {
      this.updateForExpandMode();
    }, 0);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['activeIndex'] && changes['activeIndex'].currentValue !== changes['activeIndex'].previousValue) {
      this.repeaterService.activateItemByIndex(this.activeIndex);
    }
  }

  public ngOnDestroy(): void {
    this.repeaterService.destroy();

    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private updateForExpandMode(itemAdded?: SkyRepeaterItemComponent) {
    if (this.items) {
      let foundExpanded = false;
      let isCollapsible = this.expandMode !== 'none';
      let isSingle = this.expandMode === 'single';

      // Keep any newly-added expanded item expanded and collapse the rest.
      if (itemAdded && itemAdded.isExpanded) {
        foundExpanded = true;
      }

      this.items.forEach((item) => {
        item.isCollapsible = isCollapsible;

        if (item !== itemAdded && isSingle && item.isExpanded) {
          if (foundExpanded) {
            item.updateForExpanded(false, false);
          }

          foundExpanded = true;
        }
      });
    }
  }
}
