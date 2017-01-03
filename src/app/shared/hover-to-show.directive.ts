import { Directive, HostListener, HostBinding, ElementRef } from '@angular/core';

@Directive({
  selector: '[hoverToShow]'
})
export class HoverToShowDirective {

  constructor(private el: ElementRef) {}

  @HostBinding('class.show') showComponent: boolean = false;

  @HostListener('mouseenter', ['$event'])
  handleMouseEnter = (evt) => this.showComponent = true;

  @HostListener('mouseleave', ['$event'])
  handleMouseLeave = (evt) =>  this.showComponent = false;
}
