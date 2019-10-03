import {
  Injectable
} from '@angular/core';

import {
  SkyCoreAdapterService,
  SkyFocusableChildrenOptions
} from '@skyux/core';

@Injectable()
export class SkyRepeaterAdapterService {

  constructor(
    private skyAdapterService: SkyCoreAdapterService
  ) { }

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
}
