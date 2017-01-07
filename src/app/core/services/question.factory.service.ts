import { Injectable }   from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';

import { QuestionBase } from '../question.class';

@Injectable()
export class QuestionFactoryService {

  // CUSTOM VALIDATORS
  urlValidatorFn(control: FormControl): { [key: string]: any} {
    let urlRegex: RegExp = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);
    return urlRegex.test(control.value) ? null : { 'url': 'invalid' };
  }

  makeValidator(cnst?: { [name: string]: any }): ValidatorFn {
    let validators = [];

    // add custom validators
    if ('url' in cnst && cnst['url'])     validators.push(this.urlValidatorFn as ValidatorFn);

    // add Ng2 validators
    if ('required' in cnst && cnst['required']) validators.push(Validators.required);
    if ('minLength' in cnst) validators.push(Validators.minLength(cnst['minLength']));
    if ('maxLength' in cnst) validators.push(Validators.maxLength(cnst['maxLength']));
    if ('pattern' in cnst)   validators.push(Validators.pattern(cnst['pattern']));

    return Validators.compose(validators);
  }

  toFormControl(question: QuestionBase<any>): FormControl {
    let validator = this.makeValidator(question.constraints);
    return validator
      ? new FormControl(question.value || '', validator)
      : new FormControl(question.value || '');
  }

  toFormGroup(questions: QuestionBase<any>[]): FormGroup {
    let group: any = {};
    questions.forEach((question: QuestionBase<any>) => group[question.key] = this.toFormControl(question) );

    return new FormGroup(group);
  }
}
