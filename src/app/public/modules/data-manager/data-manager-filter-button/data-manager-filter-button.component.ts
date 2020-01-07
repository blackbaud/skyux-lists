import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input
} from '@angular/core';

import {
  SkyDataManagerService
} from '../data-manager.service';

import {
  delay
} from 'rxjs/operators';

@Component({
  selector: 'sky-data-manager-filter-button',
  templateUrl: './data-manager-filter-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDataManagerFilterButtonComponent {

  @Input()
  public showButtonText: boolean;

  public get filterButtonEnabled(): boolean {
    return this._filterButtonEnabled;
  }

  public set filterButtonEnabled(enabled: boolean) {
    this._filterButtonEnabled = enabled;
    this.changeDetector.markForCheck();
  }

  private _filterButtonEnabled: boolean;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private dataManagerService: SkyDataManagerService
  ) {
    this.dataManagerService.activeView
      .pipe(
        delay(0)
    ).subscribe(view => {
      this.filterButtonEnabled = view && view.filterButtonEnabled;
    });
   }

  public filterButtonClicked(): void {
    // const context = new SkyDataManagerColumnPickerModalContext();
    // context.columnOptions = this.columnOptions;

    // const options: any = {
    //   providers: [{ provide: SkyDataManagerColumnPickerModalContext, useValue: context }]
    // };

    // const modalInstance = this.modalService.open(SkyDataManagerColumnPickerModalComponent, options);

    // modalInstance.closed.subscribe((result: SkyModalCloseArgs) => {
    //   if (result.reason === 'save') {
    //     const selectedColumnIds =
    //       result.data.map((col: SkyDataManagerColumnPickerOption) => col.id);
    //     this.dataManagerService.selectedColumnIds.next(selectedColumnIds);
    //   }
    // });
  }
}
