import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VisualModule } from './visual/visual.module';

import {
  NoopAnimationsModule
} from '@angular/platform-browser/animations';
import { SkyThemeService } from '@skyux/theme';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    NoopAnimationsModule,
    AppRoutingModule,
    VisualModule
  ],
  providers: [SkyThemeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
