import { Component, Output, EventEmitter, ViewChild, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';

import { ModalComponent } from '../../shared/modal.component';
import { FileUploadQuestion, TextboxQuestion, QuestionBase } from '../../core/question.class';

import { QuestionFactoryService } from '../../core/services/question.factory.service';
import { MarkdownService } from '../../core/services/markdown.service';
import { UtilService } from '../../core/services/util.service';
type UploadType = 'local' | 'url';

@Component({
  selector: 'app-uploader-modal',
  templateUrl: '../templates/uploader-modal.html',
  styles: [`
    .confirm-btn {
      position: fixed;
      top: 15px;
      right: 45px;
      font-size: 20px;
      cursor: pointer;
    }
  `]
})
export class UploaderModalComponent implements OnInit {
  readonly modalTitle = 'Upload Markdown';
  form: FormGroup;

  @Output() onUploadFinished = new EventEmitter<boolean>();
  @ViewChild('modal') modal: ModalComponent;

  // QUESTIONS --- BEGIN
  readonly localSourceQuestion: QuestionBase<string> = new FileUploadQuestion({
    key: 'source',
    label: 'Click to browse file',
    callback: (evt, group: FormGroup) => {
      // this is just a workaround solution since FormControl cannot capture uploaded files automatically
      const file = evt.target.files[0];
      const reader = new FileReader();
      reader.onload  = ((thefile) => (e) => group.patchValue({ source: e.target.result }))(file);
      reader.readAsText(file);
    }
  });

  readonly urlSourceQuestion: QuestionBase<string> = new TextboxQuestion({
    key: 'source',
    placeholder: 'http://foo.com/xx.md',
    label: 'Paste url address here',
    feedbacks: { url: 'please enter a valid url address' },
    constraints: { url: true }
  });

  readonly titleQuestion: QuestionBase<string> = new TextboxQuestion({
    key: 'title',
    label: 'Title',
    feedbacks: { required: 'Please enter title' },
    constraints: { required: true }
  });
  // QUESTIONS --- END

  constructor(private qService: QuestionFactoryService,
              private util: UtilService,
              private mdService: MarkdownService) {}

  ngOnInit() {
    this.resetForm();
  }

  private resetForm(): void {
    this.form = new FormGroup({
      local: new FormArray([this.getNewGroup('local')]),
      url: new FormArray([this.getNewGroup('url')]),
    });
  }

  private getNewGroup(type: UploadType): FormGroup {
    return new FormGroup({
      source: this.getSourceControl(type),
      title: this.getTitleControl()
    });
  }

  private getSourceControl(type: UploadType): FormControl {
    return type === 'local'
      ? this.qService.toFormControl(this.localSourceQuestion)
      : this.qService.toFormControl(this.urlSourceQuestion);
  }

  private  getTitleControl(): FormControl {
    return this.qService.toFormControl(this.titleQuestion);
  }

  toggle(): void {
    this.modal.toggle();
  }

  // EVENTS
  handleAddGroup(type: UploadType): void {
    const control = <FormArray>this.form.controls[type];
    control.push(this.getNewGroup(type));
  }

  handleDeleteGroup(type: UploadType, idx: number): void {
    const control = <FormArray>this.form.controls[type];
    control.removeAt(idx);
  }

  async submit(form: FormGroup): Promise<any> {
    try {
      this.resetForm();
      // filter empty sources
      const urlSources = form.value['url'].filter(source => source['source'] !== '');
      const localSources = form.value['local'].filter(source => source['source'] !== '');

      // download sources
      const texts = await Promise.all(urlSources.map(url => this.util.download(url['source'])));
      urlSources.forEach((url, idx) => url['source'] = texts[idx]); // replace url with the actual resource

      // upload
      const uploaded = await this.mdService.uploadNote(urlSources.concat(localSources));
      uploaded ? this.onUploadFinished.emit(true) : alert('Cannot upload notes');
    } catch (error) {
      alert('Something bad happened... Cannot upload notes!');
    }
  }
}
