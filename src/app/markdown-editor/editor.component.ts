import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from "rxjs/Subject";
import { Subscription } from "rxjs/Subscription";

import '../vendor';

@Component({
  selector: 'blog-editor',
  templateUrl: 'templates/editor.html',
})
export class EditiorComponent implements OnInit, OnDestroy {

  text: string = '';
  sub$: Subscription;
  input$ = new Subject<string>();

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
