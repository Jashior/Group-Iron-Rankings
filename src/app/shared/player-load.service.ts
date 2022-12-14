import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { retry, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import userData from '../../assets/data.js';

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
    // let apiURL =
    //   'https://raw.githubusercontent.com/SaintJuniper/Group-Iron-Data/7535eae08fd8025d876e15e7d73f0b7115313107/users.json';
    console.log(userData);
    const sourceObservable = of(userData);
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
