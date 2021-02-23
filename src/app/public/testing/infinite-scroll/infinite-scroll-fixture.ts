import {
  DebugElement
} from '@angular/core';
import {ComponentFixture} from '@angular/core/testing';
import {SkyAppTestUtility} from '@skyux-sdk/testing';

/**
 * Provides information for and interaction with a SKY UX infinite scroll component.
 * By using the fixture API, a test insulates itself against updates to the internals
 * of a component, such as changing its DOM structure.
 */
export class SkyInfiniteScrollFixture {
  private debugElement: DebugElement;
  private skyBtnSelector = 'div.sky-infinite-scroll > button.sky-btn';

  constructor(
    private fixture: ComponentFixture<any>,
    skyTestId: string
  ) {
    this.debugElement = SkyAppTestUtility.getDebugElementByTestId(fixture, skyTestId, 'sky-infinite-scroll');

    this.waitForComponentInitialization();
  }

  public isEnabled(): boolean {
    return !!this.debugElement.componentInstance.enabled;
  }

  public isButtonAvailable() {
    return this.debugElement.nativeElement.querySelector(this.skyBtnSelector) instanceof HTMLButtonElement;
  }

  public clickLoadMoreButton() {
    const button = this.debugElement.nativeElement.querySelector(this.skyBtnSelector);
    if (button instanceof HTMLButtonElement) {
      return button.click();
    }
    throw new DOMException('The "load more" button is not available.');
  }

  private async waitForComponentInitialization(): Promise<void> {
    this.fixture.detectChanges();
    await this.fixture.whenStable();

    this.fixture.detectChanges();
    return this.fixture.whenStable();
  }
}
