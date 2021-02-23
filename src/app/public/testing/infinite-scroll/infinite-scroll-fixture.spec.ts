import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyInfiniteScrollFixture
} from './infinite-scroll-fixture';

import {
  SkyInfiniteScrollTestingModule
} from './infinite-scroll-testing.module';

import {Component} from '@angular/core';

const DATA_SKY_ID = 'test-infinite-scroll';

//#region Test component
@Component({
  selector: 'infinite-scroll-fixture',
  template: `
    <div>
      <button (click)="enabled = !enabled">{{ enabled ? 'Disallow' : 'Allow' }} more</button>
    </div>
    <ul>
      <li *ngFor="let i of items">{{ i }}</li>
      <li *ngIf="items.length === 0"><em>(no items)</em></li>
    </ul>
    <sky-infinite-scroll
      data-sky-id="${DATA_SKY_ID}"
      [enabled]="enabled"
      (scrollEnd)="loadMore()">
    </sky-infinite-scroll>
  `
})
class InfiniteScrollTestComponent {
  private i: number = 1;
  public enabled = false;
  public items: string[] = [];
  public loadMore() {
    for (let j = 1; j <= 10; j++) {
      this.items.push(`Item ${this.i++}`);
    }
  }
}
//#endregion Test component

describe('Infinite scroll fixture component', () => {
  let fixture: ComponentFixture<InfiniteScrollTestComponent>;
  let testComponent: InfiniteScrollTestComponent;
  let infiniteScrollFixture: SkyInfiniteScrollFixture;

  /**
   * This configureTestingModule function imports SkyAppTestModule, which brings in all of
   * the SKY UX modules and components in your application for testing convenience. If this has
   * an adverse effect on your test performance, you can individually bring in each of your app
   * components and the SKY UX modules that those components rely upon.
   */
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        InfiniteScrollTestComponent
      ],
      imports: [
        SkyInfiniteScrollTestingModule
      ]
    });

    fixture = TestBed.createComponent(
      InfiniteScrollTestComponent
    );
    testComponent = fixture.componentInstance;
    infiniteScrollFixture = new SkyInfiniteScrollFixture(fixture, DATA_SKY_ID);
  });

  it('should hide button', () => {
    expect(testComponent.enabled).toBe(false);
    expect(testComponent.items.length).toBe(0);
    expect(infiniteScrollFixture.isEnabled()).toBe(false);
    expect(infiniteScrollFixture.isButtonAvailable()).toBe(false);
  });

  it('should display button', () => {
    testComponent.enabled = true;
    fixture.detectChanges();
    fixture.whenStable();

    // verify enabled
    expect(infiniteScrollFixture.isEnabled()).toBe(true);
    expect(infiniteScrollFixture.isButtonAvailable()).toBe(true);
  });

  it('should load more', () => {
    testComponent.enabled = true;
    fixture.detectChanges();
    fixture.whenStable();

    // click once
    infiniteScrollFixture.clickLoadMoreButton();
    const length = testComponent.items.length;
    expect(length).toBeGreaterThan(0);

    // click twice
    infiniteScrollFixture.clickLoadMoreButton();
    expect(testComponent.items.length).toBeGreaterThan(length);
  });

  it('should stop loading more', () => {
    testComponent.enabled = true;
    fixture.detectChanges();
    fixture.whenStable();

    // click once
    infiniteScrollFixture.clickLoadMoreButton();
    const length = testComponent.items.length;
    expect(length).toBeGreaterThan(0);

    // set to not enabled
    testComponent.enabled = true;
    fixture.detectChanges();
    fixture.whenStable();

    // button be gone
    expect(infiniteScrollFixture.isButtonAvailable()).toBe(false);
  });

});
