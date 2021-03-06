import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SkyPagingComponent
} from '../paging.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './paging.component.fixture.html'
})
export class PagingTestComponent {
  @ViewChild(SkyPagingComponent, {
    read: SkyPagingComponent,
    static: true
  })
  public pagingComponent: SkyPagingComponent;

  public pageSize: number = 2;
  public maxPages: number = 3;
  public currentPage: number = 1;
  public itemCount: number = 8;
  public label: string;
  public currentPageChanged(currentPage: number) {
    this.currentPage = currentPage;
  }
}
