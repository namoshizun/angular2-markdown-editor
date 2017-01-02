import { Component, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { MarkdownService } from '../markdown.service';

declare var CodeMirror: any;

@Component({
  selector: 'markdown-editor',
  template: `<textarea id="code"></textarea>`,
})
export class MdEditorComponent implements OnInit, OnDestroy {
  @Output() onTextInput = new EventEmitter<string>();
  @Output() onScroll = new EventEmitter<number>();

  isAdjustingView: boolean = false;
  editor: any;

  readonly config = {
    mode: 'gfm', // github flavored markdown
    lineNumber: true,
    matchBrackets: true,
    lineWrapping: true,
    theme: 'base16-light'
  };

  constructor(private mdService: MarkdownService) {}

  ngOnInit() {
    this.editor = CodeMirror.fromTextArea(document.getElementById('code'), this.config);
    this.editor.on('change', this.handleChange.bind(this));
    this.editor.on('scroll', this.handleScroll.bind(this));

    this.mdService.loadSampleMarkdown()
      .then((sample: string) => this.editor.setValue(sample))
      .catch(error => alert('Sorry, the sample cannot be loaded'))
  }

  ngOnDestroy() { this.editor = null }

  scrollTo(ratio: number): void {
    this.isAdjustingView = true;
    let yPos = (this.editor.getScrollInfo().height - this.editor.getScrollInfo().clientHeight) * ratio;
    this.editor.scrollTo(0, yPos); // x, y
  }

  // EVENTS
  handleChange(cm, evt) {
    this.onTextInput.emit(this.editor.getValue());
  }

  handleScroll(cm) {
    if (!this.isAdjustingView) {
      let height = cm.getScrollInfo().height - cm.getScrollInfo().clientHeight;
      let ratio = parseFloat(cm.getScrollInfo().top) / height;
      this.onScroll.emit(ratio);
    }
    this.isAdjustingView = false;
  }
}
