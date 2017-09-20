import {Component, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MdEditorComponent } from './components/md-editor.component';
import { MdViewerComponent } from './components/md-viewer.component';
import { SourceNavigatorComponent } from './components/source-navigator.component';

import '../vendor';
import { ToolBarItem, Note } from '../core/types';
import { MarkdownService } from '../core/services/markdown.service';
import { WindowRef } from '../core/providers/browser.providers';


@Component({
  selector: 'app-blog-editor',
  templateUrl: 'templates/editor.html',
})
export class EditiorComponent implements AfterViewInit, OnDestroy {

  @ViewChild(MdEditorComponent) private mdEditor: MdEditorComponent;
  @ViewChild(MdViewerComponent) private mdViewer: MdViewerComponent;
  @ViewChild(SourceNavigatorComponent) private noteNav: SourceNavigatorComponent;

  textStream = new BehaviorSubject<string>(null);
  choosenNoteStream = new BehaviorSubject<Note>(null);

  // View States
  viewConfig = {
    keepSync: true,
    enablePreview: true,
    syncingNotes: false
  };

  readonly toolbarItems: ToolBarItem[][] = [
    [
      { tooltip: 'Sync', glyph: 'glyphicon glyphicon-floppy-disk',
        callback: () => this.syncLatest() },
    ],
    [
      { tooltip: 'Close Preview', glyph: 'glyphicon glyphicon-eye-close',
        callback: () => this.viewConfig.enablePreview = false },
      { tooltip: 'Preview', glyph: 'glyphicon glyphicon-eye-open',
        callback: () => this.viewConfig.enablePreview = true }
    ],
    [
      { tooltip: 'No Sync', glyph: 'glyphicon glyphicon-random',
        callback: () => this.viewConfig.keepSync = false },
      { tooltip: 'Sync Views', glyph: 'glyphicon glyphicon-retweet',
        callback: () => this.viewConfig.keepSync = true }
    ]
  ];

  constructor(private mdService: MarkdownService,
              private window: WindowRef) {
    // this.window.nativeWindow.onbeforeunload = (e) => '/* asking for confirmation */'
  }

  ngAfterViewInit() {
    this.mdService.loadSampleMarkdown()
      .then(ok => this.noteNav.reset())
      .catch(error => alert('Sorry, cannot load the sample markdown'));
  }

  ngOnDestroy() {
  }

  syncLatest(): void {
    const [note, text] = [this.choosenNoteStream.getValue(), this.textStream.getValue()];
    this.mdService.updateNote(note.title, 'text', text, true /* update both local and db note */)
      .then(ok => ok ? this.noteNav.alterSaveStateTo(true, note.title) : alert('Sorry, cannot save changes'))
      .catch(console.error);
  }

  // Dynamic css class providers
  editorClass(): any {
   return {
     'col-xs-8': !this.viewConfig.enablePreview,
     'col-xs-5': this.viewConfig.enablePreview,
   };
  }

  // EVENT HANDLERS
  handleChangeText(text: string): void {
    this.textStream.next(text);
    this.noteNav.alterSaveStateTo(false);
  }

  handleSelectNote(noteTitle: string): void {
    const [currNote, currText] = [this.choosenNoteStream.getValue(), this.textStream.getValue()];
    this.choosenNoteStream.next(this.mdService.getNote(noteTitle));

    if (currNote && currText) {
      // save changes of current note
      this.mdService.updateNote(currNote.title, 'text', currText)
        .then(ok => this.choosenNoteStream.next(this.mdService.getNote(noteTitle)))
        .catch(alert);
    }
  }

  handleSyncingNotes(syncing: boolean): void {
    this.viewConfig.syncingNotes = syncing;
  }

  syncViews(ratio: number, fromEditorToViewer: boolean): void {
    if (this.viewConfig.keepSync) {
      const view = fromEditorToViewer && this.viewConfig.enablePreview ? this.mdViewer : this.mdEditor;
      view.scrollTo(ratio);
    }
  }
}
