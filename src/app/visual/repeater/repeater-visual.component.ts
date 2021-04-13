import {
  Component
} from '@angular/core';

import {
  SkyAppConfig
} from '@skyux/config';

import {
  FormArray,
  FormControl,
  Validators
} from '@angular/forms';

import {
  SkyInlineFormButtonLayout,
  SkyInlineFormCloseArgs,
  SkyInlineFormConfig
} from '@skyux/inline-form';

import {
  SkyThemeService,
  SkyThemeSettings
} from '@skyux/theme';

let nextItemId: number = 0;

@Component({
  selector: 'repeater-visual',
  templateUrl: './repeater-visual.component.html',
  styleUrls: ['./repeater-visual.component.scss']
})
export class RepeaterVisualComponent {

  public activeIndex = 0;

  public activeInlineFormId: number;

  public animationsDisabled: boolean = false;

  public customConfig: SkyInlineFormConfig = {
    buttonLayout: SkyInlineFormButtonLayout.Custom,
    buttons: [
      { action: 'save', text: 'Save', styleType: 'primary' },
      { action: 'delete', text: 'Delete', styleType: 'default' },
      { action: 'reset', text: 'Reset', styleType: 'default' },
      { action: 'cancel', text: 'Cancel', styleType: 'link' }
    ]
  };

  public items = [
    {
      id: 1,
      title: '2018 Gala',
      note: '2018 Gala for friends and family',
      fund: 'General 2018 Fund'
    },
    {
      id: 'foobar',
      title: '2018 Special event',
      note: 'Special event',
      fund: '2018 Special Events Fund'
    },
    {
      title: '2019 Gala',
      note: '2019 Gala for friends and family',
      fund: 'General 2019 Fund'
    },
    {
      id: 99,
      title: '2019 Gala',
      note: '2019 Gala for friends and family',
      fund: 'General 2019 Fund'
    },
    {
      id: 123,
      title: '2019 Gala',
      note: '2019 Gala for friends and family',
      fund: 'General 2019 Fund'
    }
  ];

  public itemsForSelectableRepeater = [
    {
      id: '1',
      title: 'Title 1',
      content: 'Content 1',
      isSelected: false
    },
    {
      id: '2',
      title: 'Title 2',
      content: 'Content 2',
      isSelected: false
    }
  ];

  public get itemsForReorderableRepeaterWithAddButton(): FormArray {
    if (typeof this._itemsForReorderableRepeaterWithAddButton === 'undefined') {
      this._itemsForReorderableRepeaterWithAddButton = new FormArray(
        Array.from(Array(5).keys())
          .map(n => this.newItemForReorderableRepeaterWithAddButton(n + 1))
      );
    }
    return this._itemsForReorderableRepeaterWithAddButton as FormArray;
  }

  public _itemsForReorderableRepeaterWithAddButton: FormArray | undefined;

  public showActiveInlineDelete: boolean = false;

  public showContent: boolean = false;

  public showStandardInlineDelete: boolean = false;

  constructor(
    private skyAppConfig: SkyAppConfig,
    public themeSvc: SkyThemeService
  ) {
    this.animationsDisabled = this.skyAppConfig.runtime.command === 'e2e';
  }

  public deleteItem(index: any): void {
    this.items.splice(index, 1);

    // If active item is removed, try selecting the next item.
    // If there's not one, try selecting the previous one.
    if (index === this.activeIndex) {
      this.activeIndex = undefined;
      setTimeout(() => {
        if (this.items[index]) {
          this.activeIndex = index;
        } else if (this.items[index - 1]) {
          this.activeIndex = index - 1;
        }
      });
    }

  }

  public addItem(): void {
    const newItem = {
      id: nextItemId++,
      title: 'New record ' + nextItemId,
      note: 'This is a new record',
      fund: 'New fund'
    };
    this.items.push(newItem);
  }

  public addItemToReorderableRepeaterWithAddButton(): void {
    this.itemsForReorderableRepeaterWithAddButton.push(
      this.newItemForReorderableRepeaterWithAddButton(this._itemsForReorderableRepeaterWithAddButton.length + 1)
    );
  }

  public onOrderChange(tags: any): void {
    console.log(tags);
  }

  public onOrderChangeForReorderableRepeaterWithAddButton(tags: FormControl[]): void {
    console.log(tags);
    this.itemsForReorderableRepeaterWithAddButton.clear();
    tags.forEach(formControl => {
      this.itemsForReorderableRepeaterWithAddButton.push(formControl);
    });
  }

  public getSelectedItems(): string[] {
    const ids: string[] = this.itemsForSelectableRepeater
      .filter(item => item.isSelected)
      .map(item => item.id.toString());

    return ids;
  }

  public onCollapse(): void {
    console.log('Collapsed.');
  }

  public onExpand(): void {
    console.log('Expanded.');
  }

  public onInlineFormClose(inlineFormCloseArgs: SkyInlineFormCloseArgs): void {
    console.log(inlineFormCloseArgs);
    this.activeInlineFormId = undefined;

    // Form handling would go here
  }

  public onItemClick(index: number): void {
    this.activeIndex = index;
  }

  public onEnter(event: KeyboardEvent, index: number): void {
    this.onItemClick(index);
  }

  public onSpace(event: KeyboardEvent, index: number): void {
    this.onItemClick(index);
  }

  public hideActiveInlineDelete(): void {
    this.showActiveInlineDelete = false;
  }

  public hideStandardInlineDelete(): void {
    this.showStandardInlineDelete = false;
  }

  public triggerActiveInlineDelete(): void {
    this.showActiveInlineDelete = true;
  }

  public triggerStandardInlineDelete(): void {
    this.showStandardInlineDelete = true;
  }

  public themeSettingsChange(themeSettings: SkyThemeSettings): void {
    this.themeSvc.setTheme(themeSettings);
  }

  private newItemForReorderableRepeaterWithAddButton(n: number): FormControl {
    return new FormControl(`item ${n}`, [Validators.required, Validators.maxLength(20)]);
  }
}
