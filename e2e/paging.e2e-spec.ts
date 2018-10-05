import {
  expect,
  SkyHostBrowser
} from '@skyux-sdk/e2e';

import {
  element, by
} from 'protractor';

describe('Paging', () => {
  it('should display first page selected', (done) => {
    SkyHostBrowser.get('visual/paging');
    SkyHostBrowser.setWindowBreakpoint('lg');
    expect('#screenshot-paging').toMatchBaselineScreenshot(done, {
      screenshotName: 'paging-first'
    });
  });

  it('should display middle page selected', (done) => {
    SkyHostBrowser.get('visual/paging');
    SkyHostBrowser.setWindowBreakpoint('lg');
    element(by.css('button[sky-cmp-id="next"]')).click();
    expect('#screenshot-paging').toMatchBaselineScreenshot(done, {
      screenshotName: 'paging-middle'
    });
  });
});
