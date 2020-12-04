import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyToolbarModule
} from '@skyux/layout';

import {
  SkyRepeaterModule
} from '@skyux/lists';

import {
  SortFixtureTestComponent
} from './fixtures/sort-fixture.component.fixture';

import {
  SkySortFixture
} from './sort-fixture';

import {
  SkySortFixtureMenuItem
} from './sort-fixture-menu-item';

import {
  SkySortTestingModule
} from './sort-testing.module';

describe('Sort fixture', () => {
  let fixture: ComponentFixture<SortFixtureTestComponent>;
  let testComponent: SortFixtureTestComponent;
  let sortFixture: SkySortFixture;

  //#region helpers

  async function lookupActiveMenuItem(): Promise<SkySortFixtureMenuItem> {
    return menuLookup((sortFxtr: SkySortFixture) => {
      return sortFxtr.activeMenuItem;
    });
  }

  async function lookupInactiveMenuItem(): Promise<SkySortFixtureMenuItem> {
    return menuLookup((sortFxtr: SkySortFixture) => {
      return sortFxtr.menuItems.find(x => !x.isActive);
    });
  }

  /**
   * This method helps simplify tests which need to get the state of the dropdown menu,
   * which is only available while the menu is open.
   */
  async function menuLookup(
    lookupAction: (x: SkySortFixture) => any
  ): Promise<any> {
    // we want to leave the menu in its original state, so track if it needs to be closed again
    const shouldCloseMenu = !sortFixture.menu.isOpen;

    // make sure the menu is open so we can access the menuItems property
    if (!sortFixture.menu.isOpen) {
      await sortFixture.toggleMenu();
    }
    expect(sortFixture.menu.isOpen).toBeTrue();

    // perform the lookup action
    const result = lookupAction(sortFixture);

    if (shouldCloseMenu) {
      await sortFixture.toggleMenu();
    }

    expect(sortFixture.menu.isOpen).toBe(!shouldCloseMenu);
    return result;
  }

  //#endregion

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [
        SortFixtureTestComponent
      ],
      imports: [
        SkyRepeaterModule,
        SkySortTestingModule,
        SkyToolbarModule
      ]
    });

    fixture = TestBed.createComponent(
      SortFixtureTestComponent
    );
    testComponent = fixture.componentInstance;
    sortFixture = new SkySortFixture(fixture, SortFixtureTestComponent.dataSkyId);

    fixture.detectChanges();
    await fixture.whenStable();
  });

  describe('Sort menu', () => {

    it('should expose default menu properties', () => {
      expect(sortFixture.menu.buttonText).toEqual('Sort');
      expect(sortFixture.menu.isOpen).toBeFalse();
    });

  });

  describe('Menu items', () => {

    it('should return undefined for menu items when the menu is closed', () => {
      expect(sortFixture.menu.isOpen).toBeFalse();
      expect(sortFixture.menuItems).toBeUndefined();
    });

    it('should expose menu item properties', async () => {
      // open the menu so we can access the menuItems property
      await sortFixture.toggleMenu();
      expect(sortFixture.menu.isOpen).toBeTrue();

      // grab the menu items
      const menuItems = sortFixture.menuItems;

      // verify the count is the same and each item is represented
      expect(menuItems.length).toEqual(testComponent.sortOptions.length);
      menuItems.forEach((item: SkySortFixtureMenuItem) => {

        // there should be an associated sort option
        const option = testComponent.sortOptions.find(x => x.label === item.text);
        expect(option).toExist();

        // verify each property (text was already verified)
        expect(item.isActive).toEqual(option.id === testComponent.initialState);
      });
    });

  });

  describe('Toggle menu', () => {

    it('should open and close the dropdown', async () => {
      expect(sortFixture.menu.isOpen).toBeFalse();
      await sortFixture.toggleMenu();
      expect(sortFixture.menu.isOpen).toBeTrue();
      await sortFixture.toggleMenu();
      expect(sortFixture.menu.isOpen).toBeFalse();
    });

  });

  describe('Select menu item by text', () => {

    it('should select inactive item if available', async () => {
      const sortItemsSpy = spyOn(fixture.componentInstance, 'sortItems');
      const existingSelection = await lookupActiveMenuItem();
      const newSelection = await lookupInactiveMenuItem();
      expect(existingSelection.text).not.toEqual(newSelection.text);

      // select the inactive option
      await sortFixture.toggleMenu();
      await sortFixture.selectMenuItemByText(newSelection.text);

      // verify the new selection was made
      const resultingSelection = await lookupActiveMenuItem();
      expect(resultingSelection.text).toEqual(newSelection.text);
      expect(sortItemsSpy).toHaveBeenCalledWith(
        jasmine.objectContaining({
          label: newSelection.text
        })
      );
    });

    it('should do nothing if item is already active', async () => {
      const sortItemsSpy = spyOn(fixture.componentInstance, 'sortItems');
      const existingSelection = await lookupActiveMenuItem();

      // select the active option
      await sortFixture.toggleMenu();
      await sortFixture.selectMenuItemByText(existingSelection.text);

      // verify nothing changed
      const resultingSelection = await lookupActiveMenuItem();
      expect(resultingSelection.text).toEqual(existingSelection.text);
      expect(sortItemsSpy).toHaveBeenCalledWith(
        jasmine.objectContaining({
          label: existingSelection.text
        })
      );
    });

    it('should do nothing if item is not available', async () => {
      const sortItemsSpy = spyOn(fixture.componentInstance, 'sortItems');
      const invalidOption = 'some-invalid-option';
      const existingSelection = await lookupActiveMenuItem();

      // try to select an invalid option
      await sortFixture.toggleMenu();
      await sortFixture.selectMenuItemByText(invalidOption);

      // verify nothing changed
      const resultingSelection = await lookupActiveMenuItem();
      expect(resultingSelection.text).toEqual(existingSelection.text);
      expect(sortItemsSpy).not.toHaveBeenCalled();
    });

    it('should automatically open a menu for selection if it is closed', async () => {
      const sortItemsSpy = spyOn(fixture.componentInstance, 'sortItems');
      const existingSelection = await lookupActiveMenuItem();
      const newSelection = await lookupInactiveMenuItem();
      expect(existingSelection.text).not.toEqual(newSelection.text);

      // ensure the menu is closed for our test case
      expect(sortFixture.menu.isOpen).toBeFalse();

      // select the inactive option
      await sortFixture.selectMenuItemByText(newSelection.text);

      // verify the new selection was made
      const resultingSelection = await lookupActiveMenuItem();
      expect(resultingSelection.text).toEqual(newSelection.text);
      expect(sortItemsSpy).toHaveBeenCalledWith(
        jasmine.objectContaining({
          label: newSelection.text
        })
      );
    });

  });

});
