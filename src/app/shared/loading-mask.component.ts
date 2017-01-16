import { Component, OnInit, OnDestroy } from '@angular/core';
import { BROWSER_GLOBALS_PROVIDERS, WindowRef } from '../core/providers/browser.providers';
@Component({
  selector: 'loading-mask',
  template: `
    <div id="mask">
      <div class="loader"></div>
    </div>
  `,
  styles: [`
    #mask {
        position:           absolute;
        z-index:            999;
        top:                0;
        left:               0;
        width:              100%;
        height:             100%;
        opacity:            0.7;
        background-color:   #eeeeee;
    }
  `],
  providers: [
    ...BROWSER_GLOBALS_PROVIDERS
  ]
})
export class LoadingMaskComponent implements OnInit ,OnDestroy {
  constructor(private windowRef: WindowRef) {}

  discardEvent() {}

  ngOnInit() {
    this.windowRef.nativeWindow.addEventListener('keypress', this.discardEvent);
    this.windowRef.nativeWindow.addEventListener('mouseup', this.discardEvent);
  }

  ngOnDestroy() {
    this.windowRef.nativeWindow.removeEventListener('keypress', this.discardEvent);
    this.windowRef.nativeWindow.removeEventListener('mouseup', this.discardEvent);
  }
}
