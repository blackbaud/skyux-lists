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
    SkyHostBrowser.scrollTo('#screenshot-infinite-scroll');
    expect('#screenshot-infinite-scroll').toMatchBaselineScreenshot(done, {
      screenshotName: 'infinite-scroll'
    });
  });

  it('should match previous infinite scroll screenshot when hasMore is false', (done) => {
    SkyHostBrowser.get('visual/infinite-scroll');
    SkyHostBrowser.setWindowBreakpoint('lg');
    SkyHostBrowser.scrollTo('#screenshot-infinite-scroll-nobutton');
    expect('#screenshot-infinite-scroll-nobutton').toMatchBaselineScreenshot(done, {
      screenshotName: 'infinite-scroll-nobutton'
    });
  });

  it('should match previous infinite scroll screenshot in wait mode', (done) => {
    SkyHostBrowser.get('visual/infinite-scroll');
    SkyHostBrowser.setWindowBreakpoint('lg');
    SkyHostBrowser.scrollTo('#screenshot-infinite-scroll');
    element(by.css('#screenshot-infinite-scroll .sky-btn')).click();
    expect('#screenshot-infinite-scroll').toMatchBaselineScreenshot(done, {
      screenshotName: 'infinite-scroll-wait'
    });
  });
});
