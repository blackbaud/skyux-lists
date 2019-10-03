import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';

import {
  skyAnimationSlide
} from '@skyux/animations';

import {
  SkyLogService
} from '@skyux/core';

import {
  SkyCheckboxChange
} from '@skyux/forms';

import {
  SkyInlineFormCloseArgs,
  SkyInlineFormConfig
} from '@skyux/inline-form';

import {
  Subject
} from 'rxjs/Subject';

import {
  SkyRepeaterAdapterService
} from './repeater-adapter.service';

import {
  SkyRepeaterService
} from './repeater.service';

let nextContentId: number = 0;

@Component({
  selector: 'sky-repeater-item',
  styleUrls: ['./repeater-item.component.scss'],
  templateUrl: './repeater-item.component.html',
  animations: [skyAnimationSlide]
})
export class SkyRepeaterItemComponent implements AfterViewInit, OnDestroy, OnInit {

  @Input()
  public inlineFormConfig: SkyInlineFormConfig;

  @Input()
  public inlineFormTemplate: TemplateRef<any>;

  @Input()
  public set isExpanded(value: boolean) {
    this.updateForExpanded(value, true);
  }

  public get isExpanded(): boolean {
    return this._isExpanded;
  }

  @Input()
  public set isSelected(value: boolean) {
    this._isSelected = value;
  }

  public get isSelected(): boolean {
    return this._isSelected;
  }

  @Input()
  public selectable: boolean = false;

  @Input()
  public showInlineForm: boolean = false;

  @Output()
  public collapse = new EventEmitter<void>();

  @Output()
  public expand = new EventEmitter<void>();

  @Output()
  public inlineFormClose = new EventEmitter<SkyInlineFormCloseArgs>();

  @Output()
  public isSelectedChange = new EventEmitter<boolean>();

  public set childFocusIndex(value: number) {
    const focusableChildren = this.adapterService.getFocusableChildren(
      this.itemRef.nativeElement,
      {
        ignoreTabIndex: true
      }
    );
    if (value !== this._childFocusIndex) {
      this._childFocusIndex = value;
      if (focusableChildren.length > 0 && value !== undefined) {
        focusableChildren[value].focus();
      } else {
        this.itemRef.nativeElement.focus();
      }
    }
  }

  public get childFocusIndex(): number {
    return this._childFocusIndex;
  }

  public contentId: string = `sky-radio-content-${++nextContentId}`;

  public isActive: boolean = false;

  public set isCollapsible(value: boolean) {
    if (this.isCollapsible !== value) {
      this._isCollapsible = value;

      /*istanbul ignore else */
      if (!value) {
        this.updateForExpanded(true, false);
      }
    }

    this.changeDetector.markForCheck();
  }

  public get isCollapsible(): boolean {
    return this._isCollapsible;
  }

  public slideDirection: string;

  public tabIndex: number = -1;

  @ViewChild('skyRepeaterItem', { read: ElementRef })
  private itemRef: ElementRef;

  private ngUnsubscribe = new Subject<void>();

  private _childFocusIndex: number;

  private _isCollapsible = true;

  private _isExpanded = true;

  private _isSelected = false;

  constructor(
    private adapterService: SkyRepeaterAdapterService,
    private changeDetector: ChangeDetectorRef,
    private logService: SkyLogService,
    private repeaterService: SkyRepeaterService
  ) {
    this.slideForExpanded(false);
  }

  public ngOnInit(): void {
    setTimeout(() => {
      this.repeaterService.registerItem(this);
      this.repeaterService.activeItemChange
        .takeUntil(this.ngUnsubscribe)
        .subscribe((item: SkyRepeaterItemComponent) => {
          this.isActive = this === item;
          this.changeDetector.markForCheck();
      });

      // When service emits a focus change, set the tabIndex and browser focus.
      this.repeaterService.focusedItemChange
        .takeUntil(this.ngUnsubscribe)
        .subscribe((item: SkyRepeaterItemComponent) => {
          if (this === item) {
            this.tabIndex = 0;
            this.itemRef.nativeElement.focus();
          } else {
            this.tabIndex = -1;
          }
      });
    });
  }

  public ngAfterViewInit(): void {
    // Wait for item to render, then reset all child tabIndexes to -1.
    setTimeout(() => {
      this.adapterService.setTabIndexOfFocusableElems(this.itemRef.nativeElement, -1);
    }, 1000);
  }

  public ngOnDestroy(): void {
    this.collapse.complete();
    this.expand.complete();
    this.inlineFormClose.complete();
    this.isSelectedChange.complete();

    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

    this.repeaterService.unregisterItem(this);
  }

  public headerClick(): void {
    if (this.isCollapsible) {
      this.updateForExpanded(!this.isExpanded, true);
    }
  }

  public chevronDirectionChange(direction: string): void {
    this.updateForExpanded(direction === 'up', true);
  }

  // Cycle backwards through interactive child elements.
  // If user reaches the beginning, focus on parent item.
  public onArrowLeft(event: KeyboardEvent): void {
    const focusableChildren = this.adapterService.getFocusableChildren(
      this.itemRef.nativeElement,
      {
        ignoreTabIndex: true
      }
    );
    if (focusableChildren.length > 0) {
      if (this.childFocusIndex > 0) {
        this.childFocusIndex--;
      } else if (this.childFocusIndex === 0) {
        this.childFocusIndex = undefined;
      }
    }
    event.stopPropagation();
    event.preventDefault();
  }

  // Cyle forward through interactive child elements.
  // If user reaches the end, do nothing.
  public onArrowRight(event: KeyboardEvent): void {
    const focusableChildren = this.adapterService.getFocusableChildren(
      this.itemRef.nativeElement,
      {
        ignoreTabIndex: true
      }
    );
    if (focusableChildren.length > 0) {
      if (this.childFocusIndex < focusableChildren.length - 1) {
        this.childFocusIndex++;
      } else if (this.childFocusIndex === undefined) {
        this.childFocusIndex = 0;
      }
    }
    event.stopPropagation();
    event.preventDefault();
  }

  public onArrowUp(event: KeyboardEvent): void {
    this.childFocusIndex = undefined;
    this.repeaterService.focusPreviousListItem(this);
    event.preventDefault();
    event.stopPropagation();
  }

  public onArrowDown(event: KeyboardEvent): void {
    this.childFocusIndex = undefined;
    this.repeaterService.focusNextListItem(this);
    event.preventDefault();
    event.stopPropagation();
  }

  // The dropdown compoment supports enter, space, and arrow keys. This event listner will
  // prevent those keyboard controls from bubbling up to tree view component.
  public onContextMenuKeydown(event: KeyboardEvent): void {
    const reservedKeys = ['enter', ' ', 'arrowdown', 'arrowup'];
    if (reservedKeys.indexOf(event.key.toLowerCase()) > -1) {
      event.stopPropagation();
    }
  }

  public onEnter(event: KeyboardEvent): void {
    // Unlike the arrow keys, enter should never execute unless focused on the parent item element.
    if (event.target === this.itemRef.nativeElement) {
      this.toggleSelected();
      event.preventDefault();
    }
  }

  public onFocus(): void {
    this.childFocusIndex = undefined;
  }

  public onRepeaterItemClick(event: any): void {
    this.repeaterService.focusListItem(this);
  }

  public onSpace(event: KeyboardEvent): void {
    // Unlike the arrow keys, space should never execute unless focused on the parent item element.
    if (event.target === this.itemRef.nativeElement) {
      this.toggleSelected();
      event.preventDefault();
    }
  }

  public updateForExpanded(value: boolean, animate: boolean): void {
    if (this.isCollapsible === false && value === false) {
      this.logService.warn(
        `Setting isExpanded to false when the repeater item is not collapsible
        will have no effect.`
      );
    } else if (this._isExpanded !== value) {
      this._isExpanded = value;

      if (this._isExpanded) {
        this.expand.emit();
      } else {
        this.collapse.emit();
      }

      this.repeaterService.onItemCollapseStateChange(this);
      this.slideForExpanded(animate);
      this.changeDetector.markForCheck();
    }
  }

  public updateIsSelected(value: SkyCheckboxChange): void {
    this._isSelected = value.checked;
    this.isSelectedChange.emit(this._isSelected);
  }

  public onInlineFormClose(inlineFormCloseArgs: SkyInlineFormCloseArgs): void {
    this.inlineFormClose.emit(inlineFormCloseArgs);
  }

  private slideForExpanded(animate: boolean): void {
    this.slideDirection = this.isExpanded ? 'down' : 'up';
  }

  private toggleSelected(): void {
    if (this.selectable) {
      this.isSelected = !this.isSelected;
    }
  }
}
