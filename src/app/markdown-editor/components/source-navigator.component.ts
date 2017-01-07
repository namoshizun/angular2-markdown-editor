import { Component, Output } from '@angular/core';
import { EventEmitter, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { Subscription } from "rxjs/Subscription";

import { UploaderModalComponent } from './uploader-modal.component';
import { MarkdownService } from "../../core/services/markdown.service";

import '../../vendor';
import { ToolBarItem } from "../../core/types";
var FuzzySearch = require('fuzzy-search/dist/FuzzySearch');

@Component({
  selector: 'source-navigator',
  templateUrl: '../templates/source-navigator.html',
  styles: [`
    .selected { background-color: #cfdff9 }
    .list-group { cursor: pointer }
  `]
})
export class SourceNavigatorComponent implements OnInit, OnDestroy {
  /*******************
   * state recorders *
   * ****************/
  unsavedNotes: Set<number> = new Set();
  viewConfig = { // default setting
    openSearch: false,
    deleteNotes: false,
  };

  /******************
   * toolbar config *
   * ***************/
  readonly navigatorToolItems: ToolBarItem[][] = [
    [
      { tooltip: 'Upload', glyph: 'glyphicon glyphicon-upload',
        callback: () => this.uploader.toggle() }
    ],
    [
      { tooltip: 'New', glyph: 'glyphicon glyphicon-plus',
        callback: () => this.mdService.addNewNote().then(title => this.reset(title)).catch(alert) }
    ],
    [
      { tooltip: 'Remove', glyph: 'glyphicon glyphicon-minus',
        callback: () => this.viewConfig.deleteNotes = true },
      { tooltip: 'Ok', glyph: 'glyphicon glyphicon-ok',
        callback: () => this.viewConfig.deleteNotes = false },
    ],
    [
      { tooltip: 'Search', glyph: 'glyphicon glyphicon-search',
        callback: () => this.viewConfig.openSearch = !this.viewConfig.openSearch }
    ]
  ];

  @ViewChild('uploader') uploader: UploaderModalComponent;
  @Output() onSelectNote = new EventEmitter<string>();

  choosen: string;
  noteTitles: string[];

  /**************************
   * data and event streams *
   * ***********************/
  searchStream = new Subject<string>();
  clickStream = new Subject<string>();
  saveStateUpdateRequestStream = new Subject<[boolean, string]/* saved?, noteTitle*/>();
  matchedTitles: Observable<string[]>;
  $subscriptions: Subscription[] = [];

  constructor(public mdService: MarkdownService) {}

  ngOnInit() {
    // setup search stream
    this.matchedTitles = this.searchStream
      .debounceTime(300)
      .switchMap(term => Observable.of<string[]>(this.search(term)));

    // setup the update request stream for note saving states
    this.$subscriptions.push(Observable.from(this.clickStream)
      .switchMapTo(this.saveStateUpdateRequestStream)
      .skip(1) // ignore the first request which is triggered by note selection. fixme, not working yet...
      .subscribe(request => {
        let [saved, title] = [...request];
        let idx = this.noteTitles.indexOf(title as string);
        saved ? this.unsavedNotes.delete(idx) : this.unsavedNotes.add(idx);
      }));
  }

  ngOnDestroy() { this.$subscriptions.forEach(sub => sub.unsubscribe()) }

  private search(keyword: string): string[] {
    if (keyword == '') return this.noteTitles;
    let fuzzy = new FuzzySearch(this.noteTitles);
    return fuzzy.search(keyword);
  }

  private cleanEvent(evt): void {
    if (evt) {
      evt.preventDefault();
      evt.stopPropagation();
    }
  }

  reset(initTitle?: string) {
    this.noteTitles = this.mdService.getNoteTitles();
    this.handleSelectNote(null, initTitle || this.noteTitles[0]);
    this.searchStream.next(''); // refresh note list
  }

  alterSaveStateTo(saved: boolean, title?: string): void {
    this.saveStateUpdateRequestStream.next([saved, title || this.choosen]);
  }

  // EVENTS
  handleDeleteNote(evt: any, noteTitle: string): void {
    this.cleanEvent(evt);
    this.mdService.deleteNote(noteTitle).then(deleted => this.reset());
  }

  handleSelectNote(evt: any, noteTitle: string): void {
    this.cleanEvent(evt);
    this.choosen = noteTitle;
    this.onSelectNote.emit(noteTitle);
    this.clickStream.next(noteTitle);
  }

  handleSearch(term: string) {
    this.searchStream.next(term);
  }

  handleFinishEditingTitle(oldTitle: string, newTitle: string): void {
    if (oldTitle === newTitle) return;

    this.mdService.updateNote(oldTitle, 'title', newTitle)
      .then(ok => ok ? this.reset(newTitle) : alert('Sorry, cannot update this title for you'))
      .catch(alert);
  }

  handleUploadFinished(allDone: boolean): void {
    allDone ? this.reset(): alert('Sorry, some files could not be uploaded');
  }
}
