import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import '../vendor';
import { Note } from '../shared/types';

@Injectable()
export class MarkdownService {
  notes: Note[] = [];
  creationCounter: number = 1;

  constructor(private http: Http) {}

  private findNote(title: string): [boolean, number] {
    let idx = this.notes.findIndex(note => note.title === title);
    return [idx !== -1, idx];
  }

  getNoteTitles(): string[] {
    return this.notes.map(note => note.title);
  }

  // todo: change to actual http requests once server is setup
  addNote(note: Note): Promise<any> {
    this.notes.push(note);
    return Promise.resolve(note.title);
  }

  addNewNote(): Promise<any> {
    return this.addNote({
      dateOfCreation: new Date(),
      title: `Note No.${this.creationCounter++}`,
      text: ''
    } as Note)
  }

  updateNote(title: string, key: string, value: any): Promise<any> {
    let [found, idx] = this.findNote(title);
    if (found) {
      this.notes[idx][key] = value;
      return Promise.resolve(true);
    } else {
      return Promise.reject(false);
    }
  }

  deleteNote(title: string): Promise<any> {
    let [found, idx] = this.findNote(title);
    if (found) {
      let deleted = this.notes.splice(idx, 1);
      return Promise.resolve(deleted);
    } else {
      return Promise.reject(null);
    }
  }

  // mock up
  loadSampleMarkdown(): Promise<any> {
    return this.http.get('./assets/sample.md')
      .map((r: Response) => r['_body'])
      .toPromise()
      .then((sampleText: string) => this.notes.push({
        title: 'Sample Markdown',
        text: sampleText,
        dateOfCreation: new Date(),
        author: 'TestUser'
      }));
  }
}
