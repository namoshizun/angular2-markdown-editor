import { Component, Input, Output } from '@angular/core'
import { EventEmitter, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal';

@Component({
  selector: 'modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div bsModal #childModal="bs-modal" class="modal fade"
         tabindex="-1" role="dialog" aria-labelledby="mdl" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <!--HEADER-->
          <div class="modal-header">
            <!--OK / CANCEL-->
            <span class="glyphicon glyphicon-remove close" (click)="modal.hide()"></span>
            <!--TITLE-->
            <h4 class="modal-title">{{title}}</h4>
          </div>
          <div class="modal-body">
            <!-- PROJECTED CONTENT -->
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ModalComponent {
  @Input() title: string = '';

  @ViewChild('childModal') modal: ModalDirective;

  toggle(): void {
    this.modal.toggle();
  }
}
