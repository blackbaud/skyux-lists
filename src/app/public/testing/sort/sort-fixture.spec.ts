import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SortFixtureTestComponent
} from './fixtures/sort-fixture.component.fixture';

import {
  SkySortFixture
} from './sort-fixture';

import {
  SkySortTestingModule
} from './sort-testing.module';

fdescribe('Sort fixture', () => {
  let fixture: ComponentFixture<SortFixtureTestComponent>;
  let testComponent: SortFixtureTestComponent;
  let sortFixture: SkySortFixture;

  //#region helpers

  // function getLastPage() {
  //   return Math.ceil(testComponent.itemCount / testComponent.pageSize);
  // }

  //#endregion helpers

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [
        SortFixtureTestComponent
      ],
      imports: [
        SkySortTestingModule
      ]
    });

    fixture = TestBed.createComponent(
      SortFixtureTestComponent
    );
    testComponent = fixture.componentInstance;
    sortFixture = new SkySortFixture(fixture, SortFixtureTestComponent.dataSkyId);

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should reflect default properties', async () => {
    await sortFixture.toggleSortMenu();
    expect(true).toBeTrue();
  });

  // it('should select page if it is available', async () => {
  //   const currentPageChangeSpy = spyOn(fixture.componentInstance, 'currentPageChange');
  //   const targetPage = 2;

  //   // ensure we have a second page to select and we're not on that page already
  //   expect(sortFixture.activePageId).toBe('1');
  //   expect(sortFixture.pageLinks).toContain(jasmine.objectContaining({ id: `${targetPage}` }));

  //   // select the target page
  //   await sortFixture.selectPage(targetPage);

  //   // verify the event was fired and the current page matches our action
  //   expect(currentPageChangeSpy).toHaveBeenCalledWith(targetPage);
  //   expect(testComponent.currentPage).toBe(targetPage);

  //   // verify paging state
  //   verifyPagingState(targetPage);
  // });
});
