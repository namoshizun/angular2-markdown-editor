import { Component, Input, Output } from '@angular/core';
import { EventEmitter, OnInit, OnDestroy } from '@angular/core';

var MarkdownIt = require('markdown-it');
var hljs = require('highlight.js');

@Component({
  selector: 'markdown-viewer',
  template: `<div id="md-result" (scroll)="handleScroll($event)"></div>`
})
export class MdViewerComponent implements OnInit, OnDestroy {
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

  isAdjustingView: boolean = false;
  viewer: HTMLDivElement;
  md: any;

  @Output() onScroll = new EventEmitter<number>();
  @Input() set content(text: string) {
    if (text) {
      this.viewer.innerHTML = this.render(text);
    }
  }

  constructor() {
    this.md = new MarkdownIt(this.config);
  }

  ngOnInit() {
    this.viewer = <HTMLDivElement>document.getElementById('md-result');
  }

  ngOnDestroy() {
    this.md = null;
  }

  scrollTo(ratio: number): void {
    this.isAdjustingView = true;
    this.viewer.scrollTop = (this.viewer.scrollHeight - this.viewer.clientHeight) * ratio;
  }

  render(text: string): string {
    return this.md.render(text);
  }

  // EVENTS
  handleScroll(evt) {
    if (!this.isAdjustingView) {
      let height = this.viewer.scrollHeight - this.viewer.clientHeight;
      let ratio = this.viewer.scrollTop / height;
      this.onScroll.emit(ratio);
    }

    this.isAdjustingView = false;
  }
}
