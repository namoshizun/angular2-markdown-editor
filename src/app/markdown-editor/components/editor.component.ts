import { Component, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { MarkdownService } from '../markdown.service';

declare var CodeMirror: any;

@Component({
  selector: 'markdown-editor',
  template: `<textarea id="code"></textarea>`,
})
export class EditorComponent implements OnInit, OnDestroy {
  @Output() onTextInput = new EventEmitter<string>();
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
    this.mdService.loadSampleMarkdown()
      .then((sample: string) => {
        this.editor.on('change', this.handleChange.bind(this));
        this.editor.setValue(sample);
      })
      .catch(error => alert('Sorry, the sample cannot be loaded'))
  }

  ngOnDestroy() { this.editor = null }

  handleChange(_, __) {
    this.onTextInput.emit(this.editor.getValue());
  }
}
