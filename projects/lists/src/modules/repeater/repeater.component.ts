import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { DragulaService } from 'ng2-dragula';

import { Subject } from 'rxjs';

import { startWith, takeUntil } from 'rxjs/operators';

import { SkyRepeaterItemComponent } from './repeater-item.component';

import { SkyRepeaterService } from './repeater.service';

import { SkyRepeaterAdapterService } from './repeater-adapter.service';

import { FocusKeyManager, FocusMonitor } from '@angular/cdk/a11y';

import { SelectionModel } from '@angular/cdk/collections';

let uniqueId = 0;

/**
 * Creates a container to display repeater items.
 */
@Component({
  selector: 'sky-repeater',
  styleUrls: ['./repeater.component.scss'],
  templateUrl: './repeater.component.html',
  providers: [SkyRepeaterService, SkyRepeaterAdapterService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyRepeaterComponent
  implements AfterContentInit, OnChanges, OnDestroy
{
  /**
   * Specifies the index of the repeater item to visually highlight as active.
   * For example, use this property in conjunction with the
   * [split view component](https://developer.blackbaud.com/skyux/components/split-view)
   * to highlight a repeater item while users edit it. Only one item can be active at a time.
   */
  @Input()
  public activeIndex: number;

  /**
   * Specifies an ARIA label for the repeater list.
   * This sets the repeater list's `aria-label` attribute
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * @default 'List of items'
   */
  @Input()
  public ariaLabel: string;

  /**
   * Indicates whether users can change the order of items in the repeater list.
   * Each repeater item also has `reorderable` property to indicate whether
   * users can change its order.
   */
  @Input()
  public reorderable: boolean = false;

  /**
   * Specifies a layout to determine which repeater items are expanded by default and whether
   * repeater items are expandable and collapsible. Collapsed items display titles only.
   * The valid options are `multiple`, `none`, and `single`.
   * - `multiple` loads repeater items in an expanded state unless `isExpanded` is set to
   * `false` for a repeater item. This layout allows users to expand and collapse
   * as many repeater items as necessary. It is best-suited to repeater items where body
   * content is important but users don't always need to see it.
   * - `none` loads all repeater items in an expanded state and does not allow users to
   * collapse them. This default layout provides the quickest access to the details in the
   * repeater items. It is best-suited to repeater items with concise content
   * that users need to view frequently.
   * - `single` loads one repeater item in an expanded state and collapses all others.
   * The expanded repeater item is the first one where `isExpanded` is set to `true`. This layout
   * allows users to expand one item at a time. It provides the most compact view and is
   * best-suited to repeater items where the most important information is in the titles
   * and users only occasionally need to view the body content.
   * @default none
   */
  @Input()
  public set expandMode(value: string) {
    this.repeaterService.expandMode = value;
    this._expandMode = value;
    this.updateForExpandMode();
  }

  public get expandMode(): string {
    return this._expandMode || 'none';
  }

  /**
   * Fires when the active repeater item changes.
   */
  @Output()
  public activeIndexChange = new EventEmitter<number>();

  /**
   * Fires when users change the order of repeater items.
   * This event emits an ordered array of the `tag` properties that the consumer provides for each repeater item.
   */
  @Output()
  public orderChange = new EventEmitter<any[]>();

  @ContentChildren(SkyRepeaterItemComponent)
  public items!: QueryList<SkyRepeaterItemComponent>;

  @ViewChild('listboxRef', { read: ElementRef })
  public listboxRef: ElementRef;

  public dragulaGroupName: string;

  public tabIndex = -1;

  private dragulaUnsubscribe = new Subject<void>();

  /**
   * @internal
   */
  public keyManager: FocusKeyManager<SkyRepeaterItemComponent>;

  /**
   * @internal
   */
  public get multipleSelectMode(): boolean {
    return this._multipleSelectMode;
  }
  public set multipleSelectMode(value: boolean) {
    if (value !== this._multipleSelectMode) {
      this._multipleSelectMode = value;
      this.selectionModel = new SelectionModel(this._multipleSelectMode);
    }
  }

  /**
   * @internal
   */
  public selectionModel = new SelectionModel<SkyRepeaterItemComponent>(
    this.multipleSelectMode
  );

  private ngUnsubscribe = new Subject<void>();

  private _expandMode = 'none';

  private _multipleSelectMode: boolean = true;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private repeaterService: SkyRepeaterService,
    private adapterService: SkyRepeaterAdapterService,
    private dragulaService: DragulaService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private focusMonitor: FocusMonitor
  ) {
    this.dragulaGroupName = `sky-repeater-dragula-${++uniqueId}`;

    this.repeaterService.itemCollapseStateChange
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((item: SkyRepeaterItemComponent) => {
        if (this.expandMode === 'single' && item.isExpanded) {
          this.items.forEach((otherItem) => {
            if (
              otherItem !== item &&
              otherItem.isExpanded &&
              otherItem.isCollapsible
            ) {
              otherItem.isExpanded = false;
            }
          });
        }
      });

    this.repeaterService.activeItemIndexChange
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((index: number) => {
        if (index !== this.activeIndex) {
          this.activeIndex = index;
          this.activeIndexChange.emit(index);
        }
      });

    this.repeaterService.orderChange
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.emitTags();
      });

    this.repeaterService.repeaterGroupId = uniqueId;

    this.updateForExpandMode();

    this.adapterService.setRepeaterHost(this.elementRef);

    this.initializeDragAndDrop();
  }

  public ngAfterContentInit(): void {
    this.keyManager = new FocusKeyManager<SkyRepeaterItemComponent>(
      this.items
    ).withWrap();

    // If the user attempts to tab out of the selection list, allow focus to escape.
    this.keyManager.tabOut.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.allowFocusEscape();
    });

    // When the number of options change, update the tabindex of the selection list.
    this.items.changes.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.updateTabIndex();
    });

    setTimeout(() => {
      this.focusMonitor
        .monitor(this.listboxRef)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((origin) => {
          if (origin === 'keyboard' || origin === 'program') {
            let toFocus = 0;
            for (let i = 0; i < this.items.length; i++) {
              if (this.items.get(i)?.isActive) {
                toFocus = i;
                break;
              }
            }
            console.log(toFocus);
            this.keyManager.setActiveItem(toFocus);

            // TODO: should also support shift+tab to go backwards
          }
        });
    });

    // If activeIndex has been set on init, call service to activate the appropriate item.
    setTimeout(() => {
      if (this.activeIndex || this.activeIndex === 0) {
        this.items.get(this.activeIndex).toggleSelection();
        // this.repeaterService.activateItemByIndex(this.activeIndex);
      }

      if (this.reorderable && !this.everyItemHasTag()) {
        console.warn(
          'Please supply tag properties for each repeater item when reordering functionality is enabled.'
        );
      }
    });

    // HACK: Not updating for expand mode in a timeout causes an error.
    // https://github.com/angular/angular/issues/6005
    this.items.changes.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      setTimeout(() => {
        if (!!this.items.last) {
          this.updateForExpandMode(this.items.last);
          this.items.last.reorderable = this.reorderable;
        }

        if (this.activeIndex !== undefined) {
          this.items.get(this.activeIndex).toggleSelection();
          // this.repeaterService.activateItemByIndex(this.activeIndex);
        }
      });
    });

    setTimeout(() => {
      this.updateForExpandMode();

      this.items.forEach((item) => {
        item.reorderable = this.reorderable;
      });
    }, 0);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['activeIndex']) {
      this.multipleSelectMode = false;
      if (
        changes['activeIndex'].currentValue !==
        changes['activeIndex'].previousValue
      ) {
        this.items?.get(this.activeIndex).toggleSelection();
        // this.repeaterService.activateItemByIndex(this.activeIndex);
      }
    }

    if (changes.reorderable) {
      if (this.items) {
        this.items.forEach((item) => (item.reorderable = this.reorderable));
      }

      this.changeDetector.markForCheck();
    }
  }

  public ngOnDestroy(): void {
    this.focusMonitor.stopMonitoring(this.listboxRef);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.destroyDragAndDrop();
  }

  public onKeydown(event: KeyboardEvent) {
    /*istanbul ignore else */
    if (event.key) {
      switch (event.key.toLowerCase()) {
        case ' ':
        case 'enter':
          const focusedItem = this.getFocusedItem();
          if (event.target === focusedItem.itemRef.nativeElement) {
            this.toggleFocusedOption();
            event.preventDefault();
          }
          break;

        default:
          this.keyManager.onKeydown(event);
          break;
      }
    }
  }

  /** Toggles the state of the currently focused option if enabled. */
  private toggleFocusedOption(): void {
    const focusedItem = this.getFocusedItem();
    if (!focusedItem) {
      return;
    }

    /* istanbul ignore else */
    if (this.isItemSelectable(focusedItem)) {
      focusedItem.toggleSelection();

      // TODO: DO WE NEED THIS?
      // Emit a change event because the focused option changed its state through user
      // interaction.
    }
  }

  /**
   * Utility to ensure all indexes are valid.
   * @param index The index to be checked.
   * @returns True if the index is valid for our list of items.
   */
  private isValidIndex(index: number): boolean {
    return index >= 0 && index < this.items.length;
  }

  private updateForExpandMode(itemAdded?: SkyRepeaterItemComponent): void {
    if (this.items) {
      let foundExpanded = false;
      let isCollapsible = this.expandMode !== 'none';
      let isSingle = this.expandMode === 'single';

      // Keep any newly-added expanded item expanded and collapse the rest.
      if (itemAdded && itemAdded.isExpanded) {
        foundExpanded = true;
      }

      this.items.forEach((item) => {
        item.isCollapsible = isCollapsible && !!item.hasItemContent;

        if (item !== itemAdded && isSingle && item.isExpanded) {
          if (foundExpanded) {
            item.updateForExpanded(false, false);
          }

          foundExpanded = true;
        }
      });
    }
  }

  private initializeDragAndDrop(): void {
    /* Sanity check that we haven't already set up dragging abilities */
    /* istanbul ignore else */
    if (!this.dragulaService.find(this.dragulaGroupName)) {
      this.dragulaService.setOptions(this.dragulaGroupName, {
        moves: (
          el: HTMLElement,
          container: HTMLElement,
          handle: HTMLElement
        ) => {
          const target = el.querySelector('.sky-repeater-item-grab-handle');
          return this.reorderable && target && target.contains(handle);
        },
      });
    }

    let draggedItemIndex: number;

    this.dragulaService.drag
      .pipe(takeUntil(this.dragulaUnsubscribe))
      .subscribe(([groupName, subject]: any[]) => {
        /* istanbul ignore else */
        if (groupName === this.dragulaGroupName) {
          this.renderer.addClass(subject, 'sky-repeater-item-dragging');
          draggedItemIndex = this.adapterService.getRepeaterItemIndex(subject);
        }
      });

    this.dragulaService.dragend
      .pipe(takeUntil(this.dragulaUnsubscribe))
      .subscribe(([groupName, subject]: any[]) => {
        /* istanbul ignore else */
        if (groupName === this.dragulaGroupName) {
          this.renderer.removeClass(subject, 'sky-repeater-item-dragging');
          let newItemIndex = this.adapterService.getRepeaterItemIndex(subject);

          /* sanity check */
          /* istanbul ignore else */
          if (draggedItemIndex >= 0) {
            this.repeaterService.reorderItem(draggedItemIndex, newItemIndex);
            draggedItemIndex = undefined;
          }

          this.emitTags();
        }
      });
  }

  private destroyDragAndDrop(): void {
    this.dragulaUnsubscribe.next();
    this.dragulaUnsubscribe.complete();
    this.dragulaUnsubscribe = undefined;

    /* Sanity check that we have set up dragging abilities */
    /* istanbul ignore else */
    if (this.dragulaService.find(this.dragulaGroupName)) {
      this.dragulaService.destroy(this.dragulaGroupName);
    }
  }

  private emitTags(): void {
    const tags = this.repeaterService.items.map((item) => item.tag);
    this.orderChange.emit(tags);
  }

  private everyItemHasTag(): boolean {
    /* sanity check */
    /* istanbul ignore if */
    if (!this.items || this.items.length === 0) {
      return false;
    }
    return this.items.toArray().every((item) => {
      return item.tag !== undefined;
    });
  }

  /**
   * Returns true if either one of the conditions is met:
   * 1. `activeIndex` is bound (single select mode)
   * 2. item is selectable
   */
  private isItemSelectable(item: SkyRepeaterItemComponent): boolean {
    /* istanbul ignore if */
    if (!item) {
      return false;
    }

    return !this.multipleSelectMode || item?.selectable;
    // return !!this.activeIndex || (item?.selectable &&
    // (this.multipleSelectMode || !item.isSelected))
  }

  private getFocusedItem(): SkyRepeaterItemComponent | undefined {
    let focusedIndex = this.keyManager.activeItemIndex;

    /* istanbul ignore else */
    if (focusedIndex != null && this.isValidIndex(focusedIndex)) {
      return this.items.get(focusedIndex);
    }
  }
  /**
   * Removes the tabindex from the selection list and resets it back afterwards, allowing the user
   * to tab out of it. This prevents the list from capturing focus and redirecting it back within
   * the list, creating a focus trap if it user tries to tab away.
   */
  private allowFocusEscape() {
    this.tabIndex = -1;

    setTimeout(() => {
      this.tabIndex = 0;
      console.log('allowFocusEscape', this.tabIndex);
      this.changeDetector.markForCheck();
    });
  }

  /** Updates the tabindex based upon if the selection list is empty. */
  private updateTabIndex(): void {
    this.tabIndex = this.items.length === 0 ? -1 : 0;
    console.log('updateTabIndex', this.tabIndex);
  }
}
