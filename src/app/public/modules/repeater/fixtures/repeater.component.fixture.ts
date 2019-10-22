import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SkyRepeaterComponent
} from '../repeater.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './repeater.component.fixture.html'
})
export class RepeaterTestComponent {

  public activeIndex: number = undefined;

  public expandMode = 'single';

  public lastItemExpanded: boolean;

  public lastItemSelected = false;

  public removeLastItem: boolean;

  public reorderable = false;

  public selectable = false;

  public showContextMenu: boolean;

  public showRepeaterWithActiveIndex = false;

  @ViewChild(SkyRepeaterComponent)
  public repeater: SkyRepeaterComponent;

  public onCollapse(): void {}

  public onExpand(): void {}
}
