import {
  expect,
  SkyHostBrowser
} from '@skyux-sdk/e2e';

import {
  element, by
} from 'protractor';

describe('Infinite Scroll', () => {

  beforeEach(() => {
    SkyHostBrowser.get('visual/infinite-scroll');
    SkyHostBrowser.setWindowBreakpoint('lg');
    SkyHostBrowser.scrollTo('#screenshot-infinite-scroll');
  });

  it('should match previous screenshot', (done) => {
    expect('#screenshot-infinite-scroll').toMatchBaselineScreenshot(done, {
      screenshotName: 'infinite-scroll'
    });
  });

  it('should match previous screenshot when enabled is false', (done) => {
    element(by.css('#toggle-enabled')).click();
    expect('#screenshot-infinite-scroll').toMatchBaselineScreenshot(done, {
      screenshotName: 'infinite-scroll-disabled'
    });
  });

  it('should match previous screenshot in wait mode', (done) => {
    element(by.css('#toggle-disable-loader')).click();
    element(by.css('#screenshot-infinite-scroll .sky-btn')).click();
    expect('#screenshot-infinite-scroll').toMatchBaselineScreenshot(done, {
      screenshotName: 'infinite-scroll-wait'
    });
  });

  it('should match previous screenshot with back to top component showing', (done) => {
    element(by.css('#screenshot-infinite-scroll .sky-btn')).click();
    element(by.css('#toggle-enabled')).click();
    SkyHostBrowser.scrollTo('#screenshot-window-bottom');
    expect('#screenshot-window').toMatchBaselineScreenshot(done, {
      screenshotName: 'infinite-scroll-back-to-top'
    });
  });
});
