import {
  Component
} from '@angular/core';
import { DataViewConfig } from '../../public/modules/data-manager/models/data-view-config';

// import {
//   SkyDataManagerService
// } from '../../public/modules/data-manager/';

@Component({
  selector: 'data-view-cards',
  templateUrl: './data-view-cards.component.html'
})
export class DataViewCardsComponent {

  public viewConfig: DataViewConfig = {
    id: 'cardsView',
    name: 'Cards View',
    icon: 'th-large',
    isActive: false
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

  // constructor(private dataManagerService: SkyDataManagerService) {}
}
