import {
  expect,
  SkyHostBrowser
} from '@skyux-sdk/e2e';

import {
  element, by
} from 'protractor';

describe('Sort', () => {
  it('should match the baseline sort screenshot', (done) => {
    SkyHostBrowser.get('visual/sort');
    SkyHostBrowser.setWindowBreakpoint('lg');
    expect('#screenshot-sort-full').toMatchBaselineScreenshot(done, {
      screenshotName: 'sort'
    });
  });

  it('should match the baseline sort screenshot when dropdown is open', (done) => {
    SkyHostBrowser.get('visual/sort');
    SkyHostBrowser.setWindowBreakpoint('lg');
    element(by.css('.sky-btn-default')).click();
    expect('#screenshot-sort-full').toMatchBaselineScreenshot(done, {
      screenshotName: 'sort-open'
    });
  });

  it('should match the baseline sort screenshot when text is shown', (done) => {
    SkyHostBrowser.get('visual/sort');
    SkyHostBrowser.setWindowBreakpoint('lg');
    expect('#screenshot-sort-text').toMatchBaselineScreenshot(done, {
      screenshotName: 'sort-text'
    });
  });

  it('should match the baseline sort screenshot when text is on but the screen is small', (done) => {
    SkyHostBrowser.get('visual/sort');
    SkyHostBrowser.setWindowBreakpoint('xs');
    expect('#screenshot-sort-text').toMatchBaselineScreenshot(done, {
      screenshotName: 'sort-text-small'
    });
  });

});
