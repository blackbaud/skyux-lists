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
 * Provides information for and interaction with a SKY UX infinite scroll component.
 * By using the fixture API, a test insulates itself against updates to the internals
 * of a component, such as changing its DOM structure.
 */
export class SkyInfiniteScrollFixture {
  private debugElement: DebugElement;

  constructor(
    private fixture: ComponentFixture<any>,
    skyTestId: string
  ) {
    this.debugElement = SkyAppTestUtility.getDebugElementByTestId(fixture, skyTestId, 'sky-infinite-scroll');

    this.waitForComponentInitialization();
  }

  public get loadMoreButtonIsVisible(): boolean {
    return this.getButton() instanceof HTMLButtonElement;
  }

  public clickLoadMoreButton(): void {
    const button = this.getButton();
    if (button instanceof HTMLButtonElement) {
      button.click();
    }
  }

  private getButton() {
    return this.debugElement.nativeElement.querySelector('.sky-infinite-scroll .sky-btn');
  }

  private async waitForComponentInitialization(): Promise<void> {
    this.fixture.detectChanges();
    await this.fixture.whenStable();

    this.fixture.detectChanges();
    return this.fixture.whenStable();
  }
}
