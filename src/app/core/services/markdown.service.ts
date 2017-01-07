import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import '../../vendor';
import { Note } from '../types';

@Injectable()
export class MarkdownService {
  private notes: Note[] = [];
  private creationCounter: number = 1;

  // todo: change to actual http requests once server is setup
  constructor(private http: Http) {}

  private findNote(title: string): [boolean, number] {
    let idx = this.notes.findIndex(note => note.title === title);
    return [idx !== -1, idx];
  }

  private addNote(note: Note): Promise<any> {
    let [noteExists, _] = this.findNote(note.title);
    if (noteExists) {
      return Promise.reject(new Error(`Note with title ${note.title} already exists`))
    } else {
      this.notes.push(note);
      return Promise.resolve(note.title);
    }
  }

  getNote(title: string): Note {
    return this.notes.find((note: Note) => note.title === title);
  }

  getNoteTitles(): string[] {
    return this.notes.map(note => note.title);
  }

  addNewNote(): Promise<any> {
    return this.addNote({
      dateOfCreation: new Date(),
      title: `Note No.${this.creationCounter++}`,
      text: ''
    } as Note)
  }

  uploadNote(payload: any[]): Promise<any> {
    return Promise.all(payload.map(p => this.addNote({
      dateOfCreation: new Date(),
      title: p['title'],
      text: p['source']
    })));
  }

  updateNote(title: string, key: string, value: any): Promise<any> {
    let [found, idx] = this.findNote(title);
    if (found) {
      if (key === 'title' && this.findNote(value)[0]) {
        return Promise.reject(new Error(`Note with title ${value} already exists`))
      }

      this.notes[idx][key] = value;
      return Promise.resolve(true);
    } else {
      return Promise.reject(new Error('Cannot update note'));
    }
  }

  deleteNote(title: string): Promise<any> {
    let [found, idx] = this.findNote(title);
    if (found) {
      let deleted = this.notes.splice(idx, 1);
      return Promise.resolve(deleted);
    } else {
      return Promise.reject(new Error('Note does not exist'));
    }
  }

  // mock up
  loadSampleMarkdown(): Promise<any> {
    return this.http.get('https://test.yz-metta.com/sample.md')
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
