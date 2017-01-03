import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from "@angular/common";

import { HoverToShowDirective } from './hover-to-show.directive';


@NgModule({
  imports: [
    FormsModule,
    HttpModule
  ],
  declarations: [
    HoverToShowDirective
  ],
  exports: [
    FormsModule,
    CommonModule,
    HoverToShowDirective,
  ]
})
export class SharedModule { }
