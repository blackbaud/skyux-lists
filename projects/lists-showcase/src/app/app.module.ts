import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VisualModule } from './visual/visual.module';

import { SkyThemeService } from '@skyux/theme';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserAnimationsModule, AppRoutingModule, VisualModule],
  providers: [SkyThemeService],
  bootstrap: [AppComponent],
})
export class AppModule {}
