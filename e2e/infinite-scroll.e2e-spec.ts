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
  });

  it('should match previous screenshot', (done) => {
    SkyHostBrowser.scrollTo('#screenshot-infinite-scroll');
    expect('#screenshot-infinite-scroll').toMatchBaselineScreenshot(done, {
      screenshotName: 'infinite-scroll'
    });
  });

  it('should match previous screenshot when enabled is false', (done) => {
    SkyHostBrowser.scrollTo('#screenshot-infinite-scroll');
    element(by.css('#toggle-enabled')).click();
    expect('#screenshot-infinite-scroll').toMatchBaselineScreenshot(done, {
      screenshotName: 'infinite-scroll-disabled'
    });
  });

  it('should match previous screenshot in wait mode', (done) => {
    SkyHostBrowser.scrollTo('#screenshot-infinite-scroll');
    element(by.css('.sky-infinite-scroll .sky-btn')).click();
    expect('#screenshot-infinite-scroll').toMatchBaselineScreenshot(done, {
      screenshotName: 'infinite-scroll-wait'
    });
  });

  it('should match previous screenshot when back to top button is visible', (done) => {
    SkyHostBrowser.scrollTo('#screenshot-infinite-scroll');
    element(by.css('.sky-infinite-scroll .sky-btn')).click();
    element(by.css('#toggle-enabled')).click();
    SkyHostBrowser.scrollTo('sky-repeater-item:last-child');
    expect('#screenshot-window').toMatchBaselineScreenshot(done, {
      screenshotName: 'infinite-scroll-back-to-top'
    });
  });
});
