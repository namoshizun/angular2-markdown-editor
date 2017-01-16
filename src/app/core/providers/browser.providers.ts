import { Provider } from '@angular/core';

export class WindowRef {
  get nativeWindow(): any { return window }
}

export class DocumentRef {
  get nativeDocument(): any { return document }
}

export const BROWSER_GLOBALS_PROVIDERS: Provider[] = [WindowRef, DocumentRef];
