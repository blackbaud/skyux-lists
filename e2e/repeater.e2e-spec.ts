import {
  expect,
  SkyHostBrowser
} from '@skyux-sdk/e2e';

import {
  by,
  element
} from 'protractor';

describe('Repeater', () => {
  it('should match previous repeater screenshot', (done) => {
    SkyHostBrowser.get('visual/repeater');
    SkyHostBrowser.setWindowBreakpoint('lg');
    SkyHostBrowser.scrollTo('#screenshot-repeater');
    expect('#screenshot-repeater').toMatchBaselineScreenshot(done, {
      screenshotName: 'repeater'
    });
  });

  it('should match previous repeater screenshot when an item is active', (done) => {
    SkyHostBrowser.get('visual/repeater');
    SkyHostBrowser.setWindowBreakpoint('lg');
    SkyHostBrowser.scrollTo('#screenshot-repeater-with-active-item');
    expect('#screenshot-repeater-with-active-item').toMatchBaselineScreenshot(done, {
      screenshotName: 'repeater-with-active-item'
    });
  });

  it('should match previous repeater screenshot when all are collapsed', (done) => {
    SkyHostBrowser.get('visual/repeater');
    SkyHostBrowser.setWindowBreakpoint('lg');
    SkyHostBrowser.scrollTo('#screenshot-repeater-collapsed');
    expect('#screenshot-repeater-collapsed').toMatchBaselineScreenshot(done, {
      screenshotName: 'repeater-collapsed'
    });
  });

  it('should match previous repeater screenshot in single mode', (done) => {
    SkyHostBrowser.get('visual/repeater');
    SkyHostBrowser.setWindowBreakpoint('lg');
    SkyHostBrowser.scrollTo('#screenshot-repeater-single');
    expect('#screenshot-repeater-single').toMatchBaselineScreenshot(done, {
      screenshotName: 'repeater-single'
    });
  });

  it('should match previous repeater screenshot in multiple mode', (done) => {
    SkyHostBrowser.get('visual/repeater');
    SkyHostBrowser.setWindowBreakpoint('lg');
    SkyHostBrowser.scrollTo('#screenshot-repeater-multiple');
    expect('#screenshot-repeater-multiple').toMatchBaselineScreenshot(done, {
      screenshotName: 'repeater-multiple'
    });
  });

  it('should match previous repeater screenshot in max-width container', (done) => {
    SkyHostBrowser.get('visual/repeater');
    SkyHostBrowser.setWindowBreakpoint('lg');
    SkyHostBrowser.scrollTo('#screenshot-repeater-max-width');
    expect('#screenshot-repeater-max-width').toMatchBaselineScreenshot(done, {
      screenshotName: 'repeater-max-width'
    });
  });

  it('should match previous repeater screenshot with a context menu', (done) => {
    SkyHostBrowser.get('visual/repeater');
    SkyHostBrowser.setWindowBreakpoint('lg');
    SkyHostBrowser.scrollTo('#screenshot-repeater-context-menu');
    expect('#screenshot-repeater-context-menu').toMatchBaselineScreenshot(done, {
      screenshotName: 'repeater-context-menu'
    });
  });

  it('should match previous repeater screenshot when selectable', (done) => {
    SkyHostBrowser.get('visual/repeater');
    SkyHostBrowser.setWindowBreakpoint('lg');
    SkyHostBrowser.scrollTo('#screenshot-repeater-selectable');
    expect('#screenshot-repeater-selectable').toMatchBaselineScreenshot(done, {
      screenshotName: 'repeater-selectable'
    });
  });

  it('should match previous repeater screenshot when selectable', (done) => {
    SkyHostBrowser.get('visual/repeater');
    SkyHostBrowser.setWindowBreakpoint('lg');
    SkyHostBrowser.scrollTo('#screenshot-repeater-selectable-context');
    expect('#screenshot-repeater-selectable-context').toMatchBaselineScreenshot(done, {
      screenshotName: 'repeater-selectable-and-context'
    });
  });

  it('should match previous repeater screenshot when reorderable', (done) => {
    SkyHostBrowser.get('visual/repeater');
    SkyHostBrowser.setWindowBreakpoint('lg');
    SkyHostBrowser.scrollTo('#screenshot-repeater-reorderable');
    expect('#screenshot-repeater-reorderable').toMatchBaselineScreenshot(done, {
      screenshotName: 'repeater-reorderable'
    });
  });

  it('should match previous repeater screenshot with an inline delete', (done) => {
    SkyHostBrowser.get('visual/repeater');
    SkyHostBrowser.setWindowBreakpoint('lg');
    SkyHostBrowser.scrollTo('#screenshot-repeater-inline-delete');
    element.all(by.css('#screenshot-repeater-inline-delete .sky-dropdown-button')).get(0).click();
    element(by.css('#screenshot-repeater-inline-delete #inline-delete-trigger-standard')).click();
    element.all(by.css('#screenshot-repeater-inline-delete .sky-dropdown-button')).get(1).click();
    element(by.css('#screenshot-repeater-inline-delete #inline-delete-trigger-active')).click();
    element(by.css('#screenshot-repeater-inline-delete')).click();
    expect('#screenshot-repeater-inline-delete').toMatchBaselineScreenshot(done, {
      screenshotName: 'repeater-inline-delete'
    });
  });
});
