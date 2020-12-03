import {
  DebugElement
} from '@angular/core';

import {
  ComponentFixture
} from '@angular/core/testing';

import {
  By
} from '@angular/platform-browser';

import {
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  SkySortFixtureMenu
} from './sort-fixture-menu';

import {
  SkySortFixtureMenuItem
} from './sort-fixture-menu-item';

/**
 * Provides information for and interaction with a SKY UX sort component.
 * By using the fixture API, a test insulates itself against updates to the internals
 * of a component, such as changing its DOM structure.
 */
export class SkySortFixture {

  /**
   * The active sort menu item, if one exists. Menu items are only available when the menu dropdown
   * is open. If the menu dropdown is closed, this property will be undefined.
   */
  public get activeMenuItem(): SkySortFixtureMenuItem {
    return this.menuItems?.find(x => x.isActive);
  }

  /**
   * The sort menu's properties.
   */
  public get menu(): SkySortFixtureMenu {
    return {
      buttonText: SkyAppTestUtility.getText(this.getSortButtonTextSpan()),
      isOpen: this.getDropdownMenuEl() !== null
    };
  }

  /**
   * The properties of each sort menu item. Menu items are only available when the menu dropdown
   * is open. If the menu dropdown is closed, this property will be undefined.
   */
  public get menuItems(): SkySortFixtureMenuItem[] {
    // Return undefined when we can't determine what the options are.
    // We do this to avoid any confusion with an empty set of options.
    if (!this.menu.isOpen) {
      return undefined;
    }

    return this.getSortItems()
      .map((item: HTMLElement) => {
        const itemButton = item.querySelector('button');

        return {
          isActive: item.classList.contains('sky-sort-item-selected'),
          text: SkyAppTestUtility.getText(itemButton)
        };
      });
  }

  private _debugEl: DebugElement;

  constructor(
    private fixture: ComponentFixture<any>,
    skyTestId: string
  ) {
    this._debugEl = SkyAppTestUtility.getDebugElementByTestId(fixture, skyTestId, 'sky-sort');
  }

  /**
   * Ensures the sort menu is open and selects the menu item with the specified text,
   * if a matching item is available.
   * @param menuItemText The text of the menu item to select.
   */
  public async selectMenuItem(menuItemText: string): Promise<void> {

    // make sure the sort menu is open
    if (!this.menu.isOpen) {
      await this.toggleMenu();
    }

    // find the requested menu item
    const items = this.getSortItems();
    const targetItem = items.find((item: HTMLElement) => {
      return SkyAppTestUtility.getText(item) === menuItemText;
    });

    // if we found the item, select it
    if (targetItem) {
      // we've got the '.sky-sort-item' div, but we want to click it's child button element
      const targetButton = targetItem.querySelector('button');
      targetButton.click();

      this.fixture.detectChanges();
      return this.fixture.whenStable();
    }
  }

  /**
   * Toggles the sort dropdown menu open or closed.
   */
  public async toggleMenu(): Promise<void> {
    const menu = this.getDropdownButtonEl();

    if (menu !== undefined && !menu.disabled) {
      menu.click();

      this.fixture.detectChanges();
      await this.fixture.whenStable();

      this.fixture.detectChanges();
      return this.fixture.whenStable();
    }
  }

  //#region helpers

  private getDropdownButtonEl(): HTMLButtonElement {
    return this._debugEl.query(
      By.css('.sky-dropdown-button')
    )?.nativeElement as HTMLButtonElement;
  }

  private getDropdownMenuEl(): HTMLElement {
    return document.querySelector('sky-overlay .sky-dropdown-menu');
  }

  private getSortButtonTextSpan(): HTMLElement {
    return this._debugEl.query(
      By.css('.sky-sort-btn-text')
    )?.nativeElement as HTMLElement;
  }

  private getSortItems(): HTMLElement[] {
    const resultNodes = document.querySelectorAll(
      'sky-overlay .sky-sort-item'
    );
    return Array.prototype.slice.call(resultNodes);
  }

  //#endregion
}
