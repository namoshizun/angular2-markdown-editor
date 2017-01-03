import {Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ToolBarItem } from '../../shared/types';

@Component({
  selector: 'toolbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="btn-toolbar step" role="toolbar"
         aria-label="toolbar with button groupts" id="toolbar" hoverToShow>
      <div class="btn-group" role="group" aria-label="first group">
        <button type="button" *ngFor="let item of _items; let i = index">
          <span *ngFor="let state of item; let j = index"
                placement="bottom"
                [style.display]="isCurrState(i, j) ? 'inherit' : 'none'" 
                [tooltip]="state.tooltip"
                [class]="state.glyph"
                (click)="state.callback ? state.callback($event, state.name) : null; updateState(i)">
          </span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    #toolbar {
      z-index: 10000;
      position: absolute;
      right: 5%;
      top: 1%;
    }
  `]
})
export class ToolBarComponent implements OnInit {
  stateTable: any [] = []; // { currentIndex, NumberOfStates } for each toolbar item;
  _items: ToolBarItem[][] = [];

  @Input() set items (items: ToolBarItem[][]) {
    this._items = items;
    this._items.forEach(item => this.stateTable.push({
      currStateIdx: 0,
      numStates: item.length
    }));
  }

  isCurrState(itemIdx, stateIdx): boolean {
    return this.stateTable[itemIdx].currStateIdx === stateIdx;
  }

  updateState(itemIdx): void {
    this.stateTable[itemIdx].currStateIdx + 1 >= this.stateTable[itemIdx].numStates
      ? this.stateTable[itemIdx].currStateIdx = 0
      : this.stateTable[itemIdx].currStateIdx += 1;
  }


  constructor() {}
  ngOnInit() {}
}
