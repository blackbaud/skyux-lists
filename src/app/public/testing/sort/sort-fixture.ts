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
  private _debugEl: DebugElement;

  /**
   * The sort menu's properties.
   */
  public get sortMenu(): SkySortFixtureMenu {
    return {
      buttonText: SkyAppTestUtility.getText(this.getSortButtonTextSpan()),
      isOpen: this.getDropdownMenuEl() !== undefined
    };
  }

  /**
   * The sort menu items.
   */
  public get sortMenuItems(): SkySortFixtureMenuItem[] {
    return this.getSortItems()
      .map((item: HTMLElement) => {
        const itemButton = item.querySelector('button');

        return {
          isActive: item.classList.contains('sky-sort-item-selected'),
          text: SkyAppTestUtility.getText(itemButton)
        };
      });
  }

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
  public async selectSortMenuItem(menuItemText: string): Promise<void> {
    // try get the menu items, which tells us if the sky-overlay is already open or not
    let menuItems = this.getSortItems();

    // ==================================================================================================================
    // TODO: does this return an empty array if nothing was found?
    // ==================================================================================================================

    // if we didn't find any items, open the menu and try again
    if (!menuItems) {
      await this.toggleSortMenu();
      menuItems = this.getSortItems();
    }

    // find the requested menu item
    const targetItem = menuItems.find((item: HTMLElement) => {
      return SkyAppTestUtility.getText(item) === menuItemText;
    });

    // if we found the item, select it
    if (targetItem) {
      targetItem.click();
      this.fixture.detectChanges();
      return this.fixture.whenStable();
    }
  }

  /**
   * Toggles the sort dropdown menu open or closed.
   */
  public async toggleSortMenu(): Promise<void> {
    const menu = this.getDropdownButtonEl();

    if (menu !== undefined && !menu.disabled) {
      menu.click();

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
