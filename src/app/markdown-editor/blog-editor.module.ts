import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { EditorComponent } from './components/editor.component';
import { ViewerComponent } from "./components/viewer.component";
import { BlogEditorComponent } from "./blog-editor.component";

import { MarkdownService } from './markdown.service';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    RouterModule.forChild([
      {
        path: 'editor',
        component: BlogEditorComponent,
      }
    ] as Routes) as ModuleWithProviders
  ],
  declarations: [
    BlogEditorComponent,
    ViewerComponent,
    EditorComponent
  ],
  providers: [MarkdownService]
})
export class BlogEditorModule {
}
