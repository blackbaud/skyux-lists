import {
  expect,
  SkyHostBrowser
} from '@skyux-sdk/e2e';

import {
  element, by
} from 'protractor';

describe('Filter', () => {
  it('should match previous screenshot for filter button', (done) => {
    SkyHostBrowser.get('visual/filter');
    SkyHostBrowser.setWindowBreakpoint('lg');
    expect('#screenshot-filter-button').toMatchBaselineScreenshot(done, {
      screenshotName: 'filter-button'
    });
  });

  it('should match the previous screenshot for filter button when text is shown', (done) => {
    SkyHostBrowser.get('visual/filter');
    SkyHostBrowser.setWindowBreakpoint('lg');
    expect('#screenshot-filter-button-text').toMatchBaselineScreenshot(done, {
      screenshotName: 'filter-button-text'
    });
  });

  it('should match the previous screenshot for filter button when text is on but the screen is small', (done) => {
    SkyHostBrowser.get('visual/filter');
    SkyHostBrowser.setWindowBreakpoint('xs');
    expect('#screenshot-filter-button-text').toMatchBaselineScreenshot(done, {
      screenshotName: 'filter-button-text-small'
    });
  });

  it('should match previous screenshot for active filter button', (done) => {
    SkyHostBrowser.get('visual/filter');
    SkyHostBrowser.setWindowBreakpoint('lg');
    element(by.css('.sky-btn-default')).click();
    expect('#screenshot-filter-button').toMatchBaselineScreenshot(done, {
      screenshotName: 'filter-button-active'
    });
  });

  it('should match previous screenshot for filter summary', (done) => {
    SkyHostBrowser.get('visual/filter');
    SkyHostBrowser.setWindowBreakpoint('lg');
    expect('#screenshot-filter-summary').toMatchBaselineScreenshot(done, {
      screenshotName: 'filter-summary'
    });
  });

  it('should match previous screenshot for filter inline', (done) => {
    SkyHostBrowser.get('visual/filter');
    SkyHostBrowser.setWindowBreakpoint('lg');
    expect('#screenshot-filter-inline').toMatchBaselineScreenshot(done, {
      screenshotName: 'filter-inline'
    });
  });
});
