import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';

import { LoadingMaskComponent } from './loading-mask.component';
import { ToolBarComponent } from './tool-bar.component';
import { ModalComponent } from './modal.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpModule,
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
  ],
  declarations: [
    LoadingMaskComponent,
    ToolBarComponent,
    ModalComponent
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpModule,
    LoadingMaskComponent,
    ToolBarComponent,
    ModalComponent
  ]
})
export class SharedModule { }
