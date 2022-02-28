import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkyE2eThemeSelectorModule } from '@skyux/e2e-client';
import { SkyDropdownModule } from '@skyux/popovers';
import { VisualComponent } from './visual.component';
import {
  SkyFilterModule,
  SkyInfiniteScrollModule,
  SkyPagingModule,
  SkyRepeaterModule,
  SkySortModule,
} from 'projects/lists/src/public-api';
import { FilterVisualComponent } from './filter/filter-visual.component';
import { InfiniteScrollVisualComponent } from './infinite-scroll/infinite-scroll-visual.component';
import { PagingVisualComponent } from './paging/paging-visual.component';
import { RepeaterVisualComponent } from './repeater/repeater-visual.component';
import { SortVisualComponent } from './sort/sort-visual.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    FilterVisualComponent,
    InfiniteScrollVisualComponent,
    PagingVisualComponent,
    RepeaterVisualComponent,
    SortVisualComponent,
    VisualComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SkyDropdownModule,
    SkyE2eThemeSelectorModule,
    SkyFilterModule,
    SkyInfiniteScrollModule,
    SkyPagingModule,
    SkyRepeaterModule,
    SkySortModule,
  ],
})
export class VisualModule {}
