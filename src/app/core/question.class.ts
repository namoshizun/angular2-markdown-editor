import { QuestionSpec } from './types';

export class QuestionBase<T> implements QuestionSpec<T> {
  value?: T;
  key?: string;
  label?: string;
  controlType?: string;
  feedbacks?: { [name: string]: any };

  // field type specific
  callback?: Function;
  placeholder?: string;
  constraints?: { [name: string]: any };
  type?: string;

  constructor(spec: QuestionSpec<T>) {
    this.value       =  spec.value;
    this.key         =  spec.key || '';
    this.label       =  spec.label || '';
    this.controlType =  spec.controlType || '';
    this.feedbacks   =  spec.feedbacks || {};
    this.constraints =  spec.constraints || {};

    this.callback    = spec.callback || null;
    this.placeholder = spec.placeholder || '';
    this.type    = spec.type || '';
  }
}

export class TextboxQuestion extends QuestionBase<string> {
  controlType = 'textbox';
  type: string;

  constructor(options: QuestionSpec<string>) {
    super(options);
    this.type = options['type'] || 'text';
  }
}

export class FileUploadQuestion extends QuestionBase<string> {
  controlType = 'file';
  type: string;

  constructor(options: QuestionSpec<string>) {
    super(options);
    this.type = options['type'] || 'file';
  }
}
