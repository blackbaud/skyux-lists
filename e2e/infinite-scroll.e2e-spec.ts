import {
  expect,
  SkyHostBrowser
} from '@skyux-sdk/e2e';

import {
  element, by
} from 'protractor';

describe('Infinite Scroll', () => {
  it('should match previous infinite scroll screenshot', (done) => {
    SkyHostBrowser.get('visual/infinite-scroll');
    SkyHostBrowser.setWindowBreakpoint('lg');
    expect('#screenshot-infinite-scroll').toMatchBaselineScreenshot(done, {
      screenshotName: 'infinite-scroll'
    });
  });

  it('should match previous infinite scroll screenshot when hasMore is false', (done) => {
    SkyHostBrowser.get('visual/infinite-scroll');
    SkyHostBrowser.setWindowBreakpoint('lg');
    expect('#screenshot-infinite-scroll-nobutton').toMatchBaselineScreenshot(done, {
      screenshotName: 'infinite-scroll-nobutton'
    });
  });

  it('should match previous infinite scroll screenshot in wait mode', (done) => {
    SkyHostBrowser.get('visual/infinite-scroll');
    SkyHostBrowser.setWindowBreakpoint('lg');
    element(by.css('#screenshot-infinite-scroll-wait .sky-btn')).click();
    expect('#screenshot-infinite-scroll-wait').toMatchBaselineScreenshot(done, {
      screenshotName: 'infinite-scroll-wait'
    });
  });
});
