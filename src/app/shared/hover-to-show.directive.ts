import { Directive, HostListener, HostBinding, ElementRef } from '@angular/core';

@Directive({
  selector: '[hoverToShow]'
})
export class HoverToShowDirective {

  constructor(private el: ElementRef) {}

  // it seems that moseleave is not always fired when cursor leaves at high speed ...
  @HostBinding('class.hoverable') makeHoverable: boolean = true;
}
