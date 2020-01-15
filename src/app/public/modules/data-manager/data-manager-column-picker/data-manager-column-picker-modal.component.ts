import {
  Component
} from '@angular/core';

import {
  SkyModalInstance
} from '@skyux/modals';

import {
  SkyDataManagerColumnPickerModalContext
} from './data-manager-column-picker-modal-context';

@Component({
  selector: 'sky-data-manager-column-picker-modal',
  templateUrl: './data-manager-column-picker-modal.component.html'
})
export class SkyDataManagerColumnPickerModalComponent {
  public title = 'Choose columns to show in the list';

  constructor(
    public context: SkyDataManagerColumnPickerModalContext,
    public instance: SkyModalInstance
  ) { }

  public cancelChanges() {
    this.instance.cancel();
  }

  public applyChanges() {
    this.instance.save(this.context.columnOptions.filter(col => col.isSelected));
  }
}
