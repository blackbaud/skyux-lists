import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input
} from '@angular/core';

import {
  SkyModalCloseArgs,
  SkyModalService
} from '@skyux/modals';

import {
  SkyDataManagerService
} from '../data-manager.service';

import {
  delay
} from 'rxjs/operators';

import {
  SkyDataManagerColumnPickerOption
} from '../models/data-manager-column-picker-option';

import {
  SkyDataManagerColumnPickerModalContext
} from './data-manager-column-picker-modal-context';

import {
  SkyDataManagerColumnPickerModalComponent
} from './data-manager-column-picker-modal.component';

@Component({
  selector: 'sky-data-manager-column-picker',
  templateUrl: './data-manager-column-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDataManagerColumnPickerComponent {

  @Input()
  public showButtonText: boolean;

  public columnOptions: SkyDataManagerColumnPickerOption[];

  public get columnPickerEnabled(): boolean {
    return this._columnPickerEnabled;
  }

  public set columnPickerEnabled(enabled: boolean) {
    this._columnPickerEnabled = enabled;
    this.changeDetector.markForCheck();
  }

  private _columnPickerEnabled: boolean;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private dataManagerService: SkyDataManagerService,
    private modalService: SkyModalService
  ) {
    this.dataManagerService.activeView
      .pipe(
        delay(0)
    ).subscribe(view => {
      this.columnPickerEnabled = view && view.columnPickerEnabled;
      this.columnOptions = view && view.columnOptions;
    });
   }

  public openColumnPickerModal(): void {
    const context = new SkyDataManagerColumnPickerModalContext();
    context.columnOptions = this.columnOptions;

    const options: any = {
      providers: [{ provide: SkyDataManagerColumnPickerModalContext, useValue: context }]
    };

    const modalInstance = this.modalService.open(SkyDataManagerColumnPickerModalComponent, options);

    modalInstance.closed.subscribe((result: SkyModalCloseArgs) => {
      if (result.reason === 'save') {
        const selectedColumnIds =
          result.data.map((col: SkyDataManagerColumnPickerOption) => col.id);
        this.dataManagerService.selectedColumnIds.next(selectedColumnIds);
      }
    });
  }
}
