import { Component } from '@angular/core';

let nextItemId = 0;

@Component({
  selector: 'app-repeater-single-select-visual',
  templateUrl: './repeater-single-select-visual.component.html',
})
export class RepeaterSingleSelectVisualComponent {
  public set activeIndex(value: number) {
    this._activeIndex = value;
    this.activeRecord = this.items[this._activeIndex];
    console.log(this._activeIndex);
  }

  public activeRecord: any;

  public get activeIndex(): number {
    return this._activeIndex;
  }

  public items = [
    {
      id: 1,
      title: '2018 Gala',
      note: '2018 Gala for friends and family',
      fund: 'General 2018 Fund',
    },
    {
      id: 'foobar',
      title: '2018 Special event',
      note: 'Special event',
      fund: '2018 Special Events Fund',
    },
    {
      title: '2019 Gala',
      note: '2019 Gala for friends and family',
      fund: 'General 2019 Fund',
    },
  ];

  public selectable = true;

  private _activeIndex;
  constructor() {}

  public addItem(): void {
    const newItem = {
      id: nextItemId++,
      title: 'New record ' + nextItemId,
      note: 'This is a new record',
      fund: 'New fund',
    };
    this.items.push(newItem);
  }

  public onSelectedChange(event: any) {
    console.log(event);
  }
}
