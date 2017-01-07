import { Component, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { ReplaySubject } from "rxjs/ReplaySubject";
import { MdEditorComponent } from "./components/md-editor.component";
import { MdViewerComponent } from "./components/md-viewer.component";
import { SourceNavigatorComponent } from "./components/source-navigator.component";

import '../vendor';
import { ToolBarItem, Note } from '../core/types';
import { MarkdownService } from "../core/services/markdown.service";

@Component({
  selector: 'blog-editor',
  templateUrl: 'templates/editor.html',
})
export class EditiorComponent implements AfterViewInit, OnDestroy {

  @ViewChild(MdEditorComponent) private mdEditor: MdEditorComponent;
  @ViewChild(MdViewerComponent) private mdViewer: MdViewerComponent;
  @ViewChild(SourceNavigatorComponent) private noteNav: SourceNavigatorComponent;

  textStream = new ReplaySubject<string>(1);
  choosenNoteStream = new ReplaySubject<Note>(1);

  // View States
  viewConfig = {
    keepSync: true,
    enablePreview: true
  };

  readonly toolbarItems: ToolBarItem[][] = [
    [
      { tooltip: 'Save Changes', glyph: 'glyphicon glyphicon-save',
        callback: () => this.saveLatest() },
    ],
    [
      { tooltip: 'Close Preview', glyph: 'glyphicon glyphicon-eye-close',
        callback: () => this.viewConfig.enablePreview = false },
      { tooltip: 'Preview', glyph: 'glyphicon glyphicon-eye-open',
        callback: () => this.viewConfig.enablePreview = true }
    ],
    [
      { tooltip: 'No Sync',glyph: 'glyphicon glyphicon-random',
        callback: () => this.viewConfig.keepSync = false },
      { tooltip: 'Sync Views', glyph: 'glyphicon glyphicon-retweet',
        callback: () => this.viewConfig.keepSync = true }
    ]
  ];

  constructor(private mdService: MarkdownService) {}

  ngAfterViewInit() {
    this.mdService.loadSampleMarkdown()
      .then(ok => this.noteNav.reset())
      .catch(error => alert('Sorry, cannot load the sample markdown'));
  }

  ngOnDestroy() {}

  saveLatest(): void {
    this.choosenNoteStream.subscribe(currNote => {
      this.textStream.subscribe(latestText => {
        this.mdService.updateNote(currNote.title, 'text', latestText)
          .then(ok => ok ? this.noteNav.alterSaveStateTo(true, currNote.title) : alert('Sorry, cannot save changes'))
          .catch(console.error);
      }).unsubscribe();
    }).unsubscribe();
  }

  // Dynamic css class providers
  editorClass(): any {
   return {
     'col-xs-8': !this.viewConfig.enablePreview,
     'col-xs-5': this.viewConfig.enablePreview,
   }
  }

  // EVENT HANDLERS
  passText(text: string): void {
    this.textStream.next(text);
    this.noteNav.alterSaveStateTo(false);
  }

  passNote(noteTitle: string): void {
    this.choosenNoteStream.next(this.mdService.getNote(noteTitle));
  }

  syncViews(ratio: number, fromEditorToViewer: boolean): void {
    if (this.viewConfig.keepSync) {
      const view = fromEditorToViewer && this.viewConfig.enablePreview ? this.mdViewer : this.mdEditor;
      view.scrollTo(ratio);
    }
  }
}
