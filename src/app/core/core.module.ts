import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MarkdownService } from './services/markdown.service';
import { QuestionFactoryService } from './services/question.factory.service';
import { UtilService } from './services/util.service';
import { BROWSER_GLOBALS_PROVIDERS } from './providers/browser.providers';

@NgModule({
  imports: [
    SharedModule
  ],
  providers: [
    ...BROWSER_GLOBALS_PROVIDERS,
    MarkdownService,
    QuestionFactoryService,
    UtilService
  ]
})
export class CoreModule { }
