import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Note } from '../types';

import '../../vendor';

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

  private syncNote(note: Note): Promise<boolean> {
    // todo
    return Promise.resolve(true);
  }

  // GET
  getNote(title: string): Note {
    return this.notes.find((note: Note) => note.title === title);
  }

  getNoteTitles(): string[] {
    return this.notes.map(note => note.title);
  }

  // PUT
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

  // POST
  async updateNote(title: string, key: string, value: any, sync: boolean = false): Promise<any> {
    let [found, idx] = this.findNote(title);
    if (!found) return new Error('Cannot update note');
    if (key === 'title' && this.findNote(value)[0]) return new Error(`Note with title ${value} already exists`);

    try {
      if (sync) await this.syncNote(this.notes[idx]);
      this.notes[idx][key] = value;
      return true
    }  catch (error) {
      return new Error('Cannot update note');
    }
  }

  syncAll(): Promise<boolean> {
    // todo
    return new Promise((resolve, reject) => setTimeout(() => resolve(true), 2000));
  }

  // DELETE
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
