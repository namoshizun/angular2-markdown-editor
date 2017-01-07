import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MarkdownService } from './services/markdown.service';
import { QuestionFactoryService } from './services/question.factory.service';
import { UtilService } from './services/util.service';

@NgModule({
  imports: [
    SharedModule
  ],
  providers: [
    MarkdownService,
    QuestionFactoryService,
    UtilService
  ]
})
export class CoreModule { }
