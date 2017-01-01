import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import '../vendor';

@Injectable()
export class MarkdownService {
  constructor(private http: Http) {}

  loadSampleMarkdown(): Promise<any> {
    return this.http.get('./assets/sample.md')
      .map((r: Response) => r['_body'])
      .toPromise();
  }
}
