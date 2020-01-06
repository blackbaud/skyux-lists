import {
  Component
} from '@angular/core';

import {
  SkyDataManagerService,
  SkyDataViewConfig
} from '../../public/modules/data-manager/';

@Component({
  selector: 'data-view-repeater',
  templateUrl: './data-view-repeater.component.html'
})
export class DataViewRepeaterComponent {

  public viewConfig: SkyDataViewConfig = {
    id: 'repeaterView',
    name: 'Repeater View',
    icon: 'list',
    searchEnabled: true,
    isActive: true,
    columnPickerEnabled: true,
    filterButtonEnabled: true,
    columnOptions: [
      {
        id: '1',
        label: 'Column 1',
        isSelected: true
      },
      {
        id: '2',
        label: 'Column 2',
        isSelected: false
      }
    ]
  };

  public displayedItems: any[];
  public items: any[] = [
    {
      name: 'Orange',
      description: 'A round, orange fruit.',
      type: 'citrus',
      color: 'orange'
    },
    {
      name: 'Mango',
      description: 'Delicious in smoothies, but don\'t eat the skin.',
      type: 'other',
      color: 'orange'
    },
    {
      name: 'Lime',
      description: 'A sour, green fruit used in many drinks.',
      type: 'citrus',
      color: 'green'
    },
    {
      name: 'Strawberry',
      description: 'A red fruit that goes well with shortcake.',
      type: 'berry',
      color: 'red'
    },
    {
      name: 'Blueberry',
      description: 'A small, blue fruit often found in muffins.',
      type: 'berry',
      color: 'blue'
    }

  ];

  constructor(private dataManagerService: SkyDataManagerService) {
    this.displayedItems = this.items;

    this.dataManagerService.searchText.subscribe(text => {
      console.log('search in repeater');
      this.searchItems(text);
    });
   }

  public searchItems(searchText: string) {
    let filteredItems = this.items;

    if (searchText) {
      filteredItems = this.items.filter(function (item: any) {
        let property: any;

        for (property in item) {
          if (item.hasOwnProperty(property) && (property === 'name' || property === 'description')) {
            if (item[property].indexOf(searchText) > -1) {
              return true;
            }
          }
        }

        return false;
      });
    }
    this.displayedItems = filteredItems;
  }
}
