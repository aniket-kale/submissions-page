import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '../shared/constants';
import { Observable } from 'rxjs';
import { Submission } from './shared/submissions.interface';

@Injectable({
  providedIn: 'root'
})
export class SubmissionsService {

  constructor(private httpClient: HttpClient) { }

  getSubmissions(): Observable<Array<Submission>> {
    return this.httpClient.get<Array<Submission>>(Constants.apiUrl);
  }


}
