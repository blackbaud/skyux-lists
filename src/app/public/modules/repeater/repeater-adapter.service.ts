import {
  ElementRef,
  Injectable
} from '@angular/core';

import {
  SkyCoreAdapterService,
  SkyFocusableChildrenOptions
} from '@skyux/core';

import {
  SkyRepeaterService
} from './repeater.service';

@Injectable()
export class SkyRepeaterAdapterService {
  private host: ElementRef;

  constructor(
    private repeaterService: SkyRepeaterService,
    private skyAdapterService: SkyCoreAdapterService
  ) {}

  public getFocusableChildren(element: HTMLElement, options: SkyFocusableChildrenOptions): HTMLElement[] {
    return this.skyAdapterService.getFocusableChildren(element, options);
  }

  public setTabIndexOfFocusableElems(element: HTMLElement, tabIndex: number): void {
    const focusableElems = this.skyAdapterService.getFocusableChildren(element);
    let index = focusableElems.length;
    while (index--) {
      focusableElems[index].tabIndex = tabIndex;
    }
  }

  public setRepeaterHost(hostRef: ElementRef): void {
    this.host = hostRef;
  }

  public moveItemUp(elementRef: ElementRef, top = false, steps = 1): number {
    const itemArray = this.getRepeaterItemArray();
    const index = itemArray.indexOf(elementRef.nativeElement);

    if (index === 0) {
      return;
    }

    let newIndex = index - steps;

    if (top || newIndex < 0) {
      newIndex = 0;
    }

    return this.moveItem(elementRef, index, newIndex);
  }

  public moveItemDown(elementRef: ElementRef, steps = 1): number {
    const itemArray = this.getRepeaterItemArray();
    const index = itemArray.indexOf(elementRef.nativeElement);

    if (index === itemArray.length - steps) {
      return;
    }

    let newIndex = index + steps;

    return this.moveItem(elementRef, index, newIndex);
  }

  private moveItem(itemRef: ElementRef, oldIndex: number, newIndex: number): number {
    const repeaterDiv: HTMLElement = this.host.nativeElement.querySelector('.sky-repeater');

    repeaterDiv.removeChild(itemRef.nativeElement);
    const nextSibling = repeaterDiv.querySelectorAll('sky-repeater-item')[newIndex];

    repeaterDiv.insertBefore(itemRef.nativeElement, nextSibling);
    this.repeaterService.reorderItem(oldIndex, newIndex);

    return newIndex;
  }

  private getRepeaterItemArray() {
    return Array.from(this.host.nativeElement.querySelectorAll('sky-repeater-item'));
  }
}
