import {
  Injectable
} from '@angular/core';

import {
  SkyCoreAdapterService
} from '@skyux/core';

@Injectable()
export class SkyRepeaterAdapterService {

  constructor(
    private skyAdapterService: SkyCoreAdapterService
  ) { }

  public getFocusableChildren(element: HTMLElement): HTMLElement[] {
    return this.skyAdapterService.getFocusableChildren(element);
  }

  public setTabIndexOfFocusableElems(element: HTMLElement, tabIndex: number) {
    const focusableElems = this.skyAdapterService.getFocusableChildren(element);
    let index = focusableElems.length;
    while (index--) {
      focusableElems[index].tabIndex = tabIndex;
    }
  }
}
