import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ElementRef
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

  public set childFocusIndex(value: number) {
    if (value !== this._childFocusIndex) {
      this._childFocusIndex = value;
      if (this.focusableChildren.length > 0 && value !== undefined) {
        this.focusableChildren[value].focus();
      } else {
        this.elementRef.nativeElement.focus();
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

  public set tabIndex(value: number) {
    this._tabIndex = value;
  }

  public get tabIndex(): number {
    return this._tabIndex;
  }

  private focusableChildren: HTMLElement[] = [];

  private ngUnsubscribe = new Subject<void>();

  private _childFocusIndex: number;

  private _isCollapsible = true;

  private _isExpanded = true;

  private _isSelected = false;

  private _tabIndex: number = -1;

  constructor(
    private adapterService: SkyRepeaterAdapterService,
    private changeDetector: ChangeDetectorRef,
    private elementRef: ElementRef,
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
    });
  }

  public ngAfterViewInit(): void {
    // Wait for node to render, then reset all child tabIndexes to -1.
    setTimeout(() => {
      this.focusableChildren = this.adapterService.getFocusableChildren(this.elementRef.nativeElement);
      this.adapterService.setTabIndexOfFocusableElems(this.elementRef.nativeElement, -1);
    });
  }

  public ngOnDestroy(): void {
    this.collapse.complete();
    this.expand.complete();
    this.inlineFormClose.complete();

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

  // Cycle backwards through interactive child elements
  // If user reaches the beginning, focus on item.
  public onArrowLeft(event: KeyboardEvent): void {
    /* istanbul ignore else */
    if (document.activeElement === event.target) {
      if (this.childFocusIndex !== undefined) {
        if (this.childFocusIndex === 0) {
          this.childFocusIndex = undefined;
        } else {
          this.childFocusIndex--;
        }
      } else {
        this.elementRef.nativeElement.focus();
      }
      event.stopPropagation();
    }
  }

  // Cyle forward through interactive child elements.
  // If user reaches the end, do nothing.
  public onArrowRight(event: KeyboardEvent): void {
    /* istanbul ignore else */
    if (document.activeElement === event.target) {
      if (this.focusableChildren.length <= 0 || this.childFocusIndex === this.focusableChildren.length - 1) {
        // Do nothing...
      } else {
        if (this.childFocusIndex === undefined) {
          this.childFocusIndex = 0;
        } else {
          this.childFocusIndex++;
        }
      }

      event.stopPropagation();
    }
  }

  // TODO: Arrow up and down

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
  }

  public onInlineFormClose(inlineFormCloseArgs: SkyInlineFormCloseArgs): void {
    this.inlineFormClose.emit(inlineFormCloseArgs);
  }

  private slideForExpanded(animate: boolean): void {
    this.slideDirection = this.isExpanded ? 'down' : 'up';
  }
}
