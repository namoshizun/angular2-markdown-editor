import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule} from '../shared/shared.module';
import { HttpModule } from '@angular/http';

import { TooltipModule } from 'ng2-bootstrap/tooltip';

import { ToolBarComponent } from './components/tool-bar.component';
import { MdEditorComponent } from './components/md-editor.component';
import { MdViewerComponent } from "./components/md-viewer.component";
import { EditiorComponent } from "./editor.component";

import { MarkdownService } from './markdown.service';

@NgModule({
  imports: [
    SharedModule,
    HttpModule,
    TooltipModule.forRoot(),
    RouterModule.forChild([
      {
        path: 'editor',
        component: EditiorComponent,
      }
    ] as Routes) as ModuleWithProviders
  ],
  declarations: [
    EditiorComponent,
    MdViewerComponent,
    MdEditorComponent,
    ToolBarComponent,
  ],
  providers: [MarkdownService]
})
export class EditorModule {
}
