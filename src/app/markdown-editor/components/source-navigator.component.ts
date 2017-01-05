import { Component, Output,  } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { MarkdownService } from "../markdown.service";

import { ToolBarItem } from "../../shared/types";
var FuzzySearch = require('fuzzy-search/dist/FuzzySearch');

@Component({
  selector: 'source-navigator',
  template: `
    <!--SEARCH BAR-->
    <div class="row">
      <input *ngIf="viewConfig.openSearch"
             type="text" class="form-control" placeholder="Note Title"
             (input)="handleSearch($event.target.value)">
    </div>
    <!--TOOL BAR-->
    <div class="row">
      <toolbar [styleClass]="'nav-toolbar'"
               [items]="navigatorToolItems">         
      </toolbar>
    </div>
    <!--NOTE LIST-->
    <div class="row">
      <ul class="list-group">
        <li *ngFor="let title of matchedTitles | async"
            class="list-group-item"
            [class.selected]="title == choosen"
            (click)="handleSelectNote($event, title);">
            {{ title }}
            <span *ngIf="viewConfig.deleteNotes"
                  class="glyphicon glyphicon-trash pull-right"
                  (click)="handleDeleteNote($event, title)"></span>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .selected { background-color: #cfdff9 }
    .list-group { cursor: pointer }
  `]
})
export class SourceNavigatorComponent {
  viewConfig = { // default setting
    openSearch: false,
    deleteNotes: false,
  };

  readonly navigatorToolItems: ToolBarItem[][] = [
    [
      { tooltip: 'Upload', glyph: 'glyphicon glyphicon-upload',
        callback: () => alert('Not yet implemented!') }
    ],
    [
      { tooltip: 'New', glyph: 'glyphicon glyphicon-plus',
        callback: () => this.mdService.addNewNote().then(title => this.reset(title)) }
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

  @Output() onSelectNote = new EventEmitter<string>();

  choosen: string;
  noteTitles: string[];

  matchedTitles: Observable<string[]>;
  searchStream = new Subject<string>();

  constructor(public mdService: MarkdownService) {}

  reset(initTitle?: string) {
    this.noteTitles = this.mdService.getNoteTitles();
    this.handleSelectNote(null, initTitle || this.noteTitles[0]);

    if (!this.matchedTitles) {
      this.setupSearchStream();
    } else {
      this.searchStream.next('');
    }
  }

  setupSearchStream(): void {
    this.matchedTitles = this.searchStream
      .startWith('')
      .debounceTime(300)
      .switchMap(term => Observable.of<string[]>(this.search(term)))
  }

  search(keyword: string): string[] {
    if (keyword == '') return this.noteTitles;
    let fuzzy = new FuzzySearch(this.noteTitles);
    return fuzzy.search(keyword);
  }

  // EVENTS
  handleDeleteNote(evt: any, noteTitle: string): void {
    this.mdService.deleteNote(noteTitle).then(deleted => this.reset());
  }

  handleSearch(term: string) {
    this.searchStream.next(term);
  }

  handleSelectNote(evt: any, noteTitle: string): void {
    this.choosen = noteTitle;
    this.onSelectNote.emit(noteTitle);
  }
}
