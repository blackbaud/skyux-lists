import {
  Component
} from '@angular/core';

import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyFilterTestingModule
} from './filter-testing.module';

import {
  SkyFilterFixtureSummary
} from './filter-fixture-summary';

import {
  SkyFilterFixtureButton
} from './filter-fixture-button';

const DATA_SKY_ID_SUMMARY = 'test-filter-summary';
const DATA_SKY_ID_BUTTON = 'test-filter-button';

//#region Test component
@Component({
  selector: 'filter-fixture',
  template: `
    <sky-filter-button
      data-sky-id="${DATA_SKY_ID_BUTTON}"
      [disabled]="buttonIsDisabled"
      [showButtonText]="true"
      (filterButtonClick)="filterButtonClicked()"
    >
    </sky-filter-button>

    <sky-filter-summary
      data-sky-id="${DATA_SKY_ID_SUMMARY}"
    >
      <sky-filter-summary-item
        *ngFor="let item of appliedFilters; let i = index"
        (dismiss)="onDismiss(i)"
      >
        {{item}}
      </sky-filter-summary-item>
    </sky-filter-summary>
  `
})
class FilterTestComponent {
  public appliedFilters: string[] = [];
  public buttonClicked: boolean = false;
  public buttonIsDisabled: boolean = false;

  public applyFilter(filter: string): void {
    this.appliedFilters.push(filter);
  }

  public onDismiss(index: number): void {
    this.appliedFilters.splice(index, 1);
  }

  public filterButtonClicked(): void {
    this.buttonClicked = true;
  }
}
//#endregion Test component

describe('Filter fixture', () => {
  let fixture: ComponentFixture<FilterTestComponent>;
  let testComponent: FilterTestComponent;
  let filterSummaryFixture: SkyFilterFixtureSummary;
  let filterButtonFixture: SkyFilterFixtureButton;

  /**
   * This configureTestingModule function imports SkyAppTestModule, which brings in all of
   * the SKY UX modules and components in your application for testing convenience. If this has
   * an adverse effect on your test performance, you can individually bring in each of your app
   * components and the SKY UX modules that those components rely upon.
   */
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilterTestComponent],
      imports: [SkyFilterTestingModule]
    });
    fixture = TestBed.createComponent(FilterTestComponent);
    testComponent = fixture.componentInstance;
    filterSummaryFixture = new SkyFilterFixtureSummary(fixture, DATA_SKY_ID_SUMMARY);
    filterButtonFixture = new SkyFilterFixtureButton(fixture, DATA_SKY_ID_BUTTON);
  });

  describe('Summary items', () => {
    it('should dismiss only filter item from summary', () => {
      expect(testComponent.appliedFilters.length).toBe(0);
      testComponent.applyFilter('example');
      expect(testComponent.appliedFilters.length).toBeGreaterThan(0);
      fixture.detectChanges();
      return filterSummaryFixture.filterCloseClick(0).then(() => {
        fixture.detectChanges();
        expect(testComponent.appliedFilters.length).toBe(0);
      });
    });

    it('should dismiss nth filter item from summary', () => {
      expect(testComponent.appliedFilters.length).toBe(0);
      for (let i = 1; i <= 5; i++) {
        testComponent.applyFilter(`example ${i}`);
      }
      expect(testComponent.appliedFilters.length).toBe(5);
      fixture.detectChanges();
      return filterSummaryFixture.filterCloseClick(3).then(() => {
        fixture.detectChanges();
        expect(testComponent.appliedFilters.length).toBe(4);
      });
    });

    it('should throw error when dismissing non existent filter', () => {
      expect(testComponent.appliedFilters.length).toBe(0);
      for (let i = 1; i <= 3; i++) {
        testComponent.applyFilter(`example ${i}`);
      }
      expect(testComponent.appliedFilters.length).toBe(3);
      fixture.detectChanges();
      return filterSummaryFixture.filterCloseClick(5).then(() => {
        expect('Error').toBeTrue();
      }).catch(e => {
        expect(e).toBeInstanceOf(Error);
        expect((e as Error).message)
          .toBe('Unable to click close for a filter index 5');
      });
    });
  });

  describe('Button', () => {
    it('should click the button', () => {
      expect(testComponent.buttonClicked).toBeFalse();
      filterButtonFixture.clickFilterButton();
      fixture.detectChanges();
      expect(testComponent.buttonClicked).toBeTrue();
    });

    it('should do nothing when the button is not enabled', () => {
      testComponent.buttonIsDisabled = true;
      expect(testComponent.buttonClicked).toBeFalse();
      fixture.detectChanges();
      return filterButtonFixture.clickFilterButton().then(() => {
        fixture.detectChanges();
        expect(testComponent.buttonClicked).toBeFalse();
      });
    });

    it('should get the button aria label', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      expect(filterButtonFixture.ariaLabel).toBe('Filter');
    });

    it('should get the button aria title', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      expect(filterButtonFixture.ariaTitle).toBe('');
    });

    it('should get the button id', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      expect(filterButtonFixture.id).toContain('sky-filter-button-');
    });

    it('should get the button text', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      expect(filterButtonFixture.buttonText).toBe('Filter');
    });
  });
});
