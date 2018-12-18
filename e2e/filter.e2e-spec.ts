import {
  expect,
  SkyHostBrowser
} from '@skyux-sdk/e2e';

import {
  element, by
} from 'protractor';

describe('Filter', () => {
  beforeEach(() => {
    SkyHostBrowser.get('visual/filter');
    SkyHostBrowser.setWindowBreakpoint('lg');
  });

  it('should match previous screenshot for filter button', (done) => {
    expect('#screenshot-filter-button .sky-btn').toMatchBaselineScreenshot(done, {
      screenshotName: 'filter-button'
    });
  });

  it('should match the previous screenshot for filter button when text is shown', (done) => {
    expect('#screenshot-filter-button-text .sky-btn').toMatchBaselineScreenshot(done, {
      screenshotName: 'filter-button-text'
    });
  });

  it('should match the previous screenshot for filter button when text is on but the screen is small', (done) => {
    SkyHostBrowser.setWindowBreakpoint('xs');
    expect('#screenshot-filter-button-text .sky-btn').toMatchBaselineScreenshot(done, {
      screenshotName: 'filter-button-text-small'
    });
  });

  it('should match previous screenshot for active filter button', (done) => {
    element(by.css('.sky-btn-default')).click();
    expect('#screenshot-filter-button').toMatchBaselineScreenshot(done, {
      screenshotName: 'filter-button-active'
    });
  });

  it('should match previous screenshot for filter summary', (done) => {
    expect('#screenshot-filter-summary').toMatchBaselineScreenshot(done, {
      screenshotName: 'filter-summary'
    });
  });

  it('should match previous screenshot for filter inline', (done) => {
    expect('#screenshot-filter-inline').toMatchBaselineScreenshot(done, {
      screenshotName: 'filter-inline'
    });
  });
});
