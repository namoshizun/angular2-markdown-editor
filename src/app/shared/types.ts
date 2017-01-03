export interface Scrollable {
  scrollTo(ratio: number): void;
}

export interface ToolBarItem {
  name?: string,
  glyph?: string,
  tooltip?: string,
  callback?: Function
}
