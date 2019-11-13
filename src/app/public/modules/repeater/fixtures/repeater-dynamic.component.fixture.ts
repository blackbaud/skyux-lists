import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SkyRepeaterComponent
} from '../repeater.component';

let nextItemId: number = 0;

@Component({
  selector: 'sky-test-cmp',
  template: `
    <sky-repeater
      [reorderable]="reorderable"
    >
      <sky-repeater-item *ngFor="let item of items; let i = index">
        <sky-repeater-item-title>
          {{ item.title }}
        </sky-repeater-item-title>
      </sky-repeater-item>
    </sky-repeater>`
})
export class RepeaterDynamicFixtureComponent {

  public items = [
    {
      title: '2018 Gala'
    },
    {
      title: '2018 Special event'
    },
    {
      title: '2019 Gala'
    }
  ];

  public reorderable = true;

  @ViewChild(SkyRepeaterComponent)
  public repeaterComponent: SkyRepeaterComponent;

  public addItem(): void {
    const newItem = {
      id: nextItemId++,
      title: 'New record ' + nextItemId
    };
    this.items.push(newItem);
  }
}
