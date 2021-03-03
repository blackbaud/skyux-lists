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
export class SkyFilterFixtureButton {
  private debugElement: DebugElement;

  constructor(
    private fixture: ComponentFixture<any>,
    skyTestId: string
  ) {
    this.debugElement = SkyAppTestUtility.getDebugElementByTestId(this.fixture, skyTestId, 'sky-filter-button');
  }

  /**
   * Click the button to apply the filter.
   */
  public async clickFilterButton(): Promise<any> {
    const button = this.getButton();
    if (button instanceof HTMLButtonElement && !button.disabled) {
      button.click();
    }
    this.fixture.detectChanges();
    return this.fixture.whenStable();
  }

  /**
   * Get the button text.
   */
  public get buttonText(): string {
    const text = this.getButton()?.innerText;
    return SkyFilterFixtureButton.normalizeText(text);
  }

  /**
   * Get the button id.
   */
  public get id(): string {
    return this.getButton()?.id;
  }

  /**
   * Get the button ARIA label.
   */
  public get ariaLabel(): string {
    const button = this.getButton();
    if (button instanceof Element && button.hasAttribute('aria-label')) {
      return SkyFilterFixtureButton.normalizeText(button.getAttribute('aria-label'));
    }
    return '';
  }

  /**
   * Get the button ARIA title.
   */
  public get ariaTitle(): string {
    const button = this.getButton();
    if (button instanceof Element && button.hasAttribute('aria-title')) {
      return SkyFilterFixtureButton.normalizeText(button.getAttribute('aria-title'));
    }
    return '';
  }

  private getButton(): HTMLButtonElement | null {
    return this.debugElement.nativeElement.querySelector('.sky-filter-btn');
  }

  private static normalizeText(text: string): string {
    return (text || '').replace(/\s+/, ' ').replace(/^ | $/g, '');
  }
}
