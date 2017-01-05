import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from "@angular/common";
import { TooltipModule } from 'ng2-bootstrap/tooltip';

import { ToolBarComponent } from './tool-bar.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    HttpModule,
    TooltipModule.forRoot(),
  ],
  declarations: [
    ToolBarComponent
  ],
  exports: [
    FormsModule,
    CommonModule,
    HttpModule,
    ToolBarComponent
  ]
})
export class SharedModule { }
