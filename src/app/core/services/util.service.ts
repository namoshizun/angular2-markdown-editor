import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()
export class UtilService {
  constructor(private http: Http) {}

  download(url: string): Promise<any> {
    return this.http.get(url)
      .map((r: Response) => r['_body'])
      .toPromise();
  }
}
