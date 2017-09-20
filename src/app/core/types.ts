export interface Scrollable {
  scrollTo(ratio: number): void;
}

export interface ToolBarItem {
  name?: string;
  glyph?: string;
  tooltip?: string;
  callback?: Function;
}

export interface Note {
  dateOfCreation: Date;
  text?: string;
  title?: string;
  author?: string;
}

export interface QuestionSpec<T> {
  value?: T;        // default value
  key?: string;     // identifier
  label?: string;
  controlType?: string;

  // expected keys: ['required', 'pattern', 'minLength', 'maxLength','url']
  feedbacks?: { [key: string]: string };
  constraints?: { [key: string]: any };

  // field type specific options
  type?: string; // text input
  placeholder?: string; // text input
  callback?: Function; // text input
}
