import { Component, Output } from '@angular/core';
import { OnInit, OnDestroy, EventEmitter, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from "rxjs/Subscription";

import { MarkdownService } from '../markdown.service';
import { Scrollable } from '../../shared/types';
import '../../vendor';

declare var CodeMirror: any;

@Component({
  selector: 'markdown-editor',
  template: `<textarea id="code"></textarea>`,
})
export class MdEditorComponent implements OnInit, OnDestroy, Scrollable {
  @Output() onTextInput = new EventEmitter<string>();
  @Output() onScroll = new EventEmitter<number>();

  $subscriptions: Subscription[] = [];
  editor: any;

  readonly config = {
    mode: 'gfm', // github flavored markdown
    lineNumber: true,
    matchBrackets: true,
    lineWrapping: true,
    theme: 'base16-light'
  };

  constructor(private el: ElementRef,
              private mdService: MarkdownService) {}

  ngOnInit() {
    this.editor = CodeMirror.fromTextArea(document.getElementById('code'), this.config);
    this.editor.on('change', this.handleChange.bind(this));
    this.setupStreams();

    this.mdService.loadSampleMarkdown()
      .then((sample: string) => this.editor.setValue(sample))
      .catch(error => alert('Sorry, the sample cannot be loaded'))
  }

  ngOnDestroy() {
    this.editor = null;
    this.$subscriptions.forEach(sub => sub.unsubscribe());
  }

  scrollTo(ratio: number): void {
    let yPos = (this.editor.getScrollInfo().height - this.editor.getScrollInfo().clientHeight) * ratio;
    this.editor.scrollTo(0, yPos); // x, y
  }

  setupStreams(): void {
    this.$subscriptions.push(
      Observable.fromEvent(this.el.nativeElement, 'mouseenter')
        .flatMap(init => this.makeScrollStream())
        .subscribe((ratio) => this.onScroll.emit(ratio))
    );
  }

  makeScrollStream(): Observable<any> {
    let $scroll = Observable.fromEvent(this.editor, 'scroll');
    let $mouseleave = Observable.fromEvent(this.el.nativeElement, 'mouseleave');
    return $scroll.map((cm: any) => {
      return parseFloat(cm.getScrollInfo().top) / (cm.getScrollInfo().height - cm.getScrollInfo().clientHeight)
    }).takeUntil($mouseleave);
  }

  // EVENTS
  handleChange(cm, evt) {
    this.onTextInput.emit(this.editor.getValue());
  }
}
