import { Component, Input} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionBase } from '../../core/question.class';

@Component({
  selector: 'app-source-input',
  template: `
    <div [formGroup]="group">
      <div class="form-group col-xs-5">
        <label>{{question.label}}</label>
        <input class="form-control"
               (change)="question.callback ? question.callback($event, group) : null"
               [type]="question.type"
               [placeholder]="question.placeholder"
               [formControlName]="question.key">
      </div>
    </div>
  `
})
export class SourceInputComponent {
  @Input() group: FormGroup;
  @Input() question: QuestionBase<any>;

  isInvalidInput(key: string): boolean {
    const control = this.group.controls[key];
    return control.errors && (control.touched || control.dirty);
  }

  problems(key: string): string[] {
    return Object.keys(this.group.controls[key].errors);
  }
}
