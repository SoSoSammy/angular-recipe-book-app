import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';

@NgModule({
  // declarations has all components, directives, and pipes
  // can only declare once
  declarations: [AppComponent, HeaderComponent],
  // imports has all imported modules
  imports: [
    BrowserModule, // must be added only once
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    CoreModule,
  ],
  // defines which component is available right in the index.html file (typically only 1)
  bootstrap: [AppComponent],
})
export class AppModule {}
