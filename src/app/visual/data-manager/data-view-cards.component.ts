import {
  Component
} from '@angular/core';

import {
  SkyDataManagerService,
  SkyDataManagerSortOption,
  SkyDataViewConfig
} from '../../public/modules/data-manager/';

@Component({
  selector: 'data-view-cards',
  templateUrl: './data-view-cards.component.html'
})
export class DataViewCardsComponent {

  public viewConfig: SkyDataViewConfig = {
    id: 'cardsView',
    name: 'Cards View',
    icon: 'th-large',
    isActive: false,
    sortEnabled: true,
    searchEnabled: true,
    filterButtonEnabled: true,
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

  public items: any[] = [
    {
      name: 'Orange',
      description: 'A round, orange fruit. A great source of vitamin C.',
      type: 'citrus',
      color: 'orange'
    },
    {
      name: 'Mango',
      description: 'Very difficult to peel. Delicious in smoothies, but don\'t eat the skin.',
      type: 'other',
      color: 'orange'
    },
    {
      name: 'Lime',
      description: 'A sour, green fruit used in many drinks. It grows on trees.',
      type: 'citrus',
      color: 'green'
    },
    {
      name: 'Strawberry',
      description: 'A red fruit that goes well with shortcake. It is the name of both the fruit and the plant!',
      type: 'berry',
      color: 'red'
    },
    {
      name: 'Blueberry',
      description: 'A small, blue fruit often found in muffins. When not ripe, they can be sour.',
      type: 'berry',
      color: 'blue'
    },
    {
      name: 'Banana',
      description: 'A yellow fruit with a thick skin. Monkeys love them, and in some countries it is customary to eat the peel.',
      type: 'other',
      color: 'yellow'
    }

  ];

  public displayedItems: any[];

  constructor(private dataManagerService: SkyDataManagerService) {
    this.displayedItems = this.items;

    this.dataManagerService.activeSortOption.subscribe(sortOption => {
      console.log('sortOption');
      console.log(sortOption);
      if (sortOption) {
        this.sortItems(sortOption);
      }
    });

    this.dataManagerService.searchText.subscribe(text => {
      console.log('search in cards');
    });
  }

  public sortItems(sortOption: SkyDataManagerSortOption) {
    let result = this.displayedItems.sort(function (a: any, b: any) {
      let descending = sortOption.descending ? -1 : 1,
        sortProperty = sortOption.propertyName;

      if (a[sortProperty] > b[sortProperty]) {
        return (descending);
      } else if (a[sortProperty] < b[sortProperty]) {
        return (-1 * descending);
      } else {
        return 0;
      }
    });

    this.displayedItems = result;
  }
}
