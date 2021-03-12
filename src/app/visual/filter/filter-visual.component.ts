import {
  Component
} from '@angular/core';

import {
  SkyThemeService,
  SkyThemeSettings
} from '@skyux/theme';

@Component({
  selector: 'filter-visual',
  templateUrl: './filter-visual.component.html'
})
export class FilterVisualComponent {
  public filtersActive: boolean = false;

  public appliedFilters: Array<any> = [
    {
      label: 'hide orange',
      dismissible: false
    },
    {
      label: 'berry fruit type',
      dismissible: true
    }
  ];
  public themeSettings: SkyThemeSettings;

  constructor(
    public themeSvc: SkyThemeService
  ) {
  }

  public themeSettingsChange(themeSettings: SkyThemeSettings): void {
    this.themeSettings = themeSettings;
    this.themeSvc.setTheme(themeSettings);
  }
}
