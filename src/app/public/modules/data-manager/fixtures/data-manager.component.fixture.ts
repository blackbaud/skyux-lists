import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

import {
  SkyDataManagerService,
  SkyDataManagerState
} from '../../../public_api';

@Component({
  selector: 'data-manager-visual',
  templateUrl: './data-manager-visual.component.html',
  providers: [SkyDataManagerService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataManagerVisualComponent {

  // public get activeViewId(): string {
  //   return this._activeViewId;
  // }

  // public set activeViewId(value: string) {
  //   this._activeViewId = value;
  // }

  public dataManagerConfig = {
    sortOptions: [
      {
        id: 'az',
        label: 'Name (A - Z)',
        descending: false,
        propertyName: 'name'
      },
      {
        id: 'za',
        label: 'Name (Z - A)',
        descending: true,
        propertyName: 'name'
      }
    ]
  };

  public dataState = new SkyDataManagerState({
    filterData: {
      filtersApplied: true,
      filters: {
        hideOrange: true
      }
    },
    views: [
      {
        viewId: 'gridView',
        displayedColumnIds: ['selected', 'name', 'description']
      }
    ]
  });

  public items: any[] = [
    {
      id: '1',
      name: 'Orange',
      description: 'A round, orange fruit. A great source of vitamin C.',
      type: 'citrus',
      color: 'orange'
    },
    {
      id: '2',
      name: 'Mango',
      description: 'Very difficult to peel. Delicious in smoothies, but don\'t eat the skin.',
      type: 'other',
      color: 'orange'
    },
    {
      id: '3',
      name: 'Lime',
      description: 'A sour, green fruit used in many drinks. It grows on trees.',
      type: 'citrus',
      color: 'green'
    },
    {
      id: '4',
      name: 'Strawberry',
      description: 'A red fruit that goes well with shortcake. It is the name of both the fruit and the plant!',
      type: 'berry',
      color: 'red'
    },
    {
      id: '5',
      name: 'Blueberry',
      description: 'A small, blue fruit often found in muffins. When not ripe, they can be sour.',
      type: 'berry',
      color: 'blue'
    },
    {
      id: '6',
      name: 'Banana',
      description: 'A yellow fruit with a thick skin. Monkeys love them, and in some countries it is customary to eat the peel.',
      type: 'other',
      color: 'yellow'
    }
  ];

  public activeViewId = 'gridView';

  constructor(
    private dataManagerService: SkyDataManagerService
  ) {
    this.dataManagerService.getDataStateUpdates('dataManager').subscribe(state => this.dataState = state);
    this.dataManagerService.getActiveViewIdUpdates().subscribe(activeViewId => this.activeViewId = activeViewId);
  }

  public searchSo() {
    this.dataState.searchText = 'so';
    this.dataManagerService.updateDataState(this.dataState, 'dataManager');
  }
}
