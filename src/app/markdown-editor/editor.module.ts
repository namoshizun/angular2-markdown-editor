import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule} from '../shared/shared.module';

import { SourceInputComponent } from './components/source-input.component';
import { SourceNavigatorComponent } from './components/source-navigator.component';
import { UploaderModalComponent } from './components/uploader-modal.component';
import { MdEditorComponent } from './components/md-editor.component';
import { MdViewerComponent } from "./components/md-viewer.component";
import { EditiorComponent } from "./editor.component";

import { MarkdownService } from '../core/services/markdown.service';

@NgModule({
  imports: [
    SharedModule,
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
    SourceNavigatorComponent,
    SourceInputComponent,
    UploaderModalComponent,
  ],
  providers: [MarkdownService]
})
export class EditorModule {
}
