import {Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ReplaySubject } from "rxjs/ReplaySubject";
import { MdEditorComponent } from "./components/md-editor.component";
import { MdViewerComponent } from "./components/md-viewer.component";
import { SourceNavigatorComponent } from "./components/source-navigator.component";

import '../vendor';
import { ToolBarItem, Note } from '../shared/types';
import { MarkdownService } from "./markdown.service";

@Component({
  selector: 'blog-editor',
  templateUrl: 'templates/editor.html',
})
export class EditiorComponent implements OnInit, OnDestroy {

  @ViewChild(MdEditorComponent) private mdEditor: MdEditorComponent;
  @ViewChild(MdViewerComponent) private mdViewer: MdViewerComponent;
  @ViewChild(SourceNavigatorComponent) private noteNav: SourceNavigatorComponent;

  textStream = new ReplaySubject<string>(1);
  choosenNoteStream = new ReplaySubject<Note>(1);

  viewConfig = { // default setting
    syncViews: true,
    enablePreview: true
  };
  readonly toolbarItems: ToolBarItem[][] = [
    [
      { tooltip: 'Close Preview', glyph: 'glyphicon glyphicon-eye-close',
        callback: () => this.viewConfig.enablePreview = false },
      { tooltip: 'Preview', glyph: 'glyphicon glyphicon-eye-open',
        callback: () => this.viewConfig.enablePreview = true }
    ],
    [
      { tooltip: 'No Sync',glyph: 'glyphicon glyphicon-random',
        callback: () => this.viewConfig.syncViews = false },
      { tooltip: 'Sync Views', glyph: 'glyphicon glyphicon-retweet',
        callback: () => this.viewConfig.syncViews = true }
    ]
  ];

  constructor(private mdService: MarkdownService) {}

  ngOnInit() {
    this.mdService.loadSampleMarkdown()
      .then(ok => this.noteNav.reset())
      .catch(error => alert('Sorry, cannot load the sample markdown'));
  }

  ngOnDestroy() {}

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
  }

  passNote(noteTitle: string): void {
    this.choosenNoteStream.next(this.mdService.notes.find((note: Note) => note.title === noteTitle));
  }

  syncViews(ratio: number, fromEditorToViewer: boolean): void {
    if (this.viewConfig.syncViews) {
      if (fromEditorToViewer && this.viewConfig.enablePreview) {
        this.mdViewer.scrollTo(ratio);
      }
      else {
        this.mdEditor.scrollTo(ratio);
      }
    }
  }
}
