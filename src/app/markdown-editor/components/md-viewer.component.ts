import { Component, Input, Output } from '@angular/core';
import { ElementRef, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from "rxjs/Subscription";

import { Scrollable } from '../../shared/types';
import '../../vendor';

var MarkdownIt = require('markdown-it');
var hljs = require('highlight.js');

@Component({
  selector: 'markdown-viewer',
  template: `<div id="md-result"></div>`
})
export class MdViewerComponent implements OnInit, OnDestroy, Scrollable {
  readonly config = {
    linkfy: true,
    breaks: true,
    typographer: true,
    highlight: (str, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value;
        } catch (__) {}
      }
      return ''; // use external default escaping
    }
  };

  @Output() onScroll = new EventEmitter<number>();
  @Input() set content(text: string) {
    if (text) {
      this.viewer.innerHTML = this.render(text);
    }
  }

  $subscriptions: Subscription[] = [];
  viewer: HTMLDivElement;
  md: any;

  constructor(private el: ElementRef) {
    this.md = new MarkdownIt(this.config);
  }

  ngOnInit() {
    this.viewer = <HTMLDivElement>document.getElementById('md-result');
    this.setupStreams();
  }

  ngOnDestroy() {
    this.md = null;
    this.$subscriptions.forEach(sub => sub.unsubscribe());
  }

  scrollTo(ratio: number): void {
    this.viewer.scrollTop = (this.viewer.scrollHeight - this.viewer.clientHeight) * ratio;
  }

  setupStreams(): void {
    this.$subscriptions.push( // fixme: NOT DRY!!
      Observable.fromEvent(this.el.nativeElement, 'mouseenter')
        .flatMap(init => this.makeScrollStream())
        .subscribe((ratio) => this.onScroll.emit(ratio))
    );
  }

  makeScrollStream(): Observable<any> {
    let $scroll = Observable.fromEvent(this.viewer, 'scroll');
    let $mouseleave = Observable.fromEvent(this.el.nativeElement, 'mouseleave');
    return $scroll.map(_ => {
      return this.viewer.scrollTop / (this.viewer.scrollHeight - this.viewer.clientHeight)
    }).takeUntil($mouseleave);
  }

  render(text: string): string {
    return this.md.render(text);
  }
}
