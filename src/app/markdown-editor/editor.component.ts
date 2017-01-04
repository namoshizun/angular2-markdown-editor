import {Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MdEditorComponent } from "./components/md-editor.component";
import { MdViewerComponent } from "./components/md-viewer.component";
import { Subject } from "rxjs/Subject";
import { Subscription } from "rxjs/Subscription";

import { ToolBarItem } from '../shared/types';
import '../vendor';

@Component({
  selector: 'blog-editor',
  templateUrl: 'templates/editor.html',
})
export class EditiorComponent implements OnInit, OnDestroy {

  @ViewChild(MdEditorComponent) private mdEditor: MdEditorComponent;
  @ViewChild(MdViewerComponent) private mdViewer: MdViewerComponent;

  text: string = '';
  sub$: Subscription;
  input$ = new Subject<string>();
  viewConfig = {
    fullScreen: false,
    syncViews: true,
    enablePreview: true
  };


  readonly toolbarItems: ToolBarItem[][] = [
    [
      { tooltip: 'Close Preview', glyph: 'glyphicon glyphicon-eye-close',
        callback: () => this.viewConfig.enablePreview = false },
      { tooltip: 'Preview', glyph: 'glyphicon glyphicon-eye-open',
        callback: () => this.viewConfig.enablePreview = true }
    ],
    [
      { tooltip: 'Full Screen',glyph: 'glyphicon glyphicon-fullscreen',
        callback: () => this.viewConfig.fullScreen = true },
      { tooltip: 'Narrow Screen',glyph: 'glyphicon glyphicon-resize-small',
        callback: () => this.viewConfig.fullScreen = false }
    ],
    [
      { tooltip: 'No Sync',glyph: 'glyphicon glyphicon-random',
        callback: () => this.viewConfig.syncViews = false },
      { tooltip: 'Sync Views', glyph: 'glyphicon glyphicon-retweet',
        callback: () => this.viewConfig.syncViews = true }
    ]
  ];

  constructor() {}

  ngOnInit() {

    this.sub$ = this.input$
      .distinctUntilChanged()
      .debounceTime(300)
      .subscribe(text => this.text = text);
  }

  ngOnDestroy() {
    if (this.sub$) this.sub$.unsubscribe();
  }

  passText(text: string): void {
    this.input$.next(text);
  }

  // Dynamic css class providers
  editorClass(): any {
   return {
     'col-xs-12': !this.viewConfig.enablePreview,
     'col-xs-6': this.viewConfig.enablePreview,
   }
  }

  containerClass(): any {
    return {
      'mid-container': !this.viewConfig.fullScreen
    }
  }
}
