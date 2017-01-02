import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from './shared/shared.module';
import { HttpModule } from '@angular/http';
import { appRouting } from './app.routing';

import { AppComponent } from './app.component';
import { EditorModule } from "./markdown-editor/editor.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    EditorModule,
    appRouting,

    BrowserModule,
    SharedModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
