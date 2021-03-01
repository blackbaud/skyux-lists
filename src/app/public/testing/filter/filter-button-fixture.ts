import {
  DebugElement
} from '@angular/core';

import {
  ComponentFixture
} from '@angular/core/testing';

import {
  SkyAppTestUtility
} from '@skyux-sdk/testing';

/**
 * Provides information for and interaction with a SKY UX filter button component.
 * By using the fixture API, a test insulates itself against updates to the internals
 * of a component, such as changing its DOM structure.
 */
export class SkyFilterButtonFixture {
  private debugElement: DebugElement;

  constructor(
    private fixture: ComponentFixture<any>,
    skyTestId: string
  ) {
    this.debugElement = SkyAppTestUtility.getDebugElementByTestId(this.fixture, skyTestId, 'sky-filter-button');
  }

  public clickFilterButton(): void {
    const button = this.debugElement.nativeElement.querySelector('.sky-filter-btn');
    if (button instanceof HTMLButtonElement && !button.disabled) {
      button.click();
    }
  }
}
