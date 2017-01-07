import { Component, Input } from '@angular/core';
import { OnInit, ChangeDetectionStrategy } from '@angular/core'
import { ToolBarItem } from '../core/types';

@Component({
  selector: 'toolbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="btn-toolbar toolbar" role="toolbar"
         aria-label="toolbar with button groupts"
         [ngClass]="toolbarClass">
         
      <div class="btn-group" role="group" aria-label="first group">
        <button type="button"
                class="btn btn-default"
                *ngFor="let item of _items; let i = index">
          <span *ngFor="let state of item; let j = index"
                placement="bottom"
                [style.display]="isCurrState(i, j) ? 'block' : 'none'" 
                [tooltip]="state.tooltip"
                [class]="state.glyph"
                (click)="state.callback ? state.callback() : null; updateState(i);
                         $event.stopPropagation(); $event.preventDefault()">
          </span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .toolbar {
      z-index: 10000;
    }
  `]
})
export class ToolBarComponent implements OnInit {
  toolbarClass: any = {};
  stateTable: any [] = []; // { currentIndex, NumberOfStates } for each toolbar item;
  _items: ToolBarItem[][] = [];

  @Input() set styleClasses(classes: string) {
    let klasses = classes.split(' ');
    klasses.forEach(klass => this.toolbarClass[klass] = true);
  };
  @Input() set items (items: ToolBarItem[][]) {
    this._items = items;
    this._items.forEach(item => this.stateTable.push({
      currStateIdx: 0,
      numStates: item.length
    }));
  }

  constructor() {}
  ngOnInit() {}

  isCurrState(itemIdx, stateIdx): boolean {
    return this.stateTable[itemIdx].currStateIdx === stateIdx;
  }

  updateState(itemIdx): void {
    this.stateTable[itemIdx].currStateIdx + 1 >= this.stateTable[itemIdx].numStates
      ? this.stateTable[itemIdx].currStateIdx = 0
      : this.stateTable[itemIdx].currStateIdx += 1;
  }
}
