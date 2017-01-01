import { Component, Input, ElementRef, OnInit, OnDestroy } from '@angular/core';

var MarkdownIt = require('markdown-it');
var hljs = require('highlight.js');

@Component({
  selector: 'markdown-viewer',
  template: `<div></div>`
})
export class ViewerComponent implements OnInit, OnDestroy {
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

  md: any;
  @Input() set content(text: string) {
    this.el.nativeElement.innerHTML = this.render(text);
  }

  constructor(private el: ElementRef) {
    this.md = new MarkdownIt(this.config);
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.md = null;
  }

  render(text: string): string {
    return this.md.render(text);
  }
}
