import {Component, Input, Output, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ElementRef, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from "rxjs/Subscription";

import { Scrollable } from '../../shared/types';
import '../../vendor';

var MarkdownIt = require('markdown-it');
var hljs = require('highlight.js');

@Component({
  selector: 'markdown-viewer',
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  @Input() contentStream: Observable<string>;
  @Output() onScroll = new EventEmitter<number>();

  $subscriptions: Subscription[] = [];
  viewer: HTMLDivElement;
  md: any;

  constructor(private el: ElementRef,
              private cd: ChangeDetectorRef) {
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

  setupStreams(): void {
    this.$subscriptions.push(
      // scroll stream
      Observable.fromEvent(this.el.nativeElement, 'mouseenter')
        .flatMap(init => this.makeScrollStream())
        .subscribe((ratio) => this.onScroll.emit(ratio)),
      // text stream
      this.contentStream
        .distinctUntilChanged()
        .debounceTime(300)
        .subscribe((text: string) => {
          this.viewer.innerHTML = this.render(text);
          this.cd.markForCheck();
        })
    );
  }

  makeScrollStream(): Observable<any> {
    let scrollStream = Observable.fromEvent(this.viewer, 'scroll');
    let mouseleaveStream = Observable.fromEvent(this.el.nativeElement, 'mouseleave');
    return scrollStream.map(_ => {
      return this.viewer.scrollTop / (this.viewer.scrollHeight - this.viewer.clientHeight)
    }).takeUntil(mouseleaveStream);
  }

  scrollTo(ratio: number): void {
    this.viewer.scrollTop = (this.viewer.scrollHeight - this.viewer.clientHeight) * ratio;
  }

  render(text: string): string {
    return this.md.render(text);
  }
}
