import {
  Component,
  ViewChild
} from '@angular/core';

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

import {
  SkyInfiniteScrollComponent
} from '../../modules/infinite-scroll/infinite-scroll.component';

const DATA_SKY_ID = 'test-infinite-scroll';

//#region Test component
@Component({
  selector: 'infinite-scroll-fixture',
  template: `
    <div>
      <button (click)="hasMore = !hasMore">{{ hasMore ? 'Disallow' : 'Allow' }} more</button>
    </div>
    <ul>
      <li *ngFor="let i of items">{{ i }}</li>
      <li *ngIf="items.length === 0"><em>(no items)</em></li>
    </ul>
    <sky-infinite-scroll
      #infiniteScrollComponent
      data-sky-id="${DATA_SKY_ID}"
      [enabled]="hasMore"
      (scrollEnd)="loadMore()">
    </sky-infinite-scroll>
  `
})
class InfiniteScrollTestComponent {
  public hasMore = false;
  public items: string[] = [];
  @ViewChild('infiniteScrollComponent')
  public infiniteScrollComponent: SkyInfiniteScrollComponent;
  private i: number = 1;
  public loadMore() {
    return new Promise(() => {
      for (let j = 1; j <= 10; j++) {
        this.items.push(`Item ${this.i++}`);
      }
      this.infiniteScrollComponent.isWaiting = false;
    });
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
    expect(testComponent.hasMore).toBe(false);
    expect(testComponent.items.length).toBe(0);
    expect(infiniteScrollFixture.loadMoreButtonIsVisible).toBeFalse();
  });

  it('should display button', () => {
    testComponent.hasMore = true;
    fixture.detectChanges();
    fixture.whenStable();
    // verify enabled
    expect(infiniteScrollFixture.loadMoreButtonIsVisible).toBeTrue();
  });

  it('should load more', () => {
    testComponent.hasMore = true;
    fixture.detectChanges();
    fixture.whenStable();
    expect(infiniteScrollFixture.loadMoreButtonIsVisible).toBeTrue();
    // click once
    infiniteScrollFixture.clickLoadMoreButton();
    const length = testComponent.items.length;
    expect(length).toBeGreaterThan(0);
    fixture.detectChanges();
    fixture.whenStable();
    expect(infiniteScrollFixture.loadMoreButtonIsVisible).toBeTrue();
    // click twice
    infiniteScrollFixture.clickLoadMoreButton();
    expect(testComponent.items.length).toBeGreaterThan(length);
  });

  it('should stop loading more', () => {
    testComponent.hasMore = true;
    fixture.detectChanges();
    fixture.whenStable();
    // click once
    infiniteScrollFixture.clickLoadMoreButton();
    expect(testComponent.items.length).toBeGreaterThan(0);
    fixture.detectChanges();
    fixture.whenStable();
    expect(infiniteScrollFixture.loadMoreButtonIsVisible).toBeTrue();
    // set to not enabled
    testComponent.hasMore = false;
    fixture.detectChanges();
    fixture.whenStable();
    // button be gone
    console.log(fixture.nativeElement.outerHTML);
    expect(infiniteScrollFixture.loadMoreButtonIsVisible).toBeFalse();
  });

});
