import {
  expect,
  SkyHostBrowser
} from '@skyux-sdk/e2e';

describe('Repeater', () => {
  it('should match the baseline sort screenshot', (done) => {
    SkyHostBrowser.get('visual/sort');
    SkyHostBrowser.setWindowBreakpoint('lg');
    expect('#screenshot-sort-full').toMatchBaselineScreenshot(done, {
      screenshotName: 'sort'
    });
  });

  it('should match previous repeater screenshot', (done) => {
    SkyHostBrowser.get('visual/repeater');
    SkyHostBrowser.setWindowBreakpoint('lg');
    expect('#screenshot-repeater').toMatchBaselineScreenshot(done, {
      screenshotName: 'repeater'
    });
  });

  it('should match previous repeater screenshot when all are collapsed', (done) => {
    SkyHostBrowser.get('visual/repeater');
    SkyHostBrowser.setWindowBreakpoint('lg');
    expect('#screenshot-repeater-collapsed').toMatchBaselineScreenshot(done, {
      screenshotName: 'repeater-collapsed'
    });
  });

  it('should match previous repeater screenshot in single mode', (done) => {
    SkyHostBrowser.get('visual/repeater');
    SkyHostBrowser.setWindowBreakpoint('lg');
    expect('#screenshot-repeater-single').toMatchBaselineScreenshot(done, {
      screenshotName: 'repeater-single'
    });
  });

  it('should match previous repeater screenshot in multiple mode', (done) => {
    SkyHostBrowser.get('visual/repeater');
    SkyHostBrowser.setWindowBreakpoint('lg');
    expect('#screenshot-repeater-multiple').toMatchBaselineScreenshot(done, {
      screenshotName: 'repeater-multiple'
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
});
