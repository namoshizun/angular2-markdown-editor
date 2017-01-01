import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { appRouting } from './app.routing';

import { AppComponent } from './app.component';
import { BlogEditorModule } from "./markdown-editor/blog-editor.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BlogEditorModule,
    appRouting,

    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
