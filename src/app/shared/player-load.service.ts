import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { retry, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import data from '../../assets/users.js';

@Injectable({
  providedIn: 'root',
})
export class PlayerLoadService {
  constructor(private http: HttpClient) {}

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    // responseType: 'text' as 'json',
  };

  testMessage = () => {
    return 'hello';
  };

  getPlayers = () => {
    console.log(`Loading Players`);
    // let apiURL = 'https://yanille2.herokuapp.com/test/users';
    const sourceObservable = of(data);
    const delayedObservable = sourceObservable.pipe(delay(100));
    return delayedObservable;
    // return this.http
    //   .get<Object>(apiURL, this.httpOptions)
    //   .pipe(retry(1), catchError(this.handleError));
  };

  // Error handling
  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    console.log(`error message: ${errorMessage}`);
    return throwError(errorMessage);
  }
}
