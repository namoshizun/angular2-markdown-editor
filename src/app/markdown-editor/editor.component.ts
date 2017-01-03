import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from "rxjs/Subject";
import { Subscription } from "rxjs/Subscription";

import { ToolBarItem } from '../shared/types';
import '../vendor';

@Component({
  selector: 'blog-editor',
  templateUrl: 'templates/editor.html',
})
export class EditiorComponent implements OnInit, OnDestroy {

  text: string = '';
  sub$: Subscription;
  input$ = new Subject<string>();

  readonly toolbarItems: ToolBarItem[][] = [
    [{ name: 'Preview', tooltip: 'Preview', glyph: 'glyphicon glyphicon-eye-open',
      callback: (evt) => alert('dummy button') }],
    [
      { name: 'Full Screen', tooltip: 'Full Screen',glyph: 'glyphicon glyphicon-fullscreen' },
      { name: 'Split', tooltip: 'Split',glyph: 'glyphicon glyphicon-resize-horizontal' }
    ]
  ];

  constructor() { }

  ngOnInit() {
    this.sub$ = this.input$
      .distinctUntilChanged()
      .debounceTime(300)
      .subscribe(text => this.text = text);
  }

  ngOnDestroy() {
    if (this.sub$) this.sub$.unsubscribe();
  }

  passText(text: string): void {
    this.input$.next(text);
  }
}
