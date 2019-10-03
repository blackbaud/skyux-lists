import {
  async,
  ComponentFixture,
  fakeAsync,
  flush,
  inject,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  expect,
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  SkyInlineFormButtonLayout
} from '@skyux/inline-form';

import {
  SkyLogService
} from '@skyux/core';

import {
  RepeaterTestComponent
} from './fixtures/repeater.component.fixture';

import {
  SkyRepeaterFixturesModule
} from './fixtures/repeater-fixtures.module';

import {
  RepeaterInlineFormFixtureComponent
} from './fixtures/repeater-inline-form.component.fixture';

describe('Repeater item component', () => {
  class MockLogService {
    public warn(message: any) { }
  }

  // #region helpers
  function flushDropdownTimer() {
    flush();
  }

  function getRepeaterItems(el: HTMLElement): NodeListOf<HTMLElement> {
    return el.querySelectorAll('.sky-repeater-item');
  }

  function getDropdowns(el: HTMLElement): NodeListOf<HTMLElement> {
    return el.querySelectorAll('.sky-dropdown-button') as NodeListOf<HTMLElement>;
  }

  function getChevrons(el: HTMLElement): NodeListOf<HTMLElement> {
    return el.querySelectorAll('sky-chevron button') as NodeListOf<HTMLElement>;
  }

  function getLinks(el: HTMLElement): NodeListOf<HTMLElement> {
    return document.querySelectorAll('a') as NodeListOf<HTMLElement>;
  }
  // #endregion

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyRepeaterFixturesModule
      ]
    });
  });

  it(
    'should default expand mode to "none" when no expand mode is specified',
    fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;
      cmp.expandMode = undefined;

      fixture.detectChanges();

      tick();

      expect(cmp.repeater.expandMode).toBe('none');

      flushDropdownTimer();
    })
  );

  it('should have aria-control set pointed at content', fakeAsync(() => {
    let fixture = TestBed.createComponent(RepeaterTestComponent);
    let el = fixture.nativeElement;

    fixture.detectChanges();
    tick();

    expect(el.querySelector('sky-chevron').getAttribute('aria-controls'))
      .toBe(el.querySelector('.sky-repeater-item-content').getAttribute('id'));

    flushDropdownTimer();
  }));

  it('should be accessible', async(() => {
    let fixture = TestBed.createComponent(RepeaterTestComponent);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));

  describe('keyboard controls', () => {
    let fixture: ComponentFixture<RepeaterTestComponent>;
    let cmp: RepeaterTestComponent;
    let el: any;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(RepeaterTestComponent);
      cmp = fixture.componentInstance;
      cmp.showContextMenu = true;
      el = fixture.nativeElement;
      fixture.detectChanges();
      tick(1000); // Allow repeater-item.component to set tabindexes & render context dropdown.
      fixture.detectChanges();
    }));

    it('should initialize with only the first repeater item being tabbable', () => {
      const items = getRepeaterItems(el);

      expect(items[0].tabIndex).toEqual(0);
      expect(items[1].tabIndex).toEqual(-1);
      expect(items[2].tabIndex).toEqual(-1);
    });

    it('should give the focused repeater item a tabIndex of 0, and the rest a tabIndex of -1', () => {
      const items = getRepeaterItems(el);

      items[1].click();
      fixture.detectChanges();

      expect(items[0].tabIndex).toEqual(-1);
      expect(items[1].tabIndex).toEqual(0);
      expect(items[2].tabIndex).toEqual(-1);
    });

    it('should disable tabbing for all node children', () => {
      const links = getLinks(el);
      const dropdowns = getDropdowns(el);
      const chevrons = getChevrons(el);

      Array.from(links).forEach(link => {
        expect(link.tabIndex).toEqual(-1);
      });
      Array.from(dropdowns).forEach(dropdown => {
        expect(dropdown.tabIndex).toEqual(-1);
      });
      Array.from(chevrons).forEach(chevron => {
        expect(chevron.tabIndex).toEqual(-1);
      });
    });

    it('should move between focusable children elements with left/right arrows', () => {
      const links = getLinks(el);
      const dropdowns = getDropdowns(el);
      const chevrons = getChevrons(el);
      const items = getRepeaterItems(el);

      // Press right arrow key on first node.
      SkyAppTestUtility.fireDomEvent(items[0], 'focus');
      SkyAppTestUtility.fireDomEvent(items[0], 'keydown', {
        keyboardEventInit: {
          key: 'ArrowRight'
        }
      });

      // Expect first interactive child element to be selected (dropdown).
      expect(document.activeElement).toEqual(dropdowns[0]);

      // Press right arrow one more time.
      SkyAppTestUtility.fireDomEvent(items[0], 'keydown', {
        keyboardEventInit: {
          key: 'ArrowRight'
        }
      });

      // Expect second interactive child element to be selected (chevron).
      expect(document.activeElement).toEqual(chevrons[0]);

      // Press right arrow one more time.
      SkyAppTestUtility.fireDomEvent(items[0], 'keydown', {
        keyboardEventInit: {
          key: 'ArrowRight'
        }
      });

      // Expect third interactive child element to be selected (link).
      expect(document.activeElement).toEqual(links[0]);

      // Press left arrow key three times to go back.
      SkyAppTestUtility.fireDomEvent(items[0], 'keydown', {
        keyboardEventInit: {
          key: 'ArrowLeft'
        }
      });
      SkyAppTestUtility.fireDomEvent(items[0], 'keydown', {
        keyboardEventInit: {
          key: 'ArrowLeft'
        }
      });
      SkyAppTestUtility.fireDomEvent(items[0], 'keydown', {
        keyboardEventInit: {
          key: 'ArrowLeft'
        }
      });

      // Active focus should move back to first repeater item.
      expect(document.activeElement).toEqual(items[0]);
    });

    it('should move between nodes with up/down arrows', () => {
      const items = getRepeaterItems(el);

      // Focus on repeater and press down arrow twice.
      SkyAppTestUtility.fireDomEvent(items[0], 'focus');
      SkyAppTestUtility.fireDomEvent(items[0], 'keydown', {
        keyboardEventInit: {
          key: 'ArrowDown'
        }
      });
      SkyAppTestUtility.fireDomEvent(items[1], 'keydown', {
        keyboardEventInit: {
          key: 'ArrowDown'
        }
      });

      // Expect focus to be on third repeater item.
      expect(document.activeElement).toBe(items[2]);

      // Press up arrow key.
      SkyAppTestUtility.fireDomEvent(items[2], 'keydown', {
        keyboardEventInit: {
          key: 'ArrowUp'
        }
      });

      // Expect focus to be on second repeater item.
      expect(document.activeElement).toBe(items[1]);
    });

    it('should prevent enter key from bubbling beyond sky-angular-tree-context-menu element', fakeAsync(() => {
      const dropdowns = getDropdowns(el);

      // Set focus on first dropdown and press keydown arrow.
      dropdowns[0].click();
      tick();
      fixture.detectChanges();
      tick();
      SkyAppTestUtility.fireDomEvent(dropdowns[0], 'keydown', {
        keyboardEventInit: {
          key: 'ArrowDown'
        }
      });

      // Expect focus to be on first dropdown menu item and NOT move to next repeater item.
      const firstDropdownMenuItem = el.querySelectorAll('.sky-dropdown-item button')[0];
      expect(document.activeElement).toBe(firstDropdownMenuItem);

      flushDropdownTimer();
    }));

    it('should select item with space and enter keys when selectable is set to true', () => {
      cmp.selectable = true;
      fixture.detectChanges();

      const items = getRepeaterItems(el);

      // Expect first item NOT to be selected.
      expect(items[0]).not.toHaveCssClass('sky-repeater-item-selected');

      // Focus on first repeater item and press enter key.
      SkyAppTestUtility.fireDomEvent(items[0], 'focus');
      SkyAppTestUtility.fireDomEvent(items[0], 'keydown', {
        keyboardEventInit: {
          key: 'Enter'
        }
      });
      fixture.detectChanges();

      // Expect first item to be selected.
      expect(items[0]).toHaveCssClass('sky-repeater-item-selected');

      // Press space key.
      SkyAppTestUtility.fireDomEvent(items[0], 'keydown', {
        keyboardEventInit: {
          key: 'Space'
        }
      });
      fixture.detectChanges();

      // Expect first item NOT to be selected.
      expect(items[0]).not.toHaveCssClass('sky-repeater-item-selected');
    });
  });

  describe('with expand mode of "single"', () => {
    it('should collapse other items when an item is expanded', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;

      cmp.expandMode = 'single';
      fixture.detectChanges();

      tick();

      let repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isExpanded).toBe(true);
      expect(repeaterItems[1].isExpanded).toBeFalsy();
      expect(repeaterItems[2].isExpanded).toBeFalsy();

      repeaterItems[1].isExpanded = true;

      fixture.detectChanges();

      tick();

      repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isExpanded).toBeFalsy();
      expect(repeaterItems[1].isExpanded).toBe(true);
      expect(repeaterItems[2].isExpanded).toBeFalsy();

      flushDropdownTimer();
    }));

    it('should collapse other items when a new expanded item is added', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;

      cmp.expandMode = 'single';
      cmp.removeLastItem = true;

      fixture.detectChanges();

      tick();

      let repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isExpanded).toBe(true);
      expect(repeaterItems[1].isExpanded).toBe(false);

      cmp.removeLastItem = false;
      cmp.lastItemExpanded = true;

      fixture.detectChanges();

      tick();

      repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isExpanded).toBe(false);
      expect(repeaterItems[1].isExpanded).toBe(false);
      expect(repeaterItems[2].isExpanded).toBe(true);

      flushDropdownTimer();
    }));

    it('should toggle its collapsed state when an item\'s header is clicked', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;
      let el = fixture.nativeElement;

      cmp.expandMode = 'single';
      fixture.detectChanges();
      tick();

      let repeaterItems = cmp.repeater.items.toArray();
      expect(repeaterItems[0].isExpanded).toBe(true);
      expect(el.querySelector('sky-chevron').getAttribute('aria-expanded')).toBe('true');

      el.querySelectorAll('.sky-repeater-item-title').item(0).click();
      fixture.detectChanges();
      tick();

      repeaterItems = cmp.repeater.items.toArray();
      expect(repeaterItems[0].isExpanded).toBe(false);
      expect(el.querySelector('sky-chevron').getAttribute('aria-expanded')).toBe('false');

      flushDropdownTimer();
    }));

    it('should toggle its collapsed state when an item\'s chevron is clicked', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;
      let el = fixture.nativeElement;

      cmp.expandMode = 'single';

      fixture.detectChanges();

      tick();

      let repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isExpanded).toBe(true);

      el.querySelectorAll('.sky-chevron').item(0).click();

      fixture.detectChanges();

      tick();

      repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isExpanded).toBe(false);

      flushDropdownTimer();
    }));

    it('should select items based on input', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;
      cmp.expandMode = 'single';
      cmp.lastItemSelected = true;

      fixture.detectChanges();
      tick();

      let repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isSelected).toBe(false);
      expect(repeaterItems[1].isSelected).toBe(false);
      expect(repeaterItems[2].isSelected).toBe(true);

      flushDropdownTimer();
    }));

    it('should be accessible', async(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      fixture.detectChanges();
      fixture.componentInstance.expandMode = 'single';
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));

    it('should emit events when item is expanded/collapsed', fakeAsync(() => {
      const fixture = TestBed.createComponent(RepeaterTestComponent);
      const cmp = fixture.componentInstance;
      cmp.expandMode = 'single';

      const collapseSpy = spyOn(cmp, 'onCollapse').and.callThrough();
      const expandSpy = spyOn(cmp, 'onExpand').and.callThrough();

      fixture.detectChanges();
      tick();

      collapseSpy.calls.reset();
      expandSpy.calls.reset();

      let repeaterItems = cmp.repeater.items.toArray();
      expect(repeaterItems[0].isExpanded).toBe(true);

      fixture.nativeElement.querySelectorAll('.sky-chevron').item(0).click();
      fixture.detectChanges();
      tick();

      expect(collapseSpy).toHaveBeenCalled();

      collapseSpy.calls.reset();
      expandSpy.calls.reset();

      fixture.nativeElement.querySelectorAll('.sky-chevron').item(0).click();
      fixture.detectChanges();
      tick();

      expect(expandSpy).toHaveBeenCalled();

      flushDropdownTimer();
    }));
  });

  describe('with expand mode of "multiple"', () => {
    it('should not collapse other items when an item is expanded', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;

      cmp.expandMode = 'multiple';

      fixture.detectChanges();
      tick();

      let repeaterItems = cmp.repeater.items.toArray();

      repeaterItems[0].isExpanded = true;
      repeaterItems[1].isExpanded = false;
      repeaterItems[2].isExpanded = false;

      fixture.detectChanges();

      repeaterItems[1].isExpanded = true;

      tick();

      repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isExpanded).toBe(true);
      expect(repeaterItems[1].isExpanded).toBe(true);
      expect(repeaterItems[2].isExpanded).toBe(false);

      flushDropdownTimer();
    }));

    it('should toggle its collapsed state when an item\'s header is clicked', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;
      let el = fixture.nativeElement;

      cmp.expandMode = 'multiple';

      fixture.detectChanges();

      tick();

      let repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isExpanded).toBe(true);

      el.querySelectorAll('.sky-repeater-item-title').item(0).click();

      fixture.detectChanges();

      tick();

      repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isExpanded).toBe(false);

      flushDropdownTimer();
    }));

    it('should toggle its collapsed state when an item\'s chevron is clicked', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;
      let el = fixture.nativeElement;

      cmp.expandMode = 'multiple';

      fixture.detectChanges();

      tick();

      let repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isExpanded).toBe(true);

      el.querySelectorAll('.sky-chevron').item(0).click();

      fixture.detectChanges();

      tick();

      repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isExpanded).toBe(false);

      flushDropdownTimer();
    }));

    it('should select items based on input', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;
      cmp.expandMode = 'multiple';
      cmp.lastItemSelected = true;

      fixture.detectChanges();
      tick();

      let repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isSelected).toBe(false);
      expect(repeaterItems[1].isSelected).toBe(false);
      expect(repeaterItems[2].isSelected).toBe(true);

      flushDropdownTimer();
    }));

    it('should be accessible', async(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      fixture.detectChanges();
      fixture.componentInstance.expandMode = 'multiple';
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));
  });

  describe('with expand mode of "none"', () => {
    it(
      'should not allow items to be collapsed',
      fakeAsync(
        inject([SkyLogService], (mockLogService: MockLogService) => {
          let fixture = TestBed.createComponent(RepeaterTestComponent);
          let cmp: RepeaterTestComponent = fixture.componentInstance;

          cmp.expandMode = 'none';

          fixture.detectChanges();
          tick();

          let item = cmp.repeater.items.first;

          expect(item.isExpanded).toBe(true);

          let warnSpy = spyOn(mockLogService, 'warn');

          item.isExpanded = false;

          fixture.detectChanges();
          tick();

          item = cmp.repeater.items.first;

          expect(warnSpy).toHaveBeenCalled();

          expect(item.isExpanded).toBe(true);

          flushDropdownTimer();
        })
    ));

    it('should hide each item\'s chevron button', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;
      let el = fixture.nativeElement as Element;

      fixture.detectChanges();

      let chevronEls = el.querySelectorAll('.sky-repeater-item-chevron');
      expect(chevronEls.length).toBe(3);

      cmp.expandMode = 'none';
      fixture.detectChanges();

      tick();

      chevronEls = el.querySelectorAll('.sky-repeater-item-chevron');

      expect(chevronEls.length).toBe(0);

      flushDropdownTimer();
    }));

    it(
      'should expand all items when mode was previously set to "single" or "multiple"',
      fakeAsync(() => {
        let fixture = TestBed.createComponent(RepeaterTestComponent);
        let cmp: RepeaterTestComponent = fixture.componentInstance;

        cmp.expandMode = 'multiple';

        fixture.detectChanges();
        tick();

        let repeaterItems = cmp.repeater.items.toArray();

        for (let repeaterItem of repeaterItems) {
          repeaterItem.isExpanded = false;
        }

        fixture.detectChanges();
        tick();

        cmp.expandMode = 'none';

        fixture.detectChanges();
        tick();

        repeaterItems = cmp.repeater.items.toArray();

        for (let repeaterItem of repeaterItems) {
          expect(repeaterItem.isExpanded).toBe(true);
        }

        flushDropdownTimer();
      })
    );

    it('should not toggle its collapsed state when an item\'s header is clicked', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;
      let el = fixture.nativeElement;

      cmp.expandMode = 'none';

      fixture.detectChanges();

      tick();

      let repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isExpanded).toBe(true);

      el.querySelectorAll('.sky-repeater-item-title').item(0).click();

      fixture.detectChanges();

      tick();

      repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isExpanded).toBe(true);

      flushDropdownTimer();
    }));

    it('should select items based on input', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;
      cmp.expandMode = 'none';
      cmp.lastItemSelected = true;

      fixture.detectChanges();
      tick();

      let repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isSelected).toBe(false);
      expect(repeaterItems[1].isSelected).toBe(false);
      expect(repeaterItems[2].isSelected).toBe(true);

      flushDropdownTimer();
    }));

    it('should be accessible', async(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      fixture.detectChanges();
      fixture.componentInstance.expandMode = 'none';
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));
  });

  describe('with selectability "true"', () => {
    it('should add selected css class when selected', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;
      let el = fixture.nativeElement;

      fixture.detectChanges();

      tick();

      cmp.repeater.items.forEach(item => item.selectable = true);

      let selectedItemsEl = el.querySelectorAll('.sky-repeater-item-selected') as NodeList;
      expect(selectedItemsEl.length).toBe(0);

      // select first item
      const repeaterItems = cmp.repeater.items.toArray();
      repeaterItems[0].updateIsSelected({source: undefined, checked: true});

      fixture.detectChanges();

      tick();

      expect(repeaterItems[0].isSelected).toBe(true);
      expect(repeaterItems[1].isSelected).toBe(false);
      expect(repeaterItems[2].isSelected).toBe(false);

      selectedItemsEl = el.querySelectorAll('.sky-repeater-item-selected');
      expect(selectedItemsEl.length).toBe(1);

      flushDropdownTimer();
    }));

    it('should be accessible', async(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      fixture.detectChanges();
      fixture.componentInstance.repeater.items.forEach(item => item.selectable = true);

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));

    it('should update the isSelected property when the user selects an item', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let el = fixture.nativeElement;
      let cmp: RepeaterTestComponent = fixture.componentInstance;
      fixture.detectChanges();
      tick();
      // Make each repeater item selectable.
      cmp.repeater.items.toArray().forEach(item => item.selectable = true);
      fixture.detectChanges();
      const repeaterItems = cmp.repeater.items.toArray();
      const repeaterCheckboxes = el.querySelectorAll('sky-checkbox');

      // Click on last repeater item.
      repeaterCheckboxes[2].querySelector('input').click();
      fixture.detectChanges();
      tick();

      // Expect only last item to be selected, and input property (isSelected) to recieve new value.
      expect(repeaterItems[0].isSelected).toBe(false);
      expect(repeaterItems[1].isSelected).toBe(false);
      expect(repeaterItems[2].isSelected).toBe(true);
      expect(cmp.lastItemSelected).toBe(true);

      flushDropdownTimer();
    }));
  });

  describe('with activeIndex', () => {
    let fixture: ComponentFixture<RepeaterTestComponent>;
    let cmp: RepeaterTestComponent;
    let el: any;

    beforeEach(() => {
      fixture = TestBed.createComponent(RepeaterTestComponent);
      cmp = fixture.componentInstance;
      el = fixture.nativeElement;
    });

    function getItems(): HTMLElement[] {
      return el.querySelectorAll('.sky-repeater-item');
    }

    it('should show active item if activeIndex is set on init', fakeAsync(() => {
      cmp.activeIndex = 0;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      let activeRepeaterItem = el.querySelectorAll('.sky-repeater-item-active');
      expect(activeRepeaterItem.length).toBe(1);

      flushDropdownTimer();
    }));

    it('should add and remove active css class when activeIndex value changes', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      let activeRepeaterItem = el.querySelectorAll('.sky-repeater-item-active');
      expect(activeRepeaterItem.length).toBe(0);

      cmp.activeIndex = 0;
      fixture.detectChanges();
      tick();

      activeRepeaterItem = el.querySelectorAll('.sky-repeater-item-active');
      expect(activeRepeaterItem.length).toBe(1);
      const items = getItems();
      expect(items[0]).toHaveCssClass('sky-repeater-item-active');

      cmp.activeIndex = undefined;
      fixture.detectChanges();
      tick();

      activeRepeaterItem = el.querySelectorAll('.sky-repeater-item-active');
      expect(activeRepeaterItem.length).toBe(0);

      flushDropdownTimer();
    }));
  });

  describe('with inline-form', () => {
    let fixture: ComponentFixture<RepeaterInlineFormFixtureComponent>;
    let el: HTMLElement;
    let component: RepeaterInlineFormFixtureComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(RepeaterInlineFormFixtureComponent);
      el = fixture.nativeElement;
      component = fixture.componentInstance;
    });

    function showInlineForm(): void {
      component.showInlineForm = true;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
    }

    function getInlineForm(): HTMLElement {
      return el.querySelector('#inline-form-template') as HTMLElement;
    }

    it('should not add inline-form to the DOM by default', () => {
      const inlineForm = el.querySelector('#repeater-item-without-inline-form sky-inline-form');

      expect(inlineForm).toBeNull();
    });

    it('should not show inline-form template if showInlineForm is false', () => {
      const inlineForm = getInlineForm();

      expect(inlineForm).toBeNull();
    });

    it('should show inline-form template if showInlineForm is true', fakeAsync(() => {
      showInlineForm();
      const inlineForm = getInlineForm();

      expect(inlineForm).not.toBeNull();

      flushDropdownTimer();
    }));

    it('should show inline-form with custom buttons', async(() => {
      component.inlineFormConfig = {
        buttonLayout: SkyInlineFormButtonLayout.Custom,
        buttons: [
          { action: 'save', text: 'Foo', styleType: 'primary' },
          { action: 'delete', text: 'Bar', styleType: 'default' }
        ]
      };

      component.showInlineForm = true;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();

        const buttons = el.querySelectorAll('.sky-inline-form-footer button') as NodeListOf<HTMLElement>;

        expect(buttons[0].innerText.trim()).toEqual('Foo');
        expect(buttons[1].innerText.trim()).toEqual('Bar');
      });
    }));

    it('should emit SkyInlineFormCloseArgs when inline form template is closed', async(() => {
      fixture.detectChanges();
      component.showInlineForm = true;
      fixture.whenStable().then(() => {
        fixture.detectChanges();

        expect(component.inlineFormCloseArgs).toBeUndefined();
        const button = el.querySelector('.sky-inline-form-footer .sky-btn-primary') as HTMLElement;
        button.click();

        expect(component.inlineFormCloseArgs).not.toBeUndefined();
        expect(component.inlineFormCloseArgs.reason).toBe('done');
      });
    }));
  });
});
